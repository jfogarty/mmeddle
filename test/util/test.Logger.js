'use strict';
if (typeof exports === 'object' && typeof module === 'object') {
  //var Should = require('should');
  var mmeddle = require('../mmeddle');
}

(function (mm) {
  mm.log('- Set up some test loggers');
  var HIGH   = mm.check(mm.Logger.Priority.HIGH);
  var NORMAL = mm.check(mm.Logger.Priority.NORMAL);
  var LOW    = mm.check(mm.Logger.Priority.LOW);

  var Logger = mm.Logger;
  var rootLogger = mm.check(new Logger('log'));
  var aLogger    = mm.check(new Logger('aLog', rootLogger));
  var bLogger    = mm.check(new Logger('bLog', aLogger));
  var loggerFailed = false;

  var log = Logger.bindLog(rootLogger);
  log.a = Logger.bindLog(aLogger);  
  log.b = Logger.bindLog(bLogger);

  // Arrays to hold the mock log outputs.
  var r = [];
  var a = [];
  var b = [];

  rootLogger.addDestination(rootLogHandler);
  aLogger.addDestination(aLogHandler);
  bLogger.addDestination(bLogHandler);
  
  function rootLogHandler(message, logger, priority) {
    arrayLogHandler(r, message, logger, priority);
  }

  function aLogHandler(message, logger, priority) {
    arrayLogHandler(a, message, logger, priority);
  }

  function bLogHandler(message, logger, priority) {
    arrayLogHandler(b, message, logger, priority);
  }
 
  function arrayLogHandler(array, message, logger, priority) {
    var ptext = priority.level > 1 ? '(!)' : '';
    var prefix = logger.origin() + ptext + ':';
    var text = prefix + message;
    array.push(text);    
  }
  
  
  function logHandlerOfDoom(message, logger, priority) {
    return xyzzy; // jshint ignore:line 
  }

  function failureHandlerOfGrace(e) {
    loggerFailed = true;
  }
  
  beforeEach(function(){
    a = [];
    b = [];
    r = [];
  })

  describe('Logger', function(){
    describe('static #format', function(){
      it('should call the logger\'s exception limited routine', function(){
        var s = Logger.format('Put {0} {1} where {2}.',
            'your', 'money', 'your mouth is');
        s.should.equal('Put your money where your mouth is.');      
      })
    })      
  
    describe('#log', function(){
      it('should deliver messages to parent logs', function(){
        mm.log('Messages should be delivered to parent logs');
        log.a('Hello');
        mm.log.debug(a);
        r[0].should.equal('[aLog]:Hello', 
            'root log gets properly formatted message');
        a[0].should.equal('[aLog]:Hello',
            'destination log gets properly formatted message');
        b.should.be.empty; // jshint ignore:line 
        log.b('To all three destinations');
        log('Only to root');
        r.should.have.length(3);
        a.should.have.length(2);
        b.should.have.length(1);
      })
    
      it('should format objects appropriately', function(){
        log.b(String('a string'));
        log.b(Number(12.34));
        log.b(new Date(2000, 0, 1, 0, 0, 0));
        log.b(12345);
        log.b({ x: 12, y: 'ain\'t right' });
        log.b(undefined, null, NaN);

        mm.log.debug(r);
        r[0].should.equal('[bLog]:a string',
            'String objects should not have quotes');
        r[1].should.equal('[bLog]:12.34', 
            'Number objects should be in raw form');
        r[2].should.startWith('[bLog]:Sat Jan 01 2000',
            'Date object formatting');
        r[3].should.equal('[bLog]:12345',
            'Simple number objects are shown as strings');
        r[4].should.equal('[bLog]:{ x: 12, y: \'ain\\\'t right\' }', 
          'Objects are shown in util.inspect form.');
        r[5].should.equal('[bLog]:(undefined) (null) NaN', 
          'Undefined, null, and NaN sre a special case.');
      })
      
      it('should process format strings', function(){
        log.a('{name} is a {job}.', { name: 'Bob', job: 'pilot' });
        log.a('[{0:#,##0.00} then {0,15:#,##0.00}]', 2123.5);
        r[0].should.equal('[aLog]:Bob is a pilot.',
            'Format allows fields to be pulled by name');
        r[1].should.equal('[aLog]:[2,123.50 then        2,123.50]',
            'Format numbers with commas');
      })
    })

    describe('exception handling', function(){
      it('should handle logging failures with some grace', function(){
        var savedFunc = Logger.failureHandler;
        Logger.failureHandler = failureHandlerOfGrace;
        aLogger.addDestination(logHandlerOfDoom);
        aLogger.log('Die, die, die.', HIGH);
        loggerFailed.should.equal(true, 
            'Detected logger failure without the end of the world');
        loggerFailed = false;
        log.b('{1:xyzzy} {1:4d}.', 213);    
        loggerFailed.should.equal(true, 
            'Detected format failure without the end of the world');
        Logger.failureHandler = savedFunc;
        aLogger.removeDestination(logHandlerOfDoom);
      })
    })

    describe('#addDestination and #removeDestination', function(){
      it('should deliver messages to parent logs', function(){
        aLogger.removeDestination(aLogHandler);
        aLogger.destinations.should.have.length(0,
            'Remove a single destination');
        aLogger.removeDestination(aLogHandler);
        aLogger.destinations.should.have.length(0,
            'Double removal is ok');
        aLogger.addDestination(rootLogHandler);
        aLogger.addDestination(rootLogHandler);
        aLogger.addDestination(aLogHandler);
        aLogger.addDestination(bLogHandler);
        aLogger.addDestination(aLogHandler);
        aLogger.addDestination(bLogHandler);
        aLogger.addDestination(rootLogHandler);
        aLogger.destinations.should.have.length(3,
            'Multiple adds are ok');
        aLogger.removeDestination('*');
        aLogger.destinations.should.have.length(0,        
            'Remove all is allowed');
        aLogger.addDestination(aLogHandler);
      })        
    })
    
    describe('#high, #low, #allowPriority handling', function(){
      it('should filter based on priorities', function(){
        bLogger.log('Nothing to see here, more along', LOW);
        r.should.have.length(0,
            'Low priority messages should not be logged by default');
        bLogger.log('hi', HIGH);
        r[0].should.equal('[bLog](!):hi',
            'High priority messages can be logged with a different format');
        bLogger.log('norm', NORMAL);
        r[1].should.equal('[bLog]:norm',
            'Log normal priority messages');
      })
      
      it('should allow priorities to be changed', function(){      
        bLogger.allowPriority(LOW);
        bLogger.log('low', LOW);
        b[0].should.equal('[bLog]:low',
            'Log low priority messages');
        r.should.have.length(0,
            'Ignore low priority messages on the root');
      })
    })
    
    describe('#enable and #disable logging', function(){
      it('should handle output based on what logs are enabled', function(){
        bLogger.disable().log('Nothing to see here, more along', HIGH);
        log.b.disable.log('Nothing to see here, more along');
        bLogger.logArray('Testing', 1, 2, 3, '...')
        bLogger.logString('more trash')
        log.b('Nothing can get through here.', HIGH);
        log.b('Nothing can get through here.', LOW);
        b.should.have.length(0,
            'Diabled messages should not go to log');
        r.should.have.length(0,
            'Diabled messages should not go to root logs');
        a.should.have.length(0, 
            'Disabled messages should not go to parent logs');
        log.a('This should still work');
        r.should.have.length(1);
        a.should.have.length(1);
        b.should.have.length(0);
        bLogger.enable().log('Turn it back on', HIGH);
        b.should.have.length(1);
        r.should.have.length(2);
        log.disable.log('Now the root logger is off');
        r.should.have.length(2); // Nothing added.
        log.a('This should still work');
        r.should.have.length(2); // Nothing added.
        a.should.have.length(3);
      })
    })
  })
}(mmeddle));
