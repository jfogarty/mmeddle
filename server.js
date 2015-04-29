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
  var mm = require('./src/mmeddle');

  var self = this;

  /**
   *  Set up server IP address and port # using env variables/defaults.
   */
  self.setupVariables = function () {
    //  Set the environment variables we need.
    var defaultPort = 8080;
    //defaultPort = 80;
    
    self.openShift = true;
    self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
    self.port      = process.env.OPENSHIFT_NODEJS_PORT || defaultPort;

    if (typeof self.ipaddress === "undefined") {
      self.openShift = false;
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

/*    
    self.routes['/css/main.css'] = function (req, res) {
      // Serve mMeddle developers API
      res.setHeader('Content-Type', 'text/css');
      res.send(fs.readFileSync('./css/main.css'));
    };
*/    
  };

  /* Not useful until https support is ready.
    function redirectSec(req, res, next) {
      if (req.headers['x-forwarded-proto'] === 'http') { 
          res.redirect('https://' + req.headers.host + req.path);
      } else {
          return next();
      }
    }
  */
  
  /**
   *  Initialize the (express) server, create the routes and register
   *  the handlers.
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
          serveStatic(__dirname + '/' + dir,  cacheControl));
    });

    function setCustomCacheControl(res, path) {
      mm.log.info('- static fetch: [' + path + ']');
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
    //self.server = require('http').Server(self.app); // pre 4.0 express.
    self.server = self.app.listen(self.port, self.ipaddress, function () {
      console.log('%s: mMeddle server started on %s:%d ...',
      Date(Date.now()), self.ipaddress, self.port);
    });

    // Socket.io setup.    
    var socketio = require('socket.io');
    var socketio9 = socketio.version.indexOf('0.9.') === 0;
    self.socketio9 = socketio9;
    console.log('- socket.io: version = ' + socketio.version);
    if (socketio9) {
      var io = socketio.listen(self.server); // old form 0.9.16
      self.io = io;
      io.configure(function(){
        console.log('- socket.io: set default config');
        console.log('- socket.io: origins = "*.*"');
        //0 - error, 1 - warn, 2 - info, 3 - debug  
        io.set('log level', 2);
        io.set('origins', '*:*');
        console.log('- socket.io: transports = ["websocket"]');
        io.set("transports", ['websocket']);
        console.log('- socket.io: configured for development');
      });

  /*    
      io.configure('production', function(){
          console.log('- socket.io:  set config for production');
          io.enable('browser client minification');  // send minified client
          io.enable('browser client etag');          // apply etag caching logic based on version number
          io.enable('browser client gzip');          // gzip the file
          io.set('log level', 1);                    // reduce logging
          io.set('transports', [                     // enable all transports (optional if you want flashsocket)
              'websocket'
            , 'flashsocket'
            , 'htmlfile'
            , 'xhr-polling'
            , 'jsonp-polling'
          ]);
          console.log('- socket.io:  configured for production');
          // $ NODE_ENV=production node app.js
        });    
  */
      console.log('- Socket.io initialized.');
    }
    else {
      console.log('- *** Sorry, this version of Socket.io is not supported yet.');
      // version 1.3.5 setup.
      
      //  Logging based on `debug`. 
      // Set environment variable DEBUG to *. ie: DEBUG=* node index.js
      //  for only socket.io related logging: DEBUG=socket.io:* node index.js.
      //  logging only from socket object: DEBUG=socket.io:socket node index.js.
      // Debug also works in the browser; logs are persisted to localstorage.
      // To use: open the developer console and type
      //      localStorage.debug = 'socket.io:*' (or any debug level) 
      // and then refresh the page. 
      
      //var io = socketio(self.server, {
      //  serveClient: ????, // sets the value for Server#serveClient()
      //  path: ????,  // sets the value for Server#path()
      //  httpCompression: false,
      //  transports, ['websocket']
      //  // see engine.io options for more.
      //}); 
    }
  };
  
  /**
   *  Start accepting sockets.io from clients.
   */
  self.acceptSockets = function () {
    if (typeof self.io === 'undefined') {
      console.log('- *** sockets.io is not enabled.');
      return;
    }

    self.io.on('connection', function (socket) {
      var id = socket.id;
      
      function log(text) {
        console.log('[' + id + ']' + text);
      }
      
      log('-----whoo hoo! Connected to ' + id);
      socket.emit('news', { 
          id: id,
          hello: 'world - mMeddle with this!',
          from: mm.envText,
          at: Date(Date.now())
      });
      
      log('-----and now????');
      socket.on('my other event', function (data) {
        log(mm.util.inspect(data));
        log('-----Whoa baby!');
      });

      socket.on('request-env', function (data) {
        var reply = process.env;
        if (self.openShift) {
          reply = {
            id: id,
            text: '* Environment variables are not available from this server *'
          }
        }
        socket.emit('env', reply);
        log('-----Posted environment');
      });
      
      socket.on('disconnect', function () {
        log('***** Recieved disconnect *****');
      });      
    });
  }
};

/**
 *  main():  Main code.
 */
var mmServer = new MMeddleServer();

console.log('-   dirname: [%s]', __dirname);

mmServer.initialize();
mmServer.start();
mmServer.acceptSockets();