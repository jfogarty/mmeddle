'use strict';
if (typeof exports === 'object' && typeof module === 'object') {
  var Should = require('should');
  var mmeddle = require('../mmeddle');
}

(function (mm) {
  var _ = mm.check(mm._);

  var TEST_TIMEOUT = 8000; // Allow a few seconds for the operations.
  before(mm.test.mochaTestConnect);

  var tuserName = 'mochaTestUser';
  var ptpwd = 'xyzzy';
  var tuser = { 
    name: tuserName,
    ptpwd: ptpwd,
    firstName: 'sir',
    lastName: 'TestUser',
    email: 'notreally@a.value.email.com'
  };

  describe('client session workspace (connected)', function(){
    this.timeout(TEST_TIMEOUT);
    it('should allow saving of the workspace', function(done) {
      var cs = mm.test.client.cs;
      Should.exist(cs);
      return cs.userLogin(tuserName, ptpwd, false, _.assign({}, tuser))
      .then(function () {
        return cs.saveWorkspace('mochaTestWorkspace')
        .then(function () {
          mm.log('- Saved to server:', mm.test.client.cs.ws.name);
          done();
        })  
      })
    })
 
    it('should allow loading of the named workspace', function(done) {
      var cs = mm.test.client.cs;
      Should.exist(cs);
      return cs.userLogin(tuserName, ptpwd, false, _.assign({}, tuser))
      .then (function () {
        return cs.loadWorkspace('mochaTestWorkspace')
        .then (function (ws) {
          mm.log('- Loaded workspace from server:', ws.name);
          done();
        },
        function (e) {
          mm.log('- Loaded Failed: ', e.message);
          done(e);
        })
        .then(function () {
          return cs.userDelete().
          then(function (result) {
            mm.log('- Delete user completed: ', result);          
          },
          function (e) {
            mm.log.error('Delete user failed: ', e.message);
            throw e;
          })
        })
      })
    })

    it('should finish the damn thing', function(done) {
      var cs = mm.test.client.cs;
      Should.exist(cs);
      done();
    })      
  })    

}(mmeddle));
