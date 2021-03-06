'use strict';
/**
 * @fileOverview A set of commands along with handlers and documentation
 * @module core/CmdSet
 */ 
module.exports = function registerCliCommands(mm) {
  var check = mm.check;
  var _     = check(mm._);
  var qq    = check(mm.Q);
  var Cmd   = check(mm.core.Cmd);

  /**
   * @summary **A set of CLI commands**
   * @description
   * Declares command keywords, parameters, help information and a
   * function for handling the command.
   * @constructor
   * @returns {CmdSet} the set of commands.
   */  
  var CmdSet = function cmdSetCtor() {
    var self = this;
    self.initialized = false;
    self.basecmds = [];
    self.subsets = {};
    self.keywords = [];
    self.cmds = {};
    self.timeoutSec = 30;
    self.helpPrefix = '';
    return self;
  }

  /**
   * @summary **set the title for the set**
   * @description
   * A title is used in help messages.
   * @param {string} title text to add to start of the help summary
   * @returns {CmdSet} the CmdSet for chaining.
   */    
  CmdSet.prototype.setTitle = function setTitle(title) {
    var self = this;
    self.title = title;
    return self;
  }

  /**
   * @summary **add a footer to the help summary**
   * @param {string} footer the text to add to the end of the help summary
   * @returns {CmdSet} the CmdSet for chaining.
   */    
  CmdSet.prototype.helpFooter = function helpFooter(footer) {
    var self = this;
    self.footer = footer;
    return self;
  }

  /**
   * @summary **add a special footer to the help summary**
   * @description
   * Declares a footer for the help summary that is only shown when logged
   * in as an administrator.
   * @param {string} footer the text to add to the end of the help summary
   * @returns {CmdSet} the CmdSet for chaining.
   */    
  CmdSet.prototype.adminHelpFooter = function adminHelpFooter(footer) {
    var self = this;
    self.adminFooter = footer;
    return self;
  }

  /**
   * @summary **initialize the command set**
   * @returns {CmdSet} the CmdSet.
   */    
  CmdSet.prototype.done = function initialize() {
    var self = this;
    function setCmd(keyword, base) {
      var word = keyword.toLowerCase();
      self.keywords.push(word);
      self.cmds[word] = base;
    }
    
    function registerCmd(cmd, base) {
      setCmd(cmd.keyword, base);
      cmd.aliases.forEach(function(alias) { setCmd(alias, base); });
      cmd.variants.forEach(function(variant) {
        registerCmd(variant, base);
      });
    }
    if (!self.initialized) {
      self.basecmds.forEach(function(basecmd) {
        registerCmd(basecmd, basecmd);
      });
    }
    self.initialized = true;
    if (!self.cmds.help) {
      self.registerHelpCmd();
    }
    return self;
  }
  
  /**
   * @summary **add a `help` command to the set**
   * @description
   * If there is no `help` command declared before the set initialization
   * is done, then this creates a default version of one.
   * @returns {CmdSet} the CmdSet for chaining.
   */    
  CmdSet.prototype.registerHelpCmd = function registerHelpCmd() {
    var self = this;
    function helpCmdHandler(context, args) {
      try { 
        if (args.commandName) return qq(self.helpCmdDetail(context, args));
        return qq(self.helpCmdSummary(context, args));
      } catch (e) { mm.log.error('helpCmdHandler', e.stack); }
    }

    var helpCmd = new Cmd('help [commandName]',
        'Display available commands')
       .setHandler(helpCmdHandler);
    self.cmds.help = helpCmd;
    return self;
  }

  // List all of the available commands in this set.  
  CmdSet.prototype.helpCmdSummary = function helpCmdSummary(context, args) {
    var self = context.set;
    var isAdmin = context.cs.userConfig.administrator;
    var prefix = self.helpPrefix;
    if (_.isString(self.title)) {
      mm.log('-----', self.title, '-----');
      mm.log();
    }
    var sortedCmds = [];
    self.basecmds.forEach(function(basecmd) {
      // Show admin commands only to an administrator.
      if ((!basecmd.adminRequired) || isAdmin) {
        sortedCmds.push(basecmd);
        basecmd.variants.forEach(function(variant) {
          sortedCmds.push(variant);
        });
      }
    });
    sortedCmds = _.sortBy(sortedCmds, 'keyword');
    sortedCmds.forEach(function (cmd) {
      mm.log(cmd._helpSummary(prefix));
    });
    if (_.size(self.subsets) > 0) {
      mm.log();
      _.forEach(self.subsets, function (subset, key) {
        var sp = key.length > 1 ? ' ' : '';
        mm.log(key + sp + '[command] : ' + subset.title);
      });
    }
    
    if (self.adminFooter && isAdmin) {
      mm.log(self.adminFooter);
    }
    if (self.footer) {
      mm.log(self.footer);
    }
    return true;
  }

  CmdSet.prototype.helpCmdDetail = function helpCmdDetail(context, args) {
    var self = context.set;
    var prefix = self.helpPrefix;
    var cmdName = args.commandName.toLowerCase();
    var cmd = self.cmds[cmdName];
    if (!cmd && prefix && _.startsWith(cmdName, prefix)) {
      cmdName = cmdName.substr(prefix.length);
      cmd = self.cmds[cmdName];
    }
    if (cmd) {
      cmd._helpDetail(prefix);
      return true;    
    }
    else {
      var e = new Error('No such command: "' + args.commandName + '"'); 
      mm.log.error(e);
      return true; // The help command has succeeded.
    }
  }
  
  /**
   * @summary **add a command subset to the set**
   * @description
   * A command subset is a set of commands that require a prefix on
   * the command line. If the prefix is a single character then no
   * space is required between it and the sub-command keyword.
   * Subsets are displayed with their own help (i.e. [prefix] help [cmd]).
   * @param {string} prefix prefix to select the subset.
   * @param {CmdSet} cmdSet command subset to add to this set.
   * @returns {CmdSet} the current CmdSet being added to.
   */    
  CmdSet.prototype.addSubset = function addSubset(prefix, cmdSet) {
    var self = this;
    self.subsets[prefix] = cmdSet;
    /* istanbul ignore next */ // Tested independently.
    cmdSet.helpPrefix = prefix + (prefix.length > 1 ? ' ' : '');
    return self;
  }

  /**
   * @summary **set the default handler**
   * @description
   * The default handler is called when the command does not otherwise
   * match any commands in the set or its subsets. The context is passed
   * (which contains the exact `text` for the text that did not match.
   * @param {function} handler the command handler.
   * @returns {CmdSet} the current CmdSet being added to.
   */    
  CmdSet.prototype.setDefaultHandler = function setDefaultHandler(handler) {
    var self = this;
    self.defaultHandler = handler;
    return self;
  }

  /**
   * @summary **add an existing command to the set**
   * @param {Cmd} cmd existing cmd to add to this set.
   * @returns {Cmd} the Cmd being added.
   */    
  CmdSet.prototype.add = function addCommand(cmd) {
    var self = this;
    self.basecmds.push(cmd);
    return cmd;
  }

  /**
   * @summary **create a new command and add it to the set**
   * @description
   * A helper method for `cmd=new Cmd(), cmdSet.add(cmd)`.
   * @param {string} keywordFormat a command keyword followed by optional format
   * @param {string} desc the short (one line) command description
   * @param {string} help the multiline help message if available
   * @returns {Cmd} the command
   */    
  CmdSet.prototype.cmd = function newCommand(keywordFormat, desc, help) {
    var self = this;
    var helpArg = Array.prototype.slice.call(arguments, 2).join(' ');
    var cmd = new Cmd(keywordFormat, desc, helpArg);
    self.add(cmd);
    return cmd;
  }

  /**
   * @summary **do a command in this set**
   * @description
   * A command line is parsed and used to populate the context for a 
   * matching keyword.  If the handler succeeds (returns a Promise that
   * succeeds, or returns a truthy value) then a true promise is returned.
   * If the handler fails (throws, returns false, or rejects a promise)
   * then a rejected promise is returned.
   * @param {string} the single or multiline command
   * @param {ClientSession} the current client session
   * @returns {Q(result)} Promise to the result of the handler or Q(false).
   */    
  CmdSet.prototype.doCmd = function doCmd(cmdText, cs) {
    try {  
      var self = this;
      /* istanbul ignore if */ // Tested independently.
      if (!self.initialized) self.done();
      var args = mm.util.removeWhitespace(cmdText).split(' ');
      var keyword = args[0].toLowerCase();
      var cmd = self.cmds[keyword];
      var arg1 = args.length > 1 ? args[1] : '';
      var arg2 = args.length > 2 ? args[2] : '';
      var arg3 = args.length > 3 ? args[3] : '';
      
      // Check for a matching command subset prefix.
      if (!cmd && _.size(self.subsets) > 0) {
        for (var prefix in self.subsets) {
          if (_.startsWith(keyword, prefix)) {
            var subset = self.subsets[prefix];
            var subCmdText = cmdText.substr(prefix.length);
            // Handle special subcmd help command format: "[prefix]? [command]"
            if (_.startsWith(subCmdText, '?')) {
              subCmdText = 'help ' + subCmdText.substring(1);
            }
            return subset.doCmd(subCmdText, cs);
          }
        }
      }

      // Handle special help command format: "[command] -h / -?"
      if (arg1 === '-h' || arg1 === '-?' ) {
        cmdText = 'help ' + keyword;
        args = cmdText.split(' ');
        arg1 = keyword;
        keyword = 'help';
        cmd = self.cmds[keyword];
      }
      
      // Put QQ pending handling here xxxxxxxxxxxx
      // Sequence the commands.

      var handler = self.defaultHandler;
      var timeout = self.timeoutSec * 1000;
      if (!cmd && !handler) {
        var nch = 'Sorry, No command: "' + cmdText + '"';
  //mm.log.error('xxxxxxxxxxxxxxxx' + nch); 
        return qq.reject(new Error(nch));
      }

      var context = {
        keyword: keyword,
        args: args,
        arg1: arg1,
        arg2: arg2,
        arg3: arg3,
        text: cmdText,
        set: self,
        cs: cs
      }

      if (cmd) {
        timeout = (cmd.timeoutSec ? cmd.timeoutSec * 1000 : timeout);
        var oargs = cmd._evalArgs(args, cs);
        if (oargs instanceof Error) {
          return qq.reject(oargs);
        }
        handler = cmd.handler.bind(cmd, context, oargs);
      }
      else {
  //mm.log.error('DEFAULT TRYING:' + cmdText + ' with ', self.defaultHandler);     
        if (!self.defaultHandler) {
          var ndh = 'Sorry, No hander for command: "' + cmdText + '"';
  //mm.log.error('xxxxxxxxxxxxxxxx' + ndh); 
          return qq.reject(new Error(ndh));
        }

        handler = self.defaultHandler.bind(self, context);
      }

      var result;
      try {
        result = handler();
      } catch (handlerError) {
        // Make the exception the result.
        result = handlerError;
      }

      if (!qq.isPromise(result)) {
        if (result instanceof Error) {
          result = qq.reject(result);
        }
        else {
          if (result) {
            // Truthy return.
            result = qq(result);
          }
          else {
            var ef = 'Command: "' + cmdText + '" failed';
            result = qq.reject(new Error(ef));
          }
        }
      }
      return result.timeout(timeout, 'The command timed out').
      then (function (emaybe) {
        // Successful promises that are actually errors are a pain
        // to handle. Make them into first class rejections.
        if (emaybe instanceof Error) {
          // -- We can turn Beans into Peas!!!
          // Benson, dear Benson, you are so mercifully free of the
          // ravages of intelligence.
          return qq.reject(emaybe)
        }
        else {
          return emaybe;
        }
      });
    }
    catch (e) { mm.log.fail(e); }    
  }

  CmdSet.Cmd = Cmd;
  return CmdSet;
}
