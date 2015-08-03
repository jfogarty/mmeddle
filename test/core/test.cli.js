'use strict';
if (typeof exports === 'object' && typeof module === 'object') {
  var Should = require('should');
  var mmeddle = require('../mmeddle');
}

(function (mm) {
  var TEST_TIMEOUT = 20000; // Allow 15 seconds for the operations.

  var EggTimer = mm.check(mm.obj.EggTimer);

  before(mm.test.mochaTestConnect);

  describe('CLI - Command Line Interface', function(){
    this.timeout(TEST_TIMEOUT);

    it('should allow setup of a new CLI', function() {
      var cliCmds  = mm.test.client.cmds;
      var cs       = mm.test.client.cs;
      var mConsole = mm.test.client.mConsole;
  
      cliCmds.rootCommandSet.setDefaultHandler(evaluateExpression);

      mConsole.onClose(function() {
        mm.log('- _mochaTest CLI Closed.');
        mm.log();
        //process.exit(0);
      });
      
      function readAnother() {
        return mConsole.readLine('_mochaTest CLI ->')
        .then(function (line) {
          return handleLine(line)
          .then(function () {
            readAnother(); // Not actually recursion.
          });
        },
        function(e) {
          mm.log.fail(e);
        });
      }
      readAnother(); // Start the CLI.

      function evaluateExpression(context) {
        var line = context.text;
        var expr = line.trim();
        if (expr) {
          var rv = cs.ws.evaluate(expr);
          if (rv instanceof Error) {
            throw (rv);
          }
          else {
            mm.log('- Result:', rv);
          }
        }
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
          mm.log.error('Failed:', e.message);
          return e;
        });
      } // End of handler.

      Should.exist(cs);
    })
    
    //------------------------------------------------------------------------
    it('should handle help commands', function(done) {
    try {     
      var mConsole = mm.test.client.mConsole;
      var idleTimer = new EggTimer(1000, 'test console idle');
      idleTimer.onDing(function () {
        mm.log('----- End CLI help tests');
        idleTimer.stop();
        done();
      });
      
      mConsole.setIdleTimer(idleTimer);
      var cli = mConsole.spoofInput;
      //var cli = mConsole.spoofInputChars;


      cli('help');
      cli('help nonsenseCommand');
      cli('help login');
      cli('.?');
      cli('.help debug');
      cli('.debug -?');
    } catch (e) { mm.fail(e) }
    })

    //------------------------------------------------------------------------
    it('should handle workspace math commands', function(done) {
    try {     
      var mConsole = mm.test.client.mConsole;
      var idleTimer = new EggTimer(3000, 'test console idle');
      idleTimer.onDing(function () {
        mm.log('----- End CLI math workspace tests');
        idleTimer.stop();
        done();
      });
      
      mConsole.setIdleTimer(idleTimer);
      var cli = mConsole.spoofInput;

      cli('clear all');
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
    } catch (e) { mm.fail(e) }
    })

    //------------------------------------------------------------------------
    it('should handle .debug command math commands', function(done) {
    try {     
      var mConsole = mm.test.client.mConsole;
      var idleTimer = new EggTimer(1000, 'test console idle');
      idleTimer.onDing(function () {
        mm.log('----- End CLI .debug command tests');
        idleTimer.stop();
        done();
      });

      mConsole.setIdleTimer(idleTimer);
      var cli = mConsole.spoofInput;
      
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
    } catch (e) { mm.fail(e) }
    })
  
    //------------------------------------------------------------------------
    it('should handle workspace and user commands', function(done) {
    try {     
      var mConsole = mm.test.client.mConsole;
      var idleTimer = new EggTimer(2000, 'test console idle');
      idleTimer.onDing(function () {
        mm.log('----- End CLI workspace commands');
        mConsole.close();
        idleTimer.stop();
        done();
      });

      mConsole.setIdleTimer(idleTimer);
      var cli = mConsole.spoofInput;
      
      cli('save');
      
      cli('.list user');
      cli('.list users');

      cli('.list user doesNotExist');

      cli('login mochaTestUser xyzzy');
        cli('xyzzy');
        cli('mr');
        cli('mochaMan');
        cli('mochaTest@fakeEmail.com');

      cli('.list user mochaTestUser');
        
      cli('.user delete');
      
      //cli('load');
      
    } catch (e) { mm.fail(e) }
    })
  })      
  
/*    

      //-------------------------------------------------------------------
*/  
      //-------------------------------------------------------------------
/*


      var nextCommand = function () {
        });
      }


              });
            });
          });
        }
        else {
          nextCommand();
        }
      });
*/    

}(mmeddle));
