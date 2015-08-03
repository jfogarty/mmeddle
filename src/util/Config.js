'use srict';
/**
 * @fileOverview Loads config.json files 
 * @module util/Config
 */ 
module.exports = function registerConfig(mm) {
  var path = mm.check(mm.path);
  var _    = mm.check(mm._);

  // This is true so that the .json files can be a bit less strictly
  // JSON and a bit more like JavaScript objects. Comments and
  // unquoted field names are allowed.
  var SANITIZE = true;  
  
  /**
   * @summary **Create a Config**
   * @description
   * A Config is an object that contains key value pairs. It contains the
   * persistent configuration about an application and optionally a specific
   * user that controls the behavior of the app during its enire execution.
   *
   * The contents are loaded from `[app][.debug].config.json` files.
   * More than one file is used to load the full configuration. 
   * For example, the `.config.json` file is followed by the
   * `server.config.json` file to load the primary settings for the server.
   * if the DEBUG environment variable (or a config.debug is set), then the
   * `server.debug.config.json` file is also loaded. On client applications,
   * the settings start with `client.config.json`, then optionally 
   * `client.config.debug.json`.

   *  When a user logs in, a first a check is made for
   * `user-[userName].config.json` and debug version. These will be
   * placed in the session user configuration. 
   *
   * Config files are not created or modified by this class. They are created
   * and modified externally and are considered to be static for the duration
   * of the program execution (i.e. they are not reloaded on change).
   * @constructor
   * @returns {Config} the empty config settingss
   */
  var Config = (function configCtorCreator() {
    return function Config() {
      var self = this;
      self.debug = mm.util.envOption('DEBUG', false);
      self.debug = mm.util.mmEnvOption('DEBUG', self.debug);
      self.configFilesLoaded = 0;
    }
  }());

  /**
   * @summary **Initialize a config from a JSON derived object**
   * @description
   * All fields of the same name in the existing config are replaced by
   * those in the source object (which is often created by parsing a
   * JSON string). Any fields NOT in the source object remain unchanged.
   * @param {Object} config the raw object
   * @returns self for chaining.
   */
  Config.prototype.init = function init(config) {
    var self = this;  
    _.assign(self, config);
    return self;
  }

  /**
   * @summary **Get a value from a config or use a default**
   * @description
   * If the value is present in the config then it is returned otherwise
   * the default value supplied is returned.
   * @param {string} fieldName the name of the field in the config 
   * @param {Object} defaultValue the value to return
   * @returns the value.
   */
  Config.prototype.get = function get(fieldName, defaultValue) {
    var self = this;  
    if (fieldName in self) return self[fieldName];
    return defaultValue;
  }

  /**
   * @summary **Load a config file by exact name **
   * @description
   * This is normally used internally.  The exact file is loaded into
   * the Config. No errors are trapped so file access and not found 
   * exceptions will be thrown.
   * @param {string} cfgPath the exact file name to load
   */
  Config.prototype.loadFile = function loadFile(cfgPath) {
    var self = this;
    var cfg = String(mm.fs.readFileSync(cfgPath));
    var config = mm.util.JSONparse(cfg, SANITIZE);
    self.init(config);
  }

  /**
   * @summary **Load a config file**
   * @description
   * The file is looked for in the base directory first, and then the 
   * ./config subdirectory. Only the first file found is loaded.
   * All loads are synchronous, but don't worry, loading configs is not
   * a common event. Errors are logged, but otherwise do nothing.
   * If `config.debug` then an additional file pair is checked with
   * `.debug.config.json` extensions. 
   * Note that this does nothing if run from within a Browser.
   * @param {string} prefix the prefix to the .config.json file
   * @param {string} optional context for log messages
   * @returns self for chaining
   */
  Config.prototype.load = function load(prefix, context) {
    var self = this;
    /* istanbul ignore if */ // Tested in WebCLI
    if (mm.config.inBrowser) return self;
    var dir1 = mm.config.baseDir;
    var dir2 = path.join(dir1, 'config');
    var fileName = prefix + '.config.json';
    var dirs = [dir1, dir2];
    /* istanbul ignore next */
    var ctx = _.isString(context) ? context : '';
    function loadInternal() {
      for (var i in dirs) {
        try {          
          var cfgPath = path.join(dirs[i], fileName);
          self.loadFile(cfgPath);
          mm.log.debug(ctx + '- Config:', cfgPath);
          self.configFilesLoaded++;
        }
        catch (e) {
          /* istanbul ignore if */ // Tested independently.
          if (!mm.util.ENOENT(e)) {
            mm.log.error(ctx +'Config read failed [' +
                cfgPath + ']', e.stack);
          }
        }
      }
    }

    loadInternal();
    /* istanbul ignore if */ // Tested independently.
    if (self.debug) {
      fileName = prefix + '.debug.config.json';
      loadInternal();
    }
    return self;
  }
  
  /**
   * @summary **Load standard app configs**
   * @description
   * This loads the default mmeddle.config.json file along with the 
   * [appName.config.json file. Optional .debug.config.json files are
   * loaded when required.  The appName is added as a key in the config.
   * @param {string} appName the application name
   * @param {string} optional context for log messages
   * @returns self for chaining
   */
  Config.prototype.appLoad = function load(appName, context) {
    var self = this;
    var appId = path.basename(appName, '.js');
    self.load('mmeddle').load(appId);
    self.appName = appId;
    return self;
  }

  /**
   * @summary **Load a user config**
   * @description
   * This loads the user-[userName].config.json file along with the 
   * optional .debug.config.json file
   * @param {string} userName the user name to look up
   * @param {string} optional context for log messages
   * @returns false if nothing was loaded.
   */
  Config.prototype.userLoad = function load(userName, context) {
    var self = this;
    self.load('user-' + userName);
    self.userName = userName;
    return self.configFilesLoaded > 0;
  }
  
  return Config;
}
