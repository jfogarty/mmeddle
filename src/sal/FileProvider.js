'use strict';
/**
 * @fileOverview Storage File Provider
 * @module sal/FileProvider
 */ 
 module.exports = function(mm) {
  var qq    = mm.check(mm.Q);
  var path  = mm.check(mm.path);  

  var storage     = mm.check(mm.storage);
  var StorageInfo = mm.check(storage.StorageInfo);
  var wildMatch   = mm.check(mm.util.wildMatch);

  //--------------------------------------------------------------------------
  /**
   * @summary **Provides operations on Node.JS files**
   * @description
   * A FileProvider is plugged into a StorageEngine when running under
   * Node.js to provide direct access to system files.
   * @constructor
   * @param {StorageEngine} engine context for this engine
   */  
  function FileProvider(engine) {
    var self = this;
    self.engine = engine;
    self.fs = mm.check(mm.fs);
  }

  /**
   * @summary **registers the Node File Storage Provider**
   * @description
   * Provides storage operations to node.js local file system.
   * @static
   * @param {StorageEngine} engine the current storage engine
   */  
  FileProvider.register = function registerFileProvider(engine) {
    engine.basePath = mm.path.join(mm.config.baseDir, 'storage');
    engine.fileExtension = '.mm.json';
    engine.fileProvider = new FileProvider(engine);
  }    

  /**
   * @summary **initialize the file storage provider**
   * @return {Promise} resolves when successful.
   */  
  FileProvider.prototype.initialize =
  function initialize(op) {
    var self = this;
    /* istanbul ignore else */
    if (!self.initialized) {
      self.initialized = qq(true);
    }
    return self.initialized;
  }  

  /**
   * @summary **perform a file storage operation**
   * @param {StorageEngine} op the operation to perform.
   */  
  FileProvider.prototype.perform =
  function perform(op) {
    var self = this;
    var opFunction = self[op.op];
    /* istanbul ignore if */ // Tested independently and often.
    if (!opFunction) {
      var s = 'Unrecognized storage operation: ' + op.op;
      op.deferred.reject(new Error(s));
      return;
    }

    try {
      var p = op.path;
      var localDir = path.join(p.userName, p.collectionName);
      var fileDir = path.join(self.engine.basePath, localDir);
      var fileName = p.itemName + self.engine.fileExtension;
      var filePath = path.join(fileDir, fileName);
      opFunction(self.fs, op, fileName, filePath, fileDir);
    }
    catch (e) {
      /* istanbul ignore if */ 
      mm.log.error('-FILEOP FAILED', e.stack); /* istanbul ignore if */
      op.deferred.reject(e);
    }
  }

  /**
   * @summary **load an object from a file**
   * @description
   * Loads a named object from a file of the same name. The object is in
   * well formed JSON with a `name` field.  Called internally by `perform`
   * and exposed to test cases.  Not for public use.
   */  
  FileProvider.prototype.load =
  function load(fs, op, fileName, filePath, fileDir) {
    fs.stat(filePath, function (err, stat) {
      if (err) {
        op.deferred.reject(err);
        return;
      }
      var info = new StorageInfo(stat);
      info.collectionName = op.path.collectionName;
      info.itemName = op.path.itemName;
      info.fileName = fileName;
      info.fileDir = fileDir;
      fs.readFile(filePath, 'utf8', function (err, text) {
        /* istanbul ignore if */ 
        if (err) {
          op.deferred.reject(err);
          return;
        }
        info.text = String(text);
        info.content = JSON.parse(text);
        info.owner = info.content.owner;
        op.deferred.resolve(info);
      });
    });
  }

  /**
   * @summary **load one or more object files**
   * @description
   * Loads multiple named objects from files with names that match a
   * wildcard pattern. This is called internally by `perform` and exposed
   * to test cases.  Not for public use.
   */  
  FileProvider.prototype.loadMultiple =
  function loadMultiple(fs, op, fileName, filePath, fileDir) {
    // where files is an array of the names of the files in the
    // directory excluding '.' and '..'. 
    mm.log.debug('- loadMultiple Dir:{0}  Pattern;"{1}"', fileDir, fileName);
    fs.readdir(fileDir, function(err, files) {
      /* istanbul ignore if */ // Tested independently.
      if (err) {
        op.deferred.reject(err);
        return;
      }
      mm.log.debug('- loadMultiple:', files);
      var info = new StorageInfo();
      info.collectionName = op.path.collectionName;
      info.itemName = op.path.itemName;
      info.fileName = fileName;
      info.fileDir = fileDir;
      info.count = 0;
      info.text = [];
      info.content = [];
      var fileSet = [];
      files.forEach(function (candidateFileName) {
        if (wildMatch(candidateFileName, fileName)) {
          fileSet.push(path.join(fileDir, candidateFileName));
        }
      });
      var n = fileSet.length;
      var erred = false;
      /* istanbul ignore if */ // Tested independently.
      if (n === 0) {
        op.deferred.resolve(info);
        return;
      }
      fileSet.forEach(function (aFilePath) {
        fs.readFile(aFilePath, 'utf8', function (err, text) {
          /* istanbul ignore if */
          if (err || erred) {
            // It doesn't matter that we reject the promise a zillion
            // times after an error.
            op.deferred.reject(err);
            erred = true;
            return;
          }
          info.text.push(String(text));
          info.content.push(JSON.parse(text));
          info.count++;
          n--;
          // When all files have been appended, return.
          if (n === 0) {
            mm.log.debug('- loadMultiple ---> :', info);          
            op.deferred.resolve(info);
          }
          // TODO!!! Stop me before I kill again.  This could
          // load half the planet if there was a lot of matching
          // stuff.
        });
      });
    });
  }

  /**
   * @summary **store an object to a file**
   * @description
   * Store a named object to a file of the same name. The object is in
   * well formed JSON with a `name` field.  Called internally by `perform`
   * and exposed to test cases.  Not for public use.
   */  
  FileProvider.prototype.store =
  function store(fs, op, fileName, filePath, fileDir) {
    var mkdirp = mm.check(mm.mkdirp);
    var options = {
      encoding: 'utf8', 
      mode: 438, // (aka 0666 in Octal)
      flag: 'w'
    };
    mkdirp(fileDir, function (err, made) {
      /* istanbul ignore if */
      if (err) {
        op.deferred.reject(err);
        return;
      }
      /* istanbul ignore if */
      if (made) {
        // First Directory made if anybody cares.
      }
      op.content.owner = op.path.userName;
      var text = mm.util.JSONify(op.content, 2);
      fs.writeFile(filePath, text, options, function (err) {
        /* istanbul ignore if */
        if (err) {
          op.deferred.reject(err);
          return;
        }
        fs.stat(filePath, function (err, stat) {
          /* istanbul ignore if */
          if (err) {
            op.deferred.reject(err);
            return;
          }
          var info = new StorageInfo(stat);
          info.owner = op.content.owner;
          info.collectionName = op.path.collectionName;
          info.itemName = op.content.name;
          info.fileName = fileName;
          info.fileDir = fileDir;
          info.text = text;
          info.ok = true;
          op.deferred.resolve(info);
        });
      });
    });
  }

  /**
   * @summary **remove an object**
   * @description
   * Removes the named file. Called internally by `perform` and exposed
   * to test cases.  Not for public use.
   */
  FileProvider.prototype.remove =
  function remove(fs, op, fileName, filePath, fileDir) {
    fs.unlink(filePath, function(err) {
      /* istanbul ignore if */  // Tested.
      if (err) {
        op.deferred.resolve(false);
        return;
      }
      op.deferred.resolve(true);
    });
  }
  
  return FileProvider;
}


