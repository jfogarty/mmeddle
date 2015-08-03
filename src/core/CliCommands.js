'use strict';
/**
 * @fileOverview CLI command handlers
 * @module core/CliCommands
 */ 
module.exports = function registerCliCommands(mm) {
  var check      = mm.check;
  var _          = check(mm._);
  var qq         = check(mm.Q);
  var CmdSet     = check(mm.core.CmdSet);
  
  /**
   * @summary **CLI command handlers**
   * @description
   * Provides a common interface for node client and browser based CLI
   * implementations.
   * @constructor
   * @param {CliConsole} mConsole the current console.
   * @param {ClientSession} cs the current client session.
   * @returns {CliCommands} the cli command handlers.
   */  
  var CliCommands = function cliCommandsCtor(mConsole, cs) {
    var self = this;
    
    //------------------------------------------------------------------------
    //                            Public Methods
    //------------------------------------------------------------------------
    
    /**
     * @summary **doUserCreate**
     */    
    self.doUserCreate = function doUserCreate(newUser, ispdk) {
      var start = _.now();
      return cs.userCreate(newUser, ispdk)
      .then(function (user) {
        mm.log('- Created new User id [{0}] at {1} in {2} mx',
            user.name, user.creationDate, _.now() - start);
        mm.log('- Welcome to mMeddle, {0} {1}.',
            user.firstName, user.lastName);
        return user;
      },
      /* istanbul ignore next */ // Tested in cli
      function (e) {
        mm.log('User creation failed: ', e)
        return e;
      });
    }              

    /**
     * @summary **fillNewUser**
     */    
    self.fillNewUser = function fillNewUser(userName, ptpwd) {
      var u = { name: userName };
      var funcs = [
      function(u) {
        return  mConsole.ask('Reenter the password: ', u, 'ptpwd', true)
      },
      function(u) {
        /* istanbul ignore else */ // Tested in cli
        if (u.ptpwd === ptpwd) return u;
        ptpwd = '';
        throw new Error('Passwords do not match. Sorry, start over.');
      },
      function(u) {
        return mConsole.ask('Enter your first name: ', u, 'firstName')
      },
      function(u) {
        return mConsole.ask('Enter your last name: ', u, 'lastName')
      },
      function(u) {
        return mConsole.ask('Enter your contact email address: ', u, 'email')
      }]
      
      var rq = funcs.reduce(qq.when, qq(u));
      return rq
    }
    
    /**
     * @summary **loginUser**
     */    
    self.loginUser = function loginUser(userName, ptpwd, isPdk) {
      var start = _.now();
      return cs.userLogin(userName, ptpwd, isPdk)
      .then(function (user) {
        mm.log('- Welcome back to mMeddle, {0} {1}.', 
            user.firstName, user.lastName);
        //mm.log('- Logged in ({0} ms). {1:inspect}', user._elapsed, user);
        mm.log('- Logged in ({0} ms)', _.now() - start);
        return user;
      },
      function (e) {
        var errString = e.toString();
        if (mm.util.ENOENT(errString)) {
          if (isPdk) {
            mm.log('- User [{0}] not found. Rebuilding deleted user.', userName);
            // TODO - Add password recheck.
            return self.doUserCreate(cs.user, isPdk);
          }
          else {
            mm.log('- User [{0}] not found. Creating a new user.', userName);
            return self.fillNewUser(userName, ptpwd)
            .then(function (newUser) {
              mm.log('- Creating new user on server [{0}]...', userName);
              return self.doUserCreate(newUser);
            },
            function (e) {
              mm.log(e);
              return e;
            });
          }
        }
        else {
          ptpwd = '';
          //mm.log.error('*** Login failed. [{0}]', errString);
          return e;
        }
      });
    }
  
    /**
     * @summary **exitCmdHandler**
     */    
    /* istanbul ignore next */ // Tested independently.     
    self.exitCmdHandler = function exitCmdHandler(context, args) {
      var wsName = cs.ws.name;
      var displayName = wsName ? ' [' + wsName + ']' : '';
      if (context.keyword !== 'abort') {
        cs.saveLocalUser(mConsole);
        mm.log('- Saved User [{0}] (local)', cs.user.name);
        cs.saveLocalWorkspace();
        mm.log('- Saved Workspace{0} (local): {1} variables',
            displayName, cs.ws.varsCount);
        if (cs.mmc.connected && cs.loggedIn) {
          mm.log('- Saving Workspace{0} for {1} to {2}', 
              displayName, cs.user.name, cs.mmc.host);
          cs.saveWorkspace()
          .then(function (rs) {
            mm.log('- Saved{0} in {1} ms.', displayName, rs._elapsed);
          });
        }
      }
      if (context.keyword !== 'save') {
        // exit application
        if (mm.config.inNode) {
          mConsole.close();
          process.exit();
        }
        // exit application page (back to home page)
        else {
          mm.window.location = '../';
        }
      }
      return true;
    }
    
    /**
     * @summary **saveCmdHandler**
     */    
    self.saveCmdHandler = function saveCmdHandler(context, args) {
      /* istanbul ignore if */ // Tested independently.
      if (!cs.loggedIn && !cs.user.isAnonymous()) {
        mm.log.warn('You are not logged in so this will save only locally.');
      }
      var oldName = cs.ws.name;
      var wsName = args.name ? args.name : oldName;
      /* istanbul ignore next */ // Tested independently.
      var displayName = wsName ? ' [' + wsName + ']' : '';
      cs.saveLocalUser(mConsole);
      mm.log('- Saved User [{0}] (local)', cs.user.name);
      /* istanbul ignore if */ // Tested independently.
      if (oldName && oldName !== wsName) {
        mm.log('- Renamed workspace from [{0}] to{1}', oldName, displayName);
      }
      cs.ws.name = wsName;
      cs.saveLocalWorkspace();
      mm.log('- Saved Workspace{0} (local): {1} variables',
          displayName, cs.ws.varsCount);
      /* istanbul ignore else */ // Tested independently.
      if (cs.mmc.connected && cs.loggedIn) {
        if (cs.ws.saved) {
          mm.log('- Save Workspace{0} skipped. Already saved.', displayName);
          return true;
        }
        mm.log('- Saving Workspace{0} for {1} to {2}', 
            displayName, cs.user.name, cs.mmc.host);
        return cs.saveWorkspace()
        .then(function (rs) {
          mm.log('- Saved{0} in {1} ms.', displayName, rs._elapsed);
          cs.ws.saved = true;
        });
      }
      return true;
    }

    /**
     * @summary **loadCmdHandler**
     */    
    self.loadCmdHandler = function loadCmdHandler(context, args) {
      /* istanbul ignore if */ // Tested independently.
      if (!cs.loggedIn) {
        mm.log.warn('Please log in first.');
        return true;
      }
      
      var oldName = cs.ws.name;
      var wsName = args.name ? args.name : oldName;
      if (wsName !== oldName && !cs.ws.saved) {
        mm.log.warn('Please save or clear the current workspace first.');
        return true;
      }

      var displayName = wsName ? ' [' + wsName + ']' : '';
      mm.log('- Loading workspace [' + wsName + ']');
      return cs.loadWorkspace(wsName)
      .then(function (ws) {
        mm.log('- Loaded{0} in {1} ms.', displayName, ws._elapsed);
        cs.ws.saved = true;
      });
    }
    
    //------------------------------------------------------------------------    
    //------------------------------------------------------------------------
    self.loginCmdHandler = function loginCmdHandler(context, args) {
      var user = cs.user;
      var userName = user.name;
      if (args.userName) {
        var ptpwd;
        userName = args.userName;
        /* istanbul ignore else */ // Tested in cli
        if (args.password) {
          ptpwd = args.password;
          return self.loginUser(userName, ptpwd);
        }
        else {
          if (userName === user.name && user.pdk) {
            return self.loginUser(userName, user.pdk, true)
            .fail(function (e) {
              mm.log.warn('Invalid locally saved password has been deleted');
              delete user.pdk;
              return e;
            });
          }
          else {
            return mConsole.ask('Please enter your password: ', null, null, true)
            .then(function (ptpwd) {
              return self.loginUser(userName, ptpwd);
            });
          }
        }
      }
      // If a locally saved user is available, login with that.
      else {
        if (!user.isAnonymous() && user.pdk) {
          return self.loginUser(user.name, user.pdk, true)
          .fail(function (e) {
            mm.log.warn('Invalid locally saved password has been deleted');
            delete user.pdk;
            return e;
          });
        }
        var e = new Error('Please login with a user name');
        return e
      }
    }

    //------------------------------------------------------------------------
    self.clearCmdHandler = function clearCmdHandler(context, args) {
      return cs.ws.clear(args.variables);
    }

    //------------------------------------------------------------------------
    self.listCmdHandler = function listCmdHandler(context, args) {
      return cs.ws.list(args.variables, context.keyword === '??');
    }

    /**
     * auto complete console input text for command line starts
     * @param {string} text the input line
     * @return {array} completions [[matches], keyword]
     */
    /* istanbul ignore next */ // TODO: Complete this function.
    self.completer = function completer (text) {
      var keyword;
      var matches = [];
      var m = /[a-zA-Z_0-9]+$/.exec(text);
      if (m) {
        keyword = m[0];

        // commandline keywords
        rcs.keywords.forEach(function (cmd) {
          if (cmd.indexOf(keyword) === 0) {
            matches.push(cmd);
          }
        });

        // remove duplicates
        matches = matches.filter(function(elem, pos, arr) {
          return arr.indexOf(elem) === pos;
        });
      }

      return [matches, keyword];
    }
  
    //------------------------------------------------------------------------      
    var rcs = new CmdSet()
        .setTitle('Main CLI Commands')
        .adminHelpFooter(
        '` [js] (backtick) will directly execute a javascript expression\n')
        .helpFooter( 
        '\n' +
        'You can enter expressions such as B=sin(PI/4) on the command line,\n' +
        'or just enter the variable name to show its evaluation.\n'
        );
    rcs.cmd('exit',
            'Save the user and workspace then exit the program')
       .alias('quit')
       .variant('abort',
            'Exit the program without saving the user or workspace')
       .setHandler(self.exitCmdHandler);
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    rcs.cmd('save [name]', 
            'Save the user and workspace then continue',
            'Supply a [name] to save this workspace under a specific name',
            'for later recall. You can have many workspaces under different',
            'names, although you have only one current workspace session.')
       .setHandler(self.saveCmdHandler);
    rcs.cmd('load [name]', 
            'Load a workspace from the server',
            'Supply a [name] to load a workspace of a specific name that',
            'was previosly saved.')
       .setHandler(self.loadCmdHandler);
       
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    rcs.cmd('login [userName] [password]',
            'Log in to the server with a user name and password',
            'The user name and password can be omitted if you have already',
            'logged in from this client in a previous session.')
       .setHandler(self.loginCmdHandler);
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    rcs.cmd('clear variables()',
            'Clear one or more variables from the workspace',
            'Use "clear all" to clear the full set of variables.')
       .setHandler(self.clearCmdHandler);
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -   
    rcs.cmd('list [variables()]',
            'List some or all of the variables in the workspace',
            'The default is to list all variables. You can list only',
            'selected entries with variable names or prefixes.',
            'Use ?? to list the detailed functions.')
       .alias('?')
       .alias('??')
       .setHandler(self.listCmdHandler);
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    rcs.cmd('cls',
            'Clear the display')
       .setHandler(function () { mConsole.clearScreen(); return true; });
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    
    rcs.addSubset('.', cs.ws.dotCmdSet());
    //mm.log('----- cs.ws.dotCmdSet():', cs.ws.dotCmdSet());    
    rcs.done();
    //mm.log('----- RCS:', rcs);
    mConsole.setCompleter(self.completer);
    self.rootCommandSet = rcs;
  }

  return CliCommands;
}
