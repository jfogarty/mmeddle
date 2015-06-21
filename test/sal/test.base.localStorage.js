'use strict';
if (typeof exports === 'object' && typeof module === 'object') {
  var Should = require('should'); // jshint ignore:line 
  var mmeddle = require('../mmeddle'); // In browser support
}

(function (mm) {
  describe('localStorage', function(){
    var ls = new mm.storage.LocalStorage();
    var exampleContent1 = { name: 'thing', fld: 'a test object' };
    var exampleContent2 = { name: 'thing2', fld: 'another test object' };
    var exampleContent3 = { name: 'thing3', fld: 'yet another test object' };
    var exampleName1 = 'thing';
    describe('#store', function(){
      it('should create a thing in storage', function(){
        ls.store(exampleName1, exampleContent1);
      })
    })

    describe('#load', function(){
      it('should read a thing eql to what was stored', function(){
        var loadedContent = ls.load(exampleName1);
        loadedContent.should.eql(exampleContent1);
      })
    })

    describe('#remove', function(){
      it('should remove the thing that was stored', function(){
        ls.remove(exampleName1);
        var deletedContent = ls.load(exampleName1);
        Should.not.exist(deletedContent);
      })
    })

    describe('#clear', function(){
      it('should do nothing odd on a empty localStorage area', function(){
        ls.clear();
      })
      it('should clear an occupied storage area', function(){
        ls.store(exampleContent1.name, exampleContent1);
        ls.store(exampleContent2.name, exampleContent2);
        ls.store(exampleContent3.name, exampleContent3);
        var loadedContent = ls.load(exampleContent2.name);
        loadedContent.should.eql(exampleContent2);
        ls.clear();
        var deletedContent = ls.load(exampleContent1.name);
        Should.not.exist(deletedContent);
        deletedContent = ls.load(exampleContent2.name);
        Should.not.exist(deletedContent);
        deletedContent = ls.load(exampleContent3.name);
        Should.not.exist(deletedContent);
      })
    })

  })
  
}(mmeddle));
  