#!/usr/bin/env node
/**
 * cli.js
 * https://github.com/jfogarty/mmeddle
 *
 * mmeddle.js is a symbolic math workspace for JavaScript and Node.js.
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
 * mMeddle makes extensive use of the truly excellent mathjs package by Jos de Jong
 * <wjosdejong@gmail.com> (https://github.com/josdejong) for numerical evaluation, and
 * significant code and ideas from mathjs have been hacked into mmeddle.
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

var mmeddle = require('../index');
var fs = require('fs');

/**
 * auto complete a text
 * @param {String} text
 * @return {[Array, String]} completions
 */
function completer (text) {
  var name;
  var matches = [];
  var m = /[a-zA-Z_0-9]+$/.exec(text);
  if (m) {
    var keyword = m[0];

    // commandline keywords
    ['exit', 'quit', 'clear'].forEach(function (cmd) {
      if (cmd.indexOf(keyword) == 0) {
        matches.push(cmd);
      }
    });

    // math functions and constants
    var ignore = ['expr', 'type'];
    for (var func in math) {
      if (math.hasOwnProperty(func)) {
        if (func.indexOf(keyword) == 0 && ignore.indexOf(func) == -1) {
          matches.push(func);
        }
      }
    }

    // remove duplicates
    matches = matches.filter(function(elem, pos, arr) {
      return arr.indexOf(elem) == pos;
    });
  }

  return [matches, keyword];
}

/**
 * Run stream, read and evaluate input and stream that to output.
 * Text lines read from the input are evaluated, and the results are send to
 * the output.
 * @param input   Input stream
 * @param output  Output stream
 */
function runStream (input, output) {
  var readline = require('readline'),
      rl = readline.createInterface({
        input: input || process.stdin,
        output: output || process.stdout,
        completer: completer
      });

  if (rl.output.isTTY) {
    rl.setPrompt('> ');
    rl.prompt();
  }

  // TODO: automatic insertion of 'ans' before operators like +, -, *, /

  rl.on('line', function(line) {
    var expr = line.trim();

    // check for exit
    if (expr.toLowerCase() == 'exit' || expr.toLowerCase() == 'quit') {
      // exit application
      rl.close();
    }
    if (expr.toLowerCase() == 'clear') {
      // clear memory
      // TODO: jf - parser.clear();
      console.log('memory cleared');

      // get next input
      if (rl.output.isTTY) {
        rl.prompt();
      }
    }
    else {
      // evaluate expression
      if (expr) {
      
        try {
        console.log('-- Evaluate ' + expr);
/*
          var res = parser.eval(expr);
          parser.set('ans', res); // TODO: in case of multi line input, set ans as the last of the expressions
          if (!Array.isArray(res) || res.length) {
            // TODO: how to distinguish array output from multi-line output?

            console.log(math.format(res, PRECISION));
          }
*/
          }
        catch (err) {
          console.log(err.toString());
        }
      }

      // get next input
      if (rl.output.isTTY) {
        rl.prompt();
      }
    }
  });

  rl.on('close', function() {
    console.log();
    process.exit(0);
  });
}

/**
 * Simulate saving a big object.
 */
function fakeSave () {

  var multimeter = require('multimeter');
  var multi = multimeter(process);

  multi.drop(function (bar) {
      var iv = setInterval(function () {
          var p = bar.percent();
          bar.percent(p + 1);
          
          if (p >= 100) clearInterval(iv);
      }, 25);
  });
}

/**
 * Output a help message
 */
function outputHelp() {
  console.log('mmeddle.js');
  console.log('http://mmeddle.org  http://jfogarty.org/mmeddle');
  console.log();
  console.log('mmeddle.js is a symbolic math workspace for JavaScript and Node.js.');
  console.log('It features pluggable types, operators, units, and functions.');
  console.log();
  console.log('This node command line interface allows you to enter and manipulate a');
  console.log('mmeddle workspace in an awkward and llimited fashion.');
  console.log();
  console.log('Usage:');
  console.log('    mmeddle [scriptfile] {OPTIONS}');
  console.log();
  console.log('Options:');
  console.log('    --version, -v  Show application version');
  console.log('       --help, -h  Show this message');
  console.log();
  console.log('Example usage:');
  console.log('    mmeddle                                Open a command prompt');
  console.log('    mmeddle script.txt                     Run a script file');
  console.log('    mmeddle script.txt > results.txt       Run a script file, output to file');
  console.log('    cat script.txt | mmeddle               Run input streaml');
  console.log('    cat script.txt | mmeddle > results.txt Run input stream, output to file');
  console.log();
}

function increaseVerbosity(v, total) {
  return total + 1;
}

var program = require('commander');
console.log('-parsing: ' + process.argv);
program
  .version(require('../src/version'))
  .description("a command line interface for mmeddle.js.")
  .option('-p, --peppers', 'Add peppers')
  .option('-P, --pineapple', 'Add pineapple')
  .option('-b, --bbq', 'Add bbq sauce')
  .option('-s, --size <size>', 'Pizza size', /^(large|medium|small)$/i, 'medium')
  .option('-v, --verbose', 'A value that can be increased', increaseVerbosity, 1)
  .command('install [name]', 'install one or more packages')
  .command('search [query]', 'search with optional query')
  .command('list', 'list packages installed');
  
program
  .command('save [target]')
  .description('save the current workspace and all documents')
  .option("-f, --fast", "Fast save")
  .action(function(target, options){
    var mode = options.fast || "normal";
    target = target || 'all';
    console.log('-- Program size: %j', program.size);
    console.log('-- Saving %s env(s) with %s mode', target, mode);
  });
  
//program.on('--help', function(){
//  outputHelp();
//  //program.outputHelp();
//  process.exit(1); // Displaying help is not a successful run.
//});
 
program.parse(process.argv);  

// Process input and output, based on the command line arguments
console.log('-parsed leaves: ' + process.argv);

/*
if (process.argv.length > 2) {
  var arg = process.argv[2];

  // run a script file
  runStream(fs.createReadStream(arg), process.stdout);
}
else {
  // run a stream, can be user input or pipe input
  runStream(process.stdin, process.stdout);
}
*/
