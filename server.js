'use strict';
//# !/bin/envnode
/**
 * @fileOverview mMeddle Express based, OpenShift test server.
 * @module server
 */ 

/**
 *  Define the simple mMeddle Express server.
 */
var MMeddleServer = function () {
  // mMeddle OpenShift Express Server
  var express = require('express');
  var serveStatic = require('serve-static');
  var fs = require('fs');

  var self = this;

  /**
   *  Set up server IP address and port # using env variables/defaults.
   */
  self.setupVariables = function () {
    //  Set the environment variables we need.
    self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
    self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

    if (typeof self.ipaddress === "undefined") {
      //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
      //  allows us to run/test the app locally.
      console.log('- No OPENSHIFT_NODEJS_IP var, using 127.0.0.1 for local access');
      self.ipaddress = "127.0.0.1";
    };
    
    console.log('- Starting server on %s:%d', self.ipaddress, self.port);
  };

  /**
   *  terminator === the termination handler
   *  Terminate server on receipt of the specified signal.
   *  @param {string} sig  Signal to terminate on.
   */
  self.terminator = function (sig) {
    if (typeof sig === "string") {
      console.log('%s: Received %s - terminating mMeddle server ...',
        Date(Date.now()), sig);
      process.exit(1);
    }
    console.log('%s: mMeddle server stopped.', Date(Date.now()));
  };

  /**
   *  Setup termination handlers (for exit and a list of signals).
   */
  self.setupTerminationHandlers = function () {
    //  Process on exit and signals.
    process.on('exit', function () {
      console.log('- process exit');
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
   *  Create the routing table entries + handlers for the application.
   */
  self.createRoutes = function () {
    self.routes = {};

    self.routes['/asciimo'] = function (req, res) {
      var link = "http://i.imgur.com/kmbjB.png";
      res.send("<html><body><img src='" + link + "'></body></html>");
    };

    // Serve the starting index page.
    self.routes['/'] = function (req, res) {
      res.setHeader('Content-Type', 'text/html');
      res.send(fs.readFileSync('./index.html'));
    };
    
    self.routes['/css/main.css'] = function (req, res) {
      // Serve mMeddle developers API
      res.setHeader('Content-Type', 'text/css');
      res.send(fs.readFileSync('./css/main.css'));
    };
  };

  /**
   *  Initialize the (express) server, create the routes and register
   *  the handlers.
   */
  self.initializeServer = function () {
    self.createRoutes();
    // self.app = express.createServer(); // deprecated.
    self.app = express();

    //  Add handlers for the app (from the routes).
    for (var r in self.routes) {
      self.app.get(r, self.routes[r]);
    }

    self.app.use(serveStatic(__dirname, {
      maxAge: '1d',
      setHeaders: setCustomCacheControl
    }));

    function setCustomCacheControl(res, path) {
      console.log('--------- [' + path + ']');
      if (serveStatic.mime.lookup(path) === 'text/html') {
        // Custom Cache-Control for HTML files
        res.setHeader('Cache-Control', 'public, max-age=0')
      }
    }    
  };

  self.initialize = function () {
    self.setupVariables();
    self.setupTerminationHandlers();
    self.initializeServer();
  };

  /**
   *  Start the server
   */
  self.start = function () {
    //  Start the app on the specific interface (and port).
    self.app.listen(self.port, self.ipaddress, function () {
      console.log('%s: mMeddle server started on %s:%d ...',
        Date(Date.now()), self.ipaddress, self.port);
    });
  };

};

/**
 *  main():  Main code.
 */
var mmServer = new MMeddleServer();

console.log('-   dirname: [%s]', __dirname);

mmServer.initialize();
mmServer.start();