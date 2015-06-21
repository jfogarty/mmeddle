'use strict';
/**
 * @fileOverview LocalStorage abstraction
 * @module sal/LocalStorage
 */ 
 module.exports = function(mm) {
  
  //--------------------------------------------------------------------------
  /**
   * @summary **Local Storage for Browser and node apps**
   * @description
   * This implements the Windows.localStorage operations as sync
   * file IO on node, and provides pass throughs for actual browser
   * localStorage when running on an actual browser of a headless
   * browser like PhantomJS.
   *
   * LocalStorage is persistent for the site across executions of the browser.
   * No more than 2.49 million characters total can be stored in localStorage.
   * @constructor
   * @returns {LocalStorage} the new local storage service.
   */  
  var LocalStorage = (function localStorageCtorCreator() {
    var ctor = function LocalStorage() {
      var self = this;
      /* istanbul ignore else */
      if (mm.config.inNode) {
        var domain = mm.util.mmEnvOption('LOCALSTORAGE', mm.config.appName);
        var dir = mm.path.join(mm.config.baseDir, 
            'storage', 'localStorage', domain);
        self.baseDir = dir;
        self.filePath = function filePath(name) {
          var fileName = name + '.localStorage.json';
          return mm.path.join(self.baseDir, fileName);
        }
      }
      else {
        if (typeof(mm.window.localStorage) === 'undefined') {
          mm.log.warn('No browser support for local Storage');
        }
      }
    };
    
    return ctor;
  }());

  /**
   * @summary **Clear the local storage**
   * @description
   * All variables are cleared for this domain in local storage.
   * Clear() takes no arguments, and simply empties the entire storage 
   * object for that domain.  
   */  
  LocalStorage.prototype.clear = function localClear() {
    var self = this;
    /* istanbul ignore else */
    if (mm.config.inNode) {
      mm.del.sync(self.baseDir);
    }
    else {
      mm.window.localStorage.clear();
    }
  }

  /**
   * @summary **Store a named object in local storage**
   * @description
   * Any other object of the same name will be replaced by this one.
   * @param {string} name the name of the object in storage
   * @param {obj} obj a named object
   */  
  LocalStorage.prototype.store = function localStore(name, obj) {
    var self = this;
    var text = mm.util.JSONify(obj, 2);
    
    /* istanbul ignore else */
    if (mm.config.inNode) {
      mm.mkdirp.sync(self.baseDir);
      mm.fs.writeFileSync(self.filePath(name), text);
    }
    else {
      mm.window.localStorage.setItem(name, text);
    }
  }

  /**
   * @summary **Load a named object from local storage**
   * @param {string} name the name of the object to load
   * @returns {obj} returns the object or undefined.
   */  
  LocalStorage.prototype.load = function localLoad(name) {
    var self = this;
    var text;
    /* istanbul ignore else */
    if (mm.config.inNode) {
      try {
        text = String(mm.fs.readFileSync(self.filePath(name)))
      }
      catch (e) {
        return text;
      }
    }
    else {
      text = mm.window.localStorage.getItem(name);
    }
    if (!text) return text;
    return JSON.parse(text);
  }
  
  /**
   * @summary **Remove a single object from local storage**
   * @param {string} name the name of the object to remove
   */  
  LocalStorage.prototype.remove = function localRemove(name) {
    var self = this;
    /* istanbul ignore else */
    if (mm.config.inNode) {
      var fp = self.filePath(name);
      if (mm.fs.existsSync(fp)) {
        mm.fs.unlinkSync(fp);
      }
    }
    else {
      mm.window.localStorage.removeItem(name);
    }
  }

  return LocalStorage;
}
