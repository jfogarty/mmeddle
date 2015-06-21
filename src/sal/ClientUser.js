'use strict';
/**
 * @fileOverview The User object used by client applications.
 * @module sal/ClientUser
 * @description
 * mMeddle has a reasonably simple but ultimtely insecure user model.
 * This is by design (and because I am both pragmatic and lazy).
 * 
 * User names (i.e. aliases) must be unique for the entire site.
 * To enforce this, each user (the person) must select a password
 * to establish their unique identity, and to avoid accidental logins
 * from one person to access another person's stuff.
 * 
 * Passwords are never saved directly by mMeddle, but since the client
 * code is JavaScript running on a browser, there is always a weak spot
 * where hacker access to the client browser can compromise the whole
 * system. When a user is created the first time, or when a password is
 * changed, the plain text of the password is converted into a PBKDF2
 * (Password Based Key Derived Function 2) hash. This hash is significantly
 * more resistent to attacks than a simple SHA or MD5 hash. The plain text
 * is deleted at that point, and as long as the user uses the same browser,
 * there is no need to reenter a text password. Also, since the plain text
 * is never sent to the server or stored in a database, the user's other
 * accounts (for which he has selected the same password or a simple
 * variant on it) do not become more vulnerable from here.
 * 
 * The PBK hash is now the actual password and it is saved as a hex string
 * in the browser local storage user. The more paranoid may want to remove
 * these, but in truth the reentry of the plain text password on every login
 * creates a much bigger threat window. If the browser is compromised the
 * user is compromised, there is no middle ground.
 * 
 * The PBK is sent to the server for saving during create User and change
 * password request handling. Logins do not sent the PBK itself, instead
 * they send a SHA256 hash of the PBK seeded by the random socket.io 
 * connection id for session. Since this changes on every connection, the
 * PBK is that much less vulnerable to packet sniffers.
 * 
 * Finally, the PBK itself is seeded by the creation time for the user so
 * multiple users who select the same password, do not end up with the
 * same PBK.
 * 
 * All that sounds like I've made some effort to be secure, but don't be
 * fooled. mMeddle is not designed for security and privacy. It is about
 * sharing content, not restricting its access. I don't expect to 'harden'
 * the security in the future, as there is little call for it in this kind
 * of site. On the other hand, adding third party authentication may prove
 * to be a temptation too great to resist, since they do offer user 
 * conveniences (and greater security).
 * 
 */ 
module.exports = function registerClientUser(mm) {
  var _          = mm.check(mm._);
  var text2ua    = mm.check(mm.util.text2ua);
  var ua2hex     = mm.check(mm.util.ua2hex);
  var CoreObject = mm.check(mm.obj.CoreObject);
  var sha256     = mm.check(require('fast-sha256'));
  
  var ANONYMOUS = 'anonymous';
  
  /**
   * @summary **Create a ClientUser**
   * @description
   * A client user the information about a user that is available to
   * a client during normal workspace interaction. It will contain a
   * hashed password if the user is logged in to a server.
   * @constructor
   * @param {userName} userName the userName for this client
   * @returns {ClientUser} the new client user.
   */  
  var ClientUser = (function clientUserCtorCreator() {
    var ctor = function ClientUser(userName) {
      var self = this;
      self.name = userName ? userName : ANONYMOUS;
      self.firstName = null;
      self.lastName = null;
      self.email = null;
      self.creationDate = new Date();
      self.loggedIn = false;
      // The PBKDF2 salt is per user and is based on the sub millisecond
      // datetime for when the user was created. This is just so the same
      // password for different users creates different PDKs.
      // Its a small comfort.
      self.pbkdf2Salt = ua2hex(text2ua(self.creationDate.toISOString()));
    };

    return ctor;
  }());

  ClientUser.prototype = Object.create(CoreObject.prototype);
  ClientUser.prototype.PBKDF2_ROUNDS = 1000; // A reasonable number of rounds.
  ClientUser.prototype.PBKDF2_DKLEN = 16; // 16 byte derived key.

  /**
   * @summary Initialize a clientUser from a JSON derived object.
   * @description
   * All fields of the existing clientUser are replaced by those in
   * the source object (which is often created by parsing a JSON string).
   * Any fields NOT in the source object remain unchanged.
   * Note that sanitized user objects are only useful for display
   * purposes, they are useless for logging in or validating anything.
   * @param {Object} userObj the raw user object
   * @param {bool} sanitized true to remove ugly internal values
   * @returns self for chaining.
   */
  ClientUser.prototype.init = function init(userObj, sanitize) {
    var self = this;  
    if (userObj) _.assign(self, userObj);
    if (sanitize) {
      delete self.pbkdf2Salt;
      delete self.pdk;
      delete self.hpdk;
      delete self.owner;
    }
    return self;
  }
  
  /**
   * @summary True is this is an anonymous user.
   * @returns true is anonymous.
   */
  ClientUser.prototype.isAnonymous = function isAnonymous() {
    var self = this;  
    return (!self.name) ||
           (!self.lastName) ||
           _.startsWith(self.name, ANONYMOUS);
  }

  /**
   * @summary Put the PDK (Password Derived Key) into the user object
   * @description
   * The hashed password is added along with a datetime derived salt, or
   * a PDK from some other source is stuffed in.
   * @param {string} ptpwd a plain text password
   * @param {bool} ispdk optional PDK supplied instead of plain text.
   * @returns self for chaining.   
   */
  ClientUser.prototype.hashP = function hashP(ptpwd, ispdk) {
    var self = this;  
    // A saved pdk was used instead of plain text.
    if (ispdk) {
      self.pdk = ptpwd;
    }
    else {
      var uIntArrayPDK = sha256.pbkdf2(
          text2ua(ptpwd), 
          self.pbkdf2Salt,
          self.PBKDF2_ROUNDS,
          self.PBKDF2_DKLEN);
      self.pdk = ua2hex(uIntArrayPDK);
    }
    return self;
  }

  /**
   * @summary Do a sha256 hash on the Password Derived Key
   * @description
   * The hashed password is hashed again before it is sent over the
   * wire. The causes the hash to change every session.
   * @param {string} a seed for the hash.
   * @returns self for chaining.
   */
  ClientUser.prototype.hashPdk = function hashPdk(seed) {
    var self = this;  
    var seedypdk = 'HASHPDK:' + seed + '_' + self.pdk;
    var uIntArrayPDK = sha256(text2ua(seedypdk));
    self.hpdk = ua2hex(uIntArrayPDK);
    //mm.log(seedypdk, '--->', self.hpdk);
    return self;
  }

  return ClientUser;
}