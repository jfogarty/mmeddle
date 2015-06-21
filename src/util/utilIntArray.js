'use strict';
/**
 * @file General Utility functions for UIntArrays.
 * @module util/utility
 */
module.exports = function registerUIntArrayUtils(util, mm) {

  /**
   * Convert a `UInt8Array` into a string of hex digits.
   * @param {UInt8Array} ua the array to convert to text
   * @returns {string} the string of hex characters
   * @alias module:utils/utility.ua2hex
   */
  util.ua2hex = function ua2hex(ua) {
      var h = '';
      for (var i = 0; i < ua.length; i++) {
          var d = ua[i].toString(16);
          h += (d.length < 2) ? '0' + d : d;
      }
      return h;
  }

  /**
   * Convert a UInt8Array into a string of hex digits.
   * @param {string} s the string to encode as `UInt8Array`
   * @returns {UInt8Array} the encoded array
   * @alias module:utils/utility.text2ua
   */
  util.text2ua = function text2ua(s) {
      var ua = new Uint8Array(s.length);
      for (var i = 0; i < s.length; i++) {
          ua[i] = s.charCodeAt(i);
      }
      return ua;
  }
}
