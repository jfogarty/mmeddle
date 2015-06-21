'use strict';
if (typeof exports === 'object' && typeof module === 'object') {
  var Should = require('should'); // jshint ignore:line 
  var mmeddle = require('../mmeddle'); // In browser support
}
  var mm = mmeddle;
   
  describe('ClientUser', function(){
    var cu1 = new mm.users.ClientUser('client1');
    var cu2 = new mm.users.ClientUser('client2');
    
    describe('#init', function(){
      var iobj = { firstName: 'bob',
                   lastName: 'client', 
                   email: 'client#clientopia.com' };
      it('should populate the user', function(){
        cu1.init(iobj);
        cu1.should.containEql(iobj);
      })
    })
    
    describe('#isAnonymous', function(){
      var cu3 = new mm.users.ClientUser();
      it('should be true on a new empty user', function(){
        cu3.isAnonymous().should.be.true; // jshint ignore:line 
      })
      it('should be false on an initialized user', function(){
        cu1.isAnonymous().should.be.false; // jshint ignore:line 
      })
      it('should be true on an uninitialized user', function(){
        cu2.isAnonymous().should.be.true; // jshint ignore:line 
      })
    })
    
    describe('#hashP', function(){
      // This test looks for changes in the hash function that will
      // invalidate existsing passwords.
      var expectPdk = 'e71cfbacd95bf137f3e9831192ad27cd';
      var salt = '323031352d30362d31365430323a33323a30322e3537385a';
      var ispdk = true;
      cu1.pbkdf2Salt = salt;
      it('should hash a plain text password with the expected function', function(){
        cu1.hashP('xyzzy');
        cu1.pdk.should.eql(expectPdk);
      })
      it('should accept a hash from an external source', function(){      
        cu2.hashP(expectPdk, ispdk);
        cu2.pdk.should.eql(expectPdk);
      })
    })
    
    describe('#hashPdk', function(){
      var expectedHpdk = '0ef61a578821bb05cddee13697cffd2f' +
                     'cf7a9a7739e6ef9c9c29e77cca7b313e';      
      it('should hash the PDK with the expected function', function(){
        cu2.hashPdk('salt');
        cu2.hpdk.should.eql(expectedHpdk);
      })
    })
    
    describe('#init(obj, sanitize)', function(){
      var sanitize = true;
      it('should clear the sensitive data from the user', function(){
        cu2.init(cu1, sanitize);
        cu2.should.have.property('name', 'client1');
        cu2.should.not.have.property('pbkdf2Salt');
        cu2.should.not.have.property('pdk');
        cu2.should.not.have.property('hpdk');
        cu2.should.not.have.property('owner');
      })
    })
  })