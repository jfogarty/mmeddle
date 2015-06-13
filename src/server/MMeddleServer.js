'use strict';
/**
 * @fileOverview MMeddleServer
 * @module server/MMeddleServer
 */ 
 module.exports = function(mm) {

  //--------------------------------------------------------------------------
  /**
   * @summary **Express Server for mMeddle applications**
   * @description
   * A service to handle mMeddle clients.
   * @constructor
   * @returns {MMeddleServer} the new server.
   */  
  var MMeddleServer = (function serverCtorCreator() {
    var express = require('express');
    var serveStatic = require('serve-static');
  
    var ctor = function MMeddleServer(dirName) {
      var self = this;    
      self.dirName = dirName;
      mm.log.debug('- mMeddleServer dirName: [{0}]', dirName);
      var defaultPort = mm.util.mmEnvOption('PORT', 8080); 
      var defaultIpAddr = mm.util.mmEnvOption('IPADDR', '127.0.0.1'); 
      self.ipaddress = mm.util.envOption('OPENSHIFT_NODEJS_IP', defaultIpAddr);
      self.port      = mm.util.envOption('OPENSHIFT_NODEJS_PORT', defaultPort);
      if (mm.config.openShift) {
        mm.log('- Running on OPENSHIFT_NODEJS');
      }
      
      mm.log('- Starting server on {0}:{1}', self.ipaddress, self.port);

      /**
       * @summary **the actual termination handler**
       * @description
       * Terminate server on receipt of the specified signal.
       * @param {string} sig  Signal to terminate on.       
       */  
      self.terminator = function (sig) {
        if (typeof sig === 'string') {
          mm.log.debug('{0}: Received {1} - terminating mMeddle server ...',
            Date(Date.now()), sig);
          process.exit(1);
        }
        mm.log('{0}: mMeddle server stopped.', Date(Date.now()));
      };

      /**
       * @summary **setup process termination handlers**
       * @description
       * Handle wrap up on ctrl-c exit from the process.
       */  
      self.setupTerminationHandlers = function () {
        //  Process on exit and signals.
        process.on('exit', function () {
          mm.log.debug('- server process exit');
          self.terminator();
        });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
          'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function (element, index, array) {
          process.on(element, function () {
            self.terminator(element);
          });
        });
      };

      // ================================================================
      //                     mMeddle server functions
      // ================================================================

      /**
       * @summary **create routes for page access**
       * @description
       * Create the routing table entries + handlers for the application.
       */  
      self.createRoutes = function () {
        self.routes = {};

        // Serve the starting index page.
        self.routes['/'] = function (req, res) {
          res.setHeader('Content-Type', 'text/html');
          res.send(mm.fs.readFileSync('./index.html'));
        };
      };

      /**
       * @summary **initialize the server**
       * @description
       * Initialize the (express) server, create the routes and register
       * the handlers.
       */  
      self.initializeServer = function () {
        self.createRoutes();
        // self.app = express.createServer(); // deprecated (pre 4.0)
        self.app = express();
      
        //  Add handlers for the app (from the routes).
        for (var r in self.routes) {
          //self.app.get(r, redirectSec, self.routes[r]);
          self.app.get(r, self.routes[r]);
        }

        var cacheControl = {
          maxAge: '1d',
          setHeaders: setCustomCacheControl
        };
        
        var publicDirs = ['lib', 'dist', 'test', 'api', 'css', 'images'];
        publicDirs.forEach(function serveStaticDir(dir) {
          self.app.use('/' + dir,
              serveStatic(self.dirName + '/' + dir,  cacheControl));
        });

        function setCustomCacheControl(res, path) {
          mm.log.debug('- static fetch: [' + path + ']');
          if (serveStatic.mime.lookup(path) === 'text/html') {
            // Custom Cache-Control for HTML files
            res.setHeader('Cache-Control', 'public, max-age=0')
          }
        }
      };

      /**
       * @summary **start serving html and other web content**
       */  
      self.start = function () {
        //self.server = require('http').Server(self.app); // pre 4.0 express.
        self.server = self.app.listen(self.port, self.ipaddress, function (e) {
          mm.log('{0}: mMeddle server started on {1}:{2} ...',
              mm.util.timestamp(new Date(Date.now())), self.ipaddress, self.port);
        });
      };
    }

    return ctor;
  }());
  
  return MMeddleServer;
}
