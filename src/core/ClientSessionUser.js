'use strict';
/**
 * @fileOverview Add user requests to the ClientSession
 * @module core/ClientSession
 * 
 */ 
 module.exports = function(mm) {
  var qq            = mm.check(mm.Q);
  var ClientSession = mm.check(mm.core.ClientSession);
  var ClientUser    = mm.check(mm.users.ClientUser);
  var localStorage  = new mm.storage.LocalStorage();
  
  // Approximate number of saved input lines to restore from the
  // locally saved user.
  var MAX_SAVED_INPUT_LINES = 50;

  /**
   * @summary **clear the current user/workspace owner**
   * @description 
   * The current user/workspace owner is reset to anonymous.
   * @returns {ClientSession} for chaining   
   */  
  ClientSession.prototype.clearLocalUser =
  function clearLocalUser() {
    var self = this;
    self.user = new ClientUser('anonymous');
    self.userConfig = new Config();
    return self;    
  }

  /**
   * @summary **load the current user/workspace owner from localStorage**
   * @description 
   * The ClientUser is accessed from the cs.user field. If no user is saved
   * then the anonymous user in the session is available. If the mConsole
   * is supplied and the user's command stack was saved, then those
   * commands are restored.
   * @param {CliConsole} mConsole an optional console for command saving
   * @returns {ClientSession} for chaining   
   */  
  ClientSession.prototype.loadLocalUser =
  function loadLocalUser(mConsole) {
    var self = this;
    var userObj = localStorage.load('user');
    if (userObj) {
      // If a stack saving console is present then add its saved
      // input lines to the current console.
      if (mConsole && 
        mConsole.savedInputLines && 
        userObj.savedInputLines &&
        userObj.savedInputLines.length > 0) 
      {
        var inLine;
        var i = 0;
        do {
          i++;
          inLine = userObj.savedInputLines.pop();
          if (inLine) mConsole.savedInputLines.unshift(inLine);
          if (i > MAX_SAVED_INPUT_LINES) inline = null;
        } while (inLine);
        delete userObj.savedInputLines;
      }
      self.user.init(userObj);
    }
    return self;    
  }

  /**
   * @summary **save the user to localStorage**
   * @description 
   * The ClientUser is saved to localStorage.  If the user was logged onto
   * a server, then the PDK (Password Derived Key hash) is saved as well
   * so the user can login next time without entry of a plain text password.
   * @param {CliConsole} mConsole an optional console for command saving
   * @returns {ClientSession} for chaining   
   */  
  ClientSession.prototype.saveLocalUser =
  function saveLocalWorkspace(mConsole) {
    var self = this;
    if (mConsole &&
        mConsole.savedInputLines &&
        mConsole.savedInputLines.length > 0) 
    {
      self.user.savedInputLines = mConsole.savedInputLines;
    }
    localStorage.store('user', self.user);
    return self;        
  }

  /**
   * @summary **check for logged in to server**
   * @returns {bool} true when logged in
   */  
  ClientSession.prototype.isLoggedIn = function isLoggedIn() {
    var self = this;    
    return self.loggedIn && self.loggedIn.name === self.user.name;
  }
  
  /**
   * @summary **Get public user information**
   * @description
   * A userName or userName pattern is sent to the server. If one or
   * more matching users exist then an array of sanitized public users
   * is returned, otherwise a null object is returned. The pattern
   * can end in '*' to indicate the prefix to match, otherwise only a
   * single user will be returned.
   * @param {string} userName the userName to get.
   * @returns {Promise} to the public user array (or a rejection).
   */  
  ClientSession.prototype.getUser =
  function getUser(userName) {
    var self = this;
    var user = new ClientUser(userName);
    return self.rq('loadUsers', user, true)
    .then(function (rs) {
      return rs.content;
    })
  }

  /**
   * @summary **Login to server**
   * @description
   * The user and password are sent to the server. 
   * If the password matches, the private user settings are
   * returned as the content object in the response.
   * The password is immediately encoded to a safety hash to make
   * it slightly less of a security risk. This hash remains as part
   * of the workspace for auto-login during later connections. The logged
   * in user is now the current user for the session and its workspace.
   * @param {string} userName the userName to login with.
   * @param {string} ptpwd the optional plain text password.
   * @param {bool} ispdk optional PDK supplied instead of plain text.
   * @returns {Promise} to the private user.
   */  
  ClientSession.prototype.userLogin =
  function userLogin(userName, ptpwd, ispdk) {
    var self = this;
    var user = new ClientUser(userName);
    return self.rq('loadUser', user, true)
    .then(function (rs) {
try{    
      user.init(rs.content).hashP(ptpwd, ispdk);
      //mm.log('+++++++++++++++++++== Login with', user);
      // Instead of sending the PDK, we send a sha256 hash
      // of the PDK based on a socket id seed which is known
      // by both the client and server.
      user.hashPdk(self.mmc.socketid);
//mm.log('xxxxxuser.hashPdk(self.socket.id)', self.socketid, user);
      var rquser = new ClientUser(userName).init(user);
//mm.log('xxxxxuser.rquser', rquser);      
      if (rquser.pdk) delete rquser.pdk;
      return self.rq('loginUser', rquser, true)
      .then(function (rs) {
        user.init(rs.content);
        self.user = user;
        self.ws.owner = user.name;
        if (rs.userConfig) {
          self.userConfig.init(rs.userConfig);
          mm.log('- User [' + user.name + '] has a personal configuration');
        }
        user.elapsed = rs.elapsed;
        user.ok = true;
        self.loggedIn = user;
        return user;
      });
} catch (e) { mm.log.error('userLogin failure internal', e.stack); }      
    })
  }
  
  /**
   * @summary **Create new user and login to server**
   * @description
   * A locally created new user and has its plain text password hashed
   * and the content is sent to the server where it is written to storage.
   * It returns a promise to the logged-in private ClientUser.  The new
   * user becomes the current user for the session and its workspace.
   * @param {Object} newUser the new user object (not yet a ClientUser).
   * @param {bool} ispdk true if the passed in object is a prior user.
   * @returns {Promise} to the private user.
   */  
  ClientSession.prototype.userCreate =
  function userCreate(newUser, ispdk) {
    var self = this;
    var user;
    if (ispdk) {
      user = newUser;
    }
    else {
      var ptpwd = newUser.ptpwd;
      delete newUser.ptpwd;
      user = new ClientUser()
          .init(newUser)
          .hashP(ptpwd);
    }
    var pdk = user.pdk;
    return self.rq('createUser', user, true)
    .then(function (rs) {
      user.init(rs.content);
      self.user = user;
      self.ws.owner = user.name;
      if (rs.userConfig) {
        self.userConfig.init(rs.userConfig); // Add to the session.
        mm.log('- User [' + user.name + '] has a personal configuration');
      }
      user.elapsed = rs.elapsed;
      user.pdk = pdk;
      user.ok = true;
      self.loggedIn = user;
      return user;
    })
  }

  /**
   * @summary **Request a Delete of the current user**
   * @description
   * The currently logged in user is deleted. If the user is not currently
   * logged into the server then the delete is rejected.
   * @returns {Promise} to a message string.
   */  
  ClientSession.prototype.userDelete =
  function userDelete() {
    var self = this;
    if (!self.isLoggedIn()) {
      var em  = '- User [' + self.user.name + '] is not logged in';
      return qq.reject(new Error(em));
    }
    return self.rq('deleteUser', self.user, true)
    .then(function (rs) {
      return rs.content;
    })
  }  

  /**
   * @summary **Request a Listing of current user sessions**
   * @description
   * The set of currently connected users is returned.
   * @returns {Promise} to an array of session entries.
   */  
  ClientSession.prototype.listUserSessions =
  function listUserSessions() {
    var self = this;
    return self.rq('listUserSessions', self.user, true)
    .then(function (rs) {
      return rs.content;
    })
  }  
}