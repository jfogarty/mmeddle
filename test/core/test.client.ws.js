'use strict';
if (typeof exports === 'object' && typeof module === 'object') {
  var Should = require('should');
  var mmeddle = require('../mmeddle');
}

(function (mm) {
  before(mm.test.mochaTestConnect);

  describe('client session workspace (connected)', function(){
    it('should allow saving of the workspace', function() {
      var cs = mm.test.client.cs;
      Should.exist(cs);
      return cs.saveWorkspace()
      .then(function () {
        mm.log('- Saved to server:', mm.test.client.cs.ws.name);
      })  
    })

    it('should allow loading of the named workspace', function() {
      var cs = mm.test.client.cs;
      Should.exist(cs);
      return cs.loadWorkspace('mochaTestWorkspace')
      .then (function (ws) {
        mm.log('- Loaded workspace from server:', ws.name);
      },
      function (e) {
        mm.log('- Loaded Failed: ', e.message);
      });
    })
  })    
  

}(mmeddle));
