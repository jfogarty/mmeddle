/**
 * @fileOverview the mMeddle global declaration and linkage constructor.
 * @module mMeddle
 */

'use strict';
/**
 * @summary **The mmeddle.js factory function**
 * @description
 * This is called automatically when loading mmeddle via the index.js root.
 * This populates and returns `mmeddle` (usually referred to as `mm`) with
 * the core 'globals' that tie together mMeddle applications.
 */ 
module.exports = (function mMeddleCreate() {
  var mm = {};

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
  
  mm.check = function(v) {
    /* istanbul ignore if */ // Tested independently and repeatedly.
    if (typeof v === 'undefined' || !v) {
      console.log( '*** Uninitialized mMeddle linkage. Abandon all hope.');
      throw new Error('Uninitialized mMeddle linkage. Abandon all hope.');
    }
    return v;
  }

  mm._ = require('lodash'); // The underscore utility library.
  mm.Q = require('q'); // Promises compatible with node and browsers.
  mm.Q.longStackSupport = true;

  mm.socketClient = {};  
  mm.socketClient.io = require('socket.io-client');
  mm.socketServer = {};

  mm.config = {};  
  mm.config.appName   = '(none)';
  mm.config.inBrowser = inBrowser;
  mm.config.inNode    = inNode;
  mm.config.socketIoLogLevel = 2; // 0 - error, 1 - warn, 2 - info, 3 - debug

  /* istanbul ignore next */
  mm.envText = inNode ? 'Node.js' : 'Browser';

  mm.path = require('path');  

  mm.config.baseDir = __dirname;

  mm.config.openShiftHost = 'mmeddle-jfogarty.rhcloud.com';
  mm.config.localHost = '127.0.0.1';
  mm.config.localUrl  = 'http://' + mm.config.localHost + ':8080';
  mm.config.remoteUrl = 'ws://mmeddle-jfogarty.rhcloud.com:8000/';
  
  /* istanbul ignore else */ // Tested in browser.
  if (inNode) {
    mm.config.baseDir = mm.path.join(__dirname, '..');
    mm.fs     = require('fs');
    mm.del    = require('del');
    mm.mkdirp = require('mkdirp');
    mm.socketServer.io = require('socket.io');
  }
  else {
    // There is not even a mock window when running in node.
    mm.window = window;     // jshint ignore:line
    mm.document = document; // jshint ignore:line
  }

  /* istanbul ignore if */
  if (inBrowser) {
    var userAgent = navigator.userAgent;
    inPhantom = userAgent.indexOf('PhantomJS') >= 0;
    mm.config.inPhantom = inPhantom;
    if (inPhantom) {
      mm.envText += '-PhantomJS';
    }
    mm.envText += '(' + userAgent + ')';
  }
  else {
    mm.config.mainFilename = process.mainModule.filename;
    mm.config.appName = mm.path.basename(mm.config.mainFilename, '.js');
    mm.envText += '(' + global.process.version + ')';
  }
  
  /* istanbul ignore next */
  mm.format = mm.check(require('../external/sf'));

  // Self registering modules.
  require('./util/')(mm);
  mm.config.openShift = mm.util.ifEnvOption('OPENSHIFT_NODEJS_IP');
  
  // Turn config pojo into an actual Config object.
  mm.config = new mm.obj.Config().init(mm.config);
  
  require('./sal/')(mm)
  require('./core/')(mm)
 
  /* istanbul ignore else */
  if (inNode) {
    require('./server/')(mm)
    mm.log.setupAppDebugLog(mm.config.appName);
    mm.config = mm.config.appLoad(mm.config.appName);
  }
  
  require('./test/')(mm)
  mm.log('- mMeddle ' + mm.config.appName + ' ' + mm.envText + ' initialized.');
  return mm;
}())
