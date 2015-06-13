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
  StorageEngine.prototype.close = 
  function engineClose() {
    var self = this;
    if (self.dbProvider && self.dbProvider.close) {
      self.dbProvider.close();
    }
    if (self.fileProvider && self.fileProvider.close) {
      self.fileProvider.close();
    }
    self.initialized = false;
  }

  /**
   * @summary **Initiate object storage by engine**
   * @description
   * The object is stored in the specified path. A promise is returned
   * which evaluates to the full `StorageInfo` to the object when it
   * has been successfully saved. Note that storage can be successful
   * even if operation is on a browser and the connection to the server
   * is lost, since the object will be saved to local storage.
   * @param {StoragePath} path the path object
   * @param {object} content the named object to store
   * @returns {Promise} a promise to a `StorageInfo`
   */
  StorageEngine.prototype.store = 
  function engineStore(path, content) {
    var self = this;
    path.itemName = content.name;
    content.owner = path.userName;
    return self.queue({ op: 'store', path: path, content: content});
  }

  /**
   * @summary **Initiate object loading by engine**
   * @description
   * The object is loaded from the specified path. A promise is returned
   * which evaluates to the full `StorageInfo` which contains the 
   * object content  field along with other info about the object access.
   * @param {StoragePath} path the text path or object
   * @param {string} name unique name of the object  
   * @returns {Promise} a promise to a `StorageInfo`
   */
  StorageEngine.prototype.load = 
  function engineLoad(path, name) {
    var self = this;
    path.itemName = name ? name : path.itemName;
    return self.queue({ op: 'load', path: path});
  }

  /**
   * @summary **Initiate multiple object loading by engine**
   * @description
   * The object set is loaded from the specified path. A promise is
   * returned which evaluates to a `StorageInfo` which contains an 
   * object content array field along with other info about the 
   * object set access.
   * @param {StoragePath} path the text path or object
   * @param {string} namePattern a pattern to search for the objects
   * @returns {Promise} a promise to a `StorageInfo`
   */
  StorageEngine.prototype.loadMultiple = 
  function engineLoad(path, name) {
    var self = this;
    path.itemName = name ? name : path.itemName;
    return self.queue({ op: 'loadMultiple', path: path});
  }

  /**
   * @summary **Initiate object removal by engine**
   * @description
   * The object is removed from the specified path. A promise is returned
   * which evaluates to true if the object was removed, false if it did
   * not exist.
   * @param {StoragePath} path the text path or object
   * @param {string} name unique name of the object  
   * @returns {Promise} a promise to a boolean value
   */
  StorageEngine.prototype.remove = 
  function engineRemove(path, name) {
    var self = this;
    path.itemName = name ? name : path.itemName;
    return self.queue({ op: 'remove', path: path});
  }

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
    if (self.idle) {
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
        p.catch(function () {
          mm.log.error('*** Database provider is not available');
          delete self.dbProvider;
        })
      }

      if (self.fileProvider) {
        p = self.fileProvider.initialize();
        initializedProviders.push(p);
        p.catch(function () {
          mm.log.error('*** File provider is not available');
          delete self.fileProviderfileProvider;
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
    if (!p.toFile && self.dbProvider) {
      self.dbProvider.perform(op);
      return;
    }

    if (self.fileProvider) {
      self.fileProvider.perform(op);
      return;
    }

    var s = 'Unavailable storage operation: ' + op.op;
    op.deferred.reject(new Error(s));
  }
  
  return StorageEngine;
}
