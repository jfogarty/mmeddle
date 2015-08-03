'use strict';
//
// This registers the permanently available test support features into
// the mMeddle global.
//
module.exports = function(mm) {
  // Hooks for client/server test cases
  mm.test = {};
  mm.test.client = {};
  mm.test.server = {};

  // Fakes up both sides of a Sockets.io connection.
  mm.mockSock = require('./MockSock')(mm);
  
  // Does self registration.
  require('./testClientSupport')(mm);
};
