'use strict';
/**
 * @fileOverview Manage server side workspace session requests.
 * @module server/WsSession
 * @description
 * Once a client has connected to the server, a session is established
 * with a persistent workspace by its session id. This id represents
 * a long term session lifetime (can persist forever).
 * @coded in San Sebastian, BCS MX
 */ 
 module.exports = function(mm) {
   var _ = mm.check(mm._);
   var Config = mm.check(mm.obj.Config);
   var ClientUser = mm.check(mm.users.ClientUser);
 
  /**
   * @summary **A server side session to match one on a browser**
   * @description
   * When user connects to the mMeddle site using a browser or client
   * applications (such as the CLI) it immediately loads a Workspace
   * from local storage. The sessionId of the workspace is provides
   * a long term socket between client and server.
   * @constructor
   * @param {string} sessionId the MMSID 
   * @param {Socket} socket the initial socket.io session for this wsSession  
   * @param {SocketService} socketService the parent socket service 
   * @returns {WsSession} the workspace session.
   */   
  var WsSession = (function wsSessionCtorCreator() {
    var ctor = function WsSession(sessionId, socket, socketService) {
      var self = this;
      self.config = new Config();
      self.user = new ClientUser();
      self.userConfig = new Config();
      self.sessionId = sessionId;
      self.socketService = socketService;
      self.storageEngine = socketService.storageEngine;
      self.socket = socket; // Changes on reconnections from clients.
      self.rqCount = 0; 
      self.rsCount = 0; 
      self.lastResponseAt = 0; //changes on every response.
      self.serverCreatonTime = _.now();
      self.firstConnectionTime = 0; // Set by client - may be very old.
      self.inProgress = {}; // The set of requests in progress.

      // Each session gets its own clients for storage access.
      // It creates another for user specific access.
      self.systemStorage = new mm.storage.StorageClient({
        user: 'systemAdmin',
        engine: self.storageEngine
      });
      self.usersStorage = new mm.storage.StorageClient({
        user: 'userAdmin',
        engine: self.storageEngine
      });
    }

    return ctor;
  }());    

  /**
   * @summary **true if the session is in admin mode**
   */
  WsSession.prototype.isAdmin =
  function wsIsAdmin() {
    var self = this;
    return self.userConfig && self.userConfig.administrator;
  }  

  /**
   * @summary **handle a session request from a client**
   * @description
   * Each 'mmWsRq' message recieved on a socket is vectored to the
   * workspace session that is handling that id.
   * @param {Object} rq the request object
   * @param {Socket} socket the (possibly) new socket.io socket
   */   
  WsSession.prototype.handleRq = 
  function wsHandleRq(rq, socket) {
    var self = this;
    self.socket = socket;
    self.rqCount++;
    var op = rq.op;
    var rqId = rq.rqId;
    
//mm.log.debug('- WS op:', op);
    if (self[op]) {
      // Keep track of abortable requests.
      if (rq.rsRequired) self.inProgress[rqId] = rq;
      self[op](rq);
    }
    else {
      mm.log.error('- Invalid workspace session operation:', rq);
      if (rq.rsRequired) {
        self.respondError(rq, 'Invalid request:' + op);
      }
    }
  }
  
  /**
   * @summary **handle an abort request from a client**
   * @description
   * The 'mmWsRqAbort' message recieved on a socket is vectored to the
   * request in progress to see if it can be stopped. This usually is
   * only relevant for callback based loadMultiple requests, but may find
   * more application in the future.
   * @param {Object} rq the request object
   * @param {Socket} socket the (possibly) new socket.io socket
   */   
  WsSession.prototype.handleRqAbort = 
  function wsHandleRqAbort(rq, socket) {
    var self = this;
    self.socket = socket;
    var rqId = rq.rqId;
    var actualRq = self.inProgress[rqId];
    if (actualRq) {
      actualRq.aborted = true;
    }
    else {
      mm.log.warn('- Abort requested for expired request:', rq);
    }
  }
  
  /**
   * @summary **handler: perform a storage request for a client**
   * @description
   * The storageClient op from the client app on the browser (or node client)
   * is passed directly to the local StorageClient for this user.
   * If the user has admin privileges, the content access is not restricted
   * to this user alone.
   * @param {Object} rq the request object
   */   
  WsSession.prototype.clientStorage = 
  function wsClientStorage(rq) {
    var self = this;
    var op = rq.content;
    mm.log.debug('Starting client storage Op:', op);
    if (!self.loggedIn) {
      var em1 = 'This session is not logged in';
      mm.log.error(em1);
      self.respondError(rq, em1);
      return;
    }
    var allowedName = self.user.name;
    if (self.isAdmin()) {
      if (op.path.userName !== allowedName) {
        // This user can access any storage.
        mm.log('- Admin "{0)" access to storage for user: "{1}"',
               allowedName, op.path.userName);
      }
    }
    else {
      if (op.path.userName !== allowedName) {
        var em2 = mm.format(
                  'user "{0}" cannot access storage for user: "{1}"',
                  allowedName, op.path.userName);
        mm.log.error(em2);
        self.respond(rq, '', new Error(em2));
        return;
      }
    }

    // For storage operations that support callbacks, stuff in a local handler.
    if (rq.callback) {
      op.path.callback = function (obj) {
        // The caller has aborted the request so there's no need to
        // process any more of them.
        if (rq.aborted) return false;
        var callBackInProgress = true;
        self.respond(rq, obj, null, null, callBackInProgress);
        return rq.aborted ? true : false;
      }
    }

    // Direct access to the storage engine without another client.
    self.storageEngine.queue(op)
    .then(function(info) {
      mm.log.debug('Completed client storage op:', op);
      
      // TODO: Implement and handle multipart responses.
      self.respond(rq, info);
    },
    function(e) {
      mm.log.debug('Failed client storage Op:', op, e);
      self.respondError(rq, e);
    })
  }
  
  /**
   * @summary **handler: logs a console message from a client session**
   * @description
   * Good for debugging and some progress logging. Don't use it to
   * excess or the logs get way too cluttered.
   * @param {Object} rq the request object
   */   
  WsSession.prototype.log = 
  function wsLog(rq) {
    var self = this;
    mm.log.debug('[' + self.sessionId + ']', rq.content);
  }

  /**
   * @summary **handler: execute a command from a client session**
   * @description
   * Good for debugging and control functions for administrators.
   * Very dangerous and a good way to crash the server.
   *             "You kids stop screwin' around"
   * @param {Object} rq the request object
   */   
  WsSession.prototype.cmd = 
  function wsCmd(rq) {
    var self = this;
    var cmdText = rq.content;
    if (self.isAdmin()) {
      mm.log('[' + self.sessionId + '] Cmd:', cmdText);
      if (_.startsWith(cmdText, '``')) {
        try {
          var jsExpression = cmdText.substring(2);
          var result = eval(jsExpression);  // jshint ignore:line 
          mm.log.debug('[' + self.sessionId + '] Cmd Result:', result);
          self.respond(rq, mm.format(result));
        }
        catch (e) {
          mm.log.debug('Failed remote command:', cmdText, e.stack);
          self.respondError(rq, new Error('Eval failed:' + e.stack));
        }
      }
      else if (_.startsWith(cmdText, '`>')) {
        var cmdLine = cmdText.substring(2);
        var exec = require('child_process').exec;
        exec(cmdLine, function (err, stdout, stderr) {
          if (err !== null) {
            mm.log.debug('Failed remote cmd:', cmdText, err.stack);              
            self.respondError(rq, err);
          }
          else {
            var resultText = stdout;
            if (stderr) {
              resultText += '***Error:' + stdout;
            }
            self.respond(rq, resultText);
          }
        });      
      }
      else {
        self.respondError(rq, 'command not supported: "' + cmdText + '"');
      }
    }
    else {
      self.respondError(rq, 'You must be logged in as an administrator.');
    }
  }
  
  /**
   * @summary **send a response to a client request**
   * @param {Object} rq the incoming request object
   * @param {Object} content the 'content' field for the response
   * @param {string} err if present 'ok' is false and 'error' is set 
   * @param {Object} extra optional extra fields for the response. 
   * @param {bool} callback optional true to send 'callback' response. 
   */   
  WsSession.prototype.respond = 
  function wsRespond(rq, content, err, extra, callback) {
    var self = this;
    try{
      self.rsCount++;
      self.lastResponseAt = _.now();
      var errString = err ? err.toString() : ''
      var rs = {
        op: rq.op,
        ok: err ? false : true,
        rqId: rq.rqId,
        sessionId: self.sessionId,
        userName: self.user.name,
        at: self.lastResponseAt,
        content: content ? content : '',
        error: errString
      };
      if (extra) {
        _.assign(rs, extra);
      }
      // Add a special case for the most common failure case.
      if (err && self.systemStorage.notFound(err)) {
        rs.notFound = true;
      }

      var event = callback ? 'mmWsCb' : 'mmWsRs';
      self.socket.emit(event, rs);
      // Remove the in progress request.
      if (!callback) {
        delete self.inProgress[rq.rqId];
      }
      mm.log.debug('---> wsRespond:', rs);
    }
    catch (e) {
      mm.log.error('***> wsRespond failure: ', e.stack);
    }
  }

  /**
   * @summary **send an error response to a client request**
   * @param {Object} rq the incoming request object
   * @param {string|Error} err a text message or Error object
   */   
  WsSession.prototype.respondError = 
  function wsRespondError(rq, err) {
    var self = this;
    if (_.isString(err)) err = new Error(err);
    self.respond(rq, '', err)
  }
  
  return WsSession;
}
