'use strict';
/**
 * @fileOverview Storage client
 * @module sal/StorageClient
 */ 
 module.exports = function(mm) {
  var _       = mm.check(mm._);
  var storage = mm.check(mm.storage);
  var StoragePath = mm.check(storage.StoragePath);

  /**
   * @summary **Client for access to persistent storage**
   * @description
   * A StorageClient provides access to the storage services to save and
   * load objects to the persistent store. The `user` field in the client
   * constructor options specifies the owner for every object that can be
   * written by this client. Other objects can be read by specifying their
   * owners in the path parameter of operations.
   * @constructor
   * @param {Object} options the options for the client type.
   * @returns {StorageClient} the new storage client.
   */  
  var StorageClient = (function storageClientCtorCreator() {
    var ctor = function StorageClient(options) {
      var self = this;
      _.defaults(self, options);
      /* istanbul ignore if */
      if (typeof self.engine === 'undefined') {
        self.engine = mm.check(storage.storageEngine);
      }
    };

    return ctor;
  }());

  /**
   * @summary **Determine if an error is NOT FOUND**
   * @description
   * This examines the error code and returns true if it indicates that
   * the request failed to find the object.
   * @param {Error} err the Error object
   * @returns {bool} true if the Error object indicates NOT FOUND.
   */
  StorageClient.prototype.notFound = function notFound(err) {
    return mm.util.ENOENT(err);
  }

  /**
   * @summary **Store an object**
   * @description
   * The object is stored in the specified path. A promise is returned
   * which evaluates to the full `StorageInfo` to the object when it
   * has been successfully saved. The object must contain a `name` field
   * that will uniquely index the object in its destination collection or
   * directory. Note that the object stored should not be modified until
   * the operation is complete, and the object may be modified by the call.
   * @param {StoragePath} path the text path or object
   * @param {Object} obj the object to store
   * @returns {Promise} a promise to a `StorageInfo`
   */
  StorageClient.prototype.store = function clientStore(path, obj) {
    var self = this;
    /* istanbul ignore else */
    if (!(path instanceof StoragePath)) {
      path = new StoragePath(self, path);
    }
 
    return self.engine.store(path, obj);
  }

  /**
   * @summary **Load an object**
   * @description
   * The object is loaded from the specified path. A promise is returned
   * which evaluates to the object if it is sucessfully loaded.
   * The loaded object will contain a `name` field that is the unique name
   * of the object in the collection or directory it is stored in.
   * @param {StoragePath} path the text path or object
   * @param {string} name the named item to load   
   * @returns {Promise} a promise to the object
   */
  StorageClient.prototype.load = function clientLoad(path, name) {
    var self = this;
    /* istanbul ignore else */
    if (!(path instanceof StoragePath)) {
      path = new StoragePath(self, path);
    }
    
    return self.engine.load(path, name)
      .then(function (info) {
        return info.content;
      });
  }

  /**
   * @summary **Load one or more objects**
   * @description
   * The set of objects is loaded from the specified path based on the
   * name pattern. The name pattern is either a name, or a partial name
   * with a '*' suffix for prefix matching. Unless there is a storage
   * error, an array is always returned (although it is empty on a non
   * matching pattern). Currently, an engine specific limit is
   * placed on the maximum number of items returned (based on the 
   * largest possible single response.
   * @param {StoragePath} path the text path or object
   * @param {string} name pattern for items to retrieve
   * @returns {Promise} a promise to the object array.
   */
  StorageClient.prototype.loadMultiple =
  function clientLoadMultiple(path, namePattern) 
  {
    var self = this;
    /* istanbul ignore else */
    if (!(path instanceof StoragePath)) {
      path = new StoragePath(self, path);
    }
    
    return self.engine.loadMultiple(path, namePattern)
      .then(function (info) {
        return info.content;
      });
  }

  /**
   * @summary **Remove an object**
   * @description
   * The object is removed from the specified path. A promise is returned
   * which evaluates to true object is sucessfully removed.
   * @param {StoragePath} path the text path or object
   * @param {string} name the item to remove
   * @returns {Promise} a promise to true if removed.
   */
  StorageClient.prototype.remove = function clientRemove(path, name) {
    var self = this;
    /* istanbul ignore else */
    if (!(path instanceof StoragePath)) {
      path = new StoragePath(self, path);
    }

    return self.engine.remove(path, name);
  }
  
  /**
   * @summary **Close the client**
   * @description
   * The client disconnects from the engine and releases any resources 
   * it currently holds.
   */
  StorageClient.prototype.close = function clientClose() {
  }

  return StorageClient;
}
