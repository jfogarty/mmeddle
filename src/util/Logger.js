/**
 * @fileOverview Logger static methods and constructor.
 * @module util/Logger
 */ 
'use strict';
module.exports = function registerLoggers(mm) {
  var _      = mm.check(mm._);
  var format = mm.check(mm.format);
  
  /**
   * @summary **Create a Priority**
   * @description
   * The last argument in any call to a Logger can specify a LogPriority.
   * Messages to a logger can be filtered based on Priority levels.
   * @constructor
   * @param {number} level the log level of this priority
   * @param {string} name a nice name for display
   * @returns {Priority} the new logger
   */    
  function Priority(level, name) {
    var self = this;
    self.level = level;
    self.name = name;
  }

  Priority.LOW    = new Priority(0, 'LOW');   
  Priority.NORMAL = new Priority(1, 'NORMAL');   
  Priority.HIGH   = new Priority(2, 'HIGH');   

  /**
   * @summary **Create a Logger**
   * @description
   * A Logger receives text messages from various parts of the program
   * via calls to the `log` method, and dispatches them to zero or more
   * destination handlers. The messages may be filtered (i.e. not output)
   * by various mechanisms. Normally one or more destination functions
   * handle output.  A Logger initialized with no destination handlers,
   * although it is enabled, for all the good that will do you.
   *
   * Arranging loggers in a hierarchy is useful since it provides
   * flexibility in dispatching. For example, status messages can go
   * to both a display area, to some log file, and to a server,
   * while internal warnings may just be dispatched to the server.
   * @constructor
   * @param {string} name the name of the logger (origin)
   * @param {Logger} parent an optional parent logger
   * @returns {Logger} the new logger
   */
  var Logger = (function loggerCtorCreator() {
    return function Logger(name, parent) {
      var self = this;
      self.name = name;
      self.enabled = true;
      self.parent = parent ? parent : null;

      /**
       * The minimum `Priority` of messages that will be
       * output to the destinations of this logger. This is set by
       * the `allowPriority` method.
       * @name minimumPriority
       * @type {number}
       * @memberOf module:util/Logger~Logger#
       */       
      self.minimumPriority = Priority.NORMAL;

      /** @member {Array} destinations 
       *  @memberOf! module:utisl/log
       *  @description The array of destination functions
       */
      self.destinations = [];
    }
  }());

  /**
   * @summary Enum for log message priority values.
   * @readonly
   * @enum {number}
   * @default
   */  
  Logger.Priority = Priority;

  /**
   * @summary **Bind log and a few functions as properties to a new member**
   * @description This is a convenient way to get a shortcut to the `log` method of a
   * logger so it can be used as a standalone function. This also binds
   * the convenience properties: `enable`, and `disable`.  These must be
   * used immediately before a call to `log`.
   * @static
   * @param {Logger} bindLog the logger to fetch the `log` method from
   * @returns {function} the rebound `log` method wrapper
   * @example
   *    var status = Logger.bindLog(allMyLoggers.statusLogger);
   *    ...
   *    status.enable.log("Whoop whoop! Everyone to get off from street.");
   */
  Logger.bindLog = function bindLog (rootLogger) {
    var log = _.bind(rootLogger.log, rootLogger);
    // Bind convenience functions to the wrapper function.
    _bindFuncAsProp(log, 'enable', rootLogger.enable, rootLogger);
    _bindFuncAsProp(log, 'disable', rootLogger.disable, rootLogger);
    return log;
  }
  
  function _bindFuncAsProp(obj, name, f, root) {
    Object.defineProperty(obj, name, {
      get: function() { return f.call(root); }
    });
  }

  /**
   * @summary **Exception handler for logger failures (replacable)**
   * @description Loggers should not fail, but when they do someting bad has
   * happened. This is a replaceble function that logs the stack trace
   * by default.
   * @static
   * @param {Error} bindLog the exception that faulted the logger
   */
  /* istanbul ignore next */     
  Logger.failureHandler = function failureHandler(e) {
    console.log('***** Logger Failure *****:', e.stack);
  }

  /**
   * @summary **Format an object argument (replacable)**
   * @description Used internally when objects are passed without a format.
   * @static
   * @param {*} obj the object to format
   * @returns the `util.inpect()` of the object
   */
  Logger.formatObject = function formatObject(obj) {
    if (typeof obj === 'undefined') return '(undefined)';  
    if (obj === null) return '(null)';
    if (typeof obj === 'object') {
      if (obj instanceof String ||
          obj instanceof Number ||
          obj instanceof Date) {
        return obj.toString();
      }
      else {
        return mm.util.inspect(obj);
      }
    }
    else {
      return obj.toString();
    }
  }

  /**
   * @summary **Logger string format routine**
   * @description Exposes the format routine used by the logger.
   * The first parameter is a `sf` compatible format, any remaning 
   * parameters are substitued into the the format.
   * The logger failure handler is used for bad formats.
   * @static
   * @param {...*} arguments the format string and its arguments
   * @returns {string} the formatted string
   */
  Logger.format = function format() {
    return Logger.formatArray(Array.prototype.slice.call(arguments));
  }

  /**
   * @summary **Logger string format array of arguments**
   * @description Exposes the format routine used by the logger.
   * The first entry is a `sf` compatible format, any remaning parameters
   * are substitued into the the format. The logger failure handler is
   * used for bad formats.
   * @static
   * @param {Array} args the format string and its arguments
   * @returns {string} the formatted string
   */
  Logger.formatArray = function formatArray(args) {
    // If the output contains only one argument or the
    // first argument is not a format, then produce `toString()` or
    // `util.inspect` formatted arguments separated by spaces.
    if (args && args.length > 1 && _.isString(args[0]) && args[0].indexOf('{') > -1) {
      try {
        return format.apply(null, args);
      }
      catch (e) {
        Logger.failureHandler(e);
        // Bad formats provide comma separated outputs, not failure.
        return args.join(); 
      }      
    }
    else {
      var outText = '';    
      var separator = '';
      args.forEach(function(arg) {
        outText += separator + Logger.formatObject(arg);
        separator = ' ';
      })
      return outText;
    }
  }

  /**
   * @summary **Get origin for a message (replacable)**
   * @description
   * This is usually used by Destination handlers to get
   * the origin "[logger name]" prefix to place on the message.
   * The handlers can add additional information such as a timestamp, 
   * or omit the origin entirely.
   * @returns {string} '[logger name]' by default.
   */
  Logger.prototype.origin = function origin() {
    var self = this;
    return '[' + self.name + ']';
  }

  /**
   * @summary **Add another destination handler to this logger**
   * @description
   * Destination handlers are functions which receive the text message
   * to log, as well as the logger which produced it, and the message
   * priority: `destFunc(message, logger, priority)`.
   * Multiple identical destinations are ignored.
   * @param {function(message, Logger, priority)} handler 
   *    the destination function
   * @returns {Logger} the logger for chaining
   */
  Logger.prototype.addDestination = function addDestination(handler)
  { 
    var self = this;
    if (_.indexOf(self.destinations, handler) < 0) {
      self.destinations.push(handler);
    }
    return self;
  }

  /**
   * @summary **Remove a handler from this logger**
   * @description
   * Removes a single destination handler, or clears them all with '*'.
   * @param {function(message, Logger, priority)|*} handler the
   *    destination handler function or '*'.
   * @returns {Logger} the logger for chaining
   */
  Logger.prototype.removeDestination = function removeDestination(handler)
  { 
    var self = this;
    if (handler === '*') {
      self.destinations = [];
    }
    else if (_.indexOf(self.destinations, handler) >= 0) {
      self.destinations = _.without(self.destinations, handler);
    }
    return self;
  }
  
  /**
   * @summary **Log a message**
   * @description
   * This is often a `format` followed by objects, but can be a simple
   * text string, or a list of objects.  The message will be converted
   * into a text string and output to all of the destinations of this
   * logger and its parents, unless the message is rejected by a
   * filter, or the logger is disabled.  The last argument can be a 
   * Logger.Priority which controls log filtering.
   * @param {...*} arguments zero or more objects, often with a leading format string.
   * @returns {Logger} the logger for chaining
   */
  Logger.prototype.log = function log() {
    var self = this;
    if (self.enabled) {
      var args = Array.prototype.slice.call(arguments);
      var n = args.length;
      if (n > 0) {
        if (args[n - 1] instanceof Priority) {
          var priority = args.pop();
          return self.logArray(args, priority);
        }
      }
      return self.logArray(args);
    }
    return self;
  }

  /**
   * @summary **Select the lowest priority to log**
   * @description
   * Modifies the minimumPriority to filter the logging of messages.
   * @param {number} v The minimum priority to log
   * @returns {Logger} the logger for chaining
   * @example
   *    logger.allowPriority(Logger.Priority.LOW);
   */
  Logger.prototype.allowPriority = function allowPriority(v) {
    var self = this;
    self.minimumPriority = v;
    return self;
  }

  /**
   * @summary **Enable the logger**
   * @description
   * When a logger is enabled then any messages with a priority greater
   * than or equal to the `minimumPriority` (as set by {@link allowPriority})
   * will be logged to all of the destination handlers of this logger andt
   * its parent handlers (unless it is disabled).
   * @param {boolean} value optional state to set the logger to
   * @returns {Logger} the logger for chaining
   */
  Logger.prototype.enable = function enable(value) {
    var self = this;
    self.enabled = (arguments.length === 0 || value);
    return self;
  }

  /**
   * @summary **Disable this logger**
   * @description
   * When a logger is disabled then any messages sent to this logger are
   * discarded. This encludes messages sent from child loggers to this one.
   * By extension, this means that the parent to this logger will receive
   * no messages from this logger or its children.
   * @returns {Logger} the logger for chaining
   */
  Logger.prototype.disable = function disable() {
    return this.enable(false);
  }

  /**
   * @summary **Log an array of objects as a message**
   * @description
   * The first object can be a format.
   * @param {Array} args zero or more objects in an array.
   * @param {Priority} priority an optional message priority.
   * @returns {Logger} the logger for chaining
   */
  Logger.prototype.logArray = function logArray(args, priority) {
    var self = this;
    var outText = '';    
    if (self.enabled) {
      outText = Logger.formatArray(args);
    }
    return self.logString(outText, priority);
  }

  /**
   * @summary **Log a single string message to the logger's destinations**
   * @param {string} text the message to log.
   * @param {Priority} priority an optional message priority.   
   * @returns {Logger} the logger for chaining
   */
  Logger.prototype.logString = function logString(text, priority) {
    var self = this;
    if (self.enabled) {    
      var messagePriority = priority ? priority : Priority.NORMAL;
      var logger = self;
      var originLogger = self;
      while (logger) {
        if (logger.enabled) {
          _logString(text, originLogger, logger, messagePriority);
          logger = logger.parent;
        }
        else {
          logger = null;
        }
      }
    }
    return self;
  }

  function _logString(text, originLogger, logger, messagePriority) {
    if (messagePriority.level >= logger.minimumPriority.level) {
      logger.destinations.forEach(function (handler) {
        _logStringToDestination(handler, text, originLogger, messagePriority);
      })
    }
  }

  function _logStringToDestination(handler, text, logger, messagePriority) {
    try {
      handler(text, logger, messagePriority);
    }
	  catch (e) {
	      // Loggers should hide the problems caused by badly
	      // behaving destination handlers and just eat the bad
	      // messages, or whatever else is causing the trouble.
	      // This keeps the logger from being part of the problem
	      // thats causing whatever nightmare is in progress.
        /* istanbul ignore next */
        Logger.failureHandler(e);
	    }
    }

  return Logger;
}
