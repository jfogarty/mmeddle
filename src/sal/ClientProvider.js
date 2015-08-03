'use strict';
/**
 * @fileOverview Storage Client Provider
 * @module sal/ClientProvider
 */ 
 module.exports = function(mm) {
  var qq    = mm.check(mm.Q);
  //--------------------------------------------------------------------------
  /**
   * @summary **Provides storage operations over the session socket**
   * @description
   * A ClientProvider is plugged into client based StorageEngine which is
   * running in a browser or node client that is connected to a mMeddle
   * server over a socket based ClientSession.
   * @constructor
   * @param {StorageEngine} engine context for this engine
   * @param {ClientSession} cs the current client session
   * @returns {ClientProvider} the new ClientProvider 
   */  
  function ClientProvider(engine, cs) {
    var self = this;
    self.engine = mm.check(engine);
    self.cs     = mm.check(cs);
  }

  /**
   * @summary **registers the Client Remote StorageProvider**
   * @description
   * Provides storage operations over sockets to the mMeddle server.
   * @static
   * @param {StorageEngine} engine the current storage engine
   * @param {ClientSession} cs the current client session
   */  
  ClientProvider.register = function registerClientProvider(engine, cs) {
    engine.clientProvider = new ClientProvider(engine, cs);
  }    

  /**
   * @summary **initialize the remote storage provider**
   * @return {Promise} resolves when successful.
   */  
  ClientProvider.prototype.initialize =
  function initialize(op) {
    var self = this;
    /* istanbul ignore else */
    if (!self.initialized) {
      self.initialized = qq(true);
    }
    return self.initialized;
  }  

  /**
   * @summary **perform a remote storage operation**
   * @param {StorageEngine} op the operation to perform.
   */  
  ClientProvider.prototype.perform =
  function perform(op) {
    var self = this;
    // Pass only the relevant request parts of the op.
    var simpleOp = { op: op.op, path: op.path, content: op.content };
    var rsRequired = op.path.callback ? op.path.callback : true;
    var tmt = op.path.timeout ? op.path.timeout : null;
    return self.cs.rq('clientStorage', simpleOp, rsRequired, tmt)
    .then(function (rs) {
      rs.content._elapsed = rs._elapsed;
      op.deferred.resolve(rs.content);
    },
    function (e) {
      op.deferred.reject(e);
      return;
    });
  }
  
  return ClientProvider;
}


