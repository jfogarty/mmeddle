'use strict';
/**
 * cli.js
 * https://github.com/jfogarty/mmeddle
 *
 * mmeddle.js is a symbolic mmath workspace for browsers and Node.js.
 * It features pluggable types, operators, units, and functions.
 *
 * Usage:
 *
 *     mmeddle [scriptfile] {OPTIONS}
 *     or link to `webcli.html` [in Browser from a mMeddle site]
 *
 * Options:
 *
 *     --version, -v  Show application version
 *        --help, -h  Show help message
 *
 * Example usage:
 *     mmeddle                                 Open a command prompt
 *     mmeddle script.txt                      Run a script file
 *     mmeddle script.txt > results.txt        Run a script file, output to file
 *     cat script.txt | mmeddle                Run input stream
 *     cat script.txt | mmeddle > results.txt  Run input stream, output to file
 *
 * @credits
 * mMeddle makes extensive use of the truly excellent mathjs package by 
 * Jos de Jong <wjosdejong@gmail.com> (https://github.com/josdejong) for 
 * numerical evaluation, and significant code and ideas from mathjs have
*  been hacked into mmeddle.
 *
 * @license
 * Copyright (C) 2015 John Fogarty <johnhenryfogarty@gmail.com> (https://github.com/jfogarty)
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy
 * of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
 
if (typeof exports === 'object' && typeof module === 'object') {
  var mmeddle = require('../index');
}

(function cli(mm) {
  var check         = mm.check;
  var _             = check(mm._);
  var qq            = check(mm.Q);
  var CliConsole    = check(mm.core.CliConsole);
  var ClientSession = check(mm.core.ClientSession);
  var MMeddleClient = check(mm.core.MMeddleClient);
  var CliCommands   = check(mm.core.CliCommands);
  
  var mConsole;

  /**
   * Handle the mMeddle CLI on a CliConsole.
   * @param {Commander} program Command line options for the program
   */
  function _runCli (program) {
    // Sets up a log file that receives timestamped log messages from the
    // various logger types.
    mm.log.setCliConsole(mConsole);
    mConsole.clearScreen();
    mm.log('----- mMeddle CLI v{0} - {1} -----', mm.version, mm.config.serverStartTime);
    if (mm.config.welcomeMessage) mm.log(mm.config.welcomeMessage);
    if (mm.config.mMeddleTS) {
      mm.log('- mMeddle.js:', mm.config.mMeddleTS);    
    }

    if (mm.config.inBrowser) {
      mm.loggers.debugLogger.removeDestination('*');
    }
    mm.log.debug('----- CLI Configuration -----\n', mm.config);

    var host = mm.config.startLocal ? mm.config.localUrl : mm.config.remoteUrl;
    var appName = mm.config.inNode ? 'CLI' : 'WebCLI';
    var cs = new ClientSession(appName);
    var mmc = new MMeddleClient(host, cs);

    var cliCmds = new CliCommands(mConsole, cs);
    cs.bindClient(mmc);
    cs.loadLocalWorkspace();
    cs.loadLocalUser(mConsole);
    
    if (!cs.user.isAnonymous()) {
      mm.log('- Hello {0} {1}.', cs.user.firstName, cs.user.lastName);    
    }

    if (cs.ws.name) {
      mm.log('- Loaded Local Workspace [{0}]: {1} variables', 
          cs.ws.name, cs.ws.varsCount);
    }
    else {
      mm.log('- Loaded Local Workspace: {0} variables', cs.ws.varsCount);
    }

    mmc.connectWorkspace()
    .then(function() {
      mm.log('- Connected to server {0}', host);
      cs.emitLogMessage('CLI connected!');
    })
  
    cliCmds.rootCommandSet.setDefaultHandler(evaluateExpression);

    mConsole.onClose(function() {
      mm.log('- CLI Closed.');
      mm.log();
      process.exit(0);
    });
    
    function readAnother() {
      mConsole.readLine('->')
      .then(function (line) {
        return handleLine(line)
        .then(function () {
          readAnother(); // Not actually recursion.
        });
      },
      function(e) {
        console.log('+++++++mConsole readline failed', e.stack);
      });
    }
    readAnother();

    function evaluateExpression(context) {
//mm.log('evaluateExpression(context)', context);
      // evaluate expression
//try {      
      var line = context.text;
      var expr = line.trim();
      if (expr) {
        if ((_.startsWith(expr, '``') ||
             _.startsWith(expr, '`>')) &&
             cs.isAdmin()) {
          return cs.doCommand(expr)
          .then(function (rs) {
            mm.log('- Cmd Result:', rs.content);
          });
        }
        
        var rv = cs.ws.evaluate(expr);
        if (rv instanceof Error) {
          throw (rv);
        }
        else {
          mm.log('- Result:', rv);
        }
      }
      //mm.log('---------------- [', expr, ']');
      
//} catch (e) { mm.log('eeeeeeeeeeeeeeeeeeeeee', e.stack) }
      return true;
    }

    function handleLine(line) {
      return cliCmds.rootCommandSet.doCmd(line, cs)
      .then(function (d) {
        if (d instanceof Error) {
          mm.log('Good Command error??? :', d);
        }
        return true;
      },
      function (e) {
        //mm.log.error('Command failure:', e.stack);
        mm.log.error('Failed:', e.message);
        return e;
      });
    } // End of handler.
  }

  if (mm.config.inNode) {  
    /**
     * Output a usage message
     */
    var outputUsage = function outputUsage() {
      [
         'mmeddle.js',
         'http://mmeddle-jfogarty.rhcloud.com  https://github.com/jfogarty/mmeddle',
         '',
         'mMeddle is a symbolic mmath workspace for JavaScript and Node.js.',
         'It features pluggable types, operators, units, and functions.',
         '',
         'This command line interface allows you to enter and manipulate a',
         'mmeddle workspace in an awkward and limited fashion.',
         '',
         'Usage:',
         '    mmeddle [scriptfile] {OPTIONS}',
         '',
         '       --help, -h  Show this message',
         '',
         'Example usage:',
         '    mmeddle                                Open a command prompt',
         '    mmeddle script.txt                     Run a script file',
         '    mmeddle script.txt > results.txt       Run a script file, output to file',
         ''
      ].forEach(function(line) { mm.log(line); });
    }

    process.title = 'mMeddleCLI';
    var program = require('commander');
    program
      .version(require('../src/version'))
      .description('a command line interface for mMeddle workspaces')
      // note --usage is NOT a good idea since it conflicts with commander.
      .option('-u, --use', 'Show usage information and exit')
      .option('-d, --debugon', 'Show debug logging to the console')
      .option('-l, --nolog', 'Suppress writing to the log file')
      .parse(process.argv);
      
    if (program.use) {
      outputUsage();
      process.exit(0);
    }

    mConsole = new CliConsole();
    mm.mConsole = mConsole; // Register the mConsole to make debugging easier.
    _runCli(program);
  }
  else {
    // On the browser, require the existence of the following three HTML
    // elements: the text input, its label, and a <pre> div to contain
    // all of the 'console' output text.
    mConsole = new CliConsole('cliInText', 'inTextPrompt', 'consolediv');
    mm.mConsole = mConsole;
    _runCli();
  }
  
}(mmeddle));  
