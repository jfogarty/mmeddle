'use strict';
/**
 * @fileOverview MMeddleClient
 * @module core/MMeddleClient
 */ 
 module.exports = function(mm) {
  var _           = mm.check(mm._);
  var qq          = mm.check(mm.Q);

  var clientConnectTimeout = mm.config.get('clientConnectTimeout', 10);
  
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
  function connectWorkspace(host) {
    var self = this;
    if (host) {
      if (host === self.host) {
        if (self.connectedP.isFulfilled()) {
          mm.log('- Already connected to: [' + self.host + ']');
        }
        else if (self.connectedP.isRejected()) {
          mm.log('- Retry connection to: [' + self.host + ']');
          self.connectedD = null; // Do a connection to a new host.
          self.connectedP = null;
        }
        else {
          // Not yet resolved, allow it to resolve.
        }
      }
      else {
        self.host = host;
        self.connectedD = null; // Do a connection to a new host.
        self.connectedP = null;
        mm.log('- Connecting to: [' + self.host + ']');
      }
    }
    
    /* istanbul ignore if */ 
    if (self.connectedP) {
      return self.connectedP;
    }
    try { 
      // Assign this here or you may not get the mock version when
      // you want it since mm.socketClient.io may be assigned well
      // after this module is loaded.
      var io = mm.check(mm.socketClient.io);
      self.connectedD = qq.defer();
      
      //mm.log('- Connecting to: [' + self.host + ']');
      self.socket = io.connect(self.host, {
        'forceNew':true,
        'max reconnection attempts': Infinity // defaults to 10
      });
      
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
            rs._elapsed = _.now() - pending.at;
            //mm.log(' Received response to ', rqId);
            //mm.log.debug('mmWs Response: ', rs);
            pending.rsD.resolve(rs);
          }
        }
      })
      
      // Handle intermediate callbacks on a multipart response.
      self.socket.on('mmWsCb', function (rs) {
        var stopNow = false;
        mm.log.debug('--- received mmWsCb:', rs, mm.Logger.Priority.LOW);
        var rqId = rs.rqId;
        var pending = self.rsPending[rqId];
        /* istanbul ignore if */   // Tested independently.
        if (!pending) {
          // Timeout has already rejected the response.
          mm.log.warn('Received late callback to ', rqId);
          mm.log.debug('mmWs Late Callback: ', rs);
        }
        else {
          if (rs.ok !== true) {
            var emsg = mm.util.trimPrefix(rs.error, 'Error: ');
            pending.rsD.reject(new Error(emsg));
          }
          else {
            // Call the callback with the intermediate results.
            if (pending.callback) {
              if (!pending.erred && !pending.ignore) {
                try {
                  var content = rs.content ? rs.content : null;
                  stopNow = pending.callback(content);
                  // TODO: Instead of just ignoring all the remaining
                  // traffic from the request, implement an 'mmWsAbort'
                  // operation to shut off the source.
                  if (stopNow && content) {
                    pending.ignore = true;
                    if (content !== null) {
                      // After an abort is issued, this client may still
                      // receive one or more callbacks before the closing
                      // response.
                      self.rqAbort(pending.rq);
                    }
                  }
                }
                catch (e) {
                  pending.rsD.reject(e);
                  pending.erred = true;
                }
                pending.cbc++;
              }
            }
            else {
              mm.log.error('Callback message on non-callback request', pending);
            }
          }
        }
      })

    }
    catch (e) {
      /* istanbul ignore next */
      self.connectedD.reject(e); /* istanbul ignore next */
      mm.log.error('Socket IO failure:', e.stack);
    }

    var nocmsg = 'Connection to: [' + self.host + '] timed out';
    self.connectedP = self.connectedD.promise.timeout(
        clientConnectTimeout * 1000, nocmsg);
    self.connectedP.fail(function (e) {
      // No need for the message if another connection finally succeeded.
      if (!self.connected) {
        mm.log.error(e);
      }
    });
    
    return self.connectedP;
  }
  
  /**
   * @summary **Request to server with optional response**
   * @description
   * This provides server connection and control for mMeddle client
   * applications.
   *
   * @param {string} op the operation being requested.
   * @param {bool} rsRequired true if a return promise response is needed.
   * @param {object} content the content for the operation.
   * @param {bool|function} rsRequired true or callback function.   
   * @param {number} timeout n optional timeout in seconds.
   * @param {bool} abort true to abort the rq. op is the pending rq.
   * @returns {bool|Promise} success true or promise to response.
   */  
  MMeddleClient.prototype.rq =
  function rq(op, content, rsRequired, timeout) {
    var self = this;
    var rqId = op + '_' + self.rqId++;
    var rsD;
    var rsP;
    // Queue a promise to resolve when the correspondimg mmWsRq shows up.
    var callback = _.isFunction(rsRequired) ? rsRequired : null;
    var hasCallback = callback ? true : false;
    var rqObj = {
        op: op,
        sessionId: self.clientSession.ws.sessionId,
        userName: self.clientSession.user.name,
        rqId: rqId,
        at: _.now(),
        content: content,
        rsRequired: rsRequired ? true : false,
        callback: hasCallback
    };
    var tmttext = 'Rq timeout. Removing pending operation: ' + rqId;
    if (rsRequired) {
      rsD = qq.defer();
      /* istanbul ignore else */ // tested independently.
      if (!timeout) timeout = self.defaultRqTimeout;
      rsP = rsD.promise.timeout(timeout * 1000, tmttext);
      var pending = {
        id: rqId,
        at: rqObj.at,
        rq: rqObj,
        rsD: rsD,
        callback: callback,
        cbc: 0
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
   * @summary **Send a request abort to the server**
   * @description
   * A cancellation packet is sent to the server.
   *
   * @param {object} rq the request that is in progress.
   */  
  MMeddleClient.prototype.rqAbort =
  function rqAbort(rq) {
    var self = this;
    self.emit('mmWsRqAbort', rq)
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
        var host = self.host;
        self.host = null; // Force a restart.
        mm.log('- Socket connect: [' + host + ']');
        self.connectWorkspace(host);
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