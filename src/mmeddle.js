'use strict';

/**
 * mmeddle.js factory function.
 */
function create() {
  // Test for ES5 support
  if (typeof Object.create !== 'function') {
    throw new Error('ES5 not supported by this JavaScript engine. ' +
        'Please load the es5-shim and es5-sham library for compatibility.');
  }

  // create namespace
  var mmeddle = {};

  /**
   * mmeddle.js factory function. Creates a new instance of mmeddle.js
   */
  mmeddle.create = create;

  mmeddle.type = {};
  
  // The underscore replacement utility library.
  mmeddle._ = require('lodash');
 
  mmeddle.users = {};
  mmeddle.storage = {};
  mmeddle.ws = {};
  
  // return the new instance
  return mmeddle;
}

// create a default instance of m.js
var mMeddle = create();

console.log('- mMeddle initialized.');
  
// export the default instance
module.exports = mMeddle;
