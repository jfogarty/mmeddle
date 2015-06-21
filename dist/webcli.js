'use strict';
/**
 * @file Browser client webcli
 * @module client/webcli
 */

/**
 * Execute a Command Line Interface on a web page.
 * @param {object} mm the mMeddle root object
 * @alias module:client/webcli.webcli
 */
function webcli(mm) {  // jshint ignore:line 
  var check         = mm.check;
  var Parser        = check(mm.core.Parser);
  var MMath         = check(mm.core.MMath);
  var CliConsole    = check(mm.core.CliConsole);
  var ClientSession = check(mm.core.ClientSession);
  var MMeddleClient = check(mm.core.MMeddleClient);
  var CliCommands   = check(mm.core.CliCommands);
  
  /**
   * Handle the mMeddle CLI on a CliConsole.
   * @param {Commander} program Command line options for the program
   */
  function _runCli (program) {
    var mmath  = check(new MMath());
    mm.log.setCliConsole(mConsole);
    mConsole.clearScreen();
    mm.log('----- mMeddle CLI v0.1.3 -----');

    //mm.config = mm.config.appLoad(__filename);
    mm.loggers.debugLogger.removeDestination('*');
    mm.log.debug('----- CLI Configuration -----\n', mm.config);

    var host = mm.config.localUrl;
    var cs = new ClientSession('WebCLI');
    var mmc = new MMeddleClient(host, cs);
    
    var cliCmds = new CliCommands(mConsole, cs);
    cs.bindClient(mmc);
    cs.loadLocalWorkspace();
    cs.loadLocalUser(mConsole);
    
    if (!cs.user.isAnonymous()) {
      mm.log('- Hello {0} {1}.', cs.user.firstName, cs.user.lastName);    
    }

    var ws = cs.ws;
    if (ws.name) {
      mm.log('- Loaded Local Workspace [{0}]: {1} variables', 
          ws.name, ws.varsCount);
    }
    else {
      mm.log('- Loaded Local Workspace: {0} variables', ws.varsCount);
    }
    var parser = check(new Parser(cs, ws, mmath));
    
    mmc.connectWorkspace()
    .then(function() {
      mm.log('- Connected to server {0}', host);
      cs.emitLogMessage('WebCLI connected.');
    })

    cliCmds.rootCommandSet.defaultHandler(evaluateExpression);

    mConsole.setLineHandler(handleLine, 'Cmd:');
    mConsole.onClose(function() {
      mm.log('- WebCLI Closed.');
      mm.log();
    });

    function evaluateExpression(context) {
      // evaluate expression
      var line = context.text;
      var expr = line.trim();
      if (expr) {
        parser.evaluate(expr);
      }
      return true;
    }

    function handleLine(line) {
      cliCmds.rootCommandSet.doCmd(line, cs)
      .then(function (d) {
        if (d instanceof Error) {
          mm.log('Command error:', d);
        }
      },
      function (e) {
        if (mm.config.debug) {
          mm.log.error('Command failure:', e.stack);
        }
        else {
          mm.log.error('Command failure:', e);
        }
      });
      return true; // Accept the command line.
    } // End of handler.
  }  

  var mConsole = new CliConsole('cliInText', 'inTextPrompt', 'consolediv');
  mm.mConsole = mConsole;
  mm.log('- mMeddle env: ' + mm.envText);

  _runCli();
}