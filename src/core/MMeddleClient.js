'use strict';
/**
 * @fileOverview MMeddleClient
 * @module core/MMeddleClient
 */ 
 module.exports = function(mm) {
  var _           = mm.check(mm._);
  var qq          = mm.check(mm.Q);
  //--------------------------------------------------------------------------
  /**
   * @summary **mMeddle client services**
   * @description
   * This provides socket.io connections to a server, as well as sending
   * requests and receiving events.
   * @constructor
   * @param {string} host url of the MMeddleServer host
   * @param {ClientSession} clientSession the client services session.
   * @returns {MMeddleClient} the new client.
   */  
  var MMeddleClient = (function mmClientCtorCreator() {
    var ctor = function MMeddleClient(host, clientSession) {
      var self = this;
      self.host = host;
      self.connectedOnce = false;  //has connected at least once
      self.connected = false;      //has a valid mmc (is connected to a server)
      self.socket = null;          //the current socket.io socket
      self.rqId = 0;               //Request number tracking.
      self.rsPending = {};         //the set of pending responses
      self.defaultRqTimeout = 10;  //Timeout in seconds.
      self.socketid = '???';
      self.clientSession = clientSession;
    };
  
    return ctor;
  }());

  MMeddleClient.prototype.connectWorkspace =
  function connectWorkspace() {
    var self = this;
    /* istanbul ignore if */ 
    if (self.connectedD) {
      return self.connectedD.promise;
    }
    try { 
      // Assign this here or you may not get the mock version when
      // you want it since mm.socketClient.io may be assigned well
      // after this module is loaded.
      var io = mm.check(mm.socketClient.io);
      self.connectedD = qq.defer();
      //mm.log('- Connecting to: [' + self.host + ']');

      self.socket = io.connect(self.host);
      
      // Handle connection request from the MMeddleServer/SocketService.
      self.socket.on('mmConnectRq', function (data) {
        mm.log.debug('--- received mmConnectRq:', data, mm.Logger.Priority.LOW);
        self.socketid = data.id;

        /* istanbul ignore if */ // Tested extensively.
        if (self.connected) {
          mm.log('- Reconnected SocketId:[{0}] Session:[{1}]',
              self.socketid, self.clientSession.ws.sessionId);
        }
        else {
          mm.log.debug('- new Connection:', self.clientSession.ws.sessionId);
        }

        self.emit('mmConnectRs', {
            id: data.id,
            sessionId: self.clientSession.ws.sessionId,
            userName: self.clientSession.user.name,
            from: mm.envText,
            config: mm.config, // report what is known about the config.
            at: _.now()
        });

        self.connectedOnce = true;
        self.connected = true;
        self.connectedD.resolve(true);
      });
      
      // This handles any pending responses.  If the response has
      // ok: true then the pending promise is resolved and the
      // response is returned. If not the promise is rejected
      // with the error code in the error field.
      self.socket.on('mmWsRs', function (rs) {
        mm.log.debug('--- received mmWsRs:', rs, mm.Logger.Priority.LOW);
        var rqId = rs.rqId;
        var pending = self.rsPending[rqId];
        /* istanbul ignore if */   // Tested independently.
        if (!pending) {
          // Timeout has already rejected the response.
          mm.log.warn('Received late response to ', rqId);
          mm.log.debug('mmWs Late Response: ', rs);
        }
        else {
          if (rs.ok !== true) {
            var emsg = mm.util.trimPrefix(rs.error, 'Error: ');
            pending.rsD.reject(new Error(emsg));
          }
          else {
            rs.elapsed = _.now() - pending.at;
            //mm.log(' Received response to ', rqId);
            //mm.log.debug('mmWs Response: ', rs);
            pending.rsD.resolve(rs);
          }
        }
      })
    }
    catch (e) {
      /* istanbul ignore next */
      self.connectedD.reject(e); /* istanbul ignore next */
      mm.log.error('Socket IO failure:', e.stack);
    }

    return self.connectedD.promise;
  }
  
  /**
   * @summary **Request to server with optional response**
   * @description
   * This provides server connection and control for mMeddle client
   * applications.
   * @param {string} op the operation being requested.
   * @param {bool} rsRequired true if a return promise response is needed.
   * @param {object} content the content for the operation.
   * @param {number} timeout n optional timeout in seconds.
   * @returns {bool|Promise} success true or promise to response.
   */  
  MMeddleClient.prototype.rq =
  function rq(op, content, rsRequired, timeout) {
    var self = this;
    var rqId = op + '_' + self.rqId++;
    var rsD;
    var rsP;
    // Queue a promise to resolve when the correspondimg mmWsRq shows up.
    var rqObj = {
        op: op,
        sessionId: self.clientSession.ws.sessionId,
        userName: self.clientSession.user.name,
        rqId: rqId,
        at: _.now(),
        content: content,
        rsRequired: rsRequired ? true : false
    };
    var tmttext = 'Rq timeout. Removing pending operation to:' + rqId;
    if (rsRequired) {
      rsD = qq.defer();
      /* istanbul ignore else */ // tested independently.
      if (!timeout) timeout = self.defaultRqTimeout;
      rsP = rsD.promise.timeout(timeout * 1000, tmttext);
      var pending = {
        id: rqId,
        at: rqObj.at,
        rq: rqObj,
        rsD: rsD
      }
      // Queue the pending wait for the response.
      self.rsPending[rqId] = pending;
      
      // Handle timeouts, failures, and other completions.
      rsP.fin(function (r) {
        delete self.rsPending[rqId];
      });
    }
    self.emit('mmWsRq', rqObj)
    if (rsRequired) {
      return rsP;
    }
    else {
      return true;
    }
  }

  /**
   * @summary **Request a socket reconnect from the server**
   * @description
   * This server should fairly quickly return a new connection with
   * a new socket id. This will be mapped to the workspace session id
   * and all will be well.
   */
  MMeddleClient.prototype.socket_reconnect =
  /* istanbul ignore next */ // tested independently.  
  function socket_reconnect() {
    var self = this;
    if (!self.socket) {
      mm.log.error('No socket established. Socket.io failed.');
    }
    else {
      if (self.connectedOnce) {
        mm.log('- Socket reconnect: [' + self.host + ']');
        self.socket.socket.reconnect();
      }
      else {
        mm.log('- Socket connect: [' + self.host + ']');
        self.connectWorkspace();
      }
    }
  }

  /**
   * @summary **Request a socket disconnect from the server**
   * @description
   * The disconnect may be used if the client will have a long period
   * of either limited connectivity or no server activity. After the
   * disconnect, a reconnect will be required to resume communications.
   */
  /* istanbul ignore next */ // tested independently.
  MMeddleClient.prototype.socket_disconnect =
  function socket_disconnect() {
    var self = this;
    if (self.socket) {
      mm.log('- Socket disconnect: [' + self.host + ']');
      if (self.socket) self.socket.disconnect();
    }
    self.connected = false;
  }

  /**
   * @summary **Emit a message to the server**
   * @description
   * This is the only routine that outputs to the socket so its a good
   * place to put logging and tracing.
   * @param {string} rqEvent the request event name
   * @param {object} rqObj the request object sent to the server
   */
  MMeddleClient.prototype.emit =
  function emit(rqEvent, rqObj) {
    mm.log.debug(rqEvent, rqObj, mm.Logger.Priority.LOW); 
    var self = this;
    self.socket.emit(rqEvent, rqObj)
  }
  
  return MMeddleClient;
}