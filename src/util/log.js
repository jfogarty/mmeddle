'use srict';
/**
 * @fileOverview The Loggers used by mMeddleSequencedObject static methods 
 *       and constructor.
 * @module util/log
 */ 
module.exports = function registerLoggers(mm) {
  var path = mm.check(mm.path);
  var Logger = mm.check(mm.Logger);
  
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
  log.info   = Logger.bindLog(infoLogger);
  log.debug  = Logger.bindLog(debugLogger);  
  log.status = Logger.bindLog(statusLogger);
  log.warn   = Logger.bindLog(warningLogger);
  log.error  = Logger.bindLog(errorLogger);

  /**
   * @summary **Logger destination for info logging**
   * @description
   * The raw console log is used for info messages.  These are the
   * default log output, so no [name]: prefixes are added to the messages.
   * @param {string} message the text of the message
   * @param {Logger} logger the logger which originate this message
   * @param {number} priority the `Logger.Priority` of the message
   * @alias module:utils/log.consoleLogHandler
   */
  function rawConsoleLogHandler(message, logger, priority) {
    var text = (priority.level > 1 ? '(!)' : '') + message;
    /* istanbul ignore next */
    if (log.writeLine) {
      log.writeLine(text);
    }
    else {
      console.log(text);
    }
  }

  /**
   * @summary **Logger destination for console logging**
   * @description
   * The console log is used for status messages, as well as when other
   * console log types are unavailable for a given environment.
   * @param {string} message the text of the message
   * @param {Logger} logger the logger which originate this message
   * @param {number} priority the `Logger.Priority` of the message
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
   * @param {number} priority the `Logger.Priority` of the message
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
   * @param {number} priority the `Logger.Priority` of the message
   * @alias module:utils/log.errorLogHandler
   */
  /* istanbul ignore next */   
  function errorLogHandler(message, logger, priority) {
    // Use the warning log by default in a browser, since the error log
    // ends up with an annoying stack trace of the logger itself. Not useful.
    if (mm.config.inBrowser) return warningLogHandler(message, logger, priority);  
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
   * @param {number} priority the `Logger.Priority` of the message
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
   * @param {number} priority the `Logger.Priority` of the message
   * @alias module:utils/log.defaultLogHandler
   */
  function defaultLogHandler(func, message, logger, priority) {
    var ptext = '';
    /* istanbul ignore next */
    ptext = priority.level > 1 ? '(!)' : ptext;
    var prefix = logger.origin() + ptext + ':';
    var text = prefix + message;
    // For the PhantomJS headless browser, log.debug is a native
    // function that doesn't like being passed around.
    /* istanbul ignore if */
    if (mm.config.inPhantom) {
      console.log(text);
    }
    else {
      if (log.writeLine) {
        log.writeLine(text);
      }
      else {
        func(text);
      }
    }
  }

  infoLogger.addDestination(rawConsoleLogHandler);  
  statusLogger.addDestination(consoleLogHandler);
  debugLogger.addDestination(debugLogHandler);
  warningLogger.addDestination(warningLogHandler);
  errorLogger.addDestination(errorLogHandler);

  /**
   * @summary **Replace all console outputs with a Writeline function**
   * @description
   * When the application is to something like a browser, it is sometimes
   * useful to replace all log output with a single writeline function
   * of your choosing.
   * @param {function} writeLine a function that takes a single string.
   * @alias module:utils/log.setWriteLine
   */
  log.setWriteLine = function setWriteLine(writeLine) {
    log.writeLine = writeLine;
  }
  
  /**
   * @summary **Replace all console outputs with a CliConsole**
   * @description
   * When the application is using an interactive command handler (i.e. it is
   * a CLI or REPL) then don't use built-in node console logs, instead
   * use the supplied CliConsole. Th
   * @param {CliConsole} cliConsole the Cli Console instance.
   * @alias module:utils/log.setCliConsole
   */
  log.setCliConsole = function setCliConsole(cliConsole) {
    log.cliConsole = cliConsole;
    log.setWriteLine(cliConsole.writeLine);
  }

  /**
   * @summary **Get a Logger destination handler for file output**
   * @description
   * This returns an asynchronous logging handler that appends timestamped
   * messages to log file.
   * @param {string} filePath the file to receive the log messages
   * @alias module:utils/log.getFileLogHandler
   */
  log.getFileLogHandler = function getFileLogHandler(filePath) {
    var msgQueue = []; // Messages before they get written to file.
    var running = 0;
    var logFailed = false;
    var recursionLimit = 50;
    var fileDir = mm.path.dirname(filePath);
    
    // The logHandler is synchronous, but it triggers an async writer.
    function fileLogHandler(message, logger, priority) {
      if (logFailed) return;
      var entry = {
        timestamp: mm._.now(),
        origin: logger.origin(),
        priority: priority,
        message: message
      };
      msgQueue.push(entry);
      if (running === 0) {
        mm.Q.fcall(startRunning);
      }
    }
    
    function startRunning() {
      if (logFailed) return;
      if (running > recursionLimit) {
        logFailed = true;
        mm.log.error('Writing to log [' + filePath +
            '] was getting too far too far behind. Sorry, I give up.');
        return;
      }
      running++;
      try {
        var text = formatTextLines();
        mm.mkdirp(fileDir, function (err, made) {
          if (err) {
            logFailed = true;
            mm.log.error('Creating log dir [' + fileDir + '] has failed', err);      
            return;
          }
          mm.fs.appendFile(filePath, text, function (err) {
            // A log file error kills logging dead.
            if (err) {
              logFailed = true;
              mm.log.error('Writing to log [' + filePath + '] has failed', err);
            }
            else {
              // While formatting or writing, more log messages have been posted.
              if (msgQueue.length > 0) startRunning();
            }
            running--;
          });
        });
      }
      catch (err) {
        logFailed = true;
        mm.log.error('Formatting log [' + filePath + '] has failed', err.stack);
      }
    }

    function formatTextLines() {
      var text = '';
      msgQueue.forEach(function(entry) {
        text += formatTextLine(entry);
      });
      msgQueue = []; // Clear the queue.
      return text;
    }

    function formatTextLine(entry) {
      var ts = mm.util.timestamp(entry.timestamp);
      var text = ts + ' ' +
        mm._.pad(entry.origin, 8) +
        (entry.priority.level > 1 ? '!!!' : '') +
         entry.message +
         '\n';
      return text;
    }
    
    return fileLogHandler;
  }
  
  /**
   * @summary **Set up and start an application file logger**
   * @description
   * This sets up a logging to a file named ./logs/[appname]-yymmdd.log.
   * If debugToConsole is not set then the current log handlers for the
   * debugging logger are cleared so debug messages are only logged to
   * the log file. This currently does nothing when run from a browser.
   * @param {string} appName the application name (with optional .js)
   * @param {bool} debugToConsole also allow debug logging to the console.
   * @alias module:utils/log.setupAppDebugLog
   */
   log.setupAppDebugLog = function setupAppDebugLog(appName, debugToConsole) {
    if (mm.config.inBrowser) return;
    var logDir = path.join(mm.config.baseDir, 'logs');
    var appId = path.basename(appName, '.js');
    var logFile = appId + '-' + mm.util.yymmdd() + '.log';
    var logPath = path.join(logDir, logFile);
    mm.log('- Debug logging to ', logPath);
    
    // Note when mockSock is on, this means that both the server and cli
    // will log to both log files.  Most entertaining.
    mm.loggers.rootLogger.addDestination(log.getFileLogHandler(logPath));
    
    if (debugToConsole) {
      // Log debug messages only to the log file.
      mm.log('- Debug logging to console enabled.');    
    }
    else {
      mm.loggers.debugLogger.removeDestination('*');
      mm.log.debug('============================= ' +
                   'mMeddle ' + appId +' STARTED ' + 
                   '=============================');
    }
  }

  return log;
}
