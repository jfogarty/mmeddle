'use strict';
/**
 * @file General utility functions
 * @module util/utility
 */
module.exports = function registerUtilities(util, mm) {

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
  
  /**
   * @summary **Remove a prefix from a string if it is present**
   * @param {string} str the string to return in trimmed form
   * @param {string} prefix a prefix to check for.
   * @returns {string} the original string or a prefixed version.
   * @alias module:utils/utility.trimPrefix
   */
  mm.util.trimPrefix = function trimPrefix(str, prefix) {
    var n = prefix.length;
    return mm._.startsWith(str, prefix) ? str.substr(n) : str;
  }

  /**
   * @summary **Remove all multiples of whitespace from a string**
   * @param {string} str the string to return in trimmed form
   * @returns {string} the string or a prefixed version.
   * @alias module:utils/utility.trimPrefix
   */
  mm.util.removeWhitespace = function removeWhitespace(str) {
    var r = str.replace(/\s+/g, ' ')
    return r;
  }

  /**
   * @summary **Get a number with leading zeros**
   * @description
   * If not an integer the value is truncated to an integer.
   * @param {number} v the number to zero fill
   * @param {number} n the number of digits in the number
   * @returns {string} the number of length n with leading zeros
   * @alias module:utils/utility.trimPrefix
   */
  mm.util.zeroFilled = function(v, n) {
    var sign = '';
    if (v < 0) {
      v = -v;
      sign = '-';
    }
    if (v < 0) v = -v;
    var val = v.toString();
    var i = val.indexOf('.');
    if (i >= 0) val = val.subString(0, i); // trim after decimal.
    var res = sign + mm._.repeat('0', n) + val;
    var m = res.length;
    return (res.substring(m - n, m));
  }
  
  /**
   * @summary **Get yyyymmdd format date**
   * @param {Date} date Optional Date, otherwise new Date() is used.
   * @returns {string} yyyymmdd formated date.
   * @alias module:utils/utility.yyyymmdd
   */
  mm.util.yyyymmdd = function(date) {
    if (arguments.length === 0 || typeof date === 'undefined') {
      date = new Date()
    }
    if (mm._.isNumber(date)) date = new Date(date);
    // Determine and display the month, day, and year. The getMonth method
    // uses a zero offset for the month number.
    var month = date.getMonth() + 1;
    var day   = date.getDate();
    var year  = date.getFullYear();
    return (year + mm.util.zeroFilled(month, 2) + mm.util.zeroFilled(day, 2))
  }
  
  /**
   * @summary **Get yymmdd format date**
   * @param {Date} date Optional Date, otherwise new Date() is used.
   * @returns {string} yymmdd formated date.
   * @alias module:utils/utility.yymmdd
   */
  mm.util.yymmdd = function(date) {
    if (arguments.length === 0 || typeof date === 'undefined') {
      date = new Date()
    }
    if (mm._.isNumber(date)) date = new Date(date);
    var month = date.getMonth() + 1;
    var day   = date.getDate();
    var year  = date.getFullYear();
    return (mm.util.zeroFilled(year, 2) +
            mm.util.zeroFilled(month, 2) +
            mm.util.zeroFilled(day, 2))
  }

  /**
   * @summary **Get hh:mm:ss format time**
   * @param {Date} date Optional Date, otherwise new Date() is used.
   * @returns {string} hh:mm:ss formated date.
   * @alias module:utils/utility.hhmmss
   */
  mm.util.hhmmss = function(date) {
    if (arguments.length === 0 || typeof date === 'undefined') {
      date = new Date()
    }
    if (mm._.isNumber(date)) date = new Date(date);
    // Determine and display the month, day, and year. The getMonth method
    // uses a zero offset for the month number.
    var hours   = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    return (mm.util.zeroFilled(hours, 2) + ':' +
            mm.util.zeroFilled(minutes, 2) + ':' +
            mm.util.zeroFilled(seconds, 2))
  }

  /**
   * @summary **Get yymmdd|hh:mm:ss format timestamp**
   * @param {Date|number} date Optional Date, otherwise new Date() is used.
   * @returns {string} yymmdd_hhmmdd formated date time stamp.
   * @alias module:utils/utility.timestamp
   */
  mm.util.timestamp = function(date) {
    return mm.util.yymmdd(date) + '|' + mm.util.hhmmss(date)
  }
  
  /**
   * @summary **JSON.stringuify an object with function conversions**
   * @description
   * Does a JSON.stringify with conversion of functions into strings
   * for recovery through evals during loading.
   * @param {Object} obj the object to convert
   * @param {number} offset the indentation for pretty encoding
   * @returns {string} the string value
   * @alias module:utils/utility.JSONify
   */
  mm.util.JSONify = function JSONify(obj, offset) {
    function fixup(key, val) {
      if (mm._.isFunction(val)) {
        //mm.log('---- func [' + key + ']:' + val.toString());
        return val.toString();
      }
      else {
        //mm.log('---- field[' + key + ']:' + mm.util.inspect(val));
        return val
      }
    }
    
    return JSON.stringify(obj, fixup, offset);
  }

  /**
   * @summary **Sanitize a string into valid JSON if possible**
   * @description
   * Sanitize a JSON-like string containing. For example changes JavaScript
   * notation into JSON notation.  This is especially useful for human edited
   * JSON such as config files since pure JSON is an annoying notation for
   * human editing.  Block and EOL comments are allowed here.
   * This function for example changes a string like "{a: 2, 'b': {c: 'd'}"
   * into '{"a": 2, "b": {"c": "d"}'
   * NOTE: This function was lifted shamelessly directly from Jos de Jong's
   * jsoneditor 4.1.3.  Apache License - Version 2.0
   * I added a fix to allow end of line comments and commas between kvpairs.
   * @see Jos de Jong <wjosdejong@gmail.com>,
   *      https://github.com/josdejong/jsoneditor.git.
   * @param {string} jsString
   * @returns {string} json
   * @alias module:utils/utility.JSONitize
   */
  mm.util.JSONitize = function (jsString) {
    // escape all single and double quotes inside strings
    var chars = [];
    var i = 0;
    var latchedPrevIsBraceOrComma = false;

    //If JSON starts with a function (characters/digits/"_-"), remove this function.
    //This is useful for "stripping" JSONP objects to become JSON
    //For example: /* some comment */ function_12321321 ( [{"a":"b"}] ); => [{"a":"b"}]
    var match = jsString.match(/^\s*(\/\*(.|[\r\n])*?\*\/)?\s*[\da-zA-Z_$]+\s*\(([\s\S]*)\)\s*;?\s*$/);
    if (match) {
      jsString = match[3];
    }

    // helper functions to get the current/prev/next character
    function curr () { return jsString.charAt(i);     }
    function next()  { return jsString.charAt(i + 1); }
    function prev()  { return jsString.charAt(i - 1); }

    // test whether the last non-whitespace character was a brace-open '{'
    // or a , to indicate that this is a key that should be quoted.
    function prevIsBraceOrComma() {
      if (latchedPrevIsBraceOrComma) { // Added by jfogarty - mMeddle. 30may15
        latchedPrevIsBraceOrComma = false;
        return true;
      }
      var ii = i - 1;
      while (ii >= 0) {
        var cc = jsString.charAt(ii);
        if (cc === '{'|| cc === ',') {
          return true;
        }
        else if (cc === ' ' || cc === '\n' || cc === '\r') { // whitespace
          ii--;
        }
        else {
          return false;
        }
      }
      return false;
    }

    // skip a block comment '/* ... */'
    function skipComment () {
      i += 2;
      while (i < jsString.length && (curr() !== '*' || next() !== '/')) {
        i++;
      }
      i += 2;
    }

    // skip an end of line comment '// ... \n'
    function skipEolComment () {
      // Added by jfogarty - mMeddle. 30may15 
      latchedPrevIsBraceOrComma = prevIsBraceOrComma();
      i += 2;
      while (i < jsString.length && (curr() !== '\n')) {
        i++;
      }
      i++;
    }

    // parse single or double quoted string
    function parseString(quote) {
      chars.push('"');
      i++;
      var c = curr();
      while (i < jsString.length && c !== quote) {
        if (c === '"' && prev() !== '\\') {
          // unescaped double quote, escape it
          chars.push('\\');
        }

        // handle escape character
        if (c === '\\') {
          i++;
          c = curr();

          // remove the escape character when followed by a single quote ', not needed
          if (c !== '\'') {
            chars.push('\\');
          }
        }
        chars.push(c);

        i++;
        c = curr();
      }
      if (c === quote) {
        chars.push('"');
        i++;
      }
    }

    // parse an unquoted key
    function parseKey() {
      var specialValues = ['null', 'true', 'false'];
      var key = '';
      var c = curr();

      var regexp = /[a-zA-Z_$\d]/; // letter, number, underscore, dollar character
      while (regexp.test(c)) {
        key += c;
        i++;
        c = curr();
      }

      if (specialValues.indexOf(key) === -1) {
        chars.push('"' + key + '"');
      }
      else {
        chars.push(key);
      }
    }

    while(i < jsString.length) {
      var c = curr();

      if (c === '/' && next() === '*') {
        skipComment();
      }
      else if (c === '/' && next() === '/') {  // Added by jfogarty
        skipEolComment();                      // mMeddle. 30may15 
      }
      else if (c === '\'' || c === '"') {
        parseString(c);
      }
      else if (/[a-zA-Z_$]/.test(c) && prevIsBraceOrComma()) {
        // an unquoted object key (like a in '{a:2}')
        parseKey();
      }
      else {
        chars.push(c);
        i++;
      }
    }

    return chars.join('');
  };

  /**
   * @summary **JSON.parse a string to an object**
   * @description
   * Does a JSON.parse. The sanitize option runs the JSONitize sanitizer
   * (for use with human edited JSON such as .config.json files.
   * @param {string} the string to convert
   * @param {bool} sanitize true to sanitize the string first
   * @returns {Object} an object (throws on error)
   * @alias module:utils/utility.JSONparse
   */
  mm.util.JSONparse = function JSONparse(str, sanitize) {
    var s = str;
    if (sanitize) s = mm.util.JSONitize(s);
    return JSON.parse(s);
  }
}
