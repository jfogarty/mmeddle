'use strict';
if (typeof exports === 'object' && typeof module === 'object') {
  var Should = require('should'); // jshint ignore:line 
  var mmeddle = require('../mmeddle'); // In browser support
}

(function (mm) {
  var _ = mm._; // jshint ignore:line 
  var qq = mm.Q;
  
  var SAL_TIMEOUT = 10000; // Allow 10 seconds for the SAL operations.
  var testCollection = 'testp';
    
  var storageEngine;
  var storageClientList = [];

  function storageClients() {
    if (storageEngine) return storageClientList;
    mm.log.debug('Create and initialize the storage engine');
    storageEngine = new mm.storage.StorageEngine();
    mm.storage.providers.FileProvider.register(storageEngine);
    mm.storage.providers.MongoDBProvider.register(storageEngine);

    mm.log.debug('Create and initialize test storage clients');
    var storageClientDb = new mm.storage.StorageClient({
      user: '_testUser',
      engine: storageEngine,
      prefer: 'db'
    });
    
    var storageClientFs = new mm.storage.StorageClient({
      user: '_testUser',
      engine: storageEngine,
      prefer: 'fs'
    });
    
    storageClientList = [storageClientFs, storageClientDb];
    return storageClientList;
  }
  
  before(function primeStorage() {
    this.timeout(SAL_TIMEOUT);
    // Prime the pump by first loading something that does not exist.
    return qq.all(storageClients().map(function (sc) {
      // Once gone it shoult not be reloaded.
      return sc.load(testCollection, 'a_thing_which_does_not_exist')
      .then (function f(content) {
        throw new Error ('Load of non existent object should fail. ' + content);
      },
      function f(e) { mm.log.debug('Prime test: ' +  e.toString()); });
    }));
  })

  describe('storage', function(){
    this.timeout(SAL_TIMEOUT);
    var exampleContent = { name: 'thing', fld: 'xyz' };
    var thingAA = { name: 'thingAA', fld: 'xyz' };
    var thingAB = { name: 'thingAB', fld: 'xyz' };
    var thingAC = { name: 'thingAC', fld: 'xyz' };
    var thingBC = { name: 'thingBC', fld: 'xyz' };
    
    storageClients().forEach(function (sc) {
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
          return sc.loadMultiple(testCollection, 'thingA*')
          .then (function f(content) {
            content.should.be.an.Array; // jshint ignore:line 
            content.should.have.length(3);
            return qq.all([ sc.remove(testCollection, thingAA.name),
                            sc.remove(testCollection, thingAB.name),
                            sc.remove(testCollection, thingAC.name),
                            sc.remove(testCollection, thingBC.name)])
            .then (function f(ok) { Should.exist(ok); },
                   function f(err) { Should.not.exist(err) }
            );
          });
        })
      })

    })
  })
  
}(mmeddle));  