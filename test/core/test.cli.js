'use strict';
if (typeof exports === 'object' && typeof module === 'object') {
  var Should = require('should');
  var mmeddle = require('../mmeddle');
}

(function (mm) {
  var TEST_TIMEOUT = 20000; // Allow 15 seconds for the operations.

  var Parser   = mm.check(mm.core.Parser);
  var MMath    = mm.check(mm.core.MMath);
  var EggTimer = mm.check(mm.obj.EggTimer);

  before(mm.test.mochaTestConnect);

  describe('CLI - Command Line Interface', function(){
    this.timeout(TEST_TIMEOUT);

    it('should allow setup of a new CLI', function() {
      var cliCmds  = mm.test.client.cmds;
      var cs       = mm.test.client.cs;
      var ws       = cs.ws;
      var mConsole = mm.test.client.mConsole;
      
      var mmath    = mm.check(new MMath());
      var parser   = mm.check(new Parser(cs, ws, mmath));
      
      cliCmds.rootCommandSet.defaultHandler(evaluateExpression);
      
      mConsole.setLineHandler(handleLine, '_mochaTest CLI ->');
      mConsole.onClose(function() {
        mm.log('- _mochaTest CLI Closed.');
        mm.log();
        // process.exit(0);
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

      Should.exist(cs);
    })
    
    it('should allow some stuff to happen', function(done) {
    try {     
      var mConsole = mm.test.client.mConsole;
      var idleTimer = new EggTimer(3000, 'test console idle');
      idleTimer.onDing(function () {
        mm.log('-------------- Thats a wrap -------------');
        mConsole.close();
        done();
      });
      
      mConsole.setIdleTimer(idleTimer);
      var clx = mConsole.spoofInput;
      var cli = mConsole.spoofInputChars;

      clx('clear all');
      clx('help');
      clx('help nonsenseCommand');
      clx('help login');
      
      cli('C = B + 1');
      cli('A = 22 * 33');
      cli('B = A * A');
      cli('CC = B + 2');
      cli('CD = B + 3');
      
      cli('clear XYZZY');
      
      cli('list C*');
      cli('list C');

      cli('?');
      cli('??');
      cli('A');
      cli('B');
      cli('C');
      
      cli('clear');
      cli('clear CC');
      
      cli('.?');

      //-------------------------------------------------------------------
      cli('.debug -?');
      cli('.debug');
      cli('.debug off');
      cli('.debug false');
      cli('.debug off normal');
      
      cli('.debug on low');

      cli('.big');
      cli('sin(PI/4)');
      
      cli('.imp');
      cli('sin(PI/4)');

      cli('.num');
      cli('sin(PI/4)');
      cli('.debug on normal');

      cli('save');
      
      //-------------------------------------------------------------------

      var nextCommand = function () {
        cli('.list user');
        cli('.list users');
        mConsole.onPause(2000, function () {           
          cli('.list user cliMochaTestUser');
          cli('.deleteUser');
        });
      }

      cli('.list user doesNotExist');      
      cli('login cliMochaTestUser xyzzy');
      mConsole.onPause(2000, function () {
        if (mConsole.handler.prompt.indexOf('password') > 0) {
          cli('xyzzy');
          mConsole.onPause(function () {
            cli('mr');
            mConsole.onPause(function () {
              cli('mochaMan');
              mConsole.onPause(function () {            
                cli('mochaTest@fakeEmail.com');
                nextCommand();
              });
            });
          });
        }
        else {
          nextCommand();
        }
      });
    }
    catch (e) { mm.log(e.stack) }
    })
  })

}(mmeddle));
