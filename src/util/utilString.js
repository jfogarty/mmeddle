'use strict';
/**
 * @file General utility string functions
 * @module util/utility
 */
module.exports = function registerStringUtilities(util, mm) {
  
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
    var val = v.toString();
    var i = val.indexOf('.');
    if (i >= 0) val = val.substring(0, i); // trim after decimal.
    var res = mm._.repeat('0', n) + val;
    res = res.substr(res.length - n);
    if (res[0] === '0' && sign) res = sign + res.substring(1);
    return res;
  }

  /**
   * @summary **Match a wildcard pattern**
   * @description
   * Matches a string that contains ? and * for matching.
   * Note that strange characters in the pattern may be interpreted as
   * part of a regular expression with correspondingly strange results.
   * $, ^, [,  and ] are escaped properly but beware of other characters.
   * @param {string} str the string to match to the pattern
   * @param {string} pattern the pattern to match
   * @returns {bool} true if the string matches the pattern
   * @alias module:utils/utility.wildMatch
   */
  mm.util.wildMatch = function wildMatch(str, pattern) {
    var wr = pattern.replace( /\./g, '\.');   // Escape '.'
    wr = wr.replace( /\$/g, '\$');   // Escape '$'
    wr = wr.replace( /\^/g, '\^');   // Escape '^'
    wr = wr.replace( /\[/g, '\[');   // Escape '['
    wr = wr.replace( /\]/g, '\]');   // Escape ']'
    wr = wr.replace( /\*/g, '.*');   // Handle *
    wr = wr.replace( /\?/g, '.' );   // Handle ?
    wr = '^' + wr + '$';
    var re = new RegExp(wr, 'i') 
    return re.test(str);
/*
    var si = pattern.indexOf('*');
    var qi = pattern.indexOf('?');
    var n = pattern.length;
    var m = str.length;
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
*/
  }
  
  /**
   * @summary **True on an ENOENT string or error**
   * @description
   * Examines an Error or string to see if it contains an ENOENT code.
   * @param {string|Error} e the error or string to examine
   * @returns {bool} true if this is an ENOENT error
   * @alias module:utils/utility.ENOENT
   */
  mm.util.ENOENT = function ENOENT(e) {
    var errString = '';
    if (e instanceof Error) {
      if (e.code === 'ENOENT') return true;
      errString = e.toString();
    }
    else if (mm._.isString(e)) {
      errString = e;
    }
    return errString.indexOf('ENOENT, ') >= 0;
  }
  
}
