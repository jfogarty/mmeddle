'use strict';
/**
 * @fileOverview ClientSession
 * @module core/ClientSession
 */ 
 module.exports = function(mm) {
  var _           = mm.check(mm._);
  var qq          = mm.check(mm.Q);
  var Config      = mm.check(mm.obj.Config);
  var ClientUser  = mm.check(mm.users.ClientUser);

  //--------------------------------------------------------------------------
  /**
   * @summary **client Workspace session**
   * @description
   * This provides client services for managing workspaces. These are
   * storage, user and server request services.  The client session is the
   * first major object created by a client. It is used to load the user
   * and workspace from browser/client localStorage if (if this browser)
   * has been used before. Normally the session is supplied to a MMeddleClient
   * which in turn connects to a MMeddleServer/WsSession over a socket.io
   * connection. Once a server connection is completed, the session can
   * handle requests such as login, saveWorkspace, etc.
   * 
   * @constructor
   * @param {string} clientApp optional name to use for the client application
   * @returns {ClientSession} the new client session
   */  
  var ClientSession = (function clientSessionCtorCreator() {
    var ctor = function clientSession(clientApp) {
      var self = this;
      self.ws = mm.check(new mm.core.Workspace(self));
      self.user = new ClientUser();
      self.userConfig = new Config();
      self.loggedIn = null; // Not currently logged in.
      self.mmc = false; // No MMeddleClient has been added,
      self.clientApp = clientApp ? clientApp : 'client';

      /* istanbul ignore next */ // tested independently
      self.newSessionId = function newSessionId() {
        return 'MMSID_' + _.now().toString() + '_' + _.random(10000).toString();
      }
    };
  
    return ctor;
  }());

  /**
   * @summary **Bind the MMeddleClient to this session**
   * @description
   * The client provides only its `rq` method, and the `socketid` to the
   * session, so its easy to mock if you want to.
   * @param {MMeddleClient} op the operation being requested.
   */  
  ClientSession.prototype.bindClient = 
  function bindClient(mmc) {
    var self = this;  
    self.mmc = mmc;
  }

  /**
   * @summary **Issue a server request with optional response**
   * @description
   * If the a client session is available and connected then this will
   * pass the request on the the MMeddleClient, otherwise it returns
   * false or a rejected error promise.
   * @param {string} op the operation being requested.
   * @param {bool} rsRequired true if a return promise response is needed.
   * @param {object} content the content for the operation.
   * @param {number} timeout n optional timeout in seconds.
   * @returns {bool|Promise} success if true or promise to response.
   */  
  ClientSession.prototype.rq =
  function rq(op, content, rsRequired, timeout) {
    var self = this;
    if (self.mmc && self.mmc.connected) {
      return self.mmc.rq(op, content, rsRequired, timeout);
    }
    /* istanbul ignore next */ // tested independently
    if (self.mmc) {
      if (rsRequired) return qq.reject(new Error('Not connected to server')); 
    }
    else {
      if (rsRequired) return qq.reject(new Error('No mMeddle Client exists'));
    }
    return false;
  }
  
  /**
   * @summary **Send a message to be logged on the server console**
   * @description
   * This is mostly for testing and remote activity logging.
   * @param {string} text the text to log.
   * @returns {bool} true (if connected)
   */
  ClientSession.prototype.emitLogMessage =
  function emitLogMessage(text) {
    var self = this;
    return self.rq('log', text);
  }

  return ClientSession;
}