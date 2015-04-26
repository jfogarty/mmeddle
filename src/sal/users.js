'use strict';
/**
 * @fileOverview The Loggers used by mMeddleSequencedObject static methods 
 *       and constructor.
 * @module sal/users
 */ 
module.exports = function registerSalUsers(mm) {
  var text2ua = mm.util.text2ua,
      ua2hex = mm.util.ua2hex,
      debug = mm.log.debug;
  
  var SequencedObject = mm.obj.SequencedObject,
      Enum = mm.obj.Enum;
      
  var sha256 = require('fast-sha256');

  var T = 10;
  
  // The cache of users and user management methods.  
  var users = {};
  users.inMemoryUserCache = {};
  
  /**
   * @summary **Create a PersistentUser**
   * @description
   * A PersistentUser contains the information about a user that is
   * persistently stored in files, or a database.
   * @constructor
   * @param {User} u the User used to create this one.
   * @returns {PersistentUser} the new persistent user.
   */  
  var PersistentUser = (function persistentUserCtorCreator() {
    var ctor = function PersistentUser(u) {
      var self = this;
      self.name = u.name;
      self.privatePassword = u.privatePassword;
      self.creationDate = u.creationDate;
      self.pbkdf2Salt = u.pbkdf2Salt;
    };

    return ctor;
  }());

  /**
   * @summary **Create a User**
   * @description
   * A User holds information about a person or authority that has
   * access rights to some part of a workspace and its storage.
   * Users are SequencedObjects since most of the activites on a given
   * user must occur in specific orders.
   * @constructor
   * @param {string} userName the name of the user's alias.
   * @returns {User} the new user
   */  
  var User = (function userCtorCreator() {
    // static initialization here.
    var STATUS = new Enum('unknown|loaded|saved|pending|created|active|failed');

    var ctor = function User(userName) {
      var self = this;

      SequencedObject.call(self); // populate parent instance fields.
      self.privatePassword = '';
      self.name = userName;
      self.STATUS = STATUS;
      self.status = self.STATUS.unknown;
      
      function setPassword(pwd) { 
        self.privatePassword = pwd; 
      }

      function getPassword() { 
        return self.privatePassword; 
      }

      function passwordMatches(testPassword) {
        return self.privatePassword === testPassword;
      }

      self.setPassword = setPassword;
      self.passwordMatches = passwordMatches;
      self.getPassword = getPassword;

      self.lock = function lockUser() { 
        self.getPassword = function userIsLocked() { return ''; }
      }
    }
    return ctor;
  }());

  User.prototype = Object.create(SequencedObject.prototype);
  User.prototype.PBKDF2_ROUNDS = 1000; // A reasonable number of rounds.
  User.prototype.PBKDF2_DKLEN = 16; // 16 byte derived key.

  /**
   * @summary Loads a User from persistent storage
   * @description
   * The PersistentUser in storage is looked up by the name alias
   * loaded into this User object. All existing fields in the user are
   * replaced by those from storage.
   * @returns {Promise} a promise to the User
   */
  User.prototype.load = function loadUser () {
    var self = this;
    return self.deferredFunc(function loadSequenced(deferred) {
      //var statusMessage = 'loading user: ' + self.name;
      setTimeout(function() {
          var u = users.inMemoryUserCache[self.name];
          if (u) {
            self.name = u.name;
            self.privatePassword = u.privatePassword;
            self.creationDate = u.creationDate;
            self.pbkdf2Salt = u.pbkdf2Salt;
            self.status = self.STATUS.loaded;
            var finishedMessage = 'loaded "' + self.name + '"';
            debug(finishedMessage, self.sequencedOperationsCount);
            deferred.resolve(self);
          }
          else {
            var notLoadedMessage = 'not loaded "' + self.name + '"';
            debug(notLoadedMessage, self.sequencedOperationsCount);
            self.status = self.STATUS.failed;            
            deferred.reject(new Error(notLoadedMessage));
          }
      }, T);
    })
  };

  /**
   * @summary Save a User into persistent storage
   * @description
   * The PersistentUser in storage is replaced by information from this
   * one, or a new user is created in storage.
   * @returns {Promise} a promise to the User
   */
  User.prototype.save = function saveUser () {
    var self = this;
    return self.deferredFunc(function saveSequenced(deferred) {
      var statusMessage = 'saving user: "' + self.name + '"';
      debug(statusMessage);
      setTimeout(function() {
          var u = users.inMemoryUserCache[self.name];
          if (u) {
            if (self.privatePassword === u.privatePassword) {
              self.status = self.STATUS.loaded;
              var finishedMessage = 'already saved "' + self.name + '"';
              debug(finishedMessage, self.sequencedOperationsCount);
              deferred.resolve(self);
            }
            else {
              var failedMessage = '*save failed for "' + self.name + '"';
              debug(failedMessage);
              deferred.reject(new Error(failedMessage));
            }
          }
          else {
            u = new PersistentUser(self);
            self.status = self.STATUS.saved;
            users.inMemoryUserCache[u.name] = u;
            var savedMessage = 'saved "' + self.name + '"';
            debug(savedMessage, self.sequencedOperationsCount);
            deferred.resolve(self);
          }
      }, T);
    })
  };
  
  /**
   * @summary Create a password for a User
   * @description
   * The User is given a password. Persistent storage is not accessed.
   * The plain text password is immediately encoded as a PBKDF2 hash.
   * @param {string} password the plain text of a password.
   * @returns {Promise} a promise to the User
   */
  User.prototype.create = function createUser(password) {
    var self = this;
    return self.deferredFunc(password,
      function createSequenced(deferred, password) {
      self.creationDate = new Date();
      self.status = self.STATUS.pending;
      if (password) {
        //statusMessage = 'computing ' + self.name;
        // The PBKDF2 salt is per user and is based on the sub millisecond
        // datetime for when the user was created. Its a small comfort.
        self.pbkdf2Salt = ua2hex(text2ua(self.creationDate.toISOString()));
        var uIntArrayPassword = sha256.pbkdf2(
            text2ua(password), 
            self.pbkdf2Salt,
            self.PBKDF2_ROUNDS,
            self.PBKDF2_DKLEN);
        self.setPassword(ua2hex(uIntArrayPassword));
        self.status = self.STATUS.created;
      }

      setTimeout(function() {
          var createdMessage = 'created user"' + self.name + '"';
          debug(createdMessage);
          deferred.resolve(self);
      }, T);
    })
  };

  /**
   * @summary Login the User
   * @description
   * The plain text password is checked against the User to determine
   * if there is a match. If there is a match then private information
   * about this user will be loaded from storage.
   * @param {string} password the plain text of a password to check.
   * @returns {Promise} a promise to the User
   */
  User.prototype.login = function loginUser(password) {
    var self = this;
    return self.deferredFunc(password,
      function loginSequenced(deferred, password) {
      var testPassword = ua2hex(sha256.pbkdf2(
          text2ua(password), 
          self.pbkdf2Salt,
          self.PBKDF2_ROUNDS,
          self.PBKDF2_DKLEN));
      debug('-- login test pwd:', '[' + testPassword + ']');
      debug('-- login user pwd:', '[' + self.getPassword() + ']');
      setTimeout(function() {
        if (self.passwordMatches(testPassword)) {
          self.status = self.STATUS.active;
          var activatedMessage = 'logged in ' + self.name;
          debug(activatedMessage);
          deferred.resolve(self);
        }
        else {
          self.status = self.STATUS.failed;
          var failedMessage = '*login failed for ' + self.name;
          debug(failedMessage);
          deferred.reject(new Error(failedMessage));
          //debug('=== Deferred:', deferred);
        }
      }, T);
    })
  };

  /**
   * @summary Remove the User
   * @description
   * The user is removed from storage.
   * @returns {Promise} a promise to the User
   */
  User.prototype.remove = function removeUser() {
    var self = this;
    return self.deferredFunc(function deleteSequenced(deferred) {
      setTimeout(function() {
          var finishedMessage = 'deleted ' + self.name;
          debug(finishedMessage);
          deferred.resolve(self);
      }, T); 
    })
  };

  users.User = User;
  return users;
}