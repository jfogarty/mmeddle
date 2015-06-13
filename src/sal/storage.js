'use strict';
/**
 * @fileOverview Storage abstractions and utility classes
 * @module sal/storage
 */ 
 module.exports = function(mm) {
  var _     = mm.check(mm._);

  var storage = {};
  storage.providers = {};

  //--------------------------------------------------------------------------
  /**
   * @summary **Location of a stored object**
   * @description
   * A StoragePath specifies a location in persistent storage. A path
   * must be created and initialized to store any objects in persistent
   * storage.
   * @constructor
   * @param {StorageClient} context the context for the path
   * @param {string} text text form of the path
   * @returns {StoragePath} the new storage path.
   */
  var StoragePath = (function storagePathCtorCreator() {
    var ctor = function StoragePath(context, text) {
      var self = this;
      var FILEPREFIX = 'file:';
      self.toFile = _.startsWith(text, FILEPREFIX);
      if ( self.toFile ) {
        text = text.substr(FILEPREFIX.length);
      }
      var parts = text.split('/');
      if (parts.length < 2) {
        // The userName will match the owner field in content.
        self.userName = context.user;
        self.collectionName = parts[0];
      }
      else {
        self.userName = parts[0];
        self.collectionName = parts[1];
      }
    };
    
    return ctor;
  }());
  
  //--------------------------------------------------------------------------
  
  /**
   * @summary **Information about a persistenly stored object**
   * @description
   * A StorageInfo contains information about an object in persistent
   * storage such as its path, size, storage state, etc.
   * @constructor
   * @param {fs.Stats} stat the fs.Stat object.
   * @returns {StorageInfo} the new storage info.
   */  
  var StorageInfo = (function storageInfoCtorCreator() {
    var ctor = function StorageInfo(stat) {
      var self = this;
      _.defaults(self, stat);
    };

    return ctor;
  }());

  storage.StoragePath = StoragePath;
  storage.StorageInfo = StorageInfo;

  return storage;
}
