'use strict';
/**
 * @fileOverview A single commands along its handler and documentation
 * @module core/Cmd
 */ 
module.exports = function registerCliCommands(mm) {

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
     * @param {function(context)} handler the handler function
     * @returns {Cmd} the command for chaining.
     */  
    cmd.setHandler = function setHandler(handler) {
      cmd.handler = handler;
      return cmd;
    }
  }

  return Cmd;
}
