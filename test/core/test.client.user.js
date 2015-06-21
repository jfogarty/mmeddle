'use strict';
if (typeof exports === 'object' && typeof module === 'object') {
  var Should = require('should');
  var mmeddle = require('../mmeddle');
}

(function (mm) {
  var TEST_TIMEOUT = 10000; // Allow 10 seconds for the operations.

  beforeEach(mm.test.mochaTestConnect);

  describe('client session user (connected)', function(){
    this.timeout(TEST_TIMEOUT);
    var userName = 'mochaTestUser';
    var testUser = null;
    
    describe('#loginUser/#createUser', function(){
      it('should allow login or create of a user', function() {
        var cs = mm.test.client.cs;
        Should.exist(cs);
        return cs.userLogin(userName, userName)
        .then(function (user) {
          user.should.have.property('name', userName);
          testUser = user; // Logged in user.
          return true;
        },
        function (e) {
          var u = { name: userName,
                    ptpwd: userName,
                    firstName: 'first' + userName,
                    lastName: 'last' + userName,
                    email: userName + '@' + userName + '.com'
                  };
          var errString = e.toString();
          if (errString.indexOf('ENOENT, ') < 0) {
            Should.not.exist(e);
            throw e;
          }
          return cs.userCreate(u)
          .then(function (user) {
            Should.exist(user);
            mm.log('- Created new User id [{0}] at {1}',
                user.name, user.creationDate);
            testUser = user; // Logged in user.
            return true;
          }, function (e) { Should.not.exist(e); return e; });
        })
      });
      
      it('should allow a second login of the same user', function() {
        var cs = mm.test.client.cs;
        return cs.userLogin(userName, userName)
        .then(function (user) {
          user.should.have.property('name', userName);
          testUser = user; // Logged in user.
          return true;
        });
      })
    })
    
    describe('#userDelete', function(){
      it('should allow delete of the logged in user', function() {
        var cs = mm.test.client.cs;
        return cs.userDelete()
        .then(function (user) {
          Should.exist(user);
          return true;
        },
        function (e) {
          Should.not.exist(e);
          throw e;
        })
      });
    })
  })

  describe('localuser', function(){
    this.timeout(TEST_TIMEOUT);

    it('should allow loading of the local user', function(done) {
      var cs = mm.test.client.cs;
      cs.loadLocalUser(mm.test.client.mConsole);
      done();
    })
    
    it('should allow saving of the local user', function(done) {
      var cs = mm.test.client.cs;  
      cs.saveLocalUser(mm.test.client.mConsole);
      done();
    })
  })
}(mmeddle));