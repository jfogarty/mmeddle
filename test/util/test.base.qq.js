'use strict';
if (typeof exports === 'object' && typeof module === 'object') {
  var Should = require('should');
  var mmeddle = require('../mmeddle');
}

(function (mm) {
  var qq = mm.check(mm.Q);

  describe('qq delay (Sanity test for Q promises)', function(){
    describe('#delay1', function(){
      it('should wait 1/10 second and then be done', function() {
        mm.log('- delay1 started');
        return qq.delay(100) 
        .then(function () {
          mm.log('- delay1 done.');
          Should.exist(mm);
          return true;
        });
      })
    })
    
  })
}(mmeddle));  