'use strict';
/**
 * @fileOverview Storage information about a file operation.
 * @module sal/StorageInfo
 */ 
 module.exports = function(mm) {
 
  /**
   * @summary **Information about a persistenly stored object**
   * @description
   * A StorageInfo contains information about an object in persistent
   * storage such as its path, size, storage state, etc.
   * @constructor
   * @param {fs.Stats} stat optional the fs.Stat object.
   * @returns {StorageInfo} the new storage info.
   */  
  var StorageInfo = (function storageInfoCtorCreator() {
    var ctor = function StorageInfo(stat) {
      var self = this;
      if (stat) mm._.defaults(self, stat);
    };

    return ctor;
  }());

  return StorageInfo;
}
