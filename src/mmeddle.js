/**
 * @fileOverview the mMeddle global declaration and linkage constructor.
 * @module mMeddle
 */

'use strict';
/**
 * @summary **The mmeddle.js factory function**
 * @description
 * This is called automatically when loading mmeddle via the index.js root.
 * This populates `module.exports` with an object containing access to all
 * the other required components.
 */ 
function create() {
  // Test for ES5 support
  /* istanbul ignore if */
  if (typeof Object.create !== 'function') {
   throw new Error('ES5 not supported by this JavaScript engine. ' +
        'Please load the es5-shim and es5-sham library for compatibility.');
  }
  
  // Globally register the execution environment for testing by the sub-modules.
  var inNode = !!(typeof window === 'undefined' &&
               typeof process !== 'undefined' &&
               process.nextTick);
  var inBrowser = !inNode;
  var inPhantom = false;

  /**
   * mmeddle factory function. Creates a new instance of mmeddle with a workspace.
   */
  var mm = {};
  mm.create = create;

  mm.type = {};
  
  mm._ = require('lodash'); // The underscore replacement utility library.
  mm.Q = require('q'); // Promises compatible with node and browsers.
  
  mm.inBrowser = inBrowser;
  mm.inNode    = inNode;
  /* istanbul ignore next */
  mm.envText = inNode ? 'Node.js' : 'Browser';
  
  /* istanbul ignore if */
  if (inBrowser) {
    var userAgent = navigator.userAgent;
    inPhantom = userAgent.indexOf('PhantomJS') >= 0;
    mm.inPhantom = inPhantom;
    if (inPhantom) {
      mm.envText += '-PhantomJS';
    }
    mm.envText += '(' + userAgent + ')';
  }
  else {
     mm.envText += '(' + global.process.version + ')';
  }
  
  //mm.format = require('string-template');
  //Other candidates.
  //mm.format = require('string-format');
  //mm.format = require('sf');
  
  /* istanbul ignore next */
  mm.format = require('../external/sf');
  
  require('./util/')(mm);
  require('./sal/')(mm)
  require('./core/')(mm)
  
  /* istanbul ignore else */
  if (inNode) {
    mm.FS = require('q-io/fs');
    // mmeddle.FS = require('q-io/fs-mock');
  }
  
  // return the new instance
  return mm;
}

// create an isolated instance of mmeddle with its own workspace.
var mMeddle = create();

mMeddle.log('- mMeddle on ' + mMeddle.envText + ' initialized.');

// export the default instance
module.exports = mMeddle;
