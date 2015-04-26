'use strict';
/**
 * @fileOverview Storage abstractions
 * @module sal/storage
 */ 
 module.exports = function(mm) {
  var qq = mm.Q,
      debug = mm.log.debug;
  
//  var SequencedObject = mm.obj.SequencedObject;
 
  var storage = {};
  //var users = mm.users;

  storage.space = {};
/**
 * Write a value into storage.
 *
 * @memberOf storage
 * @param {string} the username for the collection.
 * @param {string} the collection name.
 * @param {string} the item name.
 * @param {string} the value of the item to store.
 * @returns {Promise} resolves when item is being stored.
 * @example
 *
 * var animals = [
 *   { cat: 'edmund' },
 *   { cat: 'rosie' },
 *   { dog: 'silly' }
 *  ];
 *  
 * var promise = storage.store('john', 'allAnimals', 'myAnimals', animals);
 * promise.then(function(r) { console.log('- Stored: ', r )});
 * // => true
 */
  storage.store = function (userName, collectionName, itemName, value) {
    debug('- Item:', value);  
    return qq.fcall(function() {
      debug('-- Item:', value);
      return JSON.stringify(value);
    })
    .delay(400)
    .then(function(s) {
      var location = {
        user: userName,
        collection: collectionName,
        item: itemName
      };

      debug('- Stored: "{user}/{collection}/{item}" as "{1}"', location, s);
      debug('- Stored: "{0:inspect}"', location);
      debug('- Stored: "{0:json}"', location);
    })
  }

  storage.remove = function (userName, collectionName, item) {
    return storage;
  }

  storage.readFile = function (filename, dataHandler) {
    return storage;
  }
  
  return storage;
}