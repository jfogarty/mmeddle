'use strict';
if (typeof exports === 'object' && typeof module === 'object') {
  var Should = require('should');
  var mmeddle = require('../mmeddle');
}

(function (mm) {
  var TEST_TIMEOUT = 10000; // Allow 10 seconds for the operations.
  
  var tuser = { 
    name: 'mochaTestUser',
    ptpwd: 'xyzzy',
    firstName: 'sir',
    lastName: 'TestUser',
    email: 'notreally@a.value.email.com'
  };  

  beforeEach(mm.test.mochaTestConnect);

  describe('client session user (connected)', function(){
    this.timeout(TEST_TIMEOUT);
    var userName = 'mochaTestUser';
    var testUser = null;
    
    describe('#loginUser/#createUser', function(){
      it('should allow login or create of a user', function() {
        var cs = mm.test.client.cs;
        Should.exist(cs);
        return cs.userCreateOrLogin(tuser)
        .then(function (user) {
          user.should.have.property('name', userName);
          testUser = user; // Logged in user.
          return true;
        });
      });

      it('should allow a second login of the same user', function() {
        var cs = mm.test.client.cs;
        return cs.userLogin(tuser.name, tuser.ptpwd)
        .then(function (user) {
          user.should.have.property('name', tuser.name);
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
 
}(mmeddle));