/**
 * @fileOverview Parser text mode math parser and command handler.
 * @module core/Parser
 */ 
'use strict';
module.exports = function registerLexer(mm) {
  var check      = mm.check;
  var _          = check(mm._);
  var log        = check(mm.log);
  var dbg        = check(log.debug);
  var LOW = mm.check(mm.Logger.Priority.LOW);  

  // The worlds simplest mmath parser.
  var Parser = (function parserCtorCtor() {
    // Any static data for the parser goes here.
  
    var Parser = function parserCtor(cs, ws, mmath) {
      var self = this;
      self.ws = check(ws);       // Make the ws and mmath available from
      self.mmath = check(mmath); // outside the closure for plugins.
      self.cs = check(cs); 
      self.settings = check(ws.settings);
      Object.keys(ws.vars).forEach(
        /* istanbul ignore next */ // Tested independently.
        function (key) {
            ws.vars[key].f = evalFuncStr(ws.vars[key].f);
      });

      /* istanbul ignore next */ // Tested independently.
      function evalFuncStr(func) {
        // When a workspace is saved to storage all functions are converted
        // to strings. They are reevaluated to functions the first time
        // an attempt is made to use one.
        /* istanbul ignore else */ // Tested independently.
        if (!_.isFunction(func)) {
          func = '(' + func + ')';
          dbg('- Convert [{0}] to function', func, LOW);
          return eval(func); // jshint ignore:line 
        }
        else {
         return func;
        }
      }

      /* istanbul ignore next */ // Tested independently.
      Parser.prototype.evalBacktick = function evalBacktick(expr) {
        var self = this;
        if (self.cs.userConfig.administrator) {
          try {
            var r = eval(expr); // jshint ignore:line 
            mm.log('Result:', r);
          }
          catch (e) {
            throw new Error('Eval failed:' + e.stack);
          }
        }
        else {
          /* istanbul ignore next */ // Tested independently.
          throw new Error('You must be an administrator to do this.');
        }
      }

      Parser.prototype.evaluate = function evaluate(expr) {
        var self = this;
        /* istanbul ignore if */ // Tested independently.
        if (_.startsWith(expr, '`')) return self.evalBacktick(expr.substr(1));      
        var NUMBERMODE = self.settings._props.numberMode.values;
        var val = null;
        self.evalFailed = false;
        var assigned = '';
        var re = /^\s*([A-Za-z_]+[0-9A-Za-z_$]*)\s*=/;
        var matches = expr.match(re);
        var hasAssignment = matches;
        if (hasAssignment) {
          assigned = matches[1];
          var i = expr.indexOf('=');
          expr = expr.substring(i + 1);
          dbg('--- Assignment: ', assigned, LOW);
          dbg('--- Expression: ', expr, LOW);
        }
        
        var textExpression = _.trim(expr);
        var idTest = /[A-Za-z_]+[0-9A-Za-z_]*/g;
        var hasVariables = false;
        var hasUndefined = false;
        var undefineds = [];
        expr = expr.replace(idTest, function(v) {
          var rv = 'ws.vars["' + v + '"].f()';
          hasVariables = true;
          dbg('id:[{0}]', v, LOW);
          if (!ws.vars[v]) {
            // look for the symbol in mmath.
            if (self.mmath[v]) {
              if (self.mmath[v].f &&
                  self.settings.numberMode !== NUMBERMODE.num) {
                
                rv = 'mmath.' + v + '.f'; // Standard mMeddle implementation
                if (self.mmath[v].big &&
                  self.settings.numberMode === NUMBERMODE.big) {
                  rv = 'mmath.' + v + '.big'; // Use big when available.
                }
              }
              else {
                rv = 'Math.' + v; // Use the Math implementation
              }
            }
            else {
              hasUndefined = true;
              /* istanbul ignore else */ // Tested independently.
              if (_.indexOf(undefineds, v) < 0) undefineds.push(v);
              var undefinedFunc = 
                  '(function(){ return self.notDefined("' +
                  v + '") })';
              ws.vars[v] = {human: '*undefined*', f:
                  eval(undefinedFunc) }; // jshint ignore:line 
            }
          }
          return rv;
        });

        expr = '(function(){ return ' + expr + ' })';
        dbg('Eval: ', expr, LOW);
        try {
          // eval is the core of this for a while, so suck it up.
          var f = eval(expr); // jshint ignore:line 
          if (hasAssignment) { 
            ws.vars[assigned] = {human: textExpression, f: f };
          }
          if (hasUndefined) {
            log('- Cannot yet evaluate function: {0} {1} still undefined.',
              /* istanbul ignore next */ // Tested independently.
              undefineds.join(), undefineds.length === 1 ? 'is' : 'are');
          }
          else {
            val = f(); // Execute the function.
            /* istanbul ignore if */ // Tested independently.
            if (self.evalFailed) {
              log('*** Evaluation failed. Some values are still undefined.');
            }
            else {
              log('Value = {0}', val);
            }
          }
          return val;
        }
        catch (e) {
          /* istanbul ignore next */ // Tested independently.
          if (self.settings.debugMode) {
            log(e.stack);
          } 
          else {
            log(e);
          }
          /* istanbul ignore next */
          return '';
        }
      }
      
      /* istanbul ignore next */ // Tested independently.
      Parser.prototype.notDefined = function notDefined(v) {
        var self = this;  
        self.evalFailed = true;
        log('- Variable "{0}" is undefined', v);
        return null;
      }
    } // End of constructor for access to constructor closure.
    return Parser;
  }()); // Run constructor initializer for static creations.

  return Parser;
}