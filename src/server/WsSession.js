'use strict';
/**
 * @fileOverview Manage server side workspace session requests.
 * @module server/WsSession
 * @description
 * Once a client has connected to the server, a session is established
 * with a persistent workspace by its session id. This id represents
 * a long term session lifetime (can persist forever).
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
    //mm.log.debug.low.log('- WS op:', op);
//mm.log.debug('- WS op:', op);
    if (self[op]) {
      self[op](rq);
    }
    else {
      mm.log.error('- Invalid workspace session operation:', rq);
      if (rq.rsRequired) {
        self.respond(rq, '', new Error('Invalid request:' + op));
      }
    }
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
   * @summary **send a response to a client request**
   * @param {Object} rq the incoming request object
   * @param {Object} content the 'content' field for the response
   * @param {string} err if present 'ok' is false and 'error' is set 
   * @param {Object} optional extra fields for the response. 
   */   
  WsSession.prototype.respond = 
  function wsRespond(rq, content, err, extra) {
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
      self.socket.emit('mmWsRs', rs);
      mm.log.debug('----------> wsRespond:', rs);
    }
    catch (e) {
      mm.log.error('***> wsRespond failure: ', e.stack);
    }
  }

  return WsSession;
}
