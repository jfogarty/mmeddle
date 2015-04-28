'use strict';
if (typeof exports === 'object' && typeof module === 'object') {
  var Should = require('should');
  var mmeddle = require('../mmeddle');
}

var mm = mmeddle;
var _ = mm._; // jshint ignore:line 
var log = mm.log, // jshint ignore:line 
    debug = mm.log.debug,
    users = mm.users,
    User = users.User;
    
//debug.enabled = false;

var SAL_TIMEOUT = 10000; // Allow 10 seconds for the SAL operations.

describe('users', function(){
  this.timeout(SAL_TIMEOUT);

  it('should exist in the Services Abstraction Layer', function(){
    mm.should.have.property('users');
  })

  var uName1 = 'fake-user1';
  var uName2 = 'fake-user2';
  var user = new User(uName1);
  var user2 = new User(uName2);
  it('should allow creation of multiple new users', function(){
    user.name.should.equal(uName1);
    user2.name.should.not.equal(user.name);
  })
  
  var pwd = 'fakePassword';
  var badpwd = 'badPassword';
  it('should create new passwords that are PBKDF2 encoded', function(done) {
    user.create(pwd)
    .then(function passwordCreated() {
      user.getPassword().should.not.equal(pwd);
      debug('+++++++ ' + user.creationDate);
      debug('++++++x ' + user.getPassword());
      Should(true).ok; // jshint ignore:line 
      done();
    }, function passwordCreationFailed(e) {
      debug('**** WHOOP WHOOP ****: ', e, e.stack );
      Should(false).ok; // jshint ignore:line 
      done();
    })
  })

  it('should allow creation of users without passwords', function(done) {
    var opNum = 1;
    user2.create()
    .then(function passwordFreeCreate() {
      user2.name.should.equal(uName2);
      debug('xx+++++ ' + user2.creationDate);
      Should(true).ok; // jshint ignore:line 
      opNum++;
    })

    user2.next(function checkSequence() {
      opNum.should.equal(2);
      done();
    })
  })
  
  it('should allow the user to be saved', function(done) {
    user.save().then(function loadedUser() { done(); })
  })  
  
  it('should allow the user to be saved twice', function(done) {
    user.save().then(function loadedUser() { done(); })
  })  

  it('should fail to save a user with a bogus password', function(done) {
    var userBad = new User(uName1);
    userBad.setPassword('1234');
    userBad.save().then(null, function failToLoadedUser() {
      user.clearFailure();    
      done(); 
    })
  })  
  

  it('should allow login when the password matches', function(done) {
    user.login(pwd)
    .then(function passwordMatched() {
      debug('+++++++ ' + user.creationDate);
      debug('++++++x ' + user.getPassword());
      Should(true).ok; // jshint ignore:line 
      done();
    }, function passwordCheckFailed(e) {
      debug('**** WHOOP WHOOP ****: ', e.stack );
      Should(false).ok; // jshint ignore:line 
      done();
    })
  })

  it('should not allow login when the password differs', function(done) {
    user.lock(); // Clear the password function.
    user.login(badpwd)
    .then(function passwordMatched() {
      debug('+++++++ ' + user.creationDate);
      debug('++++++x ' + user.getPassword());
      user.getPassword().should.equal(pwd);
      Should(false).ok; // jshint ignore:line 
      done();
    }, function passwordCheckFailed(e) {
      debug('**** EXPECTED: ', e );
      user.getPassword().should.equal('');
      Should(true).ok; // jshint ignore:line 
      done();
    })
  })

  it('should allow the user to be deleted', function(done) {
    try {
    user.clearFailure();
    user.remove()
    .then(function deletedUser() { done(); });
    } catch(e) { log('??? HOW COULD I GET HERE ???', e.stack) }
  })

  it('should fail to load a non-existant user', function(done) {
    var user3 = new User('noone you know');
    try {
      user3.load()
      .then(function() {
        log('Loaded non-existent user?');
        Should(false).ok; // jshint ignore:line 
        done();
      },
      function() {
        log('Correctly failed to load non-existent user?');
        Should(true).ok; // jshint ignore:line 
        done();
      });
    } catch(e) { log('??? HOW COULD I GET HERE ???', e.stack) }
  })
  
  describe('creating multiple users', function() {
    var tests = [
      {user: 'alice',   password: 'glurg'},
      {user: 'bob',     password: 'abc'},
      {user: 'charles', password: 'def'}
    ];

    tests.forEach(function(test) {
      it('correctly creates, and saves:"' + test.user + '"', function(done) {
        var u = new User(test.user);
        u.create(test.password);
        u.save().then(function () { done(); })
      })
    })

    tests.forEach(function(test) {
      it('correctly logs in and then deletes:"' + test.user + '"', function(done) {
        var v = new User(test.user);
        v.load();
        v.login(test.password);
//      v.remove();
        v.next(function allWentWell() {
          Should(true).ok; // jshint ignore:line 
          done(); },
        function failedMiserably(e) {
          log('*** failedMiserably', e.stack);
          Should(false).ok; // jshint ignore:line 
          done(); }          
        )
      })
    })
  })
})
