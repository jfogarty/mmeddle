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
  var _             = check(mm._);
  var qq            = check(mm.Q);
  var EggTimer      = check(mm.obj.EggTimer);
  var ClientSession = check(mm.core.ClientSession);
  var MMeddleClient = check(mm.core.MMeddleClient);
  var CliCommands   = check(mm.core.CliCommands);

  var connectedP = false;
  var connectedTimer;
  var MAX_TEST_TIMEOUT_SEC = 10;
    
  //------------------------------------------------------------------------
  // A very simple mConsole compatible console for use by test routines
  function MockConsole() {
    var self = this;
    self.outputLines = [];
    self.inputLines = [];
    self.lastLine = '';
    self.closeHandler = null;

    self.handlers = []; // The stack of input handlers;
    self.handler = {
      func: null,     // caller must supply one.
      prompt: 'Cmd:',
      pwdMode: false  // show * during input.
    };

    self.writeLine = function writeLine(text) {
      console.log(text);
      self.outputLines.push(text);
    }

    self.setLineHandler = 
    function setLineHandler(handler, prompt, passwordMode) {
      // Use the previous prompt if one is not supplied.
      if (!prompt) prompt = self.handler.prompt;
      self.handlers.push(self.handler);
      self.handler = {
        func: handler,
        prompt: prompt,
        pwdMode: passwordMode
      };
    }
    
    self.clearScreen = function clearScreen() {
    }

    self.onClose = function onClose(func) {
      self.closeHandler = func;
    }
    
    self.close = function close() {
      if (self.closeHandler) self.closeHandler();
    }
    
    self.setCompleter = function setCompleter(func) {
    }
    
    // Returns all lines produced by execution of the routines.
    // The current line set is cleared.
    self.getOutputLines = function getOutputLines() {
      var lines = self.outputLines;
      self.outputLines = [];
      return lines;
    }

    // Supplies lines to the 'console' and waits for them to be consumed.
    self.setInputLines = function setInputLines(lines) {
      self.outputLines = [];
      lines.forEach(self.enter);
    }

    self.ask = function ask (query, obj, field, isPwd) {
      if (obj && obj.field) {
        return qq(obj);
      }
      var qD = qq.defer();
      self.setLineHandler(function(answer) {
        if (answer) {
          if (obj) {
            obj[field] = answer;
            qD.resolve(obj);
          }
          else {
            qD.resolve(answer);
          }
        }
        else {
          qD.reject(new Error('Blank line not allowed. Entry abandoned'));
        }
        return false; // Only ask once.
      }, query, isPwd === true ? true : false);
      return qD.promise;
    }

    // Handles Enter for single line entries.
    self.enter = function enter(textLine) {
      self.lastLine = textLine;
      while (self.handler.func) {
        // Execute the current command line handler.
        var response = self.handler.func(self.lastLine);
        // This handler no longer wants to do the job.
        if (response === false) {
          self.handler = self.handlers.pop();
          return; // All done.
        }
        else if (response === true) {
          return; // All is well, all done.
        }
        else if (_.isString(response)) {
          // Allow the handler to act as a translator for the input.
          self.handler = self.handlers.pop();
          self.lastLine = response;
        }
        else {
          throw new Error('Invalid line handler response');
        }
      }
    }
  } //MockConsole
  
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
      var path = mm.check(mm.path);
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
          mConsole.close();
          process.exit();
        }
      });
      
      mm.log('- Connect to the test Server');
      mm.test.filename = 'mochatests';
      mm.test.debugon = true;
      var mConsole = new MockConsole();
      mm.test.client.mConsole = mConsole;
      mm.log.setCliConsole(mConsole);
      mm.log.setupAppDebugLog(mm.test.filename);
      mm.config = mm.config.appLoad(mm.test.filename);
      mm.log.debug('----- MochaTests Configuration -----\n', mm.config);
      var host = mm.config.localUrl;
      
      var mockSock = mm.util.ifEnvOption('MOCKSOCK') || mm.config.mocksock;
      if (mockSock) {
        mm.socketServer.io = new mm.mockSock.Server();
        mm.socketClient.io = new mm.mockSock.Client(mm.socketServer.io);
        mockMeddleServer();
      }

      var cs = new ClientSession('MochaTests:');
      var mmc = new MMeddleClient(host, cs);
      mm.test.client.cs = cs;
      mm.test.client.mmc = mmc;
      var cliCmds = new CliCommands(mConsole, cs);
      mm.test.client.cmds = cliCmds;
      cs.bindClient(mmc);
      cs.loadLocalWorkspace();
      cs.loadLocalUser();
      
      if (cs.user.lastName) {
        mm.log('- Hello {0} {1}.', cs.user.firstName, cs.user.lastName);    
      }
      
      // Do the actual connection.
      connectedP = mmc.connectWorkspace('local')
      .then(function() {
        mm.log('- Connected to server {0}', host);
        cs.emitLogMessage(mm.test.filename + ' connected!');
      });
      
      return connectedP;
    }
    catch (e) {
        mm.log.error('Test Client Setup failed.', e.stack);
    }
  }

  mm.test.mochaTestConnect = mochaTestConnect;
}

