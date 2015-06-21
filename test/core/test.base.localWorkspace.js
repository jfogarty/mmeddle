'use strict';
if (typeof exports === 'object' && typeof module === 'object') {
  var Should = require('should');
  var mmeddle = require('../mmeddle');
}

(function (mm) {
  before(mm.test.mochaTestWorkspace);

  describe('client session workspace', function(){
    it('should allow clearing of the local workspace', function(done) {
      var cs = mm.test.client.cs;
      Should.exist(cs);
      cs.clearLocalWorkspace();
      mm.log.debug('- Cleared:', mm.test.client.cs.ws.name);
      done();
    })
  
    it('should allow loading of the local workspace', function(done) {
      var cs = mm.test.client.cs;
      Should.exist(cs);
      cs.loadLocalWorkspace();
      mm.log.debug('- Loaded:', mm.test.client.cs.ws.name);
      done();
    })
    
    it('should allow saving of the local workspace', function(done) {
      var cs = mm.test.client.cs;  
      cs.saveLocalWorkspace();
      mm.log.debug('- Saved:', mm.test.client.cs.ws.name);
      done();
    })
  })

}(mmeddle));
