'use strict';
if (typeof exports === 'object' && typeof module === 'object') {
  var Should = require('should');
  var mmeddle = require('../mmeddle');
}

(function (mm) {

  var TEST_TIMEOUT = 3000; // Allow a few seconds to fail.
  var _  = mm.check(mm._);
  var EggTimer = mm.check(mm.obj.EggTimer);

  describe('EggTimer ctor', function(){
    this.timeout(TEST_TIMEOUT);
    var eggTime = 1000;
    var goodEgg = new EggTimer(eggTime, '_mocha Test Timer');
    Should.exist(goodEgg);
        
    describe('#onDing', function(){
      it('should take about 1 second', function(ding) {
        var start = _.now();

        goodEgg.onDing(function() {
          var elapsed = _.now() - start;
          mm.log('- Elapsed time:', elapsed);
          elapsed.should.be.within(990, 1200);
          var ielapsed = goodEgg.getElapsedTime();
          mm.log('- EggTimer measured elapsed time:', ielapsed);
          ielapsed.should.be.within(990, 1010);
          ding();
        });
        goodEgg.start();
        mm.log('- Egg timer started');
      })
    })
  })
  
}(mmeddle));  
