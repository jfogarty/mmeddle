#!/usr/bin/env node
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

 module.exports = (function runCli () {
  process.title = 'mMeddleCLI';
  var mm = require('../index');
  var check         = mm.check;
  var _             = check(mm._);
  var qq            = check(mm.Q);
  var Logger        = check(mm.Logger);
  var Lexer         = check(mm.core.Lexer);
  var Parser        = check(mm.core.Parser);
  var MMath         = check(mm.core.MMath);
  var CliConsole    = check(mm.core.CliConsole);
  var ClientSession = check(mm.core.ClientSession);
  var MMeddleClient = check(mm.core.MMeddleClient);
  var CliCommands   = check(mm.core.CliCommands);
  
  var mmath  = check(new MMath());
  var ls  = new mm.storage.LocalStorage();

  /**
   * Handle the mMeddle CLI on a CliConsole.
   * @param {Commander} program Command line options for the program
   */
  function runCli (program) {
    // Sets up a log file that receives timestamped log messages from the
    // various logger types.
    var mConsole = new CliConsole();
    mm.log.setCliConsole(mConsole);
    mConsole.clearScreen();
    mm.log('----- mMeddle CLI v0.1.3 -----');

    if (!program.nolog) {
      mm.log.setupAppDebugLog(__filename, program.debugon);
    }
    mm.config = mm.config.appLoad(__filename);
    mm.log.debug('----- CLI Configuration -----\n', mm.config);

    var host = mm.config.localUrl;
    var cs = new ClientSession('CLI:');
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
      cs.emitLogMessage('CLI connected!');
    })
  
    cliCmds.rootCommandSet.defaultHandler(evaluateExpression);
  
    mConsole.setLineHandler(handleLine, '->');
    mConsole.onClose(function() {
      mm.log('- CLI Closed.');
      mm.log();
      process.exit(0);
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
        //mm.log.error('Command failure:', e.stack);
        mm.log.error('Command failure:', e);
      });
      return true; // Accept the command line.
    } // End of handler.
  }
 
  /**
   * Output a usage message
   */
  function outputUsage() {
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

  runCli(program);
}());
