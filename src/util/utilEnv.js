'use strict';
/**
 * @file General utility functions for Environment variable handling
 * @module util/utility
 */
module.exports = function registerEnvUtilities(util, mm) {

  /**
   * @summary **Get a default value or override with an environment variable**
   * @description
   * On node.js this uses the process environment variables, on browsers,
   * the default value is always used.
   * @param {string} envName the environment variable name
   * @param {obj} default value
   * @returns {string|obj} the env string or default value
   * @alias module:utils/utility.envOption
   */
  mm.util.envOption = function envOption(envName, defaultValue) {
    var envValue = defaultValue;
    if (mm.config.inNode) {
      var v = process.env[envName];
      envValue = v ? v : envValue;
    }
    return envValue;
  }  

  /**
   * @summary **True is a named environment variable exists**
   * @param {string} envName the environment variable name
   * @returns {bool} true if the variable exists and is truthy
   * @alias module:utils/utility.ifEnvOption
   */
  mm.util.ifEnvOption = function ifEnvOption(envName) {
    return mm.util.envOption(envName, false) ? true : false;
  }

  /**
   * @summary **Get a default value or override it with MMEDDLE env variable**
   * @description
   * On node.js this uses the process environment variable named
   * MMEDDLE_[envName].  On browsers the default value is always used.
   * @param {string} envName the environment variable name
   * @param {obj} default value
   * @returns {string|obj} the env string or default value
   * @alias module:utils/utility.mmEnvOption
   */
  mm.util.mmEnvOption = function mmEnvOption(envName, defaultValue) {
    return mm.util.envOption('MMEDDLE_' + envName, defaultValue);
  }
  
}
