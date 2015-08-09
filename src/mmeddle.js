/**
 * @fileOverview the mMeddle global declaration and linkage constructor.
 * @module mMeddle
 */

'use strict'; 
/**
 * @summary **The mmeddle.js factory function**
 * @description
 * This populates and returns `mmeddle` (usually referred to as `mm`) with
 * the core 'globals' that tie together mMeddle applications. Almost
 * every mMeddle module is a function that takes `mm`. The index.js files
 * for each directory usually populate sub-sections of `mm` with the
 * classes and functions defined by the modules of that directory.
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
  
  // WebPack fooling.
  mm.nodeRequire = function(s) {
    return require(s);
  }

  mm._ = require('lodash'); // The underscore utility library.
  mm.Q = require('q'); // Promises compatible with node and browsers.
  mm.Q.longStackSupport = true;

  mm.socketServer = {};
  mm.socketClient = {};  
  mm.socketClient.io = require('socket.io-client');

  mm.config = {};  
  mm.config.appName   = '';
  mm.config.inBrowser = inBrowser;
  mm.config.inNode    = inNode;
  mm.config.socketIoLogLevel = 2; // 0 - error, 1 - warn, 2 - info, 3 - debug

  /* istanbul ignore next */
  mm.envText = inNode ? 'Node.js' : 'Browser';

  mm.path = require('path');  
  mm.url  = require('url');

  mm.config.baseDir = __dirname;
  mm.config.openShiftHost = 'mmeddle-jfogarty.rhcloud.com';
  mm.config.localPort = '8085';
  mm.config.localHost = '127.0.0.1';
  mm.config.remoteUrl = 'ws://mmeddle-jfogarty.rhcloud.com:8000/';
  
  /* istanbul ignore else */ // Tested in browser.
  if (inNode) {
    mm.config.baseDir = mm.path.join(__dirname, '..');
    mm.fs     = require('fs');
    mm.del    = require('del');
    mm.mkdirp = require('mkdirp');
    mm.socketServer.io = require('socket.io');
    // mm.canvas = require('canvas');
  }
  else {
    // There is not even a mock window when running in node.
    mm.window   = window;   // jshint ignore:line
    mm.document = document; // jshint ignore:line
  }

  mm.config.distDir = mm.path.join(mm.config.baseDir, 'dist');
  mm.config.logDir  = mm.path.join(mm.config.baseDir, 'logs');

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
  mm.config.openShift  = mm.util.ifEnvOption('OPENSHIFT_NODEJS_IP');
  
  // Config.json files can override startLocal. For now, if this is
  // built on an OpenShift server, then the CLI and webCLI will load
  // sockets from that server instead of localHost.
  mm.config.startLocal = !mm.config.openshift;
  
  // Turn config pojo into an actual Config object.
  mm.config = new mm.obj.Config().init(mm.config);
  
  require('./sal/')(mm);
  require('./mMath/')(mm);
  require('./core/')(mm);
  
  /* istanbul ignore else */
  if (inNode) {
    require('./server/')(mm);
    mm.log.setupAppDebugLog(mm.config.appName);
    mm.config = mm.config.appLoad(mm.config.appName);
  }

  // Do this after the config.appLoad.
  mm.config.localUrl  = 'http://' + mm.config.localHost +
                        ':' + mm.config.localPort;
                      
  // When the server starts, it initializes the ./dist/config.js file for
  // use by web applications.
  var generatedVersionFile = require('./version');
  mm.version = generatedVersionFile.version;
  mm.config.mMeddleTS = generatedVersionFile.ts;
  mm.config.version = mm.version;
  if (mm.config.inNode) {
    if (mm.config.appName === 'server') {
      mm.browserConfig = new mm.obj.Config().init(mm.config);
      mm.browserConfig.appLoad('browser');
      mm.browserConfig.serverStartTime = mm.util.timestamp();
      mm.browserConfig.inNode = false;
      mm.browserConfig.inBrowser = true;
      var jsfunc = '';
      jsfunc += '// This file was generated by mMeddle ' + mm.version +
                ' ' + mm.config.appName + ' ' + mm.envText + '\n';
      jsfunc += '// ' + new Date().toString() + '\n';
      jsfunc += '// \n';
      jsfunc += '(function(mm) {\n';
      jsfunc += '  var config = ' + mm.util.inspect(mm.browserConfig);
      jsfunc += ';\n\n';
      jsfunc += '  mm._.assign(mm.config, config);\n';
      jsfunc += '}(mmeddle))\n';
      var configFile = mm.path.join(mm.config.distDir, 'config.js');  
      mm.fs.writeFileSync(configFile, jsfunc);
    }
    else {
      var cfgSave = mm.config;
      var cfgPath = mm.path.join(mm.config.distDir, 'config.js');
      mm.clientConfig = {};
      try {
        var cfg = String(mm.fs.readFileSync(cfgPath));
        var mmeddle = mm;
        // Config.js is a function for execution in a browser script load.
        mm.config = new mm.obj.Config().init(mm.config);
        eval(cfg); // jshint ignore:line
        mm.clientConfig = mm.config;
      }
      catch (e) {
         mm.log.debug('Client config load failed:', e);
      }
      mm.config = cfgSave;
      mm.config.serverStartTime = mm.clientConfig.serverStartTime;
    }
  }

  require('./test/')(mm);
  mm.log('- mMeddle ' +
           mm.version + ' ' +
           mm.config.appName + ' ' +
           mm.envText + ' initialized.');

  mm.configHost = function configHost() {
    var host = mm.config.startLocal ? mm.config.localUrl : mm.config.remoteUrl;
    host = mm.config.openShift ? mm.config.remoteUrl : host;
    return host;
  }

  return mm;
}())
