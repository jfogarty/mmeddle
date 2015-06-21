'use strict';
/**
 * @fileOverview EggTimer
 * @module util/EggTimer
 */ 
 module.exports = function(mm) {
  var _     = mm.check(mm._);
  var qq    = mm.check(mm.Q);

  //--------------------------------------------------------------------------
  /**
   * @summary **Resettable timer**
   * @description
   * A timer that will fire after two minutes (or any other time you set.
   * @constructor
   * @param {number} timeMs the number of ms to wait (optional)
   * @param {string} timeMs the number of ms to wait (optional)    
   * @returns {EggTimer} the new timer.
   */  
  var EggTimer = function EggTimerCtor(timeMs, name) {
    var self = this;
    var ms = 2 * 60 * 1000;
    /* istanbul ignore next */
    if (_.isString(timeMs)) {
      self.name = timeMs;
    }
    else if (_.isNumber(timeMs)) {
      ms = timeMs;
    }
    else {
      /* istanbul ignore next */
      self.name = 'Timer';
    }
    if (_.isString(name)) {
      self.name = name;
    }
    self.duration = ms;
    self.remaining = ms;
    self.running = false;
    self.dinged = false;
  };

  /**
   * @summary **Set a Ding event**
   * @description
   * Set the event to call when the timer elapses.  There is ONLY one
   * ding handler per timer. Setting a new one replaces the prior one.
   * @returns {EggTimer} the same timer for chaining.
   */
  EggTimer.prototype.onDing = function onDing(dingHandler) {
    var self = this;
    self.dingHandler = dingHandler;
    return self;
  }

  /**
   * @summary **Force a Ding event**
   * @description
   * Force the ding event to occur, thus triggering the ding handlers.
   * This is like winding the timer to zero before the timer has expired
   * and letting it go Ding!
   * @returns {EggTimer} the same timer for chaining.
   */
  EggTimer.prototype.forceDing = function forceDing(dingHandler) {
    var self = this;
    /* istanbul ignore else */
    if (self.timedDefer) {
      self.timedDefer.reject('forced Ding!');
    }
    return self;
  }
  
  /**
   * @summary **Reset the time back to the start time**
   * @description
   * The timer is started over.
   * @param (number) timeMs a new number of ms to wait (optional)       
   * @returns {EggTimer} the same timer for chaining.
   */
  EggTimer.prototype.reset = function reset(timeMs) {
    var self = this;
    if (self.timedDefer) {
      self.timedDefer.resolve(self.getRemainingTime());
    }
    /* istanbul ignore if */
    if (timeMs) {
      self.duration = timeMs;
    }
    self.remaining = self.duration;
    return self.start();
  }

  /**
   * @summary **Start the timer**
   * @description
   * The timer will begin running.
   * @returns {EggTimer} the same timer for chaining.
   */
  EggTimer.prototype.start = function start() {
    var self = this;
    // Allocate a deferred promise with a timer that will automatically
    // fire the ding handler. Each time reset occurs a new timer is
    // started and the old one is resolved to keep it from firing.
    self.timedDefer = qq.defer();
    self.timedDefer
      .promise
      .timeout(self.remaining, 'Ding!')
      .fail(self.dingWrapper.bind(self)); 
    self.startTime = _.now()
    self.running = true;
    self.dinged = false;
    return self;
  }

  /**
   * @summary **Fire the ding handler if it exists**
   */
  EggTimer.prototype.dingWrapper = function dingWrapper() {
    var self = this;
    self.running = false;
    self.stopTime = _.now();
    self.dinged = true;
    /* istanbul ignore else */ // Inspected.
    if (self.dingHandler) {
      try {
        self.dingHandler();
      }
      catch (e) {
        /* istanbul ignore next */
        mm.log.error(self.name + 'handler failed', e.stack);
      }
    }
  }

  /**
   * @summary **Stop the timer**
   * @description
   * The timer will stop and no event will be called. The timer can
   * remain stopped indefinitely but like a stopwatch, when started,
   * it will continue where it left off.
   * Call reset to restart it with the orignial duration.
   * @returns {EggTimer} the same timer for chaining.
   */
  EggTimer.prototype.stop = function stop() {
    var self = this;
    self.running = false;
    self.stopTime = _.now();
    self.remaining = self.getRemainingTime();
    /* istanbul ignore else */ // Inspected.
    if (self.timedDefer) {
      self.timedDefer.resolve(self.remaining);
    }
    return self;
  }

  /**
   * @summary **Get the elapsed time for the timer**
   * @returns {number} the elapsed in ms.
   */
  EggTimer.prototype.getElapsedTime = function getElapsedTime() {
    var self = this;
    var stopTime = self.running ? _.now() : self.stopTime;
    return self.dinged ? self.duration : stopTime - self.startTime;
  }
  
  /**
   * @summary **Get the remaining time for the timer**
   * @returns {number} the time until the ding event fires
   */
  EggTimer.prototype.getRemainingTime = function getRemainingTime() {
    var self = this;
    var remaining = self.duration - self.getElapsedTime();
    return self.dinged ? 0 : remaining;
  }

  return EggTimer;
}
