module.exports = function(mm) {
  mm.core = {};
  mm.core.CliConsole    = require('./CliConsole')(mm);
  mm.core.Cmd           = require('./Cmd')(mm);
  mm.core.CmdSet        = require('./CmdSet')(mm);    
  mm.core.Workspace     = require('./Workspace')(mm);
  mm.core.ClientSession = require('./ClientSession')(mm);
                          require('./ClientSessionUser')(mm);
                          require('./ClientSessionWorkspace')(mm);
  mm.core.MMeddleClient = require('./MMeddleClient')(mm);
  mm.core.CliCommands   = require('./CliCommands')(mm);
};
