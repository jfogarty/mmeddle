'use strict';
/**
 * @fileOverview A single commands along its handler and documentation
 * @module core/Cmd
 */ 
module.exports = function registerCliCommands(mm) {
  var check = mm.check;
  var _     = check(mm._);

  /**
   * @summary **A single CLI commands**
   * @description
   * Declares a command, its parameters help information and a
   * function for handling the command.
   * @constructor
   * @param {string} keywordFormat a command keyword followed by optional format
   * @param {string} desc the short (one line) command description
   * @param {string} help the multiline help message if available
   * @returns {Cmd} the command
   */  
  var Cmd = function cmdCtor(keywordFormat, desc, help) {
    var cmd = this;
    var format = keywordFormat.split(' ');
    var keyword = format.shift();
    cmd.keyword = keyword;
    cmd.format = format;
    cmd.handler = null;
    cmd.desc = desc;
    cmd.help = Array.prototype.slice.call(arguments, 2).join(' ');
    cmd.aliases = [];
    cmd.variants = [];
    cmd.argEnums = {};
    
    // all functions are members in the closure.

    /**
     * @summary **Restrict input arguments to an enum**
     * @description
     * An alias is an alternate keyword for execution of the command.
     * @param {string} argName keyword a command keyword
     * @param {string} values the set of values separated by |
     * @returns {Cmd} the parent command for chaining
     */  
    cmd.argEnum = function argEnum(argName, values) {
      cmd.argEnums[argName] = values;
      return cmd;
    }

    /**
     * @summary **Declare an alias to a command**
     * @description
     * An alias is an alternate keyword for execution of the command.
     * @param {string} keyword a command keyword
     * @returns {Cmd} the parent command for chaining
     */  
    cmd.alias = function alias(keyword) {
      cmd.aliases.push(keyword);
      return cmd;
    }

    /**
     * @summary **Make a command available only to administrators**
     * @description
     * An admin command is not visible, nor is it executable by a user who
     * is does not have 'admnistrator: true` in the cs.userConfig. This is more
     * about preventing stupid mistakes than security.
     * @returns {Cmd} the parent command for chaining
     */  
    cmd.setAdmin = function setAdmin() {
      cmd.adminRequired = true;
      return cmd;
    }

    /**
     * @summary **Set a timeout in seconds for the command**
     * @description
     * Commands will normally timeout after a time fixed by the CmdSet.
     * Provide a timeout only if this command should be allowed to run
     * longer than the usual time.
     * @param {number} timeoutSeconds a time in seconds
     * @returns {Cmd} the parent command for chaining
     */  
    cmd.setTimeout = function setTimeout(timeoutSeconds) {
      cmd.timeoutSec = timeoutSeconds;
      return cmd;
    }

    /**
     * @summary **Declare a variant to a single CLI commands**
     * @description
     * A variant has different behavior than the parent command, but uses
     * the same handler function. The handler function determines what to
     * do for the variant by checking its `context.keyword`
     * @param {string} keywordFormat a command keyword followed by optional format
     * @param {string} desc the short (one line) command description
     * @param {string} help the multiline help message if available
     * @returns {Cmd} the parent command for chaining
     */  
    cmd.variant = function variant(keywordFormat, desc, help) {
      var fullhelp = Array.prototype.slice.call(arguments, 2).join(' ');
      var newcmd = new Cmd(keywordFormat, desc, fullhelp);
      cmd.variants.push(newcmd);
      return cmd;
    }

    /**
     * @summary **Define the handler for a command**
     * @description
     * The handler is called when a matching text command has been supplied 
     * to the owning `CmdSet` via console entry or other source.
     * The handler is supplied a `context` object. 
     * Handlers can be immediate or promise based async.  If immediate, the
     * handler should return a truthy value reqardess of whether it 
     * succeeds or not. Return a new Error on false.
     * When async, return a promise to the result. Handlers are always
     * evaluated in execution order, so when a promise is returned, all other
     * command evaluations will be queued until the command has completed.
     *
     * Note for developers new to Promises.  Promises are viral. If your
     * handler is going to call any routine that returns promises, you must
     * return and chain promises all the way. If you omit the return .. then()
     * form, your handler will be done, but the operation you've
     * started will continue to run until it has finished. The command line
     * will be waiting for another command. This may be what you want, but
     * in many cases it will not - this has bit me many times.
     * @param {function(context)} handler the handler function
     * @returns {Cmd} the command for chaining.
     */  
    cmd.setHandler = function setHandler(handler) {
      cmd.handler = handler;
      return cmd;
    }

    /**
     * @summary **Single line description of this command**
     * @param {string} prefix the prefix to put on the command.
     * @returns {string} the command description.
     */  
    cmd._helpSummary = function _helpSummary(prefix) {
      var cmdName = prefix + cmd.keyword;
      var helpLine = _.padRight(cmdName, 9) + ': ' + cmd.desc;
      return helpLine;
    }

    /**
     * @summary **Mulitline detailed logging of the help for this command**
     * @param {string} prefix the prefix to put on the command name.
     */  
    cmd._helpDetail = function _helpDetail(prefix) {
      var cmdName = prefix + cmd.keyword;
      var format = cmd.format.join(' ');
      mm.log('Command:', cmdName, format, ':', cmd.desc);
      // Show the acceptable enumerated argument values.
      if (_.size(cmd.argEnums) > 0) {
        _.forEach(cmd.argEnums, function (values, key) {
          mm.log('   Argument "' + key + '" in [' + values + ']');
        });
      }
      if (cmd.aliases.length > 0) {
        var aliasText = '   Alias' + (cmd.aliases.length > 1 ? 'es' : '');
        aliasText = aliasText + ': ' + cmd.aliases.join(', ');
        mm.log(aliasText);
      }
      if (cmd.help) {
        mm.log('  ', cmd.help);
      }
    }

    /**
     * @summary **Evaluate actual command line arguments**
     * @description
     * This parses the command line arguments based on the format
     * and any enumerated arguments.
     * @param {string[]} args the arguments supplied on the command line.
     * @returns {*} the arguments object or an Error.
     */  
    cmd._evalArgs = function _evalArgs(args, cs) {
      try {    
        if (cmd.adminRequired) {
          /* istanbul ignore if */ // Tested independently.
          if (!cs.userConfig.administrator) {
            var ea = 'You must be an administrator to do this.';
            return new Error(ea);
          }
        }
        // When a format is supplied, check the arguments against it and
        // build a populated args object.
        var oargs = {};
        var remainderIsArray = false;
        if (cmd.format.length > 0) {
          var i = 0;
          var fargs = cmd.format;
          for (var fargi in fargs) {
            i++;
            var farg = fargs[fargi];
            /* istanbul ignore if */ // Tested independently.
            if (remainderIsArray) {
              // mm.log('-------- OArguments:', oargs);      
              return oargs;
            }
              
            var arg = args[i];
            var optional = _.startsWith(farg, '['); 
            if (optional) farg = farg.substring(1, farg.length - 1);
            var array = _.endsWith(farg, '()');
            if (array) {
              remainderIsArray = true;
              farg = farg.substring(0, farg.length - 2);
              var arrayArg = _.slice(args, i);
              oargs[farg] = arrayArg;
              if (!optional && arrayArg.length === 0) {
                var e1 = cmd.keyword + ' requires at least one "' +
                        farg + '" argument';
                return new Error(e1);
              }
            }
            else {
              oargs[farg] = ''; // Create blanks for each argument.
              /* istanbul ignore if */ // Tested independently.
              if (!optional && !arg) {
                var e2 = cmd.keyword + ' requires a "' + farg + '" argument';
                return new Error(e2);
              }
              if (arg) {
                var argEnum = cmd.argEnums[farg];
                if (argEnum) {
                  var allowedVals = argEnum.split('|');
                  var textAllowed = false;
                  var textVerified  = false;
                  var verifier;
                  var lv = allowedVals[allowedVals.length - 1];
                  if (_.startsWith(lv, '*')) {
                    allowedVals.pop();
                    textAllowed = true;
                    textVerified = _.startsWith(lv, '*(');
                    if (textVerified) {
                      verifier = lv.substring(2, lv.length - 1);
                    }
                  }
                  /* istanbul ignore if */ // Tested independently.
                  if (!_.contains(allowedVals, arg)) {
                    if (textAllowed) {
                      if (textVerified) {
                        if (!cmd[verifier](arg)) {
                          var e4 = 'Argument "' + arg +
                                   '" is not a valid ' + verifier;
                          return new Error(e4);
                        }
                      }
                    }
                    else {
                      var e3 = 'Argument "' + arg + '" must be in ' + allowedVals;
                      return new Error(e3);
                    }
                  }
                }
                oargs[farg] = arg; // Add to the object.
              }
            }
          }

          //mm.log('-------- Arguments:', oargs);      
          return oargs;
        }
      }
      catch (e) {
        mm.log.error('Cmd eval:', e.stack);
        return e;
      }
    }      
  }

  return Cmd;
}
