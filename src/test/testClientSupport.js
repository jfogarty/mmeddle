'use strict';
/**
 * @fileOverview Routines to improve client server testing.
 * @module test/testClientSupport
 * @description
 * mm.test is populated with some 'global' items that make implementing
 * test cases easier.
 * 
 */ 
module.exports = function setupClientTestSupport(mm) {
  var check         = mm.check;
  var _             = check(mm._);          // jshint ignore:line 
  var qq            = check(mm.Q);          // jshint ignore:line 
  var EggTimer      = check(mm.obj.EggTimer);
  var CliConsole    = check(mm.core.CliConsole);
  var ClientSession = check(mm.core.ClientSession);
  var MMeddleClient = check(mm.core.MMeddleClient);
  var CliCommands   = check(mm.core.CliCommands);

  var connectedP = false;
  var connectedTimer;
  var MAX_TEST_TIMEOUT_SEC = 10;
    
  /**
   * @summary **Start an in-process version of the server**
   * @description
   * The mocksock socket.io simulator is used with the express.js server
   * to create an in-process version of the mMeddle server. Since there is
   * no actual network IO problems can often be isolated more easily.
   * This also helps in getting code coverage since both sides of the
   * client/server pair are tested concurrently.
   * @alias module:test/testClientSupport.mockMeddleServer
   */
  function mockMeddleServer() {
    try {
      var appName = 'mockServer';
      mm.log.setupAppDebugLog(appName);
      mm.config = mm.config.appLoad(appName);
      mm.log.debug('----- Server Configuration -----\n', mm.config);
      
      var mmServer = new mm.server.MMeddleServer(mm.config.baseDir);

      mmServer.setupTerminationHandlers();
      mmServer.initializeServer();
      mmServer.start();
      
      var storageEngine = new mm.storage.StorageEngine();
      if (!mm.util.mmEnvOption('NOFS', false)) {
        mm.storage.providers.FileProvider.register(storageEngine);
      }
      if (!mm.util.mmEnvOption('NODB', false)) {
        mm.storage.providers.MongoDBProvider.register(storageEngine);
      }
      
      var socketService = new mm.server.SocketService();
      socketService.initializeService(mmServer, storageEngine);
      socketService.acceptConnections();
      
      mm.test.server.mmServer = mmServer;
      mm.test.server.socketService = socketService;
    }
    catch (e) {
      mm.log.error('- Mock mMeddle Server failure:', e.stack);
    }
  }
  
  /**
   * @summary **Establish a local workspace for test clients**
   * @description
   * This sets up a local workspace for test clients named 'mochatests',
   * and populates mm with the most useful objects to do client testing.
   * This can be used by 'base' tests since it does not require the meddle
   * server.
   * @example:
   *     before(mochaTestWorkspace()); // populates
   *     mm.test.client.mmc      // the current MMeddleClient
   *     mm.test.client.mConsole // the current console (Mock)
   *     mm.test.client.cmds     // the current CliCommands
   * @returns a promise that resolves when connected.
   * @alias module:test/testClientSupport.mochaTestConnect
   */
  function mochaTestWorkspace() {
    try {
      if (mm.test.client.mmc) {
        return;
      }

      var mConsole;
      if (mm.config.inNode) {
        mConsole = new CliConsole();
      }
      else {
        mConsole = new CliConsole('cliInText', 'inTextPrompt', 'consolediv');
      }

      mm.mConsole = mConsole;
      mm.test.client.mConsole = mConsole;
      mm.log.setCliConsole(mConsole);
      mm.log.debug('----- MochaTests Configuration -----\n', mm.config);
      
      var clientName = 'MochaTests';
      var cs = new ClientSession(clientName);

      var host = mm.config.startLocal ? mm.config.localUrl : mm.config.remoteUrl;
      var mmc = new MMeddleClient(host, cs);
      mm.test.client.cs = cs;
      mm.test.client.mmc = mmc;

      var cliCmds = new CliCommands(mConsole, cs);
      mm.test.client.cmds = cliCmds;
      cs.bindClient(mmc);
      cs.loadLocalWorkspace();
      cs.loadLocalUser();
    }
    catch (e) {
        mm.log.error('Test Client Setup failed.', e.stack);
    }
  }

  /**
   * @summary **Connects to a mMeddle server as a mochatests client**
   * @description
   * This routine connects to a mMeddle server as a client named 'mochatests',
   * and populates mm with the most useful objects to do client testing.
   * Note that once connected, this will only attempt to reconnect if the
   * connection is lost.
   * @example:
   *     mm.test.client.cs       // the current ClientSession
   *     mm.test.client.mmc      // the current MMeddleClient
   *     mm.test.client.mConsole // the current console (Mock)
   *     mm.test.client.cmds     // the current CliCommands
   * @returns a promise that resolves when connected.
   * @alias module:test/testClientSupport.mochaTestConnect
   */
  function mochaTestConnect() {
    try {
      mochaTestWorkspace();

      // Once the connection has succeeded or failed, we never need to
      // look at it again.
      if (connectedP) {
        connectedTimer.reset(); // Live for a bit longer.
        return connectedP; // All is well or terrible.
      }

      connectedTimer = new EggTimer(MAX_TEST_TIMEOUT_SEC * 1000);
      connectedTimer.onDing(function () {
        if (mm.config.inNode) {
          mm.log('----- Shutdown server connection for tests.');      
          mm.test.client.mConsole.close();
          //process.exit();
        }
      });
      
      mm.log('- Connect to the test Server');
      mm.test.debugon = true;
      
      var mockSock = mm.util.ifEnvOption('MOCKSOCK') || mm.config.mocksock;
      if (mockSock) {
        mm.socketServer.io = new mm.mockSock.Server();
        mm.socketClient.io = new mm.mockSock.Client(mm.socketServer.io);
        mockMeddleServer();
      }
      
      // Do the actual connection.
      connectedP = mm.test.client.mmc.connectWorkspace('local')
      .then(function() {
        mm.log('- Connected to server {0}', mm.test.client.mmc.host);
        mm.test.client.cs.emitLogMessage(
            mm.test.client.cs.appName + ' connected!');
      });
      
      return connectedP;
    }
    catch (e) {
        mm.log.error('Test Client Setup failed.', e.stack);
    }
  }

  mm.test.mochaTestWorkspace = mochaTestWorkspace;
  mm.test.mochaTestConnect = mochaTestConnect;
}

