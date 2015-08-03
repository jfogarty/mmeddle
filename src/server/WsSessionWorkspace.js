'use strict';
/**
 * @fileOverview Add workspace request handlers to WsSession.
 * @module server/WsSession
 * @description
 * The workspace related request handlers are here.
 */ 
 module.exports = function(mm) {
   var WsSession = mm.check(mm.server.WsSession);   
  
  /**
   * @summary **handler: saves a workspace to storage**
   * @description
   * The entire text of the workspace is save to storage. Functions in the
   * workspace have already been converted to text strings by the client.
   * @param {Object} rq the request object
   */   
  WsSession.prototype.saveWorkspace = 
  function wsSaveWorkspace(rq) {
    var self = this;
    mm.log.debug('[' + self.sessionId + '] Saving Workspace:', rq.content);
    var sc = new mm.storage.StorageClient({ 
      user: self.user.name, 
      engine: self.storageEngine 
    });
    var ws = JSON.parse(rq.content);
    var wsSession = {
      name: self.sessionId,
      ws: ws
    };
    sc.store('wsSessions', wsSession)
    .then(function(r) {
      mm.log('- Workspace session saved', self.sessionId);
      // Save the named workspace.
      /* istanbul ignore if */ // Tested independently.
      if (ws.name) {
        sc.store('ws', ws)
        .then(function(r) {
          mm.log('- Workspace saved:', ws.name);
          self.respond(rq);
        },
        function(e) { 
          mm.log.error('Workspace save failed: ', e)
          self.respondError(rq, e);
        })
      }
      else {
        // Just save the session for unnamed workspaces.
        self.respond(rq);
      }
    },
    /* istanbul ignore next */
    function(e) { 
      mm.log.error('Workspace session save failed: ', e)
      self.respondError(rq, e);
    })
  }

  return WsSession;
}
