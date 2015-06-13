// Insert the Server objects.
module.exports = function(mm) {
  mm.server = {};
  mm.server.WsSession = 
      require('./WsSession')(mm);  
      require('./WsSessionUser')(mm);      
      require('./WsSessionWorkspace')(mm);

  mm.server.SocketService = require('./SocketService')(mm);  
  mm.server.MMeddleServer = require('./MMeddleServer')(mm);
};
