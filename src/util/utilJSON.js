'use strict';
/**
 * @file General utility functions for JSON manipulation
 * @module util/utility
 */
module.exports = function registerJSONUtilities(util, mm) {

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
    /* istanbul ignore if */
    if (match) {
      jsString = match[3];
    }

    // helper functions to get the current/prev/next character
    function curr () { return jsString.charAt(i);     }
    function next()  { return jsString.charAt(i + 1); } /* istanbul ignore next */
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
      /* istanbul ignore next */
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
        /* istanbul ignore if */
        if (c === '"' && prev() !== '\\') {
          // unescaped double quote, escape it
          chars.push('\\');
        }

        // handle escape character
        /* istanbul ignore if */
        if (c === '\\') {
          i++;
          c = curr();

          // remove the escape character when followed by a single quote ', not needed
          /* istanbul ignore else */
          if (c !== '\'') {
            chars.push('\\');
          }
        }
        chars.push(c);

        i++;
        c = curr();
      }
      /* istanbul ignore if */
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

      /* istanbul ignore else */
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
    /* istanbul ignore else */
    if (sanitize) s = mm.util.JSONitize(s);
    return JSON.parse(s);
  }
  
}
