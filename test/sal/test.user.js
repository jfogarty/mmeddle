'use strict';
if (typeof exports === 'object' && typeof module === 'object') {
  var Should = require('should');
  var mmeddle = require('../mmeddle');
}

var SAL_TIMEOUT = 10000; // Allow 10 seconds for the SAL operations.
var mm = mmeddle;

beforeEach(function (){
  this.timeout(SAL_TIMEOUT);  
  return mm.test.mochaTestConnect();
});

describe('localuser', function(){
  this.timeout(SAL_TIMEOUT);

  it('should allow loading of the local user', function(done) {
    var cs = mm.test.client.cs;
    cs.loadLocalUser(mm.test.client.mConsole);
    done();
  })
  
  it('should allow saving of the local user', function(done) {
    var cs = mm.test.client.cs;  
    cs.saveLocalUser(mm.test.client.mConsole);
    done();
  })
})
