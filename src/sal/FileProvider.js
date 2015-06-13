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
      mm.log.error('-FILEOP FAILED', e.stack);
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
  
  function wildMatch(str, pattern) {
    var si = pattern.indexOf('*');
    var qi = pattern.indexOf('?');
    var n = pattern.length;
    var m = str.length;
    var ch;
    var pc;
    // If there must ne an exact match then return it.
    if (si < 0 && qi < 0) {
      match = pattern === str;
      return match;
    }
    // For ? only matches do it now.
    var match = true;
    if (si < 0) {
      // No need to check, the lengths have to match.
      if (m !== n) return false;
      for (var j = 0; j < n; j++) {
        pc = pattern[j];
        if (pc !== '?' && pc !== str[j]) match = false;
      }
      return match;
    }
    var leftPattern = pattern.substr(0, si);
    var leftStr = str.substr(0, si);
    // Match the ? parts.
    if (!wildMatch(leftStr, leftPattern)) return false;
    // Eat up to the * and one character from the source str.
    var rightPattern = pattern.substr(si + 1);
    // An end of pattern * always matches everything else.
    if (rightPattern.length === 0) return true;
    n = rightPattern.length;
    var rightStr = str.substr(str.length - n);
    match = wildMatch(rightStr, rightPattern);
    return match;
  }

  /**
   * @summary **load one or more object files**
   * @description
   * Loads multiple named objects from a files of the same name. Each
   * object is in well formed JSON with a `name` field.  The fileName
   * used here is actually a file wildcard pattern.  This is called
   * internally by `perform` and exposed to test cases.
   * Not for public use.
   */  
  FileProvider.prototype.loadMultiple =
  function loadMultiple(fs, op, fileName, filePath, fileDir) {
    // where files is an array of the names of the files in the
    // directory excluding '.' and '..'. 
    mm.log.debug('- loadMultiple Dir:{0}  Pattern;"{1}"', fileDir, fileName);
    fs.readdir(fileDir, function(err, files) {
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
      if (n === 0) {
        op.deferred.resolve(info);
        return;
      }
      fileSet.forEach(function (aFilePath) {
        fs.readFile(aFilePath, 'utf8', function (err, text) {
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
      if (err) {
        op.deferred.reject(err);
        return;
      }
      if (made) {
        // First Directory made if anybody cares.
      }
      op.content.owner = op.path.userName;
      var text = mm.util.JSONify(op.content, 2);
      fs.writeFile(filePath, text, options, function (err) {
        if (err) {
          op.deferred.reject(err);
          return;
        }
        fs.stat(filePath, function (err, stat) {
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
      if (err) {
        op.deferred.resolve(false);
        return;
      }
      op.deferred.resolve(true);
    });
  }
  
  return FileProvider;
}


