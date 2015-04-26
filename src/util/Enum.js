'use strict';
module.exports = function registerSimpleEnum() {
  // The world's simples Enum mechanism.
  function Enum(values) {
    var self = this;
    values.split('|').forEach(function(arg) { self[arg] = arg });
  }

  return Enum;
}