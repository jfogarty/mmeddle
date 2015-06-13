'use strict';
//
// Register Most utils register their dependency routines directly into the global
// environment object rather than returning an object themselves.  This
// seems to be a bit more flexible, but I'm not sure that I'm in love with
// the style. As always, I reserve the right to change my mind later.
//
module.exports = function(mm) {
  // Hooks for client/server test cases
  mm.test = {};
  mm.test.client = {};
  mm.test.server = {};

  require('./testClientSupport')(mm);
};
