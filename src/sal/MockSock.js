'use strict';
/**
 * @fileOverview MockSock mock client and server socket.io for testing
 * @module sal/MockSock
 */ 
 module.exports = function(mm) {
   var qq = mm.check(mm.Q);
   var _  = mm.check(mm._);
  
  //--------------------------------------------------------------------------
  /**
   * @summary **Mock socket.io server**
   * @description
   * Implements a server side socket.io for use by test servers when
   * testing node.js clients in-process instead of over the wire. This
   * is used for unit testing and code coverage.
   * @constructor
   * @returns {MockSockServer} the new storage path.
   */  
  var MockSockServer = (function mockSockServerCtorCreator() {
    var ctor = function mockSockServer() {
      var self = this;
      self.version = '0.9.16_MockSockServer';
      self.connectedD = qq.defer();
      self.connected = self.connectedD.promise;
      self.log = function() {
        var args = Array.prototype.slice.call(arguments);
        args[0] = '[MockServer]:' + args[0];
        mm.log.debug.apply(null, args);
      }
    };
    
    return ctor;
  }());

  /**
   * @summary **Mock listen**
   * @description
   * Pretend to listen for a client, but don't really.
   * @param {Server} server object (ignored)
   * @returns {MockSocket} returns a Mock client Socket.
   */  
  MockSockServer.prototype.listen = function mockListen(server) {
    var self = this;  
    self.log('Listening...');
    return self;
  }

  /**
   * @summary **Mock io configure**
   * @description
   * Call a mock configure routine.
   * @param {function} func configuration function
   */  
  MockSockServer.prototype.configure = function mockIoConfigure(func) {
    func();
  }

  /**
   * @summary **Mock io set**
   * @description
   * Set a mock sockets parameter.
   * @param {...*} args ignored arguments
   */  
  MockSockServer.prototype.set = function mockIoSet() {
  // var self = this;
  }

  /**
   * @summary **Mock io on event register**
   * @description
   * The only event actually 'registered' here is 'connection'.
   * Anything else is currently ignored.  Calls a function of the
   * form handler(socket).
   * @param {string} event must be the 'connection' event
   * @param {function(socket)} the socket for direct server-client io.
   */  
  MockSockServer.prototype.on = function mockIoConnect(event, handler) {
    var self = this;  
    self.log('on [' + event + ']');
    if (event === 'connection') {
      self.connected
      .then(function (clientSocket) {
        self.log('Connected to', clientSocket);
        handler(clientSocket);
        
        // Allow reconnections - kludgey, but good enough for testing.
        self.connectedD = qq.defer();
        self.connected = self.connectedD.promise;
        self.on('connected', handler);
      });
    }
  }
  
  //--------------------------------------------------------------------------
  /**
   * @summary **Mock socket.io client**
   * @description
   * Implements client side socket.io for use in testing node.js clients 
   * in-process instead of over the wire. 
   * @constructor
   * @param {MockSockServer} server the server to 'connect' to.
   * @returns {MockSockClient} the new storage path.
   */  
  var MockSockClient = (function mockSockClientCtorCreator() {
    var ctor = function mockSockClient(server) {
      var self = this;
      self.version = '0.9.16_MockSockClient';
      self.server = server;
      self.log = function() {
        var args = Array.prototype.slice.call(arguments);
        args[0] = '[MockClient]:' + args[0];
        mm.log.debug.apply(null, args);
      }
    };
    return ctor;
  }());

  /**
   * @summary **Mock connect**
   * @description
   * Provides a new unique connection to the MockSockServer and returns a
   * MockSocket for bidirectional io between the in-process client and
   * the server.
   * @param {string} url the url of the server (ignored)
   * @returns {MockSocket} returns a Mock client Socket.
   */  
  MockSockClient.prototype.connect = function connect(url) {
    var self = this;  
    self.url = url;
    self.log('Connecting to server:', url);
    return self.reconnect(true);
  }

  MockSockClient.prototype.reconnect = function reconnect(firstConnect) {
    var self = this;  
    if (!firstConnect) {
      self.log('Reconnecting to server:', self.url);
    }
    var id = 'MockId_' + _.random(100000000).toString();
    var mySocket = new MockSocket(id, 'client', self);
    var remoteSocket = new MockSocket(id, 'server', self.server);
    mySocket.remote = remoteSocket;
    remoteSocket.remote = mySocket;
    self.server.connectedD.resolve(remoteSocket);
    return mySocket;
  }

  //--------------------------------------------------------------------------
  /**
   * @summary **Mock client/server socket**
   * @description
   * Implements single client or server side socket
   * @constructor
   * @param {string} id the id shared between the socket pair
   * @param {string} alias the short name to use in log messages
   * @param {Object} owner the client or server that owns this socket
   * @returns {MockSocket} the new mock socket.
   */  
  var MockSocket = (function mockClientSocketCtorCreator() {
    var ctor = function mockSocket(id, alias, owner) {
      var self = this;  
      self.id = id;
      self.alias = alias;
      self.owner = owner;
      self.socket = owner; // Socket name for reconnect.
      self.remote = null;
      self.events = {};
      self.log = function() {
        var args = Array.prototype.slice.call(arguments);
        args[0] = '[MockSock_' + self.alias + ']:' + args[0];
        mm.log.debug.apply(null, args);
      }
    };
    
    return ctor;
  }());

  /**
   * @summary **Mock on event**
   * @description
   * Register a mock receive event and handler.
   * @param {string} event the name of the event
   * @param {function(data)} handler the function to handle the event
   */  
  MockSocket.prototype.on = function on(event, handler) {
    var self = this;
    // Register the event handler.
    self.events[event] = function(data) {
      self.log('Recieved event[' + event + ']');
      handler(data);
    }
  }

  /**
   * @summary **Mock emit**
   * @description
   * Register a mock transmit data.
   * @param {string} event the name of the event
   * @param {object) obj the data to send
   */  
  MockSocket.prototype.emit = function on(event, obj) {
    var self = this;
    self.log('Emit Event[' + event + ']');
    if (self.remote.events[event]) {
      self.remote.events[event](obj);
    }
    else {
      self.log('--- Warning! No handler on remote for event[' + event + ']');
    }
  }

  /**
   * @summary **Mock disconnect**
   * @description
   * Perform a mock socket disconnect.
   */  
  MockSocket.prototype.disconnect = function disconnect() {
    var self = this;  
    self.log('***disconnect***');
    self.emit('disconnect', {});
  }
  
  //--------------------------------------------------------------------------  
  return { 
    Server: MockSockServer,
    Client: MockSockClient
  }
}
