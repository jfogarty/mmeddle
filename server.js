'use strict';
//# !/bin/envnode
/**
 * @fileOverview mMeddle Express based OpenShift test server.
 * @module server
 * @description
 * This server provides the server side support for mMeddle workspace
 * clients.  It serves static web pages, the javascript distribution and
 * libs of mMeddle, and handles socket.io services to mMeddle clients.
 *
 * --app provides a testing convenience where a test client can be started
 * by the server immediately after setting up the web services.
 * --mock uses a mock Sockets implementation and will run --apps as
 * routines in-process in the server.  This is can find timing bugs and is
 * useful in getting better code coverage numbers.
 */ 
module.exports = (function runServer () {
  process.title = 'mMeddleServer';
  var mm = require('./index');
  var _ = mm.check(mm._);

  var path = mm.check(mm.path);
 
  mm.log.setupAppDebugLog(__filename);
  mm.config = mm.config.appLoad(__filename);
  mm.log.debug('----- Server Configuration -----\n', mm.config);

  function increaseVerbosity(v, total) {
    return total + 1;
  }

  var program = require('commander');
  program
    .version(require('./src/version'))
    .description('a server for mMeddle workspace clients')
    // note --usage is NOT a good idea since it conflicts with commander.
    .option('-a, --app [name]', 'Start a test client app')
    .option('-m, --mock', 'Use mock sockets and in-process apps')
    .option('-v, --verbose', 'Make output more verbose', increaseVerbosity, 0)
    .parse(process.argv);
    
  if (program.use) {
    outputUsage();
    process.exit(0);
  }

  mm.log.debug('Client app:', program.app);
  mm.log.debug('Verbosity:', program.verbose);
  mm.log.debug('Mock:', program.mock);
  
  var mmServer = new mm.server.MMeddleServer(mm.config.baseDir);

  mmServer.setupTerminationHandlers();
  mmServer.initializeServer();
  mmServer.start();
  
  var storageEngine = new mm.storage.StorageEngine();
  if (mm.config.inNode) {
    if (!mm.util.mmEnvOption('NOFS', false)) {
      mm.storage.providers.FileProvider.register(storageEngine);
    }
    if (!mm.util.mmEnvOption('NODB', false)) {
      mm.storage.providers.MongoDBProvider.register(storageEngine);
    }
  }  
//  mm.storage.storageEngine = storageEngine;

  var mockSock = mm.util.ifEnvOption('MOCKSOCK') || program.mock;
  if (mockSock) {
    mm.socketServer.io = new mm.mockSock.Server();
    mm.socketClient.io = new mm.mockSock.Client(mm.socketServer.io);
  }
  
  var socketService = new mm.server.SocketService();
  socketService.initializeService(mmServer, storageEngine);
  socketService.acceptConnections();

  try {
    if (program.app) {
      var cargs = program.app.split(' ');
      var pname = cargs[0];
      cargs.shift();
      if (_.endsWith(pname, '.js')) {
        var inP = mockSock ? ' [In Process]' : '';
        mm.log('- Running' + inP, pname, cargs);
        if (inP) {
          var ppath = mm.path.join(mm.config.baseDir, pname);
          // In process apps do not currently support their own command
          // line arguments, and share the same mm.  Be careful!
          require(ppath);
        }
        else {
          var child = require('child_process').fork(pname, cargs);
        }
        
      }
      else {
        mm.log.error('** Only js modules are supported as apps:', pname);
      }
    }
  }
  catch (e) {
    mm.log.error('Child Process ' + program.app + ' failed', e.stack);
  }
}())
