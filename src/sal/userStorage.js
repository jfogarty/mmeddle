'use strict';
module.exports = function registerSalUserStorage(mm) {
//var SequencedObject = mm.obj.SequencedObject;

  var us = {};
  
  
  
/*  
  
  // The cache of users and user management methods.  
  var users = {};
  users.inMemoryUserCache = {};
  
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

  User.prototype.load = function loadUser () {
    var self = this;
    return self.sequencedFunc(function loadSequenced(deferred) {
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
          }
      }, T);
    })
  };

  User.prototype.save = function saveUser () {
    var self = this;
    return self.sequencedFunc(function saveSequenced(deferred) {
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
  
  User.prototype.create = function createUser(password) {
    var self = this;
    return self.sequencedFunc(password,
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

  User.prototype.login = function loginUser(password) {
    var self = this;
    return self.sequencedFunc(password,
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

  User.prototype.remove = function removeUser() {
    var self = this;
    return self.sequencedFunc(function deleteSequenced(deferred) {
      setTimeout(function() {
          var finishedMessage = 'deleted ' + self.name;
          debug(finishedMessage);
          deferred.resolve(self);
      }, T); 
    })
  };
*/

  return us;
}