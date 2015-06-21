'use strict';
/**
 * @fileOverview Manage socket.io sessions and services
 * @module server/SocketService
 */ 
 module.exports = function(mm) {
  var _ = mm.check(mm._);
  
  //--------------------------------------------------------------------------
  /**
   * @summary **A socket.io session service**
   * @description
   * Provides connection initiation, vectoring, session assignment, and
   * termination for clients connection to the service via socket.io.
   * @constructor
   * @returns {SocketService} the SocketService
   */  
  var SocketService = (function socketServiceCtorCreator() {
    var ctor = function SocketService() {
      var self = this;
      self.sessions = {};
    }

    return ctor;
  }());    
 
  /**
   * @summary **Initialize the sockets.io service.**
   * @description
   * Must be called before accepting connections.
   * @param {MMeddleServer} mMeddleServer the MMeddleServer
   * @param {StorageEngine} storageEngine the StorageEngine
   */  
  SocketService.prototype.initializeService = 
  function initialize(mMeddleServer, storageEngine) {
    var self = this;  
    self.mmServer = mMeddleServer;
    self.storageEngine = storageEngine;
    self.server = self.mmServer.server; // the Express server.
    
    // Socket.io setup.    
    var socketio = mm.socketServer.io;
    var socketio9 = socketio.version.indexOf('0.9.') === 0;
    self.socketio9 = socketio9;
    mm.log.debug('- socket.io: version = ' + socketio.version);
    /* istanbul ignore else */ // Tested in real world.
    if (socketio9) {
      var io = socketio.listen(self.server); // old form 0.9.16
      self.io = io;
      io.configure(function(){
        mm.log.debug('- socket.io: set default config');
        mm.log.debug('- socket.io: origins = "*.*"');
        //0 - error, 1 - warn, 2 - info, 3 - debug  
        io.set('log level', mm.config.socketIoLogLevel);
        mm.log.debug('- socket.io: log level:', mm.config.socketIoLogLevel);
        io.set('origins', '*:*');
        mm.log.debug('- socket.io: transports = ["websocket"]');
        io.set('transports', ['websocket']);
        mm.log.debug('- socket.io: configured for development');
      });

      mm.log('- Socket.io initialized.');
    }
    else {
      mm.log.error('Sorry, this version of Socket.io is not supported yet.');
    }
  }

  /**
   * @summary **Start accepting connections from socket.io**
   */  
  SocketService.prototype.acceptConnections = 
  function acceptConnections() {
    var self = this;  
    /* istanbul ignore else */ // Tested independently
    if (self.io) {
      self.io.on('connection', self.newConnection.bind(self));
    }
  }

  /**
   * @summary **Handle a new socket connection from a client**
   * @description
   * Queries the client to determine if this is actually a new session or a 
   * continuation of a currently running or suspended session. Vectors to
   * the appropriate handlers.
   * @param {Socket} socket a socket connection to a (remote) client
   */  
  SocketService.prototype.newConnection = 
  function newConnection(socket) {
    var self = this;
    var id = socket.id;

    function slog() {
      var args = Array.prototype.slice.call(arguments);
      args.unshift('[' + id + ']');
      mm.loggers.infoLogger.logArray(args);
    }

    slog('- Client connected as socket.io id:', id);
    socket.on('mmConnectRs', function (rs) {
      var sessionId = rs.sessionId;
      slog('- Connecting Workspace Session as', sessionId);
      mm.log.debug('----- mmConnectRs:', rs);
      var session;
      /* istanbul ignore if */ // Tested independently
      if (self.sessions[sessionId]) {
        session = self.sessions[sessionId];
      }
      else {
        session = new mm.server.WsSession(
            sessionId, 
            socket, 
            self);
        session.firstConnectionTime = rs.at;
        self.sessions[sessionId] = session;
      }

      session.from = rs.from;
      session.config.init(rs.config);
      session.lastConnectionTime = rs.at;
      session.socketId = id;
      session.socket = socket;
      
      //slog('- Session:', session);
    });
    
    socket.on('mmWsRq', function (rs) {
      var sessionId = rs.sessionId;
      mm.log.debug('- Workspace Session Request', id, rs);
      /* istanbul ignore else */ // Tested independently
      if (self.sessions[sessionId]) {
        var session = self.sessions[sessionId];
        session.handleRq(rs, socket);
      }
      else {
        mm.log.error('Unexpected Workspace session request', rs);
      }
    });

    // This is trash for testing REMOVEME REMOVEME REMOVEME REMOVEME
    socket.on('my other event', function (data) {
      slog(mm.util.inspect(data));
      slog('-----Whoa baby!');
    });

    // This is trash for testing REMOVEME REMOVEME REMOVEME REMOVEME
    socket.on('request-env', function (data) {
      var reply = process.env;
      if (mm.config.openShift) {
        reply = {
          id: id,
          text: '* Environment variables are not available from this server *'
        }
      }
      socket.emit('env', reply);
      slog('-----Posted environment');
    });
    
    socket.on('disconnect', function () {
      slog('***** Recieved disconnect *****');
    });

    // This is trash for testing REMOVEME REMOVEME REMOVEME REMOVEME
    socket.emit('news', { 
        id: id,
        hello: 'world - mMeddle with this!',
        from: mm.envText,
        at: _.now()
    });

    // Connect to a MMeddleClient running in a browser or client app.
    socket.emit('mmConnectRq', { 
        id: id,
        please: 'tell me who you are',
        from: mm.envText,
        at: _.now()
    });
  }

  return SocketService;
}
