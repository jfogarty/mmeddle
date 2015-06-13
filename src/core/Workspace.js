/**
 * @fileOverview Workspace manages the objects available to a session.
 * @module core/Workspace
 */ 
'use strict';
module.exports = function registerWorkspace(mm) {
  var check       = mm.check;
  var _           = mm.check(mm._);
  var Enum        = check(mm.obj.Enum);
  var log         = check(mm.log);
  var Logger      = check(mm.Logger);
  var CmdSet      = check(mm.core.CmdSet);
  
  // fixme - get the settings from mm.
  var settings = {}
  settings._props = {
    numberMode: {
      values: new Enum('num|big|imp')
    }
  };
  
  var NUMBERMODE = settings._props.numberMode.values;
  settings.numberMode = NUMBERMODE.num;
  settings.debugMode = false;
  settings.glorm = 'fuzzle';

  /**
   * @summary **Create a persistent workspace**
   * @description
   * A workspace manages the persistent information about what a user is
   * working on. It is saved to both browser/client localStorage and to
   * server storage when online.
   * @constructor
   * @param {ClientSession} cs the current client session 
   * @returns {Workspacee} the SocketService
   */   
  var Workspace = (function workspaceCtorCtor() {
    // Any static data for all workspaces goes here.
  
    var Workspace = function workspaceCtor(cs) {
      var ws = this;
      ws.name = '';
      ws.vars = {};
      ws.settings = settings;
if (!cs) mm.log.error('?????????????????', new Error('xxx').stack);
      /**
       * @summary Initialize a ws from a saved JSON object.
       * @description
       * All fields of the existing ws are replaced by those in the source
       * object. Any fields NOT in the source object remain in the ws.
       */      
      Workspace.prototype.init = function init(wsObj) {
        var ws = this;  
        _.assign(ws, wsObj);
      }

      Object.defineProperty(ws, 'varsCount', {
        get: function () { return _.keys(this.vars).length; },
        enumerable: true,
        configurable: true
      });

      Workspace.prototype.list = function list(prefixes, detailed) {
        var ws = this;  
        var n = 0;    
        Object.keys(ws.vars).forEach(function (key) {
          var matched = true;
          if (prefixes && prefixes.length > 0) {
            matched = false;
            prefixes.forEach( function (prefix) {
              prefix = _.trimRight(prefix, '*');
              matched = matched || _.startsWith(key, prefix);
            });
          }
          if (matched) {
            if (detailed) {
              if (_.isFunction(ws.vars[key].f)) {
                log('   ' + key + ' = ' + ws.vars[key].f);
              }
              else {
                // Put quotes around currently unevaluated functions.
                log('   ' + key + ' = \'' + ws.vars[key].f +'\'');
              }
            }
            else {
              log('   ' + key + ' = ' + ws.vars[key].human);
            }
            n++;
          }
        });

        log('Listed', n, 'variables from workspace.');
        return true;
      }

      Workspace.prototype.clear = function clear(variables) {
        var ws = this;
        if (!variables || variables.length === 0) {
          log('Use "all" to clear all variables, otherwise name the variable.');
          return true;
        }
        if (variables[0] === 'all') {
          ws.vars = {};
          log('All variables cleared.');
          return true;
        }
        variables.forEach(function (v) {
          if (ws.vars[v]) {
            delete ws.vars[v];
            log('Removed variable: "'+ v + '"');
          }
          else {
            log('Variable "{0}" not found.', v);
          }
        });
        return true;
      }
        
      Workspace.prototype.dotCmdSet = function dotCmdSet() {
        var ws = this;      
        var cset = new CmdSet().setTitle('Workspace Control Commands');
        cset.cmd('big',
            'Use \'big\' numbers in computations')
            .setHandler(function setBigNumberMode() {
               ws.settings.numberMode = NUMBERMODE.big;
               log('. Big Numbers mode.');
               return true;
            });
        cset.cmd('num',
            'Use \'normal\' numbers in computations')
            .setHandler(function setNormalNumberMode() {
               ws.settings.numberMode = NUMBERMODE.num;
               log('. Normal numbers mode.');
               return true;
            });
        cset.cmd('imp',
            'Use \'imp\' for mMeddle implemented numbers in computations')
            .setHandler(function setImpNumberMode() {
               ws.settings.numberMode = NUMBERMODE.imp;
               log('. mMeddle implemented numbers mode.');
               return true;
            });
        cset.cmd('debug [state] [level]',
            'Set debugging output modes',
            '\'Debug on low\' selects low level debugging (verbose output)')
            .argEnum('level', 'high|low|norm')
            .argEnum('state', 'on|off|true|false')
            .setHandler(function setDebugMode(context, args) {
            if (args.state || args.level) {
              if (args.state && _.includes(['on', 'true'], args.state)) {
                mm.loggers.debugLogger.enable();
                ws.settings.debugMode = true;
                mm.log('. Debug logging on.');
              }
              if (args.state && _.includes(['off', 'false'], args.state)) {
                mm.loggers.debugLogger.disable();
                ws.settings.debugMode = false;
                mm.log('. Debug logging off.');
              }
              if (args.level) {
                var mode = args.level.toUpperCase();
                var priority = Logger.Priority[mode];
                mm.loggers.debugLogger.allowPriority(priority);
                mm.loggers.rootLogger.allowPriority(priority);
                mm.log('. Debug logging mode is {0}.', mode);
              }
            }
            else {
              mm.loggers.debugLogger.disable();
              ws.settings.debugMode = false;
              mm.log('. Debug logging off.');
            }
            return true;
          });
        cset.cmd('list [obj] [spec]',
            'List a server object type',
            '\'List user\' shows information about the logged in user\n',
            '\'List users\' lists the currently connected users\n',
            '\'List ws\' lists the workspaces for this user\n',
            'Use [spec] to select a prefix to subset the objects to list.')
            .argEnum('obj', 'user|users|ws')
            .setHandler(function listObj(context, args) {
              if (args.obj === 'users') {
                return cs.listUserSessions()
                .then(function (sessionEntries) {
                  mm.log(sessionEntries);
                  return true;
                });
              }
              else if (args.obj === 'user') {
                if (args.spec) {
                  var userName = args.spec;
                  return cs.getUser(userName)
                  .then(function (users) {
                    if (users.length === 0) {
                      mm.log('- User matching "{0}" not found', userName);
                    }
                    else {
                      users.forEach(function (user) {
                        //mm.log('- User: ', user);
                        mm.log('- "{0}" is {1} {2}  email:{3}', 
                            user.name,
                            user.firstName, user.lastName, user.email);
                        
                      });
                    }
                    return true;
                  });
                }
                else {
                    mm.log('- This User: ', cs.user);
                    if (cs.loggedIn) {
                      if (cs.loggedIn.name === cs.user.name) {
                        mm.log('- Logged in.');
                      }
                      else {
                        mm.log.warn('- But logged in as :', 
                          cs.loggedIn.name);
                      }
                    }
                    else {
                      mm.log('- Not logged in.');
                    }
                }
              }
              else {
                mm.log('- List {0} * NOT IMPLEMENTED *', args.obj);
              }
              return true;
            });
        cset.cmd('deleteUser',
            'Delete the current user')
            .setHandler(function delUser() {
              return cs.userDelete()
              .then(function (msg) {
                mm.log(msg);
                return true;
              },
              function (err) {
                mm.log(err);
                return true;
              });
            });
        cset.cmd('syncDbToFs [collection]',
            'Synchronize the database to the file system')
            .setAdmin()
            .setHandler(function syncDbToFs() {
               mm.log('. syncDbToFs * NOT IMPLEMENTED *');
               return true;
            });
        cset.cmd('syncFsToDb [collection]',
            'Synchronize the file sysem storage area to the mongo database')
            .setAdmin()
            .setHandler(function syncFsToDb() {
               mm.log('. syncFsToDb * NOT IMPLEMENTED *');
               return true;
            });
        cset.cmd('reconnect',
            'Reconnect to the server')
            .setHandler(function reconnect() {
              cs.mmc.socket_reconnect();
              return true;
            });
        cset.done();
        return cset;
      }
    } // End of constructor for access to constructor closure.

    return Workspace;
  }()); // Run constructor initializer for static creations.

  return Workspace;
}