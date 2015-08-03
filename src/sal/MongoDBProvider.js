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
      mm.log.debug('- Connecting to MongoDB database: ', url);
      var mongodb = mm.check(require('mongodb'));
      var MongoClient = mongodb.MongoClient;
      var dbOpenDeferred = qq.defer(); // Add a promise and resolver.
      self.dbOpenP = dbOpenDeferred.promise;
    
      // Use connect method to connect to the Server
      MongoClient.connect(url, function (err, db) {
        /* istanbul ignore if */   // Tested independently and often.
        if (err) {
          if (err.message === 'connect ECONNREFUSED') {
            mm.log.warn('MongoDB: Not available');
          }
          else {
            mm.log.error('MongoDB: Connection failure:', err);
          }
          dbOpenDeferred.reject(err);
          return;
        }

        mm.log.debug('- Connection established to:', url);
        mm.log.status('- Database opened: ', url);
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
    /* istanbul ignore if */   // Inspected, not tested.
    if (!url) {
      mm.log.warn('No DB specified. Provider not registered.');
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
    /* istanbul ignore else */   // Inspected, not tested.
    if (!self.initialized) {
      self.initialized = self.connectDB();
    }
    return self.initialized;
  }  

  MongoDBProvider.prototype.perform = 
  function perform(op) {
    var self = this;
    var opFunction = self[op.op];
    /* istanbul ignore if */   // Tested independently.
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
        /* istanbul ignore next */   // Tested independently.
        op.deferred.reject(e);
      }
    },
    /* istanbul ignore next */
    function(err) {
      op.deferred.reject(err);
    });
  }

  /**
   * @summary **close the database**
   * @description
   * Closes the database and releases its resources.
   */
  /* istanbul ignore next */  // Tested independently.
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
      /* istanbul ignore if */
      if (callbacks > 1) return; // Ignore long replies.
      /* istanbul ignore if */ // Tested independently.
      if (err) {
        // TODO: When the database connection is lost, fail more
        // gracefully than a permanent state of failure with the
        // message:
        //    [error]:DB find failure { [MongoError: no connection 
        //            available for operation]
        //    name: 'MongoError',
        //    message: 'no connection available for operation' }      
        // hidden away in the server log.
        mm.log.error('DB find failure', err);
        op.deferred.reject(err);
        return;
      }
      
      if (items.length === 0) {
        mm.log.debug('MongoDBProvider: * No items found on DB load', objectQuery);
        // Make a nice looking ENOENT error message.
        var e = new Error('ENOENT, Item "' + itemName + '" not found.');
        e.code = 'ENOENT';
        op.deferred.reject(e);
        return;
      }

      // TODO: Consider changing to Find one.
      /* istanbul ignore if */
      if (items.length > 1) {
        mm.log.warn('%d items of name "%s" found.', items.length, itemName);
      }
      
      mm.log.debug(items, mm.Logger.Priority.LOW); 
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
   * @summary **load one or more object files**
   * @description
   * Loads multiple named objects from a collection where the name fields
   * match the wildcard pattern. This is called internally by `perform`
   * and exposed to test cases.
   * Not for public use.
   */  
  MongoDBProvider.prototype.loadMultiple = 
  function loadMultiple(db, op) {
    var erred = false;
    function doCallBack(obj) {
      try {
        return op.path.callback(obj); // true to stop.
      }
      catch (e) {
        erred = true;
        mm.log.error('DB loadMultiple callback failed', e);
        op.deferred.reject(e);
        return true; // No more callbacks on error.
      }
    }
  
    var collectionName = op.path.collectionName;
    var userName = op.path.userName;
    var itemName = op.path.itemName;
    var collection = db.collection(collectionName);
    var info = new StorageInfo();
    info.collectionName = op.path.collectionName;
    info.itemName = itemName;
    info.count = 0;
    info.text = [];
    info.content = [];
    var wildcardRegex = itemName.replace( /\./g, '\.');   // Escape '.'
    wildcardRegex = wildcardRegex.replace( /\*/g, '.*');
    wildcardRegex = '^' + wildcardRegex.replace(/\?/g, '.');
    var objectQuery = {name: { $regex: wildcardRegex, $options: 'i' },
                       owner: userName };
    mm.log.debug('- loadMultiple Collection:', 
        collectionName, ', Pattern:', objectQuery);
    var cursor = collection.find(objectQuery);
    var stopNow = false;    
    cursor.each(function (err, item) {
      if (erred) return; // Stop processing the remaining objects.
      /* istanbul ignore if */  // I haven't seen this yet. Inspected.
      if (err) {
        erred = true;
        mm.log.error('DB loadMultiple each failure', err);
        op.deferred.reject(err);
        return;
      }
      if (item && !stopNow) {
        if (op.path.callback) {
//mm.log('--> DB pushilate: ', item);  
          stopNow = doCallBack(item);
          if (!op.path.terse && !erred) {
            // Return an array of objectnames as the final result.
            info.content.push(item.name);
          }
        }
        else {
          info.content.push(item);
        }
        info.count++;        
      }
      else {
        /* istanbul ignore if */  // Tested independently
        if (info.count === 0) {
          mm.log.debug('MongoDBProvider: * No items found on DB loadMultiple', objectQuery);
        }
        else {
          mm.log.debug('loadMultiple ---> :', info);
        }
        if (op.path.callback) {
          doCallBack(null);
          erred = true; // This is just to force stop, not really an error.
        }

        op.deferred.resolve(info);
      }
    })
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
    op.content.owner = userName; // Stuff the owner in the object.
    
    //Collection.prototype.findAndModify = function(query, sort, doc, options, callback)
    //Collection.prototype.findOneAndUpdate = function(filter, update, options, callback)
    //collection.findOneAndUpdate(objectQuery, op.content,
    collection.findOneAndReplace(objectQuery, op.content,
    { upsert: true, returnOriginal: false },
    function(err, r) {
      /* istanbul ignore if */  // I haven't seen this yet. Inspected.
      if (err) {
        mm.log.error('DB upsert failure', err);
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
      /* istanbul ignore if */  // I haven't seen this yet. Inspected.
      if (err) {
        mm.log.error('DB remove failure', err);
        op.deferred.reject(err);
        return;
      }

      var result = r.result;
      // example: { result: { ok: 1, n: 39 },
      var nRemoved = result.n;
      /* istanbul ignore if */  // Tested.
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


