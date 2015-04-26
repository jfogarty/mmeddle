'use strict';
//
// Most utils register their dependency routines directly into the global
// environment object rather than returning an object themselves.  This
// seems to be a bit more flexible, but I'm not sure that I'm in love with
// the style. As always, I reserve the right to change my mind later.
//
module.exports = function(mm) {
  mm.util = require('util');
  mm.obj = {};
  mm.obj.SequencedObject = require('./Settings')(mm);  

  require('./uIntArray')(mm.util);
  mm.obj.Enum = require('./Enum')();
  mm.Logger = require('./Logger')(mm);
  
  mm.log = require('./log')(mm);


  mm.obj.CoreObject = function CoreObject() {
    // core object prototype functions here.
  };

  mm.obj.SequencedObject = require('./SequencedObject')(mm);  
};
