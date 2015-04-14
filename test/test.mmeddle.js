if (typeof exports === 'object' && typeof module === 'object') {
  var mmeddle = require('../src/mmeddle');
}

describe('mmeddle', function(){
  describe('ws', function(){
    it('should be empty when first initialized', function(){
      mmeddle.should.have.property('ws');
    })
  })

  describe('users', function(){
    it('should be empty when first initialized', function(){
      mmeddle.should.have.property('users');
    })
  })

  describe('storage', function(){
    it('should be empty when first initialized', function(){
      mmeddle.should.have.property('storage');
    })
  })
})