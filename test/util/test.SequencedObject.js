'use strict';
if (typeof exports === 'object' && typeof module === 'object') {
  //var Should = require('should');
  var mmeddle = require('../mmeddle');
}

(function (mm) {
  mm.log('- Set up some test loggers');

  var _     = mm.check(mm._);
  var _func = mm.check(_.partial);
  var SequencedObject = mm.check(mm.obj.SequencedObject);

  mm.log.debug('- Create a couple of example SequencedObjects');
  var MySO = function() {
    var self = this;
    SequencedObject.call(self); // populate parent instance fields.
    self.content = '';
  }
  MySO.prototype = Object.create(SequencedObject.prototype);
  
  var o1 = new MySO();
  //var o2 = new MySO();

  mm.log('- Start some SequencedObject testing');
  MySO.prototype.add = function add (text) {
    var self = this;
    return self.deferredFunc(text, function addSequenced(deferred, text) {
      setTimeout(function() {
        self.content += text;
        deferred.resolve(self.content);
      }, 10);
    })
  };
    
  //---------------------------------------------------------------------------
  describe('SequencedObject', function(){
    describe('basic sequencing', function(){
      it('should add objects in scheduled order', function(testDone){
        mm.log.status('- Add a, b, c to o1');
        o1.add('a');
        o1.add('b');
        o1.add('c').then(function(t) { 
          mm.log.status('- Add e and f to o1');  
          o1.add('e');
          return o1.add('f').then(function(t) {
            t.should.equal('abcdef',
              'Operations are sequenced in scheduled order [2]');
            testDone();
            return 'Can you guess where this ends up?';
          })
          // Note that without the returns, the done() will
          // receive a resolved promise with a value of 'undefined'.
        })
        .done(_func(mm.log.debug, '-----Done 1'));
        
        mm.log.status('- Add d to o1');  
        o1.add('d').then( function(t) { 
          t.should.equal('abcd',
            'Operations are sequenced in scheduled order [1]');
          return 'd added, but other adds are still pending';
        })
        .done(_func(mm.log.debug, '-----Done 2'));
      })
    })
  })

/*
  mm.log.status('- Add a, b, c to o1');
  o1.add('a');
  o1.add('b');
  o1.add('c').then( function(t) { 
    mm.log.status('- Add e and f to o1');  
    o1.add('e');
    return o1.add('f').then( function(t) {
      expect(t === 'abcdef', 'Operations are sequenced in scheduled order [2]');
      return 'Can you guess where this ends up?';
    })
    // Note that without the returns, the done() will
    // receive a resolved promise with a value of 'undefined'.
  })
  .done(_func(mm.log.debug, '-----Done 1'));

  mm.log.status('- Add d to o1');  
  o1.add('d').then( function(t) { 
    expect(t === 'abcd', 'Operations are sequenced in scheduled order [1]');
    return 'd added, but other adds are still pending';
  })
  .done(_func(mm.log.debug, '-----Done 2'));
  
  //--------------------------------------------------------------------
  o2.add('xy');
  o2.add('zzy').then( function(t) {
    mm.log.status('++ Now o2 is', t);  
  })
  .done();
  _.defer(_func(mm.log.debug, '-----Deferred 1'))  
  
  o1.next(function() {
      var t1 = o1.content;
      o2.add('-ping').then( function(t2) {
      mm.log.status('++ Now o2 is', t2, 'and o1 is', t1);  
    })
  });

  // Notice the deferred messages are well before most of the
  // good stuff since everything that matters has been scheduled.
  _.defer(_func(mm.log.debug, '-----Deferred 2'))
*/  
}(mmeddle));  
