'use strict';
/**
 * @fileOverview Adds Workspace services to the ClientSession.
 * @module core/ClientSession
 */ 
 module.exports = function(mm) {
  var ClientSession = mm.check(mm.core.ClientSession);
  var localStorage = new mm.storage.LocalStorage();

  /**
   * @summary **Clear the local workspace to empty**
   * @description
   * Empties the current workspace but retains the same session id.
   * If this workspace is saved to the server then the contents of the
   * prior workspace are lost.
   * @returns {ClientSession} self for chaining.
   */  
  ClientSession.prototype.clearLocalWorkspace =
  function clearLocalWorkspace() {
    var self = this;
    var savedSessionId = self.ws.sessionId;
    self.ws = mm.check(new mm.core.Workspace(self));
    self.ws.sessionId = savedSessionId;
    /* istanbul ignore if */ // tested independently.
    if (!self.ws.sessionId) {
      self.ws.sessionId = self.newSessionId();
    }
    return self;
  }

  /**
   * @summary **load the workspace from localStorage**
   * @description
   * Loads a previously saved workspace from the browser/client localStorage.
   * If no prior workspace exists, then a new one is created an a new
   * MMSID is assigned to it. The MMSID is the long-term identifier used
   * to identify this session across multiple connections, reconnections,
   * and even multiple browsers and client applications.
   * @returns {ClientSession} for chaining
   */  
  ClientSession.prototype.loadLocalWorkspace =
  function loadLocalWorkspace() {
    var self = this;  
    var wsObj = localStorage.load('ws');
    /* istanbul  ignore else */ // tested independently.
    if (wsObj) {
      self.ws.init(wsObj);
    }
    /* istanbul ignore if */ // tested independently.
    if (!self.ws.sessionId) {
      self.ws.sessionId = self.newSessionId();
    }
    return self;
  }

  /**
   * @summary **save the workspace to localStorage**
   * @returns {ClientSession} for chaining   
   */  
  ClientSession.prototype.saveLocalWorkspace =
  function saveLocalWorkspace() {
    var self = this;    
    localStorage.store('ws', self.ws);
    self.ws.savedLocal = true;
    return self;
  }
  
  /**
   * @summary **Save contents of current workspace to server**
   * @description
   * Any changes to the current workspace, including all settings and
   * documents are copied to the server for persistent storage.
   * The workspace is saved for the current authenticated user, or
   * under the 'anonymous' user if none has been established.
   * @param {string} name optional name (if used, sets the ws name).
   * @returns {Promise} to the response (ok=true on success)
   */  
  ClientSession.prototype.saveWorkspace =
  function saveWorkspace(wsName) {
    var self = this;
    self.ws.name = wsName ? wsName : self.ws.name
    return self.rqWithReply('saveWorkspace', mm.util.JSONify(self.ws, 2));
  }

  /**
   * @summary **Load a workspace from the server**
   * @description
   * An existing workspace is loaded from the server.
   * @param {string} name required name.
   * @returns {Promise} to the WS or a failure.
   */  
  ClientSession.prototype.loadWorkspace =
  function loadWorkspace(wsName) {
    var self = this;
    if (!self.isLoggedIn()) {
      throw new Error('Please log in before loading a workspace');
    }
    if (!self.storageClient) {
      throw new Error('Odd. There is no storage available. Give up.');
    }
    if (wsName) {
      return self.storageClient.load('ws', wsName)
      .then(function(wsObj) {
        var sessionId = self.ws.sessionId;
        mm.log.debug('- Loaded ws', wsObj);
        self.ws.init(wsObj);
        var same = self.ws.sessionId === sessionId &&
                   self.ws.owner === self.user.name;
        self.ws.sessionId = sessionId; // Use the current session id.
        self.ws.saved = same; // This is currently saved to the server.
        return self.ws;
      },
      function(e) {
        if (mm.util.ENOENT(e)) {
          var em = 'No such workspace exists: [' + wsName + ']';
          mm.log.debug('loadWorkspace: ' + em);
          throw new Error(em);
        }
        else {
          mm.log.debug('loadWorkspace: Access error: [' + wsName + ']', e.stack);
          throw e;
        }
      })
    }
    else {
      var sessionId = self.ws.sessionId;
      return self.storageClient.load('wsSession', sessionId)
      .then(function(wsSessionObj) {
        var wsObj = wsSessionObj.ws;
        mm.log.debug('- Loaded ws by session Id', sessionId);
        self.ws.init(wsObj);
        self.ws.saved = true; // This is currently saved to the server.
        return self.ws;
      },
      function(e) {
        if (mm.util.ENOENT(e)) {
          var em = 'No such workspace session exists: [' + sessionId + ']';
          mm.log.debug('loadWorkspace: ' + em);
          throw new Error(em);
        }
        else {
          mm.log.debug('loadWorkspace: Access error: [' + sessionId + ']', e.stack);
          throw e;
        }
      })
    }
  }
}