'use strict';
/**
 * @fileOverview Add User Request handlers to WsSession prototype.
 * @module server/WsSession
 * @description
 * These are the server side handlers for user related requests such
 * as login, logoff, createUser, changePassword and so on.
 */ 
 module.exports = function(mm) {
   var _ = mm.check(mm._);
   var WsSession = mm.check(mm.server.WsSession);
   var ClientUser = mm.check(mm.users.ClientUser);
  
  /**
   * @summary **handler: load public info on a user**
   * @description
   * A public user looked up by name (alias) only is returned.  If the
   * user doesn't exist then a `notFound` field is set in the response.
   * A createUser request will be required.
   * @param {Object} rq the request object
   */   
  WsSession.prototype.loadUser = 
  function wsLoadUser(rq) {
    var self = this;
    var userObj = rq.content;
    var userName = userObj.name;
    mm.log('- Loading public user [' + userName + ']');
    self.usersStorage.load('publicUsers', userName)
    .then(function(publicUser) {
      mm.log.debug('- Loaded user', publicUser);
      self.respond(rq, publicUser);
    },
    function(e) {
      /* istanbul ignore else */ // Tested independently.
      if (mm.util.ENOENT(e)) {
        mm.log.warn('loadUser: No such user exists: [' + userName + ']');
      }
      else {
        mm.log.debug('loadUser: Access error: [' + userName + ']', e.stack);
      }
      self.respond(rq, '', e);
    })
  }

  /**
   * @summary **handler: load public info on one or more users**
   * @description
   * Public users are looked up by name (alias) or a wildcard pattern.
   * An array of matching users is returned in the response.  An
   * empty array is returned when there are no storage errors during
   * the lookup.
   * @param {Object} rq the request object
   */   
  WsSession.prototype.loadUsers = 
  function wsLoadUsers(rq) {
    var self = this;
    var userObj = rq.content;
    var userNamePattern = userObj.name;
    mm.log('- Loading public users [' + userNamePattern + ']');
    self.usersStorage.loadMultiple('publicUsers', userNamePattern)
    .then(function(publicUsers) {
      mm.log.debug('- Loaded users', publicUsers);
      self.respond(rq, publicUsers);
    },
      /* istanbul ignore next */ // Tested independently.
    function(e) {
      mm.log.debug('Storage error: ', e.stack)
      self.respond(rq, '', e);
    })
  }

  /**
   * @summary **handler: login a user and return private info**
   * @description
   * The public user (acquired from a loadUser request) is coupled with
   * the pbkdf2 hash of the user entered password to acquire the private
   * information about the user, and to enable private object access to
   * this session.
   * @param {Object} rq the request object
   */   
  WsSession.prototype.loginUser = 
  function wsLoginUser(rq) {
    var self = this;
    var publicUserObj = rq.content;
    mm.log.debug('- Login with public user', publicUserObj);
    var userName = publicUserObj.name;
    var user = new ClientUser(userName);
    user.init(publicUserObj);
    mm.log('- Loading private user [' + userName + ']');
    self.usersStorage.load('privateUsers', userName)
    .then(function(privateUser) {
//mm.log.debug('- Loaded private user', privateUser);
//mm.log.debug('- ************ remotehpdk:', privateUser);
      var remotehpdk = user.hpdk;
      user.init(privateUser).hashPdk(self.socket.id);
//mm.log.debug('- User converted to', self.socket.id, user); 
      //Check the password derived key for a match.
      //Instead of checking the PDK directly, we check the
      //hpdk (a sha256 hash of the PDK based on a socket id seed).
      /* istanbul ignore else */ // Tested independently.
      if (user.hpdk === remotehpdk) {
        user.lastLogin = _.now();
        user.loginCount++;
        self.user = user; // The session is now owned by this user.
        self.loggedIn = true;
        var rsuser = new ClientUser(userName);
        rsuser.init(user);
        // The PDK is sent on the wire only once, during the original
        // password setting.
        delete rsuser.pdk; 
        var userConfig = self.loadUserConfig(userName);
        /* istanbul ignore if */ // Tested independently.
        if (userConfig) {
          mm.log('- Logged in user [' + userName +
                 '] with private configuration');        
          self.respond(rq, rsuser, false, { userConfig: userConfig });
        }
        else {
          mm.log('- Logged in user [' + userName + ']');
          self.respond(rq, rsuser);
        }
      }
      else {
        user.failedLoginCount++;
        mm.log.error('Password mismatch on user [{0}]. {1} failed attempts',
            userName, user.failedLoginCount);
        var e = new Error('Password mismatch. Sorry, try again');
        self.respond(rq, '', e);
      }
      self.usersStorage.store('privateUsers', user)
    },
      /* istanbul ignore next */ // Tested independently.
    function(e) {
      if (mm.util.ENOENT(e)) {
        mm.log.warn('loginUser: No such user exists: [' + userName + ']');
      }
      else {
        mm.log.debug('loginUser: Access error: [' + userName + ']', e.stack);
      }
      self.respond(rq, '', e);
    })
  }
  
    /**
   * @summary **handler: create a user and log in**
   * @description
   * New private and public users are created. The public user contains
   * only the user id, and public name, while the private version also
   * contains the email address.
   * @param {Object} rq the request object
   */   
  WsSession.prototype.createUser = 
  function wsCreateUser(rq) {
    var self = this;
    var userObj = rq.content;
    var userName = userObj.name;
    var user = new ClientUser(userName).init(userObj);
    user.firstLogin = _.now();  
    user.lastLogin = user.firstLogin;
    user.loginCount = 1;
    user.failedLoginCount = 0;
    mm.log('- Created new user [' + userName + ']');
    mm.log.debug('createUser: storing private user', user);        
    self.usersStorage.store('privateUsers', user)
    .then(function(info) {
      mm.log('- Saved private user info');
      var publicUser = new ClientUser(userName);
      publicUser.firstName = user.firstName;
      publicUser.lastName = user.lastName;
      // Pass the salt. Allows the PDK to be created by the client.
      publicUser.pbkdf2Salt = user.pbkdf2Salt;
      /* istanbul ignore if */ // Inspected not tested.
      if (user.privateEmail !== true) {
        publicUser.email = user.email;
      }
      mm.log.debug('createUser: storing', publicUser);            
      self.usersStorage.store('publicUsers', publicUser)
      .then(function(info) {
        self.user = user; // This user is now the current user.
        self.loggedIn = true;
        var userConfig = self.loadUserConfig(userName);
        /* istanbul ignore if */ // Tested independently.
        if (userConfig) {
          mm.log('- Created and Logged in user [' + userName +
                 '] with private configuration');        
          self.respond(rq, user, false, { userConfig: userConfig });
        }
        else {
          mm.log('- Created and Logged in user [' + userName + ']');
          self.respond(rq, user);
        }
      },
      /* istanbul ignore next */ // Tested independently.
      function(e) { 
        mm.log.error('Cannot save public user: ', e.stack);
        self.respond(rq, '', e);
      });
    },
    /* istanbul ignore next */ // Tested independently.
    function(e) { 
      mm.log.error('Cannot save private user:', e.stack);
      self.respond(rq, '', e);
    });
  }
  
  /**
   * @summary **handler: delete a user and return a message**
   * @description
   * The owning user of this session is deleted (if it matches the
   * request). The current user reverts to anonymous.
   * @param {Object} rq the request object
   */   
  WsSession.prototype.deleteUser = 
  function wsDeleteUser(rq) {
    var self = this;
    var deleteUserObj = rq.content;
    mm.log.debug('- Delete user', deleteUserObj);
    var userName = self.user.name;
mm.log.debug('++++++++++++++ deleteUser', deleteUserObj);
    /* istanbul ignore if */ // Tested independently.
    if (userName !== deleteUserObj.name) {
      var em1 = mm.format('"{0}" is not the current user: "{1}"',
          deleteUserObj.name, userName);
      mm.log.error(em1);
      self.respond(rq, '', new Error(em1));
      return;
    }
    mm.log('- Deleting private user [' + userName + ']');
    self.usersStorage.remove('privateUsers', userName)
    .then(function(ok) {
      mm.log('- Deleting public user [' + userName + ']');
      self.usersStorage.remove('publicUsers', userName)
      .then(function(ok) {
        var rmd = mm.format('User "{0}" has been removed', userName);
        self.respond(rq, rmd);
      },
      /* istanbul ignore next */ // Tested independently.
      function(e) { 
        mm.log.error('Cannot remove public user: ', e.stack);
        self.respond(rq, '', e);
      });
    },
    /* istanbul ignore next */ // Tested independently.
    function(e) { 
      mm.log.error('Cannot remove private user:', e.stack);
      self.respond(rq, '', e);
    });
  }

  /**
   * @summary **handler: list user sessions**
   * @description
   * The set of client sessions currently running is returned.
   * @param {Object} rq the request object   */   
  /* istanbul ignore next */ // Tested independently.
  WsSession.prototype.listUserSessions = 
  function wsListUserSessions(rq) {
    var self = this;
    var sessions = self.socketService.sessions;
    var sessionInfos = [];
    for (var key in sessions) {
      var session = sessions[key];
      var sessionInfo = {
        userName: session.user.name,
        sessionId: session.sessionId,
        rqCount: session.rqCount,
        rsCount: session.rsCount,
        lastResponseAt: session.lastResponseAt,
        serverCreatonTime: session.serverCreatonTime,
        firstConnectionTime: session.firstConnectionTime
      };
      sessionInfos.push(sessionInfo);
    }

    mm.log('- Sending into on {0} sessions', sessionInfos.length);
    self.respond(rq, sessionInfos);
  }

  /**
   * @summary **load a userConfig from .config.json files**
   * @description
   * Grant special powers to users who have custom .config.json files.
   * @param {ClientUser} a user to look up.
   * @returns {Config|null} a Config for the specified user.
   */   
  WsSession.prototype.loadUserConfig = 
  function wsLoadUserConfig(userName) {
    var self = this;
    var config = new mm.obj.Config();
    /* istanbul ignore if */ // Tested independently.
    if (config.userLoad(userName)) {
      // Establish the session user config for service request validation.
      // This also allows a power user to logon and pass those powers on 
      // to another user who logs on afterwards (only in the same session).
      self.userConfig.init(config);
      mm.log('- User [' + userName + '] has a personal config.json' )
      return self.userConfig;
    }
    else {
      return false;
    }
  }
}
