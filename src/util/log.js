'use srict';
/**
 * @fileOverview The Loggers used by mMeddleSequencedObject static methods 
 *       and constructor.
 * @module util/log
 */ 
module.exports = function registerLoggers(mm) {
  var Logger = mm.Logger;
  
  // The rootLogger provides a common logger to catch
  // all log messages. By default it has no destinations.
  var rootLogger    = new Logger('log');
  var debugLogger   = new Logger('debug',   rootLogger);
  var infoLogger    = new Logger('info',    rootLogger);
  var statusLogger  = new Logger('status',  rootLogger);
  var warningLogger = new Logger('warning', rootLogger);
  var errorLogger   = new Logger('error',   rootLogger);

  /**
   * @namespace
   * @property {object}  loggers - The set of available loggers
   * @property {Logger}  loggers.rootLogger - the common logger
   *   used to contain any destination handlers that aggregate output
   *   from all other loggers. The `log` method of this logger is
   *   not normally used.
   * @property {Logger}  loggers.debugLogger - output from the program
   *   that is not intended for users, only developers of this code.
   *   Shortcut access: **mm.log.debug()**
   * @property {Logger}  loggers.infoLogger - general info about the
   *   execution of the program that should be saved persistently.
   *   Shortcut access: **mm.log()** as well as **mm.log.info()**
   * @property {Logger}  loggers.statusLogger - progress information
   *   that is normally displayed on the user interface.
   *   Shortcut access: **mm.log.status()**  
   * @property {Logger}  loggers.warningLogger - execution warnings
   *   not usually viewed by the user, but logged persistently.
   *   Shortcut access: **mm.log.warn()*  
   * @property {Logger}  loggers.errorLogger - execution errors that the
   *   Shortcut access: **mm.log.error()**     
   *   user needs to see
   */   
  mm.loggers = {
    rootLogger: rootLogger, 
    debugLogger: debugLogger,
    infoLogger: infoLogger,    
    statusLogger: statusLogger,
    warningLogger: warningLogger,
    errorLogger: errorLogger
  }

  var log    = Logger.bindLog(infoLogger);
  log.debug  = Logger.bindLog(debugLogger);  
  log.info   = Logger.bindLog(infoLogger);
  log.status = Logger.bindLog(statusLogger);
  log.warn   = Logger.bindLog(warningLogger);
  log.error  = Logger.bindLog(errorLogger);

  /**
   * @summary **Logger destination for console logging**
   * @description
   * The console log is used for info, and status messages, as well as
   * when other console log types are unavailable for a given environment.
   * @param {string} message the text of the message
   * @param {Logger} logger the logger which originate this message
   * @param {number} priority the `Logger.PRIORITY` of the message
   * @alias module:utils/log.consoleLogHandler
   */
  function consoleLogHandler(message, logger, priority) {
    defaultLogHandler(console.log, message, logger, priority);
  }

  /**
   * @summary **Logger destination handler for debug logging**
   * @description   
   * This is added to the {@link debugLogger} to handle `log.debg` messages.
   * @param {string} message the text of the message
   * @param {Logger} logger the logger which originate this message
   * @param {number} priority the `Logger.PRIORITY` of the message
   * @alias module:utils/log.debugLogHandler
   */
  /* istanbul ignore next */
  function debugLogHandler(message, logger, priority) {
    // Node has no console.debug  
    if (!console.debug) return consoleLogHandler(message, logger, priority);
    defaultLogHandler(console.debug, message, logger, priority);
  }
  
  /**
   * @summary **Logger destination handler for error logging**
   * @description
   * This is added to the {@link errorLogger} to handle `log.error` messages.
   * On `Node.js` this is to **stdio.err**. On browsers these are treated
   * as `warn` messages since error logging is an ugly stack trace.
   * @param {string} message the text of the message
   * @param {Logger} logger the logger which originate this message
   * @param {number} priority the `Logger.PRIORITY` of the message
   * @alias module:utils/log.errorLogHandler
   */
  /* istanbul ignore next */   
  function errorLogHandler(message, logger, priority) {
    // Use the warning log by default in a browser, since the error log
    // ends up with an annoying stack trace of the logger itself. Not useful.
    if (mm.inBrowser) return warningLogHandler(message, logger, priority);  
    if (!console.error) return consoleLogHandler(message, logger, priority);
    // In node, console.error outputs to stdio.err
    defaultLogHandler(console.error, message, logger, priority);
 }

  /**
   * @summary **Logger destination handler for warning logging**
   * @description
   * This is added to the {@link Logger} to handle `log.warn` messages.
   * On browsers such as *FireFox*, warninge messages are output in yellow
   * with a nice tag in the console window of the debugging tools.
   * @param {string} message the text of the message
   * @param {Logger} logger the logger which originate this message
   * @param {number} priority the `Logger.PRIORITY` of the message
   * @alias module:utils/log.warningLogHandler
   */
   /* istanbul ignore next */
   function warningLogHandler(message, logger, priority) {
    if (!console.warn) return consoleLogHandler(message, logger, priority);
    // In node, console.warn outputs to stdio.err
    defaultLogHandler(console.warn, message, logger, priority);
  }

  /**
   * @summary **Logger destination handler common function**
   * @description
   * This does the actual formatting of messages for the text line oriented
   * log messages.
   * @param {function} func the actual message output function
   * @param {string} message the text of the message
   * @param {Logger} logger the logger which originate this message
   * @param {number} priority the `Logger.PRIORITY` of the message
   * @alias module:utils/log.defaultLogHandler
   */
  function defaultLogHandler(func, message, logger, priority) {
    var ptext = '';
    /* istanbul ignore next */
    ptext = priority > 1 ? '(!)' : ptext;
    var prefix = logger.origin() + ptext + ':';
    var text = prefix + message;
    // For the PhantomJS headless browser, log.debug is a native
    // function that doesn't like being passed around.
    /* istanbul ignore if */
    if (mm.inPhantom) {
      console.log(text);
    }
    else {
      func(text);
    }
  }

  infoLogger.addDestination(consoleLogHandler);  
  statusLogger.addDestination(consoleLogHandler);
  debugLogger.addDestination(debugLogHandler);
  warningLogger.addDestination(warningLogHandler);
  errorLogger.addDestination(errorLogHandler);

  return log;
}
