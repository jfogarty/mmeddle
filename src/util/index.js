'use strict';
//
// Most utils register their dependency routines directly into the global
// environment object rather than returning an object themselves.  This
// seems to be a bit more flexible, but I'm not sure that I'm in love with
// the style. As always, I reserve the right to change my mind later.
//
module.exports = function(mm) {
  mm.util = require('util'); // Node.js utilities, extended.
  require('./utilString')(mm.util, mm);
  require('./utilIntArray')(mm.util);
  require('./utilEnv')(mm.util, mm);
  require('./utilDateTime')(mm.util, mm);
  require('./utilJSON')(mm.util, mm);
  
  mm.obj = {};
  mm.obj.Config = require('./Config')(mm);
  //mm.obj.Settings = require('./Settings')(mm);  
  mm.obj.EggTimer = require('./EggTimer')(mm);  
  mm.obj.Enum = require('./Enum')();
  
  mm.Logger = require('./Logger')(mm);
  mm.log = require('./log')(mm);
  
  mm.format = mm.Logger.format;

  /* istanbul ignore next */ // Tested independently
  mm.obj.CoreObject = function CoreObject() {
    // core object prototype functions here.
  };

};
