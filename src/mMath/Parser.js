/**
 * @fileOverview text mode math parser and command handler.
 * @module mMath/Parser
 */ 
'use strict';
module.exports = function registerParser(mm) {
  var check  = mm.check;
  var _      = check(mm._);
  var LOW    = check(mm.Logger.Priority.LOW);

  //--------------------------------------------------------------------------
  /**
   * @summary **mMath super simple math parser**
   * @description
   * This is currently more of a shim on top of javascript functions than
   * an actual parser at this point. All it does is locate symbols in the
   * text sting and convert them to symbolic function references.  Then
   * it spits out a function that wraps the expression.
   * @constructor
   * @param {MMath} mmath an instance of the symbolic math library.
   * @param {object} context contains settings, and a vars object.
   * @param {object} sessionContext contains a userConfig.
   * @returns {Parser} a new mMath parser.
   */  
  var Parser = (function parserCtorCtor() {
    // Any static data for the parser goes here.
  
    var Parser = function parserCtor(context, mmath, sessionContext) {
      check(context);
      check(mmath);
      check(sessionContext);
      var self = this;
      self.evalFailed = false;

      /* istanbul ignore next */ // Tested independently.
      function evalFuncStr(func) {
        var vars = context.vars;  // jshint ignore:line
        // When a workspace is saved to storage all functions are converted
        // to strings. They are reevaluated to functions the first time
        // an attempt is made to use one.
        /* istanbul ignore else */ // Tested independently.
        if (!_.isFunction(func)) {
          func = '(' + func + ')';
          mm.log.debug('- Convert [{0}] to function', func, LOW);
          return eval(func); // jshint ignore:line 
        }
        else {
         return func;
        }
      }

      Parser.prototype.update = function update() {
        var vars = context.vars; 
        Object.keys(vars).forEach(
          /* istanbul ignore next */ // Tested independently.
          function (key) {
            var f = vars[key].f;
            try {          
              vars[key].f = evalFuncStr(f);
            }
            catch (e) {
              mm.log.warning(
                '[' + key + ']: Invalid function in workspace: ', f);
              delete vars[key];
            }
          }
        );
      }

      /* istanbul ignore next */ // Tested independently.
      Parser.prototype.evalBacktick = function evalBacktick(expr) {
        var vars = context.vars; // jshint ignore:line
        if (sessionContext.userConfig.administrator) {
          try {
            var r = eval(expr); // jshint ignore:line 
            return r;
          }
          catch (e) {
            return new Error('Eval failed:' + e.stack);
          }
        }
        else {
          /* istanbul ignore next */ // Tested independently.
          return new Error('You must be an administrator to do this.');
        }
      }

      Parser.prototype.evaluate = function evaluate(expr) {
        var vars = context.vars; 
        var val = null;      
        var undefineds = [];        
        var hasUndefined = false;
        var textExpression;
        var hasAssignment;
        var assigned;
        try {      
          /* istanbul ignore if */ // Tested independently.
          if (_.startsWith(expr, '`')) return self.evalBacktick(expr.substr(1));      
          var NUMBERMODE = context.settings._props.numberMode.values;
          self.evalFailed = false;
          assigned = '';
          var re = /^\s*([A-Za-z_]+[0-9A-Za-z_$]*)\s*=/;
          var matches = expr.match(re);
          hasAssignment = matches;
          if (hasAssignment) {
            assigned = matches[1];
            var i = expr.indexOf('=');
            expr = expr.substring(i + 1);
            mm.log.debug('--- Assignment: ', assigned, LOW);
            mm.log.debug('--- Expression: ', expr, LOW);
          }
          
          textExpression = _.trim(expr);
          var idTest = /[A-Za-z_]+[0-9A-Za-z_]*/g;
          var hasVariables = false;
          expr = expr.replace(idTest, function(v) {
            var rv = 'vars["' + v + '"].f()';
            hasVariables = true;
            mm.log.debug('id:[{0}]', v, LOW);
            if (!vars[v]) {
              // look for the symbol in mmath.
              if (mmath[v]) {
                if (mmath[v].f &&
                    context.settings.numberMode !== NUMBERMODE.num) {
                  
                  rv = 'mmath.' + v + '.f'; // Standard mMeddle implementation
                  if (mmath[v].big &&
                    context.settings.numberMode === NUMBERMODE.big) {
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

                // TODO: Add a DO/UNDO change log to context.
                context.saved = false;
                context.savedLocal = false;
                vars[v] = {human: '*undefined*', f:
                    eval(undefinedFunc) }; // jshint ignore:line 
              }
            }
            return rv;
          });

          expr = '(function(){ return ' + expr + ' })';
          mm.log.debug('Eval: ', expr, LOW);
        }
        catch (e) {
          mm.log.error('Parser internal error:', e.stack);
          throw e;
        }

        // The text expression has been parsed into a javascript
        // expression. Now try to evaluate that.
        try {
          // eval is the core of this for a while, so suck it up.
          var f = eval(expr); // jshint ignore:line 
          if (hasAssignment) { 
            // TODO: Add a DO/UNDO change log to context.
            context.saved = false;
            context.savedLocal = false;
            vars[assigned] = {human: textExpression, f: f };
          }
          if (hasUndefined) {
            mm.log('- Cannot yet evaluate function: {0} {1} still undefined.',
              /* istanbul ignore next */ // Tested independently.
              undefineds.join(), undefineds.length === 1 ? 'is' : 'are');
          }
          else {
            val = f(); // Execute the function.
            /* istanbul ignore if */ // Tested independently.
            if (self.evalFailed) {
              var e1 = 'Evaluation failed. Some values are still undefined.'
              return new Error(e1);
            }
            else {
              return val.toString();
            }
          }
          
          return val;
        }
        catch (e) {
          /* istanbul ignore next */ // Tested independently.
          if (context.settings.debugMode) {
            mm.log(e.stack);
          } 
          else {
            mm.log(e);
          }
          /* istanbul ignore next */
          return '';
        }
      }
      
      /* istanbul ignore next */ // Tested independently.
      Parser.prototype.notDefined = function notDefined(v) {
        self.evalFailed = true;
        mm.log('- Variable "{0}" is undefined', v);
        return null;
      }
    } // End of constructor for access to constructor closure.
    return Parser;
  }()); // Run constructor initializer for static creations.

  return Parser;
}