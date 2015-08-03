'use strict';
if (typeof exports === 'object' && typeof module === 'object') {
  var Should = require('should'); // jshint ignore:line 
  var mmeddle = require('../mmeddle'); // In browser support
}

// Note that this is a 'base' test case only on Node.js since when it
// runs on a browser, a mochaTestUser login to a mMeddle server is
// required.

(function (mm) {
  var _ = mm._; // jshint ignore:line 
  var qq = mm.Q;
  
  var SAL_TIMEOUT = 10000; // Allow 10 seconds for the SAL operations.
  var testCollection = 'testp';
    
  var storageEngine;
  var storageClientList = [];
  var cs;
  var clientCount;
  
  var tuser = { 
    name: 'mochaTestUser',
    ptpwd: 'xyzzy',
    firstName: 'sir',
    lastName: 'TestUser',
    email: 'notreally@a.value.email.com'
  };

  function initStorageClients() {
    if (storageEngine) return qq(storageClientList);
    mm.log.debug('Create and initialize the storage engine');
    storageEngine = new mm.storage.StorageEngine();
    mm.log.debug('Create and initialize test storage clients');

    // This client will revert to accessing files if the engine is
    // unable to access the database.
    var storageClientDb = new mm.storage.StorageClient({
      user: tuser.name,
      engine: storageEngine,
      prefer: 'db'
    });

    var storageClientFs = new mm.storage.StorageClient({
      user: tuser.name,
      engine: storageEngine,
      prefer: 'fs'
    });
    
    storageClientList = [storageClientFs, storageClientDb];
    clientCount = storageClientList.length;

    if (mm.config.inNode) {
      mm.storage.providers.FileProvider.register(storageEngine);
      mm.storage.providers.MongoDBProvider.register(storageEngine);
      return qq(storageClientList);
    }
    else {
      var host = mm.config.startLocal ? mm.config.localUrl : mm.config.remoteUrl;
      cs = new mm.core.ClientSession('mochaTests');
      var mmc = new mm.core.MMeddleClient(host, cs);
      cs.bindClient(mmc);
      cs.loadLocalWorkspace();
      cs.loadLocalUser();
      return mmc.connectWorkspace()
      .then(function() {
        mm.log('- Connected to server {0}', host);
        cs.emitLogMessage('TestCase test.base.storage Connected.');
        mm.storage.providers.ClientProvider.register(storageEngine, cs);
        return cs.userCreateOrLogin(tuser)
        .then (function () {
          return storageClientList;
        });
      })
    }
  }
  
  before(function primeStorage() {
    this.timeout(SAL_TIMEOUT);
    // Prime the pump by first loading something that does not exist.
    return initStorageClients().then(function (scl) {
      //mm.log('- Clients: ', scl);
      return scl;
    });
  })

  describe('storage', function(){
    this.timeout(SAL_TIMEOUT);
    var exampleContent = { name: 'thing', fld: 'xyz' };
    var thingAA = { name: 'thingAA', fld: 'xyz' };
    var thingAB = { name: 'thingAB', fld: 'xyz' };
    var thingAC = { name: 'thingAC', fld: 'xyz' };
    var thingBC = { name: 'thingBC', fld: 'xyz' };
    
    it('should initialize the storage engine and clients', function(){
      storageClientList.forEach(function (sc) {
        describe('#store(' + sc.prefer + ')', function(){
          it('should create a thing in storage', function(){
            return sc.store(testCollection, exampleContent)
            .then (function f(info) {
              //mm.log.debug('+++TEST sc.store:', info);
              info.should.have.property('ok');
              info.ok.should.be.true; // jshint ignore:line 
            });
          })

          it('will accecpt a few more things', function(){
            var p1 = sc.store(testCollection, thingAA);
            var p2 = sc.store(testCollection, thingAB);
            var p3 = sc.store(testCollection, thingAC);
            var p4 = sc.store(testCollection, thingBC);
            return qq.all([p1, p2, p3, p4])
            .then (function f(ok) { Should.exist(ok); },
                   function f(err) { Should.not.exist(err) }
            );
          })
        })
        
        describe('#load(' + sc.prefer + ')', function(){
          it('should read the thing back from storage', function(){
            return sc.load(testCollection, 'thing')
            .then (function f(content) {
              //mm.log.debug('+++TEST sc.load:', content);
              content.should.have.property('name');
              content.should.have.property('fld');
              content.should.have.property('owner');
              content.name.should.equal(exampleContent.name);
              content.fld.should.equal(exampleContent.fld);
              content.owner.should.equal(sc.user);
            });
          })
        })

        describe('#remove(' + sc.prefer + ')', function(){
          it('should remove the thing from storage', function(){
            return sc.remove(testCollection, 'thing')
            .then (function f(bool) {
              bool.should.equal(true);
              // Once gone it shoult not be reloaded.
              return sc.load(testCollection, 'thing')
              .then (function f(content) {
                mm.log.debug('+++TEST sc.load:', content);
                Should.not.exist(content);
              },
              function f(e) {
                e.toString().should.containEql('Error: ENOENT');
                Should.exist(e);
              });
            });
          })
        })

        describe('#loadMultiple(' + sc.prefer + ')', function(){
          it('should read multiple things back from storage', function(){
            // The thingA* should match exactly 3 of the objects that
            // were inserted by the prior test cases.
            return sc.loadMultiple(testCollection, 'thingA*')
            .then (function f(content) {
              content.should.be.an.Array; // jshint ignore:line 
              content.should.have.length(3);
              return true;
            });
          })

          it('should support multiple callbacks', function(){
            var shouldRead = 3;
            var didRead = 0;
            return sc.loadMultiple(testCollection, 'thingA*', 
            function(obj) {
              if (obj === null) {
                didRead.should.eql(shouldRead);
                return true;
              }
              didRead++;
              //mm.log('----- Read object:', obj);
              return false;
            })
            .then (function f(content) {
              content.should.be.an.Array; // jshint ignore:line 
              content.should.have.length(3);
              //mm.log('----- Content names:', content);
              didRead.should.eql(shouldRead); 
              // Make sure the reads actually happen.
              return qq.all([ sc.remove(testCollection, thingAA.name),
                              sc.remove(testCollection, thingAB.name),
                              sc.remove(testCollection, thingAC.name),
                              sc.remove(testCollection, thingBC.name)])
              .then (function f(ok) { Should.exist(ok); },
                     function f(err) { Should.not.exist(err) }
              );
            });
          })
          
          it('should get here to wrap up', function(){
            if (mm.config.inBrowser) {
              clientCount--;
              if (clientCount === 0) {
                return cs.userDelete()
                .then(function (msg) {
                  mm.log(msg);
                  Should.exist(msg);
                  return true;
                },
                function (e) {
                  Should.not.exist(e);
                  throw e;
                })
              }
            }
          })
        })
      })      
    })
  })
  
}(mmeddle));  