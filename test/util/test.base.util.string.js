'use strict';
if (typeof exports === 'object' && typeof module === 'object') {
  var Should = require('should'); // jshint ignore:line 
  var mmeddle = require('../mmeddle');
}

(function (mm) {
  describe('util String functions', function(){
    var x;
    describe('#trimPrefix', function(){
      it('should remove prefixes', function() {
        x = mm.util.trimPrefix('Very stupid', 'Very');
        x.should.eql(' stupid');
        x = mm.util.trimPrefix('Not Very stupid', 'Very');
        x.should.eql('Not Very stupid');
      })
    })
    
    describe('#removeWhitespace', function(){
      it('should convert whitespace into single spaces', function() {
        x = mm.util.removeWhitespace('  this   has   spaces   ');
        x.should.eql(' this has spaces ');
        x.trim().should.eql('this has spaces');
        x = mm.util.removeWhitespace('this has no extra spaces');
        x.should.eql('this has no extra spaces');
      })
    })
    
    describe('#zeroFilled', function(){
      it('should zero fill in front of a value', function() {
        x = mm.util.zeroFilled(7, 3);
        x.should.eql('007');
        x = mm.util.zeroFilled(-7, 3);
        x.should.eql('-07');
        x = mm.util.zeroFilled(123456.89, 9);
        x.should.eql('000123456');
        x = mm.util.zeroFilled(123456, 3);
        x.should.eql('456');
        x = mm.util.zeroFilled(-123456, 1);
        x.should.eql('6');
      })
    })
    
    describe('#wildMatch', function(){
      it('should match any set of chars to *', function() {
        mm.util.wildMatch('OddStuff.glorm', '*glorm').should.be.true; // jshint ignore:line 
     // mm.util.wildMatch('OddStuff.Gl*rM', '*gl?rm').should.be.false; // jshint ignore:line 
      })
      it('should be case insensitive', function() {
        mm.util.wildMatch('OddStuff.GlorM', '*glorm').should.be.true; // jshint ignore:line 
      })
      it('should not match all the time', function() {      
        mm.util.wildMatch('OddStuff.glorm', '*glor').should.be.false; // jshint ignore:line 
        mm.util.wildMatch('OddStuff.Gl*rM', '*glorm').should.be.false; // jshint ignore:line 
      })
    })
    
    describe('#ENOENT', function(){
      it('should match errors', function() {
        mm.util.ENOENT(new Error('This has ENOENT, in it')).should.be.true; // jshint ignore:line 
        mm.util.ENOENT(new Error('ENOENT, is an error')).should.be.true; // jshint ignore:line 
        mm.util.ENOENT('ENOENT, is an error').should.be.true; // jshint ignore:line 
        var e = new Error('This is an E N O E N T error')
        e.code = 'ENOENT';
        mm.util.ENOENT(e).should.be.true; // jshint ignore:line 
      })
    })
  })
}(mmeddle));  
