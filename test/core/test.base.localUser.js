'use strict';
if (typeof exports === 'object' && typeof module === 'object') {
  var Should = require('should');
  var mmeddle = require('../mmeddle');
}

(function (mm) {

  before(mm.test.mochaTestWorkspace);
  
  describe('localuser', function(){
    it('should allow the local user to be cleared', function() {
      Should.exist(mm.test.client.cs);
      var cs = mm.test.client.cs;
      cs.clearLocalUser();
      mm.log.debug('- Cleared:', mm.test.client.cs.user.name);
    })

    it('should allow loading of the local user', function() {
      Should.exist(mm.test.client.cs);
      var cs = mm.test.client.cs;
      cs.loadLocalUser(mm.test.client.mConsole);
      mm.log.debug('- Loaded:', mm.test.client.cs.user.name);
    })
    
    it('should allow saving of the local user', function() {
      var cs = mm.test.client.cs;  
      cs.saveLocalUser(mm.test.client.mConsole);
      mm.log.debug('- Saved:', mm.test.client.cs.user.name);
    })
  })
}(mmeddle));
