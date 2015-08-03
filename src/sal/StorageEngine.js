'use strict';
/**
 * @fileOverview Storage Engine
 * @module sal/storageEngine
 */ 
 module.exports = function(mm) {
  var _     = mm.check(mm._);
  var qq    = mm.check(mm.Q);
  
  //--------------------------------------------------------------------------
  /**
   * @summary **Background persistent storage service**
   * @description
   * A storage engine services storage requests for clients or the server.
   * @constructor
   * @returns {StorageEngine} the new storage engine.
   */  
  var StorageEngine = (function storageEngineCtorCreator() {
    var ctor = function StorageEngine() {
      var self = this;
      self.todo = [];
      self.idle = true;
      self.engineTimeout = 10000;
      self.initialized = false;
    };

    return ctor;
  }());

  /**
   * @summary **Close the engine**
   * @description
   * The engine closes any pending clients and releases any resources 
   * it currently holds.
   */
  StorageEngine.prototype.close = /* istanbul ignore next */
  function engineClose() {
    var self = this;
    if (self.dbProvider && self.dbProvider.close) {
      self.dbProvider.close();
    }
    if (self.fileProvider && self.fileProvider.close) {
      self.fileProvider.close();
    }
    if (self.clientProvider && self.clientProvider.close) {
      self.clientProvider.close();
    }
    
    self.initialized = false;
  }

  /**
   * @summary **Initiate an operation by engine**
   * @description
   * The operation is queued to the appropriate provider.
   * @param {string} opName the operation requested.
   * @param {StoragePath} path the text path or object
   * @param {string} name unique name of the object  
   * @param {object} content the named object to store on 'store' operations.
   * @returns {Promise} a promise to a `StorageInfo`
   */
  StorageEngine.prototype.rq = 
  function engineRq(opName, path, name, content) {
    var self = this;
    /* istanbul ignore next */
    path.itemName = name ? name : path.itemName;
    return self.queue({ op: opName, path: path, content: content});
  }

  /**
   * @summary **Queue an operation to the storage engine**
   * @description
   * The operation is added to the storage engine  queue.
   * @param {object} op a storage operation object
   * @returns {Promise} a promise to a `StorageInfo`
   */
  StorageEngine.prototype.queue = 
  function engineQueue(op) {
    var self = this;
    op.deferred = qq.defer(); // Add a promise and resolver.
    var ms = self.engineTimeout;
    // If the called provider goes to see the wizard, this will finally
    // terminate the operation with a failure after a couple of minutes.
    var tp = op.deferred.promise.timeout(ms, 
      'Storage engine timed out after ' + ms + ' ms');
    self.todo.push(op);
    /* istanbul ignore else */
    if (self.idle) {
      // TODO: Since this is never idle, perhaps I should rethink the
      // operation queue.
      self.initializeProviders()
      .then(function () {
        // Schedule run operation.
        self.run(); // Kick the engine into gear.
      });
    }

    return tp;
  }

  StorageEngine.prototype.run = 
  function engineRun() {
  try {
      var self = this;
      self.idle = false;

      // Do stuff as long as work is available.
      while (self.todo.length > 0) {
        var op = self.todo.shift();
        op.started = _.now();
        self.startOp(op);
      }
      
      self.idle = true;
    }
    catch (e) {
      /* istanbul ignore next */
      mm.log.error('* Storage Engine Failure:', e.stack);
    }
  }

  /**
   * @summary **Initialize the engine providers**
   * @description
   * All registered providers are initialized once. If initialization of a
   * provider fails, it is removed and will not be used.
   */  
  StorageEngine.prototype.initializeProviders =
  function engineInitializeProviders() {
    var self = this;
    var initializedProviders = [];
    if (!self.initialized) {
      self.initializer = qq.defer();
      var p;
      if (self.dbProvider) {
        p = self.dbProvider.initialize();
        initializedProviders.push(p);
        p.catch( /* istanbul ignore next */
        function () {
          mm.log.warn('Database provider is not available');
          delete self.dbProvider;
        })
      }

      if (self.fileProvider) {
        p = self.fileProvider.initialize();
        initializedProviders.push(p);
        p.catch( /* istanbul ignore next */
        function () {
          mm.log.error('File provider is not available');
          delete self.fileProvider;
        })
      }

      if (self.clientProvider) {
        p = self.clientProvider.initialize();
        initializedProviders.push(p);
        p.catch( /* istanbul ignore next */
        function () {
          mm.log.error('Client provider is not available');
          delete self.clientProvider;
        })
      }

      self.initialized = qq.allSettled(initializedProviders);
    }

    return self.initialized;
  }
  
  /**
   * @summary **Peform a node.js filesystem operation**
   * @description
   * This handles `fs` based file IO operations.
   * @param {Object} op the operation being performed
   */  
  StorageEngine.prototype.startOp = 
  function startOp(op) {
    var self = this;
    var p = op.path;

    // Use the client provider whenever it is available
    if (self.clientProvider) {
      self.clientProvider.perform(op);
      return;
    }
 
    // Use the filesystem if it was preferred by the client.
    if (p.prefer === 'fs' && self.fileProvider) {
      self.fileProvider.perform(op);
      return;
    }
    
    // Use the db by default (or if it is preferred)
    if (self.dbProvider) {
      self.dbProvider.perform(op);
      return;
    }

    // Fall back on using the file provider as needed.
    /* istanbul ignore if */ // Tested independently and repeatedly.
    if (self.fileProvider) {
      self.fileProvider.perform(op);
      return;
    }

    /* istanbul ignore next */
    var s = 'Unavailable storage operation: ' + op.op; 
    /* istanbul ignore next */
    op.deferred.reject(new Error(s));
  }
  
  return StorageEngine;
}
