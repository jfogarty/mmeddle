'use strict';
if (typeof exports === 'object' && typeof module === 'object') {
  var mmeddle = require('../src/mmeddle'); // In browser support
}

var mm = mmeddle;
var _ = mm._; // jshint ignore:line 

beforeEach(function(){
  // This executes before EVERY test in every test suite.
})

describe('mmeddle', function(){
  describe('ws', function(){
    it('should be empty when first initialized', function(){
      mm.should.have.property('ws');
    })
  })
})