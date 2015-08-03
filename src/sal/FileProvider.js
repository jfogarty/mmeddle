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
  
  var FILE_SUFFIX = '.mm.json';

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
    engine.fileExtension = FILE_SUFFIX;
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
    var erred = false;  
    function doCallBack(obj) {
      try {
        return op.path.callback(obj); // true to stop.
      }
      catch (e) {
        erred = true;
        mm.log.error('loadMultiple callback failed', e);
        op.deferred.reject(e);
        return true; // No more callbacks on error.
      }
    }
  
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
      var objNames = [];
      files.forEach(function (candidateFileName) {
        if (wildMatch(candidateFileName, fileName)) {
          fileSet.push(path.join(fileDir, candidateFileName));
          var cn = candidateFileName.length;
          var ce = FILE_SUFFIX.length;
          var objName = candidateFileName.substr(0, cn - ce);
          objNames.push(objName);
        }
      });
      var n = fileSet.length;
      /* istanbul ignore if */ // Tested independently.
      if (n === 0) {
        if (op.path.callback) {
          doCallBack(null); // If it errors, it resolves by itself.
        }
        op.deferred.resolve(info);
        return;
      }
      var stopNow = false;
      fileSet.forEach(function (aFilePath) {
        if (erred) return; // This MAY stop some runon errors.
        fs.readFile(aFilePath, 'utf8', function (err, text) {
          /* istanbul ignore if */
          if (erred) return; // Don't reject a million times.
          /* istanbul ignore if */
          if (err) {
            op.deferred.reject(err);
            erred = true;
            return;
          }
          
          if (op.path.callback) {
//mm.log('--> pushilate: ', text);  
            stopNow = doCallBack(JSON.parse(text));          
            if (!op.path.terse && !erred) {
              // Return an array of objectnames as the final result.

              info.content.push(objNames.shift());
            }
          }
          else {
            info.content.push(JSON.parse(text));
          }
          info.count++;
          n--;
          // When all files have been appended, return.
          if (n === 0 || stopNow) {
            mm.log.debug('loadMultiple ---> :', info);
            op.deferred.resolve(info);
          }
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
    /*
    var options = {
      encoding: 'utf8', 
      mode: 438, // (aka 0666 in Octal)
      flag: 'w'
    };
    */
    mkdirp(fileDir, function (err, made) {
try {
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
      //mm.log.status('++++++++++++ fs.writeFile: ', filePath, ' ----[', text, ']');
      fs.writeFile(filePath, text, null, function (err) {
        // A mysterious bug happened here. The writefile (specifically the
        // one to a privateUser during loginCount updates) did not get to
        // this point. It is as if fs.writeFile truncated the file then
        // just STOPPED.  The next statement here was not reached.
        // *** BUG NOTE *** see the note in WsSessionUser.loginUser
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
          //mm.log.debug('++++++++++++ fs.stat after writeFile: ', filePath, stat);
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
} catch(xx) { mm.log.fail(xx); }
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


