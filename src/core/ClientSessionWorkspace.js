'use strict';
/**
 * @fileOverview Adds Workspace services to the ClientSession.
 * @module core/ClientSession
 */ 
 module.exports = function(mm) {
  var Workspace  = mm.check(mm.core.Workspace);
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
    if (wsObj) {
      self.ws.init(wsObj);
    }
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
    return self;
  }
  
  /**
   * @summary **Save contents of current workspace to server**
   * @description
   * Any changes to the current workspace, including all settings and
   * documents are copied to the server for persistent storage.
   * The workspace is saved for the current authenticated user, or
   * under the 'anonymous' user if none has been established.
   * @returns {Promise} to the response (ok=true on success)
   */  
  ClientSession.prototype.saveWorkspace =
  function saveWorkspace() {
    var self = this;
    return self.rq('saveWorkspace', mm.util.JSONify(self.ws, 2), true);
  }
  
  /**
   * @summary **Load a workspace from the server**
   * @description
   * A new workspace is loaded from the server.
   * @param {string} name an optional name, otherwise loaded by current MMSID.
   * @returns {Promise} to the WS or a failure.
   */  
  ClientSession.prototype.loadWorkspace =
  function loadWorkspace(name) {
    var self = this;
    return self.rq('loadWorkspace', name, true)
      .then(function (rs) {
      var ws = new Workspace(self).init(rs.content);
      ws.elapsed = rs.elapsed;
      ws.ok = true;
      return ws;
    })
  }
}