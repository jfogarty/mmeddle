'use strict';
/**
 * @fileOverview Storage path abstraction
 * @module sal/StoragePath
 */ 
 module.exports = function(mm) {

  //--------------------------------------------------------------------------
  /**
   * @summary **Location of a stored object**
   * @description
   * A StoragePath specifies a location in persistent storage. Options
   * for the storage engine can also be part of the path. The storage
   * clients provide Path, operation names, and additional info to the
   *  storage engine.
   * @constructor
   * @param {StorageClient} context the context for the path
   * @param {string} text text form of the path
   * @returns {StoragePath} the new storage path.
   */
  var StoragePath = (function storagePathCtorCreator() {
    var ctor = function StoragePath(context, text) {
      var self = this;
      var parts = text.split('/');
      /* istanbul ignore else */
      if (parts.length < 2) {
        // The userName matches the owner field in content.
        self.userName = context.user;
        self.collectionName = parts[0];
      }
      else {
        self.userName = parts[0];
        self.collectionName = parts[1];
      }
      if (context.prefer) self.prefer = context.prefer;
    };
    
    return ctor;
  }());

  return StoragePath;
}
