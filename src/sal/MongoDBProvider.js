'use strict';
/**
 * @fileOverview Storage MongoDBProvider
 * @module sal/MongoDBProvider
 */ 
 module.exports = function(mm) {
//var _     = mm.check(mm._);
  var qq    = mm.check(mm.Q);
  
  var storage     = mm.check(mm.storage);
  var StorageInfo = mm.check(storage.StorageInfo);
  var EggTimer    = mm.check(mm.obj.EggTimer);
 
  //--------------------------------------------------------------------------
  /**
   * @summary **Provides file-like operations on MongoDB database**
   * @description
   * A MongoDBProvider is plugged into a StorageEngine when running under
   * Node.js to provide access to collections in a MongoDB database.
   * These very limited operations use mongo much like a file system,
   * although objects in collections must contain `name` and `owner` fields
   * for indexing.
   * @constructor
   * @param {StorageEngine} engine context for this engine
   */  
  function MongoDBProvider(engine, url) {
    var self = this;
    self.engine = engine;
    self.dbOpen = false; // Database starts out closed.
    self.operationTimeout = 60000; // Time to keep DB open.
    self.url = url;
    self.opTimer = new EggTimer(self.operationTimeout);
    self.connectDB = function connectDB() {
      self.opTimer.onDing(self.close.bind(self));
      self.opTimer.reset();

      // The database is open or being opened, return it to the caller.
      if (self.dbOpen || self.dbOpenP) {
        return self.dbOpenP;
      }

      //mm.log.status('- Connecting to MongoDB database: ', url);
      mm.log.status('- Connecting to MongoDB database: ', url);
      var mongodb = mm.check(require('mongodb'));
      var MongoClient = mongodb.MongoClient;
      var dbOpenDeferred = qq.defer(); // Add a promise and resolver.
      self.dbOpenP = dbOpenDeferred.promise;
    
      // Use connect method to connect to the Server
      MongoClient.connect(url, function (err, db) {
        if (err) {
          mm.log.error('Unable to connect to the mongoDB server. Error:', err);
          dbOpenDeferred.reject(err);
          return;
        }

        mm.log.status('----- Connection established to:', url);
        self.dbOpen = true;
        self.db = db;
        self.opTimer.reset();
        dbOpenDeferred.resolve(db);
      });
      
      return dbOpenDeferred.promise;
    }
  }

  /**
   * @summary **registers the MongoDb Storage Provider to an Engine**
   * @static
   * @description
   * Provides file-like storage operations to a MongoDB.
   * @param {StorageEngine} engine the current storage engine
   */  
  MongoDBProvider.register = function registerMongoDbProvider(engine) {
    var url = 'mongodb://localhost/mydb';
    url = mm.util.envOption('OPENSHIFT_MONGODB_DB_URL', url);
    url = mm.util.mmEnvOption('MONGODB_DB_URL', url);
    if (!url) {
      mm.log.warn('- No DB specified. Provider not registered.');
      return;
    }

    engine.dbProvider = new MongoDBProvider(engine, url);
  }
  
  /**
   * @summary **initialize the database provider**
   * @return {Promise} resolves when successful.
   */  
  MongoDBProvider.prototype.initialize =
  function initialize(op) {
    var self = this;
    if (!self.initialized) {
      self.initialized = self.connectDB();
    }
    return self.initialized;
  }  

  MongoDBProvider.prototype.perform = 
  function perform(op) {
    var self = this;
    var opFunction = self[op.op];
    if (!opFunction) {
      var s = 'Unrecognized MONGO DB operation: ' + op.op;
      op.deferred.reject(new Error(s));
      return;
    }

    self.connectDB().then(function (db) {
      try {
        opFunction(db, op);
      }
      catch (e) {
        op.deferred.reject(e);
      }
    },
    function(err) {
      op.deferred.reject(new Error(err));
    });
  }

  /**
   * @summary **close the database**
   * @description
   * Closes the database and releases its resources.
   */
  MongoDBProvider.prototype.close = 
  function close() {
    var self = this;
    if (self.dbOpen) {
      self.db.close();
      self.dbOpen = false;
      self.dbOpenP = false;
      self.opTimer.stop();
      mm.log.status('- Database closed: ', self.url);
    }
  }

  /**
   * @summary **load an object from a collection**
   * @description
   * Loads a named object from a collection. Called internally by perform
   * and exposed to test cases.  Not for public use.
   */    
  MongoDBProvider.prototype.load = 
  function load(db, op) {
    var collectionName = op.path.collectionName;
    var userName = op.path.userName;
    var itemName = op.path.itemName;
    var collection = db.collection(collectionName);
    var callbacks = 0;
    var objectQuery = {name: itemName, owner: userName};
    collection.find(objectQuery).toArray(function(err, items) {
      callbacks++;
      if (callbacks > 1) return; // Ignore long replies.
      if (err) {
        mm.log.error('*** DB find failure', err);
        op.deferred.reject(err);
        return;
      }
      
      if (items.length === 0) {
        mm.log.error('*** DB find failure', err);
        op.deferred.reject(
            new Error('ENOENT, Item "' + itemName + '" not found.'));
        return;
      }

      if (items.length > 1) {
        mm.log.warn('- Warning: %d items of name "%s" found.',
          items.length, itemName);
      }
      
      mm.log.debug.low.log(items);
      var content = items[0];
      var info = new StorageInfo({});
      info.userName = userName;
      info.itemName = itemName;
      info.collectionName = collectionName;
      info.content = content;
      op.deferred.resolve(info);
    });
  }

  /**
   * @summary **store an object to a collection**
   * @description
   * Stores a named object to a collection. Called internally by perform
   * and exposed to test cases.  Not for public use.
   */    
  MongoDBProvider.prototype.store = 
  function store(db, op) {
    var collectionName = op.path.collectionName;
    var userName = op.path.userName;
    var itemName = op.path.itemName;
    var collection = db.collection(collectionName);
    var objectQuery = {name: itemName, owner: userName};
    //Collection.prototype.findAndModify = function(query, sort, doc, options, callback)
    //Collection.prototype.findOneAndUpdate = function(filter, update, options, callback)
    collection.findOneAndUpdate(objectQuery, op.content,
      { upsert: true, returnOriginal: false },
      function(err, r) {
      if (err) {
        mm.log.error('*** DB upsert failure', err);
        op.deferred.reject(err);
        return;
      }
      // returns { value: { _id: 55614ebf1e46fb426cc4d26d, ... fields },
      //           lastErrorObject: { updatedExisting: false, n: 1,
      //                              upserted: 55614ebf1e46fb426cc4d26d },
      //           ok: 1 }
      var info = new StorageInfo(r);
      info.itemName = itemName;
      info.collectionName = collectionName;
      info.userName = userName;
      info.ok = true;
      op.deferred.resolve(info);
    });
  }

  /**
   * @summary **remove an object**
   * @description
   * Removes the named file. Called internally by perform and exposed
   * to test cases.  Not for public use.
   */
  MongoDBProvider.prototype.remove = 
  function remove(db, op) {
    var collectionName = op.path.collectionName;
    var userName = op.path.userName;
    var itemName = op.path.itemName;
    var objectQuery = {name: itemName, owner: userName};
    var collection = db.collection(collectionName);
    collection.remove(objectQuery, function (err, r) {
      if (err) {
        mm.log.error('*** DB remove failure', err);
        op.deferred.reject(err);
        return;
      }

      var result = r.result;
      // { result: { ok: 1, n: 39 },
      var nRemoved = result.n;
      if (nRemoved === 0) {
        op.deferred.resolve(false);
      }
      else {
        op.deferred.resolve(true);
      }
    });
  }
  
  return MongoDBProvider;
}


