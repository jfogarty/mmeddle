/**
 * mmeddle.js 
 * https://github.com/jfogarty/mmeddle
 *
 * mmeddle.js is a symbolic math workspace for JavaScript and Node.js.
 *
 * @version 0.1.1
 * @date    2015-04-25
 *
 * @license
 * Copyright (C) 2015 John Fogarty <johnhenryfogarty@gmail.com> (https://github.com/jfogarty)
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy
 * of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["mmeddle"] = factory();
	else
		root["mmeddle"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, global) {/**
	 * @fileOverview the mMeddle global declaration and linkage constructor.
	 * @module mMeddle
	 */

	'use strict';
	/**
	 * @summary **The mmeddle.js factory function**
	 * @description
	 * This is called automatically when loading mmeddle via the index.js root.
	 * This populates `module.exports` with an object containing access to all
	 * the other required components.
	 */ 
	function create() {
	  // Test for ES5 support
	  /* istanbul ignore if */
	  if (typeof Object.create !== 'function') {
	   throw new Error('ES5 not supported by this JavaScript engine. ' +
	        'Please load the es5-shim and es5-sham library for compatibility.');
	  }
	  
	  // Globally register the execution environment for testing by the sub-modules.
	  var inNode = !!(typeof window === 'undefined' &&
	               typeof process !== 'undefined' &&
	               process.nextTick);
	  var inBrowser = !inNode;
	  var inPhantom = false;

	  /**
	   * mmeddle factory function. Creates a new instance of mmeddle with a workspace.
	   */
	  var mm = {};
	  mm.create = create;

	  mm.type = {};
	  
	  mm._ = __webpack_require__(7); // The underscore replacement utility library.
	  mm.Q = __webpack_require__(9); // Promises compatible with node and browsers.
	  
	  mm.inBrowser = inBrowser;
	  mm.inNode    = inNode;
	  /* istanbul ignore next */
	  mm.envText = inNode ? 'Node.js' : 'Browser';
	  
	  /* istanbul ignore if */
	  if (inBrowser) {
	    var userAgent = navigator.userAgent;
	    inPhantom = userAgent.indexOf('PhantomJS') >= 0;
	    mm.inPhantom = inPhantom;
	    if (inPhantom) {
	      mm.envText += '-PhantomJS';
	    }
	    mm.envText += '(' + userAgent + ')';
	  }
	  else {
	     mm.envText += '(' + global.process.version + ')';
	  }
	  
	  //mm.format = require('string-template');
	  //Other candidates.
	  //mm.format = require('string-format');
	  //mm.format = require('sf');
	  
	  /* istanbul ignore next */
	  mm.format = __webpack_require__(2);
	  
	  __webpack_require__(3)(mm);
	  __webpack_require__(4)(mm)
	  __webpack_require__(5)(mm)
	  
	  /* istanbul ignore else */
	  if (inNode) {
	    mm.FS = __webpack_require__(8);
	    // mmeddle.FS = require('q-io/fs-mock');
	  }
	  
	  // return the new instance
	  return mm;
	}

	// create an isolated instance of mmeddle with its own workspace.
	var mMeddle = create();

	mMeddle.log('- mMeddle on ' + mMeddle.envText + ' initialized.');

	// export the default instance
	module.exports = mMeddle;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6), (function() { return this; }())))

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {'use strict';
	module.exports = function() {

	var shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	var shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	function padLeft(str, char, totalWidth) {
	  while (str.length < totalWidth) {
	    str = char + str;
	  }
	  return str;
	}

	function padRight(str, char, totalWidth) {
	  while (str.length < totalWidth) {
	    str = str + char;
	  }
	  return str;
	}

	function formatNumber(num, format) {
	  format = format || "0";

	  var hex = format.match(/^([xX])([0-9]*)$/);
	  if (hex) {
	    var str = num.toString(16);
	    if (hex[1] == 'x') {
	      str = str.toLowerCase();
	    } else {
	      str = str.toUpperCase();
	    }
	    var width = parseInt(hex[2]);
	    str = padLeft(str, '0', width);
	    return str;
	  }

	  var negative = false;
	  if (num < 0) {
	    num = -num;
	    negative = true;
	  }

	  var addPositiveSign = false;
	  if (format.match(/^\+/)) {
	    format = format.substr(1);
	    addPositiveSign = true;
	  }

	  var formatParts = format.split('.');
	  var formatBeforeDecimal = formatParts[0];
	  var wholeNumber = Math.floor(num);
	  var decimalVal = num - wholeNumber;
	  var result = '';
	  var wholeNumberStr = wholeNumber.toString();
	  var formatIdx, numberIdx;

	  // format whole number part
	  for (formatIdx = formatBeforeDecimal.length - 1, numberIdx = wholeNumberStr.length - 1; numberIdx >= 0 || formatIdx >= 0; formatIdx--) {
	    if (formatIdx < 0 && numberIdx >= 0) {
	      result = wholeNumberStr[numberIdx--] + result;
	      continue;
	    }

	    if (formatBeforeDecimal[formatIdx] == '0' || formatBeforeDecimal[formatIdx] == '#') {
	      if (numberIdx >= 0) {
	        result = wholeNumberStr[numberIdx--] + result;
	      } else {
	        if (formatBeforeDecimal[formatIdx] == '#') {
	          break;
	        }
	        result = '0' + result;
	      }
	      continue;
	    }

	    result = formatBeforeDecimal[formatIdx] + result;
	  }
	  result = result.replace(/^[^0-9]+/, '');

	  // format decimal part
	  if (formatParts.length > 1) {
	    var formatAfterDecimal = formatParts[1];
	    var decimalValStr = decimalVal.toString().substr(2);

	    result += '.';
	    for (formatIdx = 0, numberIdx = 0; formatIdx < formatAfterDecimal.length; formatIdx++) {
	      if (formatAfterDecimal[formatIdx] == '0' || formatAfterDecimal[formatIdx] == '#') {
	        if (numberIdx < decimalValStr.length) {
	          result += decimalValStr[numberIdx++];
	        } else {
	          if (formatAfterDecimal[formatIdx] == '#') {
	            break;
	          }
	          result += '0';
	        }
	      } else {
	        result += formatAfterDecimal[formatIdx];
	      }
	    }
	  }

	  if (result[result.length - 1] == '.') {
	    result = result.substr(0, result.length - 1);
	  }

	  if (negative) {
	    result = '-' + result;
	  }
	  if (!negative && addPositiveSign) {
	    result = '+' + result;
	  }

	  return result;
	}

	function formatTimeSpanPart(timeSpan, format, width) {
	  var formatStr = "{0:";
	  for (var i = 0; i < width; i++) {
	    formatStr += '0';
	  }
	  formatStr += "}";

	  switch (format) {
	  case 'y':
	    return sf(formatStr, timeSpan.years);
	  case 'M':
	    return sf(formatStr, timeSpan.months);
	  case 'd':
	    return sf(formatStr, timeSpan.days);
	  case 'h':
	    return sf(formatStr, timeSpan.hours);
	  case 'm':
	    return sf(formatStr, timeSpan.minutes);
	  case 's':
	    return sf(formatStr, timeSpan.seconds);
	  case 'f':
	    return sf(formatStr, timeSpan.milliseconds);
	  case '^y':
	    return sf(formatStr, timeSpan.totalYears);
	  case '^M':
	    return sf(formatStr, timeSpan.totalMonths);
	  case '^d':
	    return sf(formatStr, timeSpan.totalDays);
	  case '^h':
	    return sf(formatStr, timeSpan.totalHours);
	  case '^m':
	    return sf(formatStr, timeSpan.totalMinutes);
	  case '^s':
	    return sf(formatStr, timeSpan.totalSeconds);
	  case '^f':
	    return sf(formatStr, timeSpan.totalMilliseconds);
	  default:
	    throw new Error("unhandled time span format '" + format + "'");
	  }
	}

	function formatTimeSpan(timespan, format) {
	  if (!format || format === '') {
	    return timespan.toString();
	  }

	  var formats = [
	    'y',
	    'M',
	    'd',
	    'h',
	    'm',
	    's',
	    'f'
	  ];
	  var result = '';
	  var i;
	  var totalCount;
	  while (format.length > 0) {
	    if (format[0] === "'") {
	      var nextTick = format.indexOf("'", 1);
	      result += format.substring(1, nextTick);
	      format = format.substring(nextTick + 1);
	      continue;
	    }

	    if (format.length > 1 && format[0] === '^') {
	      totalCount = true;
	      format = format.substring(1);
	    } else {
	      totalCount = false;
	    }

	    for (i = 0; i < formats.length; i++) {
	      if (format.indexOf(formats[i]) === 0) {
	        var width = 0;
	        while (format.indexOf(formats[i]) === 0) {
	          width++;
	          format = format.substring(formats[i].length);
	        }
	        result += formatTimeSpanPart(timespan, (totalCount ? '^' : '') + formats[i], width);
	        break;
	      }
	    }
	    if (i < formats.length) {
	      continue;
	    }

	    result += format[0];
	    format = format.substring(1);
	  }
	  return result;
	}

	function formatDatePart(date, format) {
	  switch (format) {
	  case 'sd': // Short date - 10/12/2002
	    return sf("{0:M}/{0:d}/{0:yyyy}", date);
	  case 'D': // Long date - December 10, 2002
	    return sf("{0:MMMM} {0:dd}, {0:yyyy}", date);
	  case 't': // Short time - 10:11 PM
	    return sf("{0:hh}:{0:mm} {0:tt}", date);
	  case 'T': // Long time - 10:11:29 PM
	    return sf("{0:hh}:{0:mm}:{0:ss} {0:tt}", date);
	  case 'fdt': // Full date & time - December 10, 2002 10:11 PM
	    return sf("{0:D} {0:t}", date);
	  case 'F': // Full date & time (long) - December 10, 2002 10:11:29 PM
	    return sf("{0:D} {0:T}", date);
	  case 'g': // Default date & time - 10/12/2002 10:11 PM
	    return sf("{0:sd} {0:t}", date);
	  case 'G': // Default date & time (long) - 10/12/2002 10:11:29 PM
	    return sf("{0:sd} {0:T}", date);
	  case 'md': // Month day pattern - December 10
	    return sf("{0:MMMM} {0:dd}", date);
	  case 'r': // RFC1123 date string - Tue, 10 Dec 2002 22:11:29 +0500
	    return sf("{0:ddd}, {0:dd} {0:MMM} {0:yyyy} {0:HH}:{0:mm}:{0:ss} {0:+zzzz}", date);
	  case 's': // Sortable date string - 2002-12-10T22:11:29
	    return sf("{0:yyyy}-{0:MM}-{0:dd}:{0:HH}:{0:mm}:{0:ss}", date);
	  case 'd':
	    return sf("{0:#0}", date.getDate());
	  case 'dd':
	    return sf("{0:00}", date.getDate());
	  case 'ddd':
	    return shortDays[date.getDay()];
	  case 'dddd':
	    return days[date.getDay()];
	  case 'f':
	    return sf("{0:0}", date.getMilliseconds() / 100.0);
	  case 'ff':
	    return sf("{0:00}", date.getMilliseconds() / 10.0);
	  case 'fff':
	    return sf("{0:000}", date.getMilliseconds() / 1.0);
	  case 'h':
	    var hours_h = date.getHours() % 12;
	    return sf("{0:#0}", hours_h == 0 ? 12 : hours_h);
	  case 'hh':
	    var hours_hh = date.getHours() % 12;
	    return sf("{0:00}", hours_hh == 0 ? 12 : hours_hh);
	  case 'H':
	    return sf("{0:#0}", date.getHours());
	  case 'HH':
	    return sf("{0:00}", date.getHours());
	  case 'mm':
	    return sf("{0:00}", date.getMinutes());
	  case 'M':
	    return sf("{0:#0}", date.getMonth() + 1);
	  case 'MM':
	    return sf("{0:00}", date.getMonth() + 1);
	  case 'MMM':
	    return shortMonths[date.getMonth()];
	  case 'MMMM':
	    return months[date.getMonth()];
	  case 'ss':
	    return sf("{0:00}", date.getSeconds());
	  case 'tt':
	    return date.getHours() >= 12 ? 'PM' : 'AM';
	  case 'yy':
	    return getYear(date).toString().substr(2);
	  case 'yyyy':
	    return getYear(date);
	  case 'zz':
	    return sf("{0:00}", Math.floor(date.getTimezoneOffset() / 60));
	  case '+zz':
	    return sf("{0:+00}", Math.floor(date.getTimezoneOffset() / 60));
	  case 'zzz':
	    var wholeTimezoneOffset = Math.floor(date.getTimezoneOffset() / 60);
	    return sf("{0:00}:{1:00}", wholeTimezoneOffset, date.getTimezoneOffset() - (wholeTimezoneOffset * 60));
	  case 'zzzz':
	    var wholeTimezoneOffset = Math.floor(date.getTimezoneOffset() / 60);
	    return sf("{0:00}{1:00}", wholeTimezoneOffset, date.getTimezoneOffset() - (wholeTimezoneOffset * 60));
	  case '+zzzz':
	    var wholeTimezoneOffset = Math.floor(date.getTimezoneOffset() / 60);
	    return sf("{0:+00}{1:00}", wholeTimezoneOffset, date.getTimezoneOffset() - (wholeTimezoneOffset * 60));
	  default:
	    throw new Error("unhandled date format '" + format + "'");
	  }
	}

	function getYear(date) {
	  return date.getYear() + 1900;
	}

	function formatDate(date, format) {
	  if (!format || format === '') {
	    return date;
	  }

	  var formats = [
	    'sd',
	    'fdt',
	    'md',
	    'dddd',
	    'ddd',
	    'dd',
	    'd',
	    'D',
	    'fff',
	    'ff',
	    'f',
	    'F',
	    'g',
	    'G',
	    'hh',
	    'h',
	    'HH',
	    'H',
	    'mm',
	    'MMMM',
	    'MMM',
	    'MM',
	    'M',
	    'r',
	    'ss',
	    's',
	    'tt',
	    't',
	    'T',
	    'yyyy',
	    'yy',
	    '+zzzz',
	    '+zz',
	    'zzzz',
	    'zzz',
	    'zz'
	  ];
	  var result = '';
	  var i;
	  while (format.length > 0) {
	    if (format[0] === "'") {
	      var nextTick = format.indexOf("'", 1);
	      result += format.substring(1, nextTick);
	      format = format.substring(nextTick + 1);
	      continue;
	    }
	    for (i = 0; i < formats.length; i++) {
	      if (format.indexOf(formats[i]) === 0) {
	        result += formatDatePart(date, formats[i]);
	        format = format.substring(formats[i].length);
	        break;
	      }
	    }
	    if (i < formats.length) {
	      continue;
	    }

	    result += format[0];
	    format = format.substring(1);
	  }
	  return result;
	}

	function formatObjectIndent(obj) {
	  if (!obj) {
	    return 'null';
	  }
	  if (typeof(obj) != 'object') {
	    return obj.toString();
	  }
	  var results = '';
	  var keys = Object.keys(obj).sort();
	  for (var i = 0; i < keys.length; i++) {
	    results += keys[i] + ":";
	    var val = obj[keys[i]];
	    if (!val) {
	      results += '\n';
	    }
	    else if (val instanceof Buffer) {
	      var bufferContent = '';
	      for (var bufferIdx = 0; bufferIdx < val.length; bufferIdx++) {
	        if (bufferIdx !== 0) {
	          bufferContent += ', ';
	        }
	        if (bufferIdx >= 10) {
	          bufferContent += '...';
	          break;
	        }
	        bufferContent += val[bufferIdx];
	      }
	      results += ' Buffer[' + bufferContent + '] (length: ' + val.length + ')\n';
	    }
	    else if (val instanceof Date || isTimezoneJsDate(val)) {
	      results += " " + formatDate(val, 'r') + "\n";
	    }
	    else if (typeof(val) === 'string' || typeof(val) === 'number' || typeof(val) === 'boolean') {
	      results += " " + val + "\n";
	    } else {
	      var str = formatObjectIndent(val);
	      results += "\n" + sf.indent(str, {}) + "\n";
	    }
	  }
	  results = results.replace(/\s+$/, '');
	  return results;
	}

	function formatObject(obj, format) {
	  if (!format || format === '') {
	    return obj;
	  }

	  if (format == 'inspect') {
	    return __webpack_require__(19).inspect(obj);
	  }

	  if (format == 'json') {
	    return JSON.stringify(obj);
	  }

	  if (format == 'indent') {
	    return formatObjectIndent(obj);
	  }

	  throw new Error("unhandled format: " + format);
	}

	function formatError(err, format) {
	  if (!format || format === '') {
	    return err.stack;
	  }

	  if (format == 'message') {
	    return err.message;
	  }

	  return formatObject(err, format);
	}

	function align(str, val) {
	  str = str || '';
	  if (val < 0) {
	    return padRight(str, ' ', Math.abs(val));
	  } else if (val > 0) {
	    return padLeft(str, ' ', val);
	  }
	  return str;
	}

	function splitFieldName(fieldName) {
	  var results = [];
	  var part = '';
	  for (var i = 0; i < fieldName.length;) {
	    if (fieldName[i] == '.') {
	      results.push(part);
	      part = '';
	      i++;
	      continue;
	    }

	    if (fieldName[i] == '[') {
	      results.push(part);
	      part = '[';
	      i++;
	      continue;
	    }

	    part += fieldName[i++];
	  }
	  results.push(part);
	  return results;
	}

	function getValue(args, fieldName) {
	  var fieldIndex = parseInt(fieldName);
	  if (fieldIndex.toString() === fieldName) {
	    return args[fieldIndex + 1];
	  } else {
	    var parts = splitFieldName(fieldName);
	    var root = args[1];
	    for (var i = 0; i < parts.length; i++) {
	      var part = parts[i];

	      if (part.length >= 1 && part[0] == '?') {
	        if (typeof(root) == 'undefined') {
	          return undefined;
	        } else {
	          part = part.substr(1);
	        }
	      }

	      if (part.length >= 1 && part[0] == '[') {
	        part = part.substr(1, part.length - 2);
	        var strMatch = part.match(/^['"](.*)['"]$/);
	        if (strMatch) {
	          root = root[strMatch[1]];
	        }
	        else if (part < 0) {
	          part = -part;
	          root = root[root.length - part];
	        } else {
	          root = root[part];
	        }
	        continue;
	      }

	      root = root[part];
	    }
	    return root;
	  }
	}

	function sf(formatString) {
	  var result = '';
	  for (var i = 0; i < formatString.length;) {
	    if (formatString[i] == '}') {
	      i++;
	      if (formatString[i] == '}') {
	        result += '}';
	        i++;
	        continue;
	      }
	      throw new Error("Unescaped substitution");
	    }
	    if (formatString[i] == '{') {
	      var spec = '';
	      i++;
	      if (formatString[i] == '{') {
	        result += '{';
	        i++;
	        continue;
	      }
	      for (; i < formatString.length;) {
	        if (formatString[i] == '}') {
	          break;
	        }
	        spec += formatString[i++];
	      }
	      if (i == formatString.length) {
	        throw new Error("Unterminated substitution");
	      }
	      i++;
	      var alignTokenLoc = spec.indexOf(',');
	      var specTokenLoc;
	      var alignVal = 0;
	      if (alignTokenLoc > 0) {
	        specTokenLoc = spec.indexOf(':');
	        if (specTokenLoc > 0) {
	          if (alignTokenLoc < specTokenLoc) {
	            alignVal = spec.substr(alignTokenLoc + 1, specTokenLoc - alignTokenLoc - 1);
	            spec = spec.substr(0, alignTokenLoc) + spec.substr(specTokenLoc);
	          }
	        } else {
	          alignVal = spec.substr(alignTokenLoc + 1);
	          spec = spec.substr(0, alignTokenLoc);
	        }
	      }

	      specTokenLoc = spec.indexOf(':');
	      var fieldName, formatSpec;
	      if (specTokenLoc > 0) {
	        fieldName = spec.substr(0, specTokenLoc);
	        formatSpec = spec.substr(specTokenLoc + 1);
	      } else {
	        fieldName = spec;
	        formatSpec = null;
	      }
	      var val = getValue(arguments, fieldName);

	      if (val instanceof sf.TimeSpan) {
	        result += align(formatTimeSpan(val, formatSpec), alignVal);
	      } else if (typeof(val) === 'number') {
	        result += align(formatNumber(val, formatSpec), alignVal);
	      } else if (val instanceof Date || isTimezoneJsDate(val)) {
	        result += align(formatDate(val, formatSpec), alignVal);
	      } else if (val instanceof Error) {
	        result += align(formatError(val, formatSpec), alignVal);
	      } else {
	        result += align(formatObject(val, formatSpec), alignVal);
	      }
	    } else {
	      result += formatString[i++];
	    }
	  }
	  return result;
	}

	function isTimezoneJsDate(date) {
	  return date && date.hasOwnProperty('timezone');
	}

	function getStringLength(str, options) {
	  options.tabWidth = options.tabWidth || 4;

	  var tabStr = padLeft('', ' ', options.tabWidth);
	  str = str.replace(/\t/g, tabStr);
	  return str.length;
	}

	function isSpace(char) {
	  if (char.match(/\s/)) {
	    return true;
	  }
	  return false;
	}

	function isSplitable(char) {
	  if (isSpace(char)) {
	    return true;
	  }
	  if (char == '(' || char == ')' || char == '.' || char == ',' || char == '?' || char == '!') {
	    return false;
	  }
	  if (char >= 'a' && char <= 'z') {
	    return false;
	  }
	  if (char >= 'A' && char <= 'Z') {
	    return false;
	  }
	  if (char >= '0' && char <= '9') {
	    return false;
	  }

	  return true;
	}

	function findLastSplit(line, i) {
	  if (i >= line.length) {
	    i = line.length - 1;
	  }
	  while (i > 0 && !isSplitable(line[i])) {
	    i--;
	  }
	  return i;
	}

	function findNextSplit(line, i) {
	  while (i < line.length && !isSplitable(line[i])) {
	    i++;
	  }
	  return i;
	}

	function wordWrapLine(line, options) {
	  if (line.length === 0) {
	    return '';
	  }

	  options._prefixLength = options._prefixLength || getStringLength(options.prefix, options);

	  if (line.length + options._prefixLength < options.wordwrap) {
	    return options.prefix + line;
	  }

	  var i = options._prefixLength + options.wordwrap;
	  var lastSplit = findLastSplit(line, i);
	  var nextSplit = findNextSplit(line, i);
	  var rest;

	  if (lastSplit === 0 && (nextSplit + options._prefixLength > options.wordwrap)) {
	    rest = wordWrapLine(line.substr(options.wordwrap - options._prefixLength), options);
	    if (rest.length > 0) {
	      rest = '\n' + rest;
	    }
	    return options.prefix + line.substr(0, options.wordwrap - options._prefixLength) + rest;
	  }

	  rest = wordWrapLine(line.substr(lastSplit + 1), options);
	  if (rest.length > 0) {
	    rest = '\n' + rest;
	  }
	  if (!isSpace(line[lastSplit])) {
	    lastSplit++;
	  }
	  return options.prefix + line.substr(0, lastSplit) + rest;
	}

	sf.indent = function(str, options) {
	  options = options || {};
	  options.prefix = 'prefix' in options ? options.prefix : '  ';
	  options.tabWidth = options.tabWidth || 4;

	  options._prefixLength = getStringLength(options.prefix, options);

	  if (options.wordwrap) {
	    var results = '';
	    var lines = str.split('\n');

	    for (var i = 0; i < lines.length; i++) {
	      var line = lines[i];
	      if (line === '') {
	        results += options.prefix + line + '\n';
	      } else {
	        line = wordWrapLine(line, options) + '\n';
	      }
	      results += line;
	    }
	    if (results.length > 0) {
	      results = results.substr(0, results.length - 1);
	    }
	    return results;
	  }

	  str = str.replace(/\n/g, '\n' + options.prefix);
	  str = options.prefix + str;
	  return str;
	};

	/* JFogarty - Removed as inapplicable to mmeddle.
	sf.log = function() {
	  console.log(sf.apply(this, arguments));
	};

	sf.info = function() {
	  console.info(sf.apply(this, arguments));
	};

	sf.warn = function() {
	  console.warn(sf.apply(this, arguments));
	};

	sf.error = function() {
	  console.error(sf.apply(this, arguments));
	};
	*/

	sf.TimeSpan = function(milliseconds, seconds, minutes, hours, days) {
	  var MILLISECONDS = 1;
	  var SECOND = MILLISECONDS * 1000;
	  var MINUTE = SECOND * 60;
	  var HOUR = MINUTE * 60;
	  var DAY = HOUR * 24;
	  var MONTH = DAY * 30;
	  var YEAR = DAY * 365.25;

	  seconds = seconds || 0;
	  minutes = minutes || 0;
	  hours = hours || 0;
	  days = days || 0;
	  var _ms = milliseconds
	              + (SECOND * seconds)
	              + (MINUTE * minutes)
	              + (HOUR * hours)
	    + (DAY * days);

	  var remaining = _ms;

	  var _years = Math.floor(remaining / YEAR);
	  remaining %= YEAR;

	  var _months = Math.floor(remaining / MONTH);
	  remaining %= MONTH;

	  var _days = Math.floor(remaining / DAY);
	  remaining %= DAY;

	  var _hours = Math.floor(remaining / HOUR);
	  remaining %= HOUR;

	  var _minutes = Math.floor(remaining / MINUTE);
	  remaining %= MINUTE;

	  var _seconds = Math.floor(remaining / SECOND);
	  remaining %= SECOND;

	  var _milliseconds = Math.floor(remaining / MILLISECONDS);
	  remaining %= MILLISECONDS;

	  this.__defineGetter__("years", function() {
	    return _years;
	  });
	  this.__defineGetter__("months", function() {
	    return _months;
	  });
	  this.__defineGetter__("days", function() {
	    return _days;
	  });
	  this.__defineGetter__("hours", function() {
	    return _hours;
	  });
	  this.__defineGetter__("minutes", function() {
	    return _minutes;
	  });
	  this.__defineGetter__("seconds", function() {
	    return _seconds;
	  });
	  this.__defineGetter__("milliseconds", function() {
	    return _milliseconds;
	  });

	  this.__defineGetter__("totalYears", function() {
	    return _ms / YEAR;
	  });
	  this.__defineGetter__("totalMonths", function() {
	    return _ms / MONTH;
	  });
	  this.__defineGetter__("totalDays", function() {
	    return _ms / DAY;
	  });
	  this.__defineGetter__("totalHours", function() {
	    return _ms / HOUR;
	  });
	  this.__defineGetter__("totalMinutes", function() {
	    return _ms / MINUTE;
	  });
	  this.__defineGetter__("totalSeconds", function() {
	    return _ms / SECOND;
	  });
	  this.__defineGetter__("totalMilliseconds", function() {
	    return _ms;
	  });

	  this.toString = function() {
	    return _ms;
	  };

	  return this;
	};

	return sf;
	}();

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(20).Buffer))

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	//
	// Most utils register their dependency routines directly into the global
	// environment object rather than returning an object themselves.  This
	// seems to be a bit more flexible, but I'm not sure that I'm in love with
	// the style. As always, I reserve the right to change my mind later.
	//
	module.exports = function(mm) {
	  mm.util = __webpack_require__(19);
	  mm.obj = {};
	  mm.obj.SequencedObject = __webpack_require__(10)(mm);  

	  __webpack_require__(11)(mm.util);
	  mm.obj.Enum = __webpack_require__(12)();
	  mm.Logger = __webpack_require__(13)(mm);
	  
	  mm.log = __webpack_require__(14)(mm);


	  mm.obj.CoreObject = function CoreObject() {
	    // core object prototype functions here.
	  };

	  mm.obj.SequencedObject = __webpack_require__(15)(mm);  
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	// Insert the Services Abstraction Layer dependencies.
	module.exports = function(mm) {
	  mm.storage = __webpack_require__(16)(mm);
	  mm.users = __webpack_require__(17)(mm);
	  mm.userStorage = __webpack_require__(18)(mm);


	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(mm) {
	  mm.ws = {};
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    draining = true;
	    var currentQueue;
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        var i = -1;
	        while (++i < len) {
	            currentQueue[i]();
	        }
	        len = queue.length;
	    }
	    draining = false;
	}
	process.nextTick = function (fun) {
	    queue.push(fun);
	    if (!draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	// TODO(shtylman)
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {/**
	 * @license
	 * lodash 3.6.0 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern -d -o ./index.js`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	;(function() {

	  /** Used as a safe reference for `undefined` in pre-ES5 environments. */
	  var undefined;

	  /** Used as the semantic version number. */
	  var VERSION = '3.6.0';

	  /** Used to compose bitmasks for wrapper metadata. */
	  var BIND_FLAG = 1,
	      BIND_KEY_FLAG = 2,
	      CURRY_BOUND_FLAG = 4,
	      CURRY_FLAG = 8,
	      CURRY_RIGHT_FLAG = 16,
	      PARTIAL_FLAG = 32,
	      PARTIAL_RIGHT_FLAG = 64,
	      ARY_FLAG = 128,
	      REARG_FLAG = 256;

	  /** Used as default options for `_.trunc`. */
	  var DEFAULT_TRUNC_LENGTH = 30,
	      DEFAULT_TRUNC_OMISSION = '...';

	  /** Used to detect when a function becomes hot. */
	  var HOT_COUNT = 150,
	      HOT_SPAN = 16;

	  /** Used to indicate the type of lazy iteratees. */
	  var LAZY_DROP_WHILE_FLAG = 0,
	      LAZY_FILTER_FLAG = 1,
	      LAZY_MAP_FLAG = 2;

	  /** Used as the `TypeError` message for "Functions" methods. */
	  var FUNC_ERROR_TEXT = 'Expected a function';

	  /** Used as the internal argument placeholder. */
	  var PLACEHOLDER = '__lodash_placeholder__';

	  /** `Object#toString` result references. */
	  var argsTag = '[object Arguments]',
	      arrayTag = '[object Array]',
	      boolTag = '[object Boolean]',
	      dateTag = '[object Date]',
	      errorTag = '[object Error]',
	      funcTag = '[object Function]',
	      mapTag = '[object Map]',
	      numberTag = '[object Number]',
	      objectTag = '[object Object]',
	      regexpTag = '[object RegExp]',
	      setTag = '[object Set]',
	      stringTag = '[object String]',
	      weakMapTag = '[object WeakMap]';

	  var arrayBufferTag = '[object ArrayBuffer]',
	      float32Tag = '[object Float32Array]',
	      float64Tag = '[object Float64Array]',
	      int8Tag = '[object Int8Array]',
	      int16Tag = '[object Int16Array]',
	      int32Tag = '[object Int32Array]',
	      uint8Tag = '[object Uint8Array]',
	      uint8ClampedTag = '[object Uint8ClampedArray]',
	      uint16Tag = '[object Uint16Array]',
	      uint32Tag = '[object Uint32Array]';

	  /** Used to match empty string literals in compiled template source. */
	  var reEmptyStringLeading = /\b__p \+= '';/g,
	      reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
	      reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

	  /** Used to match HTML entities and HTML characters. */
	  var reEscapedHtml = /&(?:amp|lt|gt|quot|#39|#96);/g,
	      reUnescapedHtml = /[&<>"'`]/g,
	      reHasEscapedHtml = RegExp(reEscapedHtml.source),
	      reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

	  /** Used to match template delimiters. */
	  var reEscape = /<%-([\s\S]+?)%>/g,
	      reEvaluate = /<%([\s\S]+?)%>/g,
	      reInterpolate = /<%=([\s\S]+?)%>/g;

	  /**
	   * Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
	   */
	  var reComboMarks = /[\u0300-\u036f\ufe20-\ufe23]/g;

	  /**
	   * Used to match [ES template delimiters](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-template-literal-lexical-components).
	   */
	  var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;

	  /** Used to match `RegExp` flags from their coerced string values. */
	  var reFlags = /\w*$/;

	  /** Used to detect hexadecimal string values. */
	  var reHexPrefix = /^0[xX]/;

	  /** Used to detect host constructors (Safari > 5). */
	  var reHostCtor = /^\[object .+?Constructor\]$/;

	  /** Used to match latin-1 supplementary letters (excluding mathematical operators). */
	  var reLatin1 = /[\xc0-\xd6\xd8-\xde\xdf-\xf6\xf8-\xff]/g;

	  /** Used to ensure capturing order of template delimiters. */
	  var reNoMatch = /($^)/;

	  /**
	   * Used to match `RegExp` [special characters](http://www.regular-expressions.info/characters.html#special).
	   * In addition to special characters the forward slash is escaped to allow for
	   * easier `eval` use and `Function` compilation.
	   */
	  var reRegExpChars = /[.*+?^${}()|[\]\/\\]/g,
	      reHasRegExpChars = RegExp(reRegExpChars.source);

	  /** Used to match unescaped characters in compiled string literals. */
	  var reUnescapedString = /['\n\r\u2028\u2029\\]/g;

	  /** Used to match words to create compound words. */
	  var reWords = (function() {
	    var upper = '[A-Z\\xc0-\\xd6\\xd8-\\xde]',
	        lower = '[a-z\\xdf-\\xf6\\xf8-\\xff]+';

	    return RegExp(upper + '+(?=' + upper + lower + ')|' + upper + '?' + lower + '|' + upper + '+|[0-9]+', 'g');
	  }());

	  /** Used to detect and test for whitespace. */
	  var whitespace = (
	    // Basic whitespace characters.
	    ' \t\x0b\f\xa0\ufeff' +

	    // Line terminators.
	    '\n\r\u2028\u2029' +

	    // Unicode category "Zs" space separators.
	    '\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000'
	  );

	  /** Used to assign default `context` object properties. */
	  var contextProps = [
	    'Array', 'ArrayBuffer', 'Date', 'Error', 'Float32Array', 'Float64Array',
	    'Function', 'Int8Array', 'Int16Array', 'Int32Array', 'Math', 'Number',
	    'Object', 'RegExp', 'Set', 'String', '_', 'clearTimeout', 'document',
	    'isFinite', 'parseInt', 'setTimeout', 'TypeError', 'Uint8Array',
	    'Uint8ClampedArray', 'Uint16Array', 'Uint32Array', 'WeakMap',
	    'window'
	  ];

	  /** Used to make template sourceURLs easier to identify. */
	  var templateCounter = -1;

	  /** Used to identify `toStringTag` values of typed arrays. */
	  var typedArrayTags = {};
	  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
	  typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
	  typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
	  typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
	  typedArrayTags[uint32Tag] = true;
	  typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
	  typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
	  typedArrayTags[dateTag] = typedArrayTags[errorTag] =
	  typedArrayTags[funcTag] = typedArrayTags[mapTag] =
	  typedArrayTags[numberTag] = typedArrayTags[objectTag] =
	  typedArrayTags[regexpTag] = typedArrayTags[setTag] =
	  typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

	  /** Used to identify `toStringTag` values supported by `_.clone`. */
	  var cloneableTags = {};
	  cloneableTags[argsTag] = cloneableTags[arrayTag] =
	  cloneableTags[arrayBufferTag] = cloneableTags[boolTag] =
	  cloneableTags[dateTag] = cloneableTags[float32Tag] =
	  cloneableTags[float64Tag] = cloneableTags[int8Tag] =
	  cloneableTags[int16Tag] = cloneableTags[int32Tag] =
	  cloneableTags[numberTag] = cloneableTags[objectTag] =
	  cloneableTags[regexpTag] = cloneableTags[stringTag] =
	  cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
	  cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
	  cloneableTags[errorTag] = cloneableTags[funcTag] =
	  cloneableTags[mapTag] = cloneableTags[setTag] =
	  cloneableTags[weakMapTag] = false;

	  /** Used as an internal `_.debounce` options object by `_.throttle`. */
	  var debounceOptions = {
	    'leading': false,
	    'maxWait': 0,
	    'trailing': false
	  };

	  /** Used to map latin-1 supplementary letters to basic latin letters. */
	  var deburredLetters = {
	    '\xc0': 'A',  '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
	    '\xe0': 'a',  '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
	    '\xc7': 'C',  '\xe7': 'c',
	    '\xd0': 'D',  '\xf0': 'd',
	    '\xc8': 'E',  '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
	    '\xe8': 'e',  '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
	    '\xcC': 'I',  '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
	    '\xeC': 'i',  '\xed': 'i', '\xee': 'i', '\xef': 'i',
	    '\xd1': 'N',  '\xf1': 'n',
	    '\xd2': 'O',  '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
	    '\xf2': 'o',  '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
	    '\xd9': 'U',  '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
	    '\xf9': 'u',  '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
	    '\xdd': 'Y',  '\xfd': 'y', '\xff': 'y',
	    '\xc6': 'Ae', '\xe6': 'ae',
	    '\xde': 'Th', '\xfe': 'th',
	    '\xdf': 'ss'
	  };

	  /** Used to map characters to HTML entities. */
	  var htmlEscapes = {
	    '&': '&amp;',
	    '<': '&lt;',
	    '>': '&gt;',
	    '"': '&quot;',
	    "'": '&#39;',
	    '`': '&#96;'
	  };

	  /** Used to map HTML entities to characters. */
	  var htmlUnescapes = {
	    '&amp;': '&',
	    '&lt;': '<',
	    '&gt;': '>',
	    '&quot;': '"',
	    '&#39;': "'",
	    '&#96;': '`'
	  };

	  /** Used to determine if values are of the language type `Object`. */
	  var objectTypes = {
	    'function': true,
	    'object': true
	  };

	  /** Used to escape characters for inclusion in compiled string literals. */
	  var stringEscapes = {
	    '\\': '\\',
	    "'": "'",
	    '\n': 'n',
	    '\r': 'r',
	    '\u2028': 'u2028',
	    '\u2029': 'u2029'
	  };

	  /** Detect free variable `exports`. */
	  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

	  /** Detect free variable `module`. */
	  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

	  /** Detect free variable `global` from Node.js. */
	  var freeGlobal = freeExports && freeModule && typeof global == 'object' && global;

	  /** Detect free variable `self`. */
	  var freeSelf = objectTypes[typeof self] && self && self.Object && self;

	  /** Detect free variable `window`. */
	  var freeWindow = objectTypes[typeof window] && window && window.Object && window;

	  /** Detect the popular CommonJS extension `module.exports`. */
	  var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;

	  /**
	   * Used as a reference to the global object.
	   *
	   * The `this` value is used if it is the global object to avoid Greasemonkey's
	   * restricted `window` object, otherwise the `window` object is used.
	   */
	  var root = freeGlobal || ((freeWindow !== (this && this.window)) && freeWindow) || freeSelf || this;

	  /*--------------------------------------------------------------------------*/

	  /**
	   * The base implementation of `compareAscending` which compares values and
	   * sorts them in ascending order without guaranteeing a stable sort.
	   *
	   * @private
	   * @param {*} value The value to compare to `other`.
	   * @param {*} other The value to compare to `value`.
	   * @returns {number} Returns the sort order indicator for `value`.
	   */
	  function baseCompareAscending(value, other) {
	    if (value !== other) {
	      var valIsReflexive = value === value,
	          othIsReflexive = other === other;

	      if (value > other || !valIsReflexive || (typeof value == 'undefined' && othIsReflexive)) {
	        return 1;
	      }
	      if (value < other || !othIsReflexive || (typeof other == 'undefined' && valIsReflexive)) {
	        return -1;
	      }
	    }
	    return 0;
	  }

	  /**
	   * The base implementation of `_.findIndex` and `_.findLastIndex` without
	   * support for callback shorthands and `this` binding.
	   *
	   * @private
	   * @param {Array} array The array to search.
	   * @param {Function} predicate The function invoked per iteration.
	   * @param {boolean} [fromRight] Specify iterating from right to left.
	   * @returns {number} Returns the index of the matched value, else `-1`.
	   */
	  function baseFindIndex(array, predicate, fromRight) {
	    var length = array.length,
	        index = fromRight ? length : -1;

	    while ((fromRight ? index-- : ++index < length)) {
	      if (predicate(array[index], index, array)) {
	        return index;
	      }
	    }
	    return -1;
	  }

	  /**
	   * The base implementation of `_.indexOf` without support for binary searches.
	   *
	   * @private
	   * @param {Array} array The array to search.
	   * @param {*} value The value to search for.
	   * @param {number} fromIndex The index to search from.
	   * @returns {number} Returns the index of the matched value, else `-1`.
	   */
	  function baseIndexOf(array, value, fromIndex) {
	    if (value !== value) {
	      return indexOfNaN(array, fromIndex);
	    }
	    var index = fromIndex - 1,
	        length = array.length;

	    while (++index < length) {
	      if (array[index] === value) {
	        return index;
	      }
	    }
	    return -1;
	  }

	  /**
	   * The base implementation of `_.isFunction` without support for environments
	   * with incorrect `typeof` results.
	   *
	   * @private
	   * @param {*} value The value to check.
	   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	   */
	  function baseIsFunction(value) {
	    // Avoid a Chakra JIT bug in compatibility modes of IE 11.
	    // See https://github.com/jashkenas/underscore/issues/1621 for more details.
	    return typeof value == 'function' || false;
	  }

	  /**
	   * Converts `value` to a string if it is not one. An empty string is returned
	   * for `null` or `undefined` values.
	   *
	   * @private
	   * @param {*} value The value to process.
	   * @returns {string} Returns the string.
	   */
	  function baseToString(value) {
	    if (typeof value == 'string') {
	      return value;
	    }
	    return value == null ? '' : (value + '');
	  }

	  /**
	   * Used by `_.max` and `_.min` as the default callback for string values.
	   *
	   * @private
	   * @param {string} string The string to inspect.
	   * @returns {number} Returns the code unit of the first character of the string.
	   */
	  function charAtCallback(string) {
	    return string.charCodeAt(0);
	  }

	  /**
	   * Used by `_.trim` and `_.trimLeft` to get the index of the first character
	   * of `string` that is not found in `chars`.
	   *
	   * @private
	   * @param {string} string The string to inspect.
	   * @param {string} chars The characters to find.
	   * @returns {number} Returns the index of the first character not found in `chars`.
	   */
	  function charsLeftIndex(string, chars) {
	    var index = -1,
	        length = string.length;

	    while (++index < length && chars.indexOf(string.charAt(index)) > -1) {}
	    return index;
	  }

	  /**
	   * Used by `_.trim` and `_.trimRight` to get the index of the last character
	   * of `string` that is not found in `chars`.
	   *
	   * @private
	   * @param {string} string The string to inspect.
	   * @param {string} chars The characters to find.
	   * @returns {number} Returns the index of the last character not found in `chars`.
	   */
	  function charsRightIndex(string, chars) {
	    var index = string.length;

	    while (index-- && chars.indexOf(string.charAt(index)) > -1) {}
	    return index;
	  }

	  /**
	   * Used by `_.sortBy` to compare transformed elements of a collection and stable
	   * sort them in ascending order.
	   *
	   * @private
	   * @param {Object} object The object to compare to `other`.
	   * @param {Object} other The object to compare to `object`.
	   * @returns {number} Returns the sort order indicator for `object`.
	   */
	  function compareAscending(object, other) {
	    return baseCompareAscending(object.criteria, other.criteria) || (object.index - other.index);
	  }

	  /**
	   * Used by `_.sortByOrder` to compare multiple properties of each element
	   * in a collection and stable sort them in the following order:
	   *
	   * If orders is unspecified, sort in ascending order for all properties.
	   * Otherwise, for each property, sort in ascending order if its corresponding value in
	   * orders is true, and descending order if false.
	   *
	   * @private
	   * @param {Object} object The object to compare to `other`.
	   * @param {Object} other The object to compare to `object`.
	   * @param {boolean[]} orders The order to sort by for each property.
	   * @returns {number} Returns the sort order indicator for `object`.
	   */
	  function compareMultiple(object, other, orders) {
	    var index = -1,
	        objCriteria = object.criteria,
	        othCriteria = other.criteria,
	        length = objCriteria.length,
	        ordersLength = orders.length;

	    while (++index < length) {
	      var result = baseCompareAscending(objCriteria[index], othCriteria[index]);
	      if (result) {
	        if (index >= ordersLength) {
	          return result;
	        }
	        return result * (orders[index] ? 1 : -1);
	      }
	    }
	    // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
	    // that causes it, under certain circumstances, to provide the same value for
	    // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
	    // for more details.
	    //
	    // This also ensures a stable sort in V8 and other engines.
	    // See https://code.google.com/p/v8/issues/detail?id=90 for more details.
	    return object.index - other.index;
	  }

	  /**
	   * Used by `_.deburr` to convert latin-1 supplementary letters to basic latin letters.
	   *
	   * @private
	   * @param {string} letter The matched letter to deburr.
	   * @returns {string} Returns the deburred letter.
	   */
	  function deburrLetter(letter) {
	    return deburredLetters[letter];
	  }

	  /**
	   * Used by `_.escape` to convert characters to HTML entities.
	   *
	   * @private
	   * @param {string} chr The matched character to escape.
	   * @returns {string} Returns the escaped character.
	   */
	  function escapeHtmlChar(chr) {
	    return htmlEscapes[chr];
	  }

	  /**
	   * Used by `_.template` to escape characters for inclusion in compiled
	   * string literals.
	   *
	   * @private
	   * @param {string} chr The matched character to escape.
	   * @returns {string} Returns the escaped character.
	   */
	  function escapeStringChar(chr) {
	    return '\\' + stringEscapes[chr];
	  }

	  /**
	   * Gets the index at which the first occurrence of `NaN` is found in `array`.
	   *
	   * @private
	   * @param {Array} array The array to search.
	   * @param {number} fromIndex The index to search from.
	   * @param {boolean} [fromRight] Specify iterating from right to left.
	   * @returns {number} Returns the index of the matched `NaN`, else `-1`.
	   */
	  function indexOfNaN(array, fromIndex, fromRight) {
	    var length = array.length,
	        index = fromIndex + (fromRight ? 0 : -1);

	    while ((fromRight ? index-- : ++index < length)) {
	      var other = array[index];
	      if (other !== other) {
	        return index;
	      }
	    }
	    return -1;
	  }

	  /**
	   * Checks if `value` is object-like.
	   *
	   * @private
	   * @param {*} value The value to check.
	   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	   */
	  function isObjectLike(value) {
	    return !!value && typeof value == 'object';
	  }

	  /**
	   * Used by `trimmedLeftIndex` and `trimmedRightIndex` to determine if a
	   * character code is whitespace.
	   *
	   * @private
	   * @param {number} charCode The character code to inspect.
	   * @returns {boolean} Returns `true` if `charCode` is whitespace, else `false`.
	   */
	  function isSpace(charCode) {
	    return ((charCode <= 160 && (charCode >= 9 && charCode <= 13) || charCode == 32 || charCode == 160) || charCode == 5760 || charCode == 6158 ||
	      (charCode >= 8192 && (charCode <= 8202 || charCode == 8232 || charCode == 8233 || charCode == 8239 || charCode == 8287 || charCode == 12288 || charCode == 65279)));
	  }

	  /**
	   * Replaces all `placeholder` elements in `array` with an internal placeholder
	   * and returns an array of their indexes.
	   *
	   * @private
	   * @param {Array} array The array to modify.
	   * @param {*} placeholder The placeholder to replace.
	   * @returns {Array} Returns the new array of placeholder indexes.
	   */
	  function replaceHolders(array, placeholder) {
	    var index = -1,
	        length = array.length,
	        resIndex = -1,
	        result = [];

	    while (++index < length) {
	      if (array[index] === placeholder) {
	        array[index] = PLACEHOLDER;
	        result[++resIndex] = index;
	      }
	    }
	    return result;
	  }

	  /**
	   * An implementation of `_.uniq` optimized for sorted arrays without support
	   * for callback shorthands and `this` binding.
	   *
	   * @private
	   * @param {Array} array The array to inspect.
	   * @param {Function} [iteratee] The function invoked per iteration.
	   * @returns {Array} Returns the new duplicate-value-free array.
	   */
	  function sortedUniq(array, iteratee) {
	    var seen,
	        index = -1,
	        length = array.length,
	        resIndex = -1,
	        result = [];

	    while (++index < length) {
	      var value = array[index],
	          computed = iteratee ? iteratee(value, index, array) : value;

	      if (!index || seen !== computed) {
	        seen = computed;
	        result[++resIndex] = value;
	      }
	    }
	    return result;
	  }

	  /**
	   * Used by `_.trim` and `_.trimLeft` to get the index of the first non-whitespace
	   * character of `string`.
	   *
	   * @private
	   * @param {string} string The string to inspect.
	   * @returns {number} Returns the index of the first non-whitespace character.
	   */
	  function trimmedLeftIndex(string) {
	    var index = -1,
	        length = string.length;

	    while (++index < length && isSpace(string.charCodeAt(index))) {}
	    return index;
	  }

	  /**
	   * Used by `_.trim` and `_.trimRight` to get the index of the last non-whitespace
	   * character of `string`.
	   *
	   * @private
	   * @param {string} string The string to inspect.
	   * @returns {number} Returns the index of the last non-whitespace character.
	   */
	  function trimmedRightIndex(string) {
	    var index = string.length;

	    while (index-- && isSpace(string.charCodeAt(index))) {}
	    return index;
	  }

	  /**
	   * Used by `_.unescape` to convert HTML entities to characters.
	   *
	   * @private
	   * @param {string} chr The matched character to unescape.
	   * @returns {string} Returns the unescaped character.
	   */
	  function unescapeHtmlChar(chr) {
	    return htmlUnescapes[chr];
	  }

	  /*--------------------------------------------------------------------------*/

	  /**
	   * Create a new pristine `lodash` function using the given `context` object.
	   *
	   * @static
	   * @memberOf _
	   * @category Utility
	   * @param {Object} [context=root] The context object.
	   * @returns {Function} Returns a new `lodash` function.
	   * @example
	   *
	   * _.mixin({ 'foo': _.constant('foo') });
	   *
	   * var lodash = _.runInContext();
	   * lodash.mixin({ 'bar': lodash.constant('bar') });
	   *
	   * _.isFunction(_.foo);
	   * // => true
	   * _.isFunction(_.bar);
	   * // => false
	   *
	   * lodash.isFunction(lodash.foo);
	   * // => false
	   * lodash.isFunction(lodash.bar);
	   * // => true
	   *
	   * // using `context` to mock `Date#getTime` use in `_.now`
	   * var mock = _.runInContext({
	   *   'Date': function() {
	   *     return { 'getTime': getTimeMock };
	   *   }
	   * });
	   *
	   * // or creating a suped-up `defer` in Node.js
	   * var defer = _.runInContext({ 'setTimeout': setImmediate }).defer;
	   */
	  function runInContext(context) {
	    // Avoid issues with some ES3 environments that attempt to use values, named
	    // after built-in constructors like `Object`, for the creation of literals.
	    // ES5 clears this up by stating that literals must use built-in constructors.
	    // See https://es5.github.io/#x11.1.5 for more details.
	    context = context ? _.defaults(root.Object(), context, _.pick(root, contextProps)) : root;

	    /** Native constructor references. */
	    var Array = context.Array,
	        Date = context.Date,
	        Error = context.Error,
	        Function = context.Function,
	        Math = context.Math,
	        Number = context.Number,
	        Object = context.Object,
	        RegExp = context.RegExp,
	        String = context.String,
	        TypeError = context.TypeError;

	    /** Used for native method references. */
	    var arrayProto = Array.prototype,
	        objectProto = Object.prototype,
	        stringProto = String.prototype;

	    /** Used to detect DOM support. */
	    var document = (document = context.window) && document.document;

	    /** Used to resolve the decompiled source of functions. */
	    var fnToString = Function.prototype.toString;

	    /** Used to the length of n-tuples for `_.unzip`. */
	    var getLength = baseProperty('length');

	    /** Used to check objects for own properties. */
	    var hasOwnProperty = objectProto.hasOwnProperty;

	    /** Used to generate unique IDs. */
	    var idCounter = 0;

	    /**
	     * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
	     * of values.
	     */
	    var objToString = objectProto.toString;

	    /** Used to restore the original `_` reference in `_.noConflict`. */
	    var oldDash = context._;

	    /** Used to detect if a method is native. */
	    var reNative = RegExp('^' +
	      escapeRegExp(objToString)
	      .replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	    );

	    /** Native method references. */
	    var ArrayBuffer = isNative(ArrayBuffer = context.ArrayBuffer) && ArrayBuffer,
	        bufferSlice = isNative(bufferSlice = ArrayBuffer && new ArrayBuffer(0).slice) && bufferSlice,
	        ceil = Math.ceil,
	        clearTimeout = context.clearTimeout,
	        floor = Math.floor,
	        getPrototypeOf = isNative(getPrototypeOf = Object.getPrototypeOf) && getPrototypeOf,
	        push = arrayProto.push,
	        propertyIsEnumerable = objectProto.propertyIsEnumerable,
	        Set = isNative(Set = context.Set) && Set,
	        setTimeout = context.setTimeout,
	        splice = arrayProto.splice,
	        Uint8Array = isNative(Uint8Array = context.Uint8Array) && Uint8Array,
	        WeakMap = isNative(WeakMap = context.WeakMap) && WeakMap;

	    /** Used to clone array buffers. */
	    var Float64Array = (function() {
	      // Safari 5 errors when using an array buffer to initialize a typed array
	      // where the array buffer's `byteLength` is not a multiple of the typed
	      // array's `BYTES_PER_ELEMENT`.
	      try {
	        var func = isNative(func = context.Float64Array) && func,
	            result = new func(new ArrayBuffer(10), 0, 1) && func;
	      } catch(e) {}
	      return result;
	    }());

	    /* Native method references for those with the same name as other `lodash` methods. */
	    var nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray,
	        nativeCreate = isNative(nativeCreate = Object.create) && nativeCreate,
	        nativeIsFinite = context.isFinite,
	        nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys,
	        nativeMax = Math.max,
	        nativeMin = Math.min,
	        nativeNow = isNative(nativeNow = Date.now) && nativeNow,
	        nativeNumIsFinite = isNative(nativeNumIsFinite = Number.isFinite) && nativeNumIsFinite,
	        nativeParseInt = context.parseInt,
	        nativeRandom = Math.random;

	    /** Used as references for `-Infinity` and `Infinity`. */
	    var NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY,
	        POSITIVE_INFINITY = Number.POSITIVE_INFINITY;

	    /** Used as references for the maximum length and index of an array. */
	    var MAX_ARRAY_LENGTH = Math.pow(2, 32) - 1,
	        MAX_ARRAY_INDEX =  MAX_ARRAY_LENGTH - 1,
	        HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;

	    /** Used as the size, in bytes, of each `Float64Array` element. */
	    var FLOAT64_BYTES_PER_ELEMENT = Float64Array ? Float64Array.BYTES_PER_ELEMENT : 0;

	    /**
	     * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
	     * of an array-like value.
	     */
	    var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;

	    /** Used to store function metadata. */
	    var metaMap = WeakMap && new WeakMap;

	    /** Used to lookup unminified function names. */
	    var realNames = {};

	    /*------------------------------------------------------------------------*/

	    /**
	     * Creates a `lodash` object which wraps `value` to enable implicit chaining.
	     * Methods that operate on and return arrays, collections, and functions can
	     * be chained together. Methods that return a boolean or single value will
	     * automatically end the chain returning the unwrapped value. Explicit chaining
	     * may be enabled using `_.chain`. The execution of chained methods is lazy,
	     * that is, execution is deferred until `_#value` is implicitly or explicitly
	     * called.
	     *
	     * Lazy evaluation allows several methods to support shortcut fusion. Shortcut
	     * fusion is an optimization that merges iteratees to avoid creating intermediate
	     * arrays and reduce the number of iteratee executions.
	     *
	     * Chaining is supported in custom builds as long as the `_#value` method is
	     * directly or indirectly included in the build.
	     *
	     * In addition to lodash methods, wrappers have `Array` and `String` methods.
	     *
	     * The wrapper `Array` methods are:
	     * `concat`, `join`, `pop`, `push`, `reverse`, `shift`, `slice`, `sort`,
	     * `splice`, and `unshift`
	     *
	     * The wrapper `String` methods are:
	     * `replace` and `split`
	     *
	     * The wrapper methods that support shortcut fusion are:
	     * `compact`, `drop`, `dropRight`, `dropRightWhile`, `dropWhile`, `filter`,
	     * `first`, `initial`, `last`, `map`, `pluck`, `reject`, `rest`, `reverse`,
	     * `slice`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, `toArray`,
	     * and `where`
	     *
	     * The chainable wrapper methods are:
	     * `after`, `ary`, `assign`, `at`, `before`, `bind`, `bindAll`, `bindKey`,
	     * `callback`, `chain`, `chunk`, `commit`, `compact`, `concat`, `constant`,
	     * `countBy`, `create`, `curry`, `debounce`, `defaults`, `defer`, `delay`,
	     * `difference`, `drop`, `dropRight`, `dropRightWhile`, `dropWhile`, `fill`,
	     * `filter`, `flatten`, `flattenDeep`, `flow`, `flowRight`, `forEach`,
	     * `forEachRight`, `forIn`, `forInRight`, `forOwn`, `forOwnRight`, `functions`,
	     * `groupBy`, `indexBy`, `initial`, `intersection`, `invert`, `invoke`, `keys`,
	     * `keysIn`, `map`, `mapValues`, `matches`, `matchesProperty`, `memoize`, `merge`,
	     * `mixin`, `negate`, `noop`, `omit`, `once`, `pairs`, `partial`, `partialRight`,
	     * `partition`, `pick`, `plant`, `pluck`, `property`, `propertyOf`, `pull`,
	     * `pullAt`, `push`, `range`, `rearg`, `reject`, `remove`, `rest`, `reverse`,
	     * `shuffle`, `slice`, `sort`, `sortBy`, `sortByAll`, `sortByOrder`, `splice`,
	     * `spread`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, `tap`,
	     * `throttle`, `thru`, `times`, `toArray`, `toPlainObject`, `transform`,
	     * `union`, `uniq`, `unshift`, `unzip`, `values`, `valuesIn`, `where`,
	     * `without`, `wrap`, `xor`, `zip`, and `zipObject`
	     *
	     * The wrapper methods that are **not** chainable by default are:
	     * `add`, `attempt`, `camelCase`, `capitalize`, `clone`, `cloneDeep`, `deburr`,
	     * `endsWith`, `escape`, `escapeRegExp`, `every`, `find`, `findIndex`, `findKey`,
	     * `findLast`, `findLastIndex`, `findLastKey`, `findWhere`, `first`, `has`,
	     * `identity`, `includes`, `indexOf`, `inRange`, `isArguments`, `isArray`,
	     * `isBoolean`, `isDate`, `isElement`, `isEmpty`, `isEqual`, `isError`,
	     * `isFinite`,`isFunction`, `isMatch`, `isNative`, `isNaN`, `isNull`, `isNumber`,
	     * `isObject`, `isPlainObject`, `isRegExp`, `isString`, `isUndefined`,
	     * `isTypedArray`, `join`, `kebabCase`, `last`, `lastIndexOf`, `max`, `min`,
	     * `noConflict`, `now`, `pad`, `padLeft`, `padRight`, `parseInt`, `pop`,
	     * `random`, `reduce`, `reduceRight`, `repeat`, `result`, `runInContext`,
	     * `shift`, `size`, `snakeCase`, `some`, `sortedIndex`, `sortedLastIndex`,
	     * `startCase`, `startsWith`, `sum`, `template`, `trim`, `trimLeft`,
	     * `trimRight`, `trunc`, `unescape`, `uniqueId`, `value`, and `words`
	     *
	     * The wrapper method `sample` will return a wrapped value when `n` is provided,
	     * otherwise an unwrapped value is returned.
	     *
	     * @name _
	     * @constructor
	     * @category Chain
	     * @param {*} value The value to wrap in a `lodash` instance.
	     * @returns {Object} Returns the new `lodash` wrapper instance.
	     * @example
	     *
	     * var wrapped = _([1, 2, 3]);
	     *
	     * // returns an unwrapped value
	     * wrapped.reduce(function(sum, n) {
	     *   return sum + n;
	     * });
	     * // => 6
	     *
	     * // returns a wrapped value
	     * var squares = wrapped.map(function(n) {
	     *   return n * n;
	     * });
	     *
	     * _.isArray(squares);
	     * // => false
	     *
	     * _.isArray(squares.value());
	     * // => true
	     */
	    function lodash(value) {
	      if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
	        if (value instanceof LodashWrapper) {
	          return value;
	        }
	        if (hasOwnProperty.call(value, '__chain__') && hasOwnProperty.call(value, '__wrapped__')) {
	          return wrapperClone(value);
	        }
	      }
	      return new LodashWrapper(value);
	    }

	    /**
	     * The function whose prototype all chaining wrappers inherit from.
	     *
	     * @private
	     */
	    function baseLodash() {
	      // No operation performed.
	    }

	    /**
	     * The base constructor for creating `lodash` wrapper objects.
	     *
	     * @private
	     * @param {*} value The value to wrap.
	     * @param {boolean} [chainAll] Enable chaining for all wrapper methods.
	     * @param {Array} [actions=[]] Actions to peform to resolve the unwrapped value.
	     */
	    function LodashWrapper(value, chainAll, actions) {
	      this.__wrapped__ = value;
	      this.__actions__ = actions || [];
	      this.__chain__ = !!chainAll;
	    }

	    /**
	     * An object environment feature flags.
	     *
	     * @static
	     * @memberOf _
	     * @type Object
	     */
	    var support = lodash.support = {};

	    (function(x) {

	      /**
	       * Detect if functions can be decompiled by `Function#toString`
	       * (all but Firefox OS certified apps, older Opera mobile browsers, and
	       * the PlayStation 3; forced `false` for Windows 8 apps).
	       *
	       * @memberOf _.support
	       * @type boolean
	       */
	      support.funcDecomp = /\bthis\b/.test(function() { return this; });

	      /**
	       * Detect if `Function#name` is supported (all but IE).
	       *
	       * @memberOf _.support
	       * @type boolean
	       */
	      support.funcNames = typeof Function.name == 'string';

	      /**
	       * Detect if the DOM is supported.
	       *
	       * @memberOf _.support
	       * @type boolean
	       */
	      try {
	        support.dom = document.createDocumentFragment().nodeType === 11;
	      } catch(e) {
	        support.dom = false;
	      }

	      /**
	       * Detect if `arguments` object indexes are non-enumerable.
	       *
	       * In Firefox < 4, IE < 9, PhantomJS, and Safari < 5.1 `arguments` object
	       * indexes are non-enumerable. Chrome < 25 and Node.js < 0.11.0 treat
	       * `arguments` object indexes as non-enumerable and fail `hasOwnProperty`
	       * checks for indexes that exceed their function's formal parameters with
	       * associated values of `0`.
	       *
	       * @memberOf _.support
	       * @type boolean
	       */
	      try {
	        support.nonEnumArgs = !propertyIsEnumerable.call(arguments, 1);
	      } catch(e) {
	        support.nonEnumArgs = true;
	      }
	    }(0, 0));

	    /**
	     * By default, the template delimiters used by lodash are like those in
	     * embedded Ruby (ERB). Change the following template settings to use
	     * alternative delimiters.
	     *
	     * @static
	     * @memberOf _
	     * @type Object
	     */
	    lodash.templateSettings = {

	      /**
	       * Used to detect `data` property values to be HTML-escaped.
	       *
	       * @memberOf _.templateSettings
	       * @type RegExp
	       */
	      'escape': reEscape,

	      /**
	       * Used to detect code to be evaluated.
	       *
	       * @memberOf _.templateSettings
	       * @type RegExp
	       */
	      'evaluate': reEvaluate,

	      /**
	       * Used to detect `data` property values to inject.
	       *
	       * @memberOf _.templateSettings
	       * @type RegExp
	       */
	      'interpolate': reInterpolate,

	      /**
	       * Used to reference the data object in the template text.
	       *
	       * @memberOf _.templateSettings
	       * @type string
	       */
	      'variable': '',

	      /**
	       * Used to import variables into the compiled template.
	       *
	       * @memberOf _.templateSettings
	       * @type Object
	       */
	      'imports': {

	        /**
	         * A reference to the `lodash` function.
	         *
	         * @memberOf _.templateSettings.imports
	         * @type Function
	         */
	        '_': lodash
	      }
	    };

	    /*------------------------------------------------------------------------*/

	    /**
	     * Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
	     *
	     * @private
	     * @param {*} value The value to wrap.
	     */
	    function LazyWrapper(value) {
	      this.__wrapped__ = value;
	      this.__actions__ = null;
	      this.__dir__ = 1;
	      this.__dropCount__ = 0;
	      this.__filtered__ = false;
	      this.__iteratees__ = null;
	      this.__takeCount__ = POSITIVE_INFINITY;
	      this.__views__ = null;
	    }

	    /**
	     * Creates a clone of the lazy wrapper object.
	     *
	     * @private
	     * @name clone
	     * @memberOf LazyWrapper
	     * @returns {Object} Returns the cloned `LazyWrapper` object.
	     */
	    function lazyClone() {
	      var actions = this.__actions__,
	          iteratees = this.__iteratees__,
	          views = this.__views__,
	          result = new LazyWrapper(this.__wrapped__);

	      result.__actions__ = actions ? arrayCopy(actions) : null;
	      result.__dir__ = this.__dir__;
	      result.__filtered__ = this.__filtered__;
	      result.__iteratees__ = iteratees ? arrayCopy(iteratees) : null;
	      result.__takeCount__ = this.__takeCount__;
	      result.__views__ = views ? arrayCopy(views) : null;
	      return result;
	    }

	    /**
	     * Reverses the direction of lazy iteration.
	     *
	     * @private
	     * @name reverse
	     * @memberOf LazyWrapper
	     * @returns {Object} Returns the new reversed `LazyWrapper` object.
	     */
	    function lazyReverse() {
	      if (this.__filtered__) {
	        var result = new LazyWrapper(this);
	        result.__dir__ = -1;
	        result.__filtered__ = true;
	      } else {
	        result = this.clone();
	        result.__dir__ *= -1;
	      }
	      return result;
	    }

	    /**
	     * Extracts the unwrapped value from its lazy wrapper.
	     *
	     * @private
	     * @name value
	     * @memberOf LazyWrapper
	     * @returns {*} Returns the unwrapped value.
	     */
	    function lazyValue() {
	      var array = this.__wrapped__.value();
	      if (!isArray(array)) {
	        return baseWrapperValue(array, this.__actions__);
	      }
	      var dir = this.__dir__,
	          isRight = dir < 0,
	          view = getView(0, array.length, this.__views__),
	          start = view.start,
	          end = view.end,
	          length = end - start,
	          index = isRight ? end : (start - 1),
	          takeCount = nativeMin(length, this.__takeCount__),
	          iteratees = this.__iteratees__,
	          iterLength = iteratees ? iteratees.length : 0,
	          resIndex = 0,
	          result = [];

	      outer:
	      while (length-- && resIndex < takeCount) {
	        index += dir;

	        var iterIndex = -1,
	            value = array[index];

	        while (++iterIndex < iterLength) {
	          var data = iteratees[iterIndex],
	              iteratee = data.iteratee,
	              type = data.type;

	          if (type == LAZY_DROP_WHILE_FLAG) {
	            if (data.done && (isRight ? (index > data.index) : (index < data.index))) {
	              data.count = 0;
	              data.done = false;
	            }
	            data.index = index;
	            if (!data.done) {
	              var limit = data.limit;
	              if (!(data.done = limit > -1 ? (data.count++ >= limit) : !iteratee(value))) {
	                continue outer;
	              }
	            }
	          } else {
	            var computed = iteratee(value);
	            if (type == LAZY_MAP_FLAG) {
	              value = computed;
	            } else if (!computed) {
	              if (type == LAZY_FILTER_FLAG) {
	                continue outer;
	              } else {
	                break outer;
	              }
	            }
	          }
	        }
	        result[resIndex++] = value;
	      }
	      return result;
	    }

	    /*------------------------------------------------------------------------*/

	    /**
	     * Creates a cache object to store key/value pairs.
	     *
	     * @private
	     * @static
	     * @name Cache
	     * @memberOf _.memoize
	     */
	    function MapCache() {
	      this.__data__ = {};
	    }

	    /**
	     * Removes `key` and its value from the cache.
	     *
	     * @private
	     * @name delete
	     * @memberOf _.memoize.Cache
	     * @param {string} key The key of the value to remove.
	     * @returns {boolean} Returns `true` if the entry was removed successfully, else `false`.
	     */
	    function mapDelete(key) {
	      return this.has(key) && delete this.__data__[key];
	    }

	    /**
	     * Gets the cached value for `key`.
	     *
	     * @private
	     * @name get
	     * @memberOf _.memoize.Cache
	     * @param {string} key The key of the value to get.
	     * @returns {*} Returns the cached value.
	     */
	    function mapGet(key) {
	      return key == '__proto__' ? undefined : this.__data__[key];
	    }

	    /**
	     * Checks if a cached value for `key` exists.
	     *
	     * @private
	     * @name has
	     * @memberOf _.memoize.Cache
	     * @param {string} key The key of the entry to check.
	     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	     */
	    function mapHas(key) {
	      return key != '__proto__' && hasOwnProperty.call(this.__data__, key);
	    }

	    /**
	     * Adds `value` to `key` of the cache.
	     *
	     * @private
	     * @name set
	     * @memberOf _.memoize.Cache
	     * @param {string} key The key of the value to cache.
	     * @param {*} value The value to cache.
	     * @returns {Object} Returns the cache object.
	     */
	    function mapSet(key, value) {
	      if (key != '__proto__') {
	        this.__data__[key] = value;
	      }
	      return this;
	    }

	    /*------------------------------------------------------------------------*/

	    /**
	     *
	     * Creates a cache object to store unique values.
	     *
	     * @private
	     * @param {Array} [values] The values to cache.
	     */
	    function SetCache(values) {
	      var length = values ? values.length : 0;

	      this.data = { 'hash': nativeCreate(null), 'set': new Set };
	      while (length--) {
	        this.push(values[length]);
	      }
	    }

	    /**
	     * Checks if `value` is in `cache` mimicking the return signature of
	     * `_.indexOf` by returning `0` if the value is found, else `-1`.
	     *
	     * @private
	     * @param {Object} cache The cache to search.
	     * @param {*} value The value to search for.
	     * @returns {number} Returns `0` if `value` is found, else `-1`.
	     */
	    function cacheIndexOf(cache, value) {
	      var data = cache.data,
	          result = (typeof value == 'string' || isObject(value)) ? data.set.has(value) : data.hash[value];

	      return result ? 0 : -1;
	    }

	    /**
	     * Adds `value` to the cache.
	     *
	     * @private
	     * @name push
	     * @memberOf SetCache
	     * @param {*} value The value to cache.
	     */
	    function cachePush(value) {
	      var data = this.data;
	      if (typeof value == 'string' || isObject(value)) {
	        data.set.add(value);
	      } else {
	        data.hash[value] = true;
	      }
	    }

	    /*------------------------------------------------------------------------*/

	    /**
	     * Copies the values of `source` to `array`.
	     *
	     * @private
	     * @param {Array} source The array to copy values from.
	     * @param {Array} [array=[]] The array to copy values to.
	     * @returns {Array} Returns `array`.
	     */
	    function arrayCopy(source, array) {
	      var index = -1,
	          length = source.length;

	      array || (array = Array(length));
	      while (++index < length) {
	        array[index] = source[index];
	      }
	      return array;
	    }

	    /**
	     * A specialized version of `_.forEach` for arrays without support for callback
	     * shorthands and `this` binding.
	     *
	     * @private
	     * @param {Array} array The array to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @returns {Array} Returns `array`.
	     */
	    function arrayEach(array, iteratee) {
	      var index = -1,
	          length = array.length;

	      while (++index < length) {
	        if (iteratee(array[index], index, array) === false) {
	          break;
	        }
	      }
	      return array;
	    }

	    /**
	     * A specialized version of `_.forEachRight` for arrays without support for
	     * callback shorthands and `this` binding.
	     *
	     * @private
	     * @param {Array} array The array to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @returns {Array} Returns `array`.
	     */
	    function arrayEachRight(array, iteratee) {
	      var length = array.length;

	      while (length--) {
	        if (iteratee(array[length], length, array) === false) {
	          break;
	        }
	      }
	      return array;
	    }

	    /**
	     * A specialized version of `_.every` for arrays without support for callback
	     * shorthands and `this` binding.
	     *
	     * @private
	     * @param {Array} array The array to iterate over.
	     * @param {Function} predicate The function invoked per iteration.
	     * @returns {boolean} Returns `true` if all elements pass the predicate check,
	     *  else `false`.
	     */
	    function arrayEvery(array, predicate) {
	      var index = -1,
	          length = array.length;

	      while (++index < length) {
	        if (!predicate(array[index], index, array)) {
	          return false;
	        }
	      }
	      return true;
	    }

	    /**
	     * A specialized version of `_.filter` for arrays without support for callback
	     * shorthands and `this` binding.
	     *
	     * @private
	     * @param {Array} array The array to iterate over.
	     * @param {Function} predicate The function invoked per iteration.
	     * @returns {Array} Returns the new filtered array.
	     */
	    function arrayFilter(array, predicate) {
	      var index = -1,
	          length = array.length,
	          resIndex = -1,
	          result = [];

	      while (++index < length) {
	        var value = array[index];
	        if (predicate(value, index, array)) {
	          result[++resIndex] = value;
	        }
	      }
	      return result;
	    }

	    /**
	     * A specialized version of `_.map` for arrays without support for callback
	     * shorthands and `this` binding.
	     *
	     * @private
	     * @param {Array} array The array to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @returns {Array} Returns the new mapped array.
	     */
	    function arrayMap(array, iteratee) {
	      var index = -1,
	          length = array.length,
	          result = Array(length);

	      while (++index < length) {
	        result[index] = iteratee(array[index], index, array);
	      }
	      return result;
	    }

	    /**
	     * A specialized version of `_.max` for arrays without support for iteratees.
	     *
	     * @private
	     * @param {Array} array The array to iterate over.
	     * @returns {*} Returns the maximum value.
	     */
	    function arrayMax(array) {
	      var index = -1,
	          length = array.length,
	          result = NEGATIVE_INFINITY;

	      while (++index < length) {
	        var value = array[index];
	        if (value > result) {
	          result = value;
	        }
	      }
	      return result;
	    }

	    /**
	     * A specialized version of `_.min` for arrays without support for iteratees.
	     *
	     * @private
	     * @param {Array} array The array to iterate over.
	     * @returns {*} Returns the minimum value.
	     */
	    function arrayMin(array) {
	      var index = -1,
	          length = array.length,
	          result = POSITIVE_INFINITY;

	      while (++index < length) {
	        var value = array[index];
	        if (value < result) {
	          result = value;
	        }
	      }
	      return result;
	    }

	    /**
	     * A specialized version of `_.reduce` for arrays without support for callback
	     * shorthands and `this` binding.
	     *
	     * @private
	     * @param {Array} array The array to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @param {*} [accumulator] The initial value.
	     * @param {boolean} [initFromArray] Specify using the first element of `array`
	     *  as the initial value.
	     * @returns {*} Returns the accumulated value.
	     */
	    function arrayReduce(array, iteratee, accumulator, initFromArray) {
	      var index = -1,
	          length = array.length;

	      if (initFromArray && length) {
	        accumulator = array[++index];
	      }
	      while (++index < length) {
	        accumulator = iteratee(accumulator, array[index], index, array);
	      }
	      return accumulator;
	    }

	    /**
	     * A specialized version of `_.reduceRight` for arrays without support for
	     * callback shorthands and `this` binding.
	     *
	     * @private
	     * @param {Array} array The array to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @param {*} [accumulator] The initial value.
	     * @param {boolean} [initFromArray] Specify using the last element of `array`
	     *  as the initial value.
	     * @returns {*} Returns the accumulated value.
	     */
	    function arrayReduceRight(array, iteratee, accumulator, initFromArray) {
	      var length = array.length;
	      if (initFromArray && length) {
	        accumulator = array[--length];
	      }
	      while (length--) {
	        accumulator = iteratee(accumulator, array[length], length, array);
	      }
	      return accumulator;
	    }

	    /**
	     * A specialized version of `_.some` for arrays without support for callback
	     * shorthands and `this` binding.
	     *
	     * @private
	     * @param {Array} array The array to iterate over.
	     * @param {Function} predicate The function invoked per iteration.
	     * @returns {boolean} Returns `true` if any element passes the predicate check,
	     *  else `false`.
	     */
	    function arraySome(array, predicate) {
	      var index = -1,
	          length = array.length;

	      while (++index < length) {
	        if (predicate(array[index], index, array)) {
	          return true;
	        }
	      }
	      return false;
	    }

	    /**
	     * A specialized version of `_.sum` for arrays without support for iteratees.
	     *
	     * @private
	     * @param {Array} array The array to iterate over.
	     * @returns {number} Returns the sum.
	     */
	    function arraySum(array) {
	      var length = array.length,
	          result = 0;

	      while (length--) {
	        result += +array[length] || 0;
	      }
	      return result;
	    }

	    /**
	     * Used by `_.defaults` to customize its `_.assign` use.
	     *
	     * @private
	     * @param {*} objectValue The destination object property value.
	     * @param {*} sourceValue The source object property value.
	     * @returns {*} Returns the value to assign to the destination object.
	     */
	    function assignDefaults(objectValue, sourceValue) {
	      return typeof objectValue == 'undefined' ? sourceValue : objectValue;
	    }

	    /**
	     * Used by `_.template` to customize its `_.assign` use.
	     *
	     * **Note:** This method is like `assignDefaults` except that it ignores
	     * inherited property values when checking if a property is `undefined`.
	     *
	     * @private
	     * @param {*} objectValue The destination object property value.
	     * @param {*} sourceValue The source object property value.
	     * @param {string} key The key associated with the object and source values.
	     * @param {Object} object The destination object.
	     * @returns {*} Returns the value to assign to the destination object.
	     */
	    function assignOwnDefaults(objectValue, sourceValue, key, object) {
	      return (typeof objectValue == 'undefined' || !hasOwnProperty.call(object, key))
	        ? sourceValue
	        : objectValue;
	    }

	    /**
	     * The base implementation of `_.assign` without support for argument juggling,
	     * multiple sources, and `this` binding `customizer` functions.
	     *
	     * @private
	     * @param {Object} object The destination object.
	     * @param {Object} source The source object.
	     * @param {Function} [customizer] The function to customize assigning values.
	     * @returns {Object} Returns the destination object.
	     */
	    function baseAssign(object, source, customizer) {
	      var props = keys(source);
	      if (!customizer) {
	        return baseCopy(source, object, props);
	      }
	      var index = -1,
	          length = props.length;

	      while (++index < length) {
	        var key = props[index],
	            value = object[key],
	            result = customizer(value, source[key], key, object, source);

	        if ((result === result ? (result !== value) : (value === value)) ||
	            (typeof value == 'undefined' && !(key in object))) {
	          object[key] = result;
	        }
	      }
	      return object;
	    }

	    /**
	     * The base implementation of `_.at` without support for strings and individual
	     * key arguments.
	     *
	     * @private
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {number[]|string[]} [props] The property names or indexes of elements to pick.
	     * @returns {Array} Returns the new array of picked elements.
	     */
	    function baseAt(collection, props) {
	      var index = -1,
	          length = collection.length,
	          isArr = isLength(length),
	          propsLength = props.length,
	          result = Array(propsLength);

	      while(++index < propsLength) {
	        var key = props[index];
	        if (isArr) {
	          key = parseFloat(key);
	          result[index] = isIndex(key, length) ? collection[key] : undefined;
	        } else {
	          result[index] = collection[key];
	        }
	      }
	      return result;
	    }

	    /**
	     * Copies the properties of `source` to `object`.
	     *
	     * @private
	     * @param {Object} source The object to copy properties from.
	     * @param {Object} [object={}] The object to copy properties to.
	     * @param {Array} props The property names to copy.
	     * @returns {Object} Returns `object`.
	     */
	    function baseCopy(source, object, props) {
	      if (!props) {
	        props = object;
	        object = {};
	      }
	      var index = -1,
	          length = props.length;

	      while (++index < length) {
	        var key = props[index];
	        object[key] = source[key];
	      }
	      return object;
	    }

	    /**
	     * The base implementation of `_.callback` which supports specifying the
	     * number of arguments to provide to `func`.
	     *
	     * @private
	     * @param {*} [func=_.identity] The value to convert to a callback.
	     * @param {*} [thisArg] The `this` binding of `func`.
	     * @param {number} [argCount] The number of arguments to provide to `func`.
	     * @returns {Function} Returns the callback.
	     */
	    function baseCallback(func, thisArg, argCount) {
	      var type = typeof func;
	      if (type == 'function') {
	        return typeof thisArg == 'undefined'
	          ? func
	          : bindCallback(func, thisArg, argCount);
	      }
	      if (func == null) {
	        return identity;
	      }
	      if (type == 'object') {
	        return baseMatches(func);
	      }
	      return typeof thisArg == 'undefined'
	        ? baseProperty(func + '')
	        : baseMatchesProperty(func + '', thisArg);
	    }

	    /**
	     * The base implementation of `_.clone` without support for argument juggling
	     * and `this` binding `customizer` functions.
	     *
	     * @private
	     * @param {*} value The value to clone.
	     * @param {boolean} [isDeep] Specify a deep clone.
	     * @param {Function} [customizer] The function to customize cloning values.
	     * @param {string} [key] The key of `value`.
	     * @param {Object} [object] The object `value` belongs to.
	     * @param {Array} [stackA=[]] Tracks traversed source objects.
	     * @param {Array} [stackB=[]] Associates clones with source counterparts.
	     * @returns {*} Returns the cloned value.
	     */
	    function baseClone(value, isDeep, customizer, key, object, stackA, stackB) {
	      var result;
	      if (customizer) {
	        result = object ? customizer(value, key, object) : customizer(value);
	      }
	      if (typeof result != 'undefined') {
	        return result;
	      }
	      if (!isObject(value)) {
	        return value;
	      }
	      var isArr = isArray(value);
	      if (isArr) {
	        result = initCloneArray(value);
	        if (!isDeep) {
	          return arrayCopy(value, result);
	        }
	      } else {
	        var tag = objToString.call(value),
	            isFunc = tag == funcTag;

	        if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
	          result = initCloneObject(isFunc ? {} : value);
	          if (!isDeep) {
	            return baseCopy(value, result, keys(value));
	          }
	        } else {
	          return cloneableTags[tag]
	            ? initCloneByTag(value, tag, isDeep)
	            : (object ? value : {});
	        }
	      }
	      // Check for circular references and return corresponding clone.
	      stackA || (stackA = []);
	      stackB || (stackB = []);

	      var length = stackA.length;
	      while (length--) {
	        if (stackA[length] == value) {
	          return stackB[length];
	        }
	      }
	      // Add the source value to the stack of traversed objects and associate it with its clone.
	      stackA.push(value);
	      stackB.push(result);

	      // Recursively populate clone (susceptible to call stack limits).
	      (isArr ? arrayEach : baseForOwn)(value, function(subValue, key) {
	        result[key] = baseClone(subValue, isDeep, customizer, key, value, stackA, stackB);
	      });
	      return result;
	    }

	    /**
	     * The base implementation of `_.create` without support for assigning
	     * properties to the created object.
	     *
	     * @private
	     * @param {Object} prototype The object to inherit from.
	     * @returns {Object} Returns the new object.
	     */
	    var baseCreate = (function() {
	      function Object() {}
	      return function(prototype) {
	        if (isObject(prototype)) {
	          Object.prototype = prototype;
	          var result = new Object;
	          Object.prototype = null;
	        }
	        return result || context.Object();
	      };
	    }());

	    /**
	     * The base implementation of `_.delay` and `_.defer` which accepts an index
	     * of where to slice the arguments to provide to `func`.
	     *
	     * @private
	     * @param {Function} func The function to delay.
	     * @param {number} wait The number of milliseconds to delay invocation.
	     * @param {Object} args The arguments provide to `func`.
	     * @returns {number} Returns the timer id.
	     */
	    function baseDelay(func, wait, args) {
	      if (typeof func != 'function') {
	        throw new TypeError(FUNC_ERROR_TEXT);
	      }
	      return setTimeout(function() { func.apply(undefined, args); }, wait);
	    }

	    /**
	     * The base implementation of `_.difference` which accepts a single array
	     * of values to exclude.
	     *
	     * @private
	     * @param {Array} array The array to inspect.
	     * @param {Array} values The values to exclude.
	     * @returns {Array} Returns the new array of filtered values.
	     */
	    function baseDifference(array, values) {
	      var length = array ? array.length : 0,
	          result = [];

	      if (!length) {
	        return result;
	      }
	      var index = -1,
	          indexOf = getIndexOf(),
	          isCommon = indexOf == baseIndexOf,
	          cache = (isCommon && values.length >= 200) ? createCache(values) : null,
	          valuesLength = values.length;

	      if (cache) {
	        indexOf = cacheIndexOf;
	        isCommon = false;
	        values = cache;
	      }
	      outer:
	      while (++index < length) {
	        var value = array[index];

	        if (isCommon && value === value) {
	          var valuesIndex = valuesLength;
	          while (valuesIndex--) {
	            if (values[valuesIndex] === value) {
	              continue outer;
	            }
	          }
	          result.push(value);
	        }
	        else if (indexOf(values, value, 0) < 0) {
	          result.push(value);
	        }
	      }
	      return result;
	    }

	    /**
	     * The base implementation of `_.forEach` without support for callback
	     * shorthands and `this` binding.
	     *
	     * @private
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @returns {Array|Object|string} Returns `collection`.
	     */
	    var baseEach = createBaseEach(baseForOwn);

	    /**
	     * The base implementation of `_.forEachRight` without support for callback
	     * shorthands and `this` binding.
	     *
	     * @private
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @returns {Array|Object|string} Returns `collection`.
	     */
	    var baseEachRight = createBaseEach(baseForOwnRight, true);

	    /**
	     * The base implementation of `_.every` without support for callback
	     * shorthands and `this` binding.
	     *
	     * @private
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function} predicate The function invoked per iteration.
	     * @returns {boolean} Returns `true` if all elements pass the predicate check,
	     *  else `false`
	     */
	    function baseEvery(collection, predicate) {
	      var result = true;
	      baseEach(collection, function(value, index, collection) {
	        result = !!predicate(value, index, collection);
	        return result;
	      });
	      return result;
	    }

	    /**
	     * The base implementation of `_.fill` without an iteratee call guard.
	     *
	     * @private
	     * @param {Array} array The array to fill.
	     * @param {*} value The value to fill `array` with.
	     * @param {number} [start=0] The start position.
	     * @param {number} [end=array.length] The end position.
	     * @returns {Array} Returns `array`.
	     */
	    function baseFill(array, value, start, end) {
	      var length = array.length;

	      start = start == null ? 0 : (+start || 0);
	      if (start < 0) {
	        start = -start > length ? 0 : (length + start);
	      }
	      end = (typeof end == 'undefined' || end > length) ? length : (+end || 0);
	      if (end < 0) {
	        end += length;
	      }
	      length = start > end ? 0 : (end >>> 0);
	      start >>>= 0;

	      while (start < length) {
	        array[start++] = value;
	      }
	      return array;
	    }

	    /**
	     * The base implementation of `_.filter` without support for callback
	     * shorthands and `this` binding.
	     *
	     * @private
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function} predicate The function invoked per iteration.
	     * @returns {Array} Returns the new filtered array.
	     */
	    function baseFilter(collection, predicate) {
	      var result = [];
	      baseEach(collection, function(value, index, collection) {
	        if (predicate(value, index, collection)) {
	          result.push(value);
	        }
	      });
	      return result;
	    }

	    /**
	     * The base implementation of `_.find`, `_.findLast`, `_.findKey`, and `_.findLastKey`,
	     * without support for callback shorthands and `this` binding, which iterates
	     * over `collection` using the provided `eachFunc`.
	     *
	     * @private
	     * @param {Array|Object|string} collection The collection to search.
	     * @param {Function} predicate The function invoked per iteration.
	     * @param {Function} eachFunc The function to iterate over `collection`.
	     * @param {boolean} [retKey] Specify returning the key of the found element
	     *  instead of the element itself.
	     * @returns {*} Returns the found element or its key, else `undefined`.
	     */
	    function baseFind(collection, predicate, eachFunc, retKey) {
	      var result;
	      eachFunc(collection, function(value, key, collection) {
	        if (predicate(value, key, collection)) {
	          result = retKey ? key : value;
	          return false;
	        }
	      });
	      return result;
	    }

	    /**
	     * The base implementation of `_.flatten` with added support for restricting
	     * flattening and specifying the start index.
	     *
	     * @private
	     * @param {Array} array The array to flatten.
	     * @param {boolean} isDeep Specify a deep flatten.
	     * @param {boolean} isStrict Restrict flattening to arrays and `arguments` objects.
	     * @returns {Array} Returns the new flattened array.
	     */
	    function baseFlatten(array, isDeep, isStrict) {
	      var index = -1,
	          length = array.length,
	          resIndex = -1,
	          result = [];

	      while (++index < length) {
	        var value = array[index];

	        if (isObjectLike(value) && isLength(value.length) && (isArray(value) || isArguments(value))) {
	          if (isDeep) {
	            // Recursively flatten arrays (susceptible to call stack limits).
	            value = baseFlatten(value, isDeep, isStrict);
	          }
	          var valIndex = -1,
	              valLength = value.length;

	          result.length += valLength;
	          while (++valIndex < valLength) {
	            result[++resIndex] = value[valIndex];
	          }
	        } else if (!isStrict) {
	          result[++resIndex] = value;
	        }
	      }
	      return result;
	    }

	    /**
	     * The base implementation of `baseForIn` and `baseForOwn` which iterates
	     * over `object` properties returned by `keysFunc` invoking `iteratee` for
	     * each property. Iterator functions may exit iteration early by explicitly
	     * returning `false`.
	     *
	     * @private
	     * @param {Object} object The object to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @param {Function} keysFunc The function to get the keys of `object`.
	     * @returns {Object} Returns `object`.
	     */
	    var baseFor = createBaseFor();

	    /**
	     * This function is like `baseFor` except that it iterates over properties
	     * in the opposite order.
	     *
	     * @private
	     * @param {Object} object The object to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @param {Function} keysFunc The function to get the keys of `object`.
	     * @returns {Object} Returns `object`.
	     */
	    var baseForRight = createBaseFor(true);

	    /**
	     * The base implementation of `_.forIn` without support for callback
	     * shorthands and `this` binding.
	     *
	     * @private
	     * @param {Object} object The object to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @returns {Object} Returns `object`.
	     */
	    function baseForIn(object, iteratee) {
	      return baseFor(object, iteratee, keysIn);
	    }

	    /**
	     * The base implementation of `_.forOwn` without support for callback
	     * shorthands and `this` binding.
	     *
	     * @private
	     * @param {Object} object The object to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @returns {Object} Returns `object`.
	     */
	    function baseForOwn(object, iteratee) {
	      return baseFor(object, iteratee, keys);
	    }

	    /**
	     * The base implementation of `_.forOwnRight` without support for callback
	     * shorthands and `this` binding.
	     *
	     * @private
	     * @param {Object} object The object to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @returns {Object} Returns `object`.
	     */
	    function baseForOwnRight(object, iteratee) {
	      return baseForRight(object, iteratee, keys);
	    }

	    /**
	     * The base implementation of `_.functions` which creates an array of
	     * `object` function property names filtered from those provided.
	     *
	     * @private
	     * @param {Object} object The object to inspect.
	     * @param {Array} props The property names to filter.
	     * @returns {Array} Returns the new array of filtered property names.
	     */
	    function baseFunctions(object, props) {
	      var index = -1,
	          length = props.length,
	          resIndex = -1,
	          result = [];

	      while (++index < length) {
	        var key = props[index];
	        if (isFunction(object[key])) {
	          result[++resIndex] = key;
	        }
	      }
	      return result;
	    }

	    /**
	     * The base implementation of `_.isEqual` without support for `this` binding
	     * `customizer` functions.
	     *
	     * @private
	     * @param {*} value The value to compare.
	     * @param {*} other The other value to compare.
	     * @param {Function} [customizer] The function to customize comparing values.
	     * @param {boolean} [isLoose] Specify performing partial comparisons.
	     * @param {Array} [stackA] Tracks traversed `value` objects.
	     * @param {Array} [stackB] Tracks traversed `other` objects.
	     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	     */
	    function baseIsEqual(value, other, customizer, isLoose, stackA, stackB) {
	      // Exit early for identical values.
	      if (value === other) {
	        // Treat `+0` vs. `-0` as not equal.
	        return value !== 0 || (1 / value == 1 / other);
	      }
	      var valType = typeof value,
	          othType = typeof other;

	      // Exit early for unlike primitive values.
	      if ((valType != 'function' && valType != 'object' && othType != 'function' && othType != 'object') ||
	          value == null || other == null) {
	        // Return `false` unless both values are `NaN`.
	        return value !== value && other !== other;
	      }
	      return baseIsEqualDeep(value, other, baseIsEqual, customizer, isLoose, stackA, stackB);
	    }

	    /**
	     * A specialized version of `baseIsEqual` for arrays and objects which performs
	     * deep comparisons and tracks traversed objects enabling objects with circular
	     * references to be compared.
	     *
	     * @private
	     * @param {Object} object The object to compare.
	     * @param {Object} other The other object to compare.
	     * @param {Function} equalFunc The function to determine equivalents of values.
	     * @param {Function} [customizer] The function to customize comparing objects.
	     * @param {boolean} [isLoose] Specify performing partial comparisons.
	     * @param {Array} [stackA=[]] Tracks traversed `value` objects.
	     * @param {Array} [stackB=[]] Tracks traversed `other` objects.
	     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	     */
	    function baseIsEqualDeep(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
	      var objIsArr = isArray(object),
	          othIsArr = isArray(other),
	          objTag = arrayTag,
	          othTag = arrayTag;

	      if (!objIsArr) {
	        objTag = objToString.call(object);
	        if (objTag == argsTag) {
	          objTag = objectTag;
	        } else if (objTag != objectTag) {
	          objIsArr = isTypedArray(object);
	        }
	      }
	      if (!othIsArr) {
	        othTag = objToString.call(other);
	        if (othTag == argsTag) {
	          othTag = objectTag;
	        } else if (othTag != objectTag) {
	          othIsArr = isTypedArray(other);
	        }
	      }
	      var objIsObj = (objTag == objectTag || (isLoose && objTag == funcTag)),
	          othIsObj = (othTag == objectTag || (isLoose && othTag == funcTag)),
	          isSameTag = objTag == othTag;

	      if (isSameTag && !(objIsArr || objIsObj)) {
	        return equalByTag(object, other, objTag);
	      }
	      if (isLoose) {
	        if (!isSameTag && !(objIsObj && othIsObj)) {
	          return false;
	        }
	      } else {
	        var valWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
	            othWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

	        if (valWrapped || othWrapped) {
	          return equalFunc(valWrapped ? object.value() : object, othWrapped ? other.value() : other, customizer, isLoose, stackA, stackB);
	        }
	        if (!isSameTag) {
	          return false;
	        }
	      }
	      // Assume cyclic values are equal.
	      // For more information on detecting circular references see https://es5.github.io/#JO.
	      stackA || (stackA = []);
	      stackB || (stackB = []);

	      var length = stackA.length;
	      while (length--) {
	        if (stackA[length] == object) {
	          return stackB[length] == other;
	        }
	      }
	      // Add `object` and `other` to the stack of traversed objects.
	      stackA.push(object);
	      stackB.push(other);

	      var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, isLoose, stackA, stackB);

	      stackA.pop();
	      stackB.pop();

	      return result;
	    }

	    /**
	     * The base implementation of `_.isMatch` without support for callback
	     * shorthands and `this` binding.
	     *
	     * @private
	     * @param {Object} object The object to inspect.
	     * @param {Array} props The source property names to match.
	     * @param {Array} values The source values to match.
	     * @param {Array} strictCompareFlags Strict comparison flags for source values.
	     * @param {Function} [customizer] The function to customize comparing objects.
	     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
	     */
	    function baseIsMatch(object, props, values, strictCompareFlags, customizer) {
	      var index = -1,
	          length = props.length,
	          noCustomizer = !customizer;

	      while (++index < length) {
	        if ((noCustomizer && strictCompareFlags[index])
	              ? values[index] !== object[props[index]]
	              : !(props[index] in object)
	            ) {
	          return false;
	        }
	      }
	      index = -1;
	      while (++index < length) {
	        var key = props[index],
	            objValue = object[key],
	            srcValue = values[index];

	        if (noCustomizer && strictCompareFlags[index]) {
	          var result = typeof objValue != 'undefined' || (key in object);
	        } else {
	          result = customizer ? customizer(objValue, srcValue, key) : undefined;
	          if (typeof result == 'undefined') {
	            result = baseIsEqual(srcValue, objValue, customizer, true);
	          }
	        }
	        if (!result) {
	          return false;
	        }
	      }
	      return true;
	    }

	    /**
	     * The base implementation of `_.map` without support for callback shorthands
	     * and `this` binding.
	     *
	     * @private
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @returns {Array} Returns the new mapped array.
	     */
	    function baseMap(collection, iteratee) {
	      var result = [];
	      baseEach(collection, function(value, key, collection) {
	        result.push(iteratee(value, key, collection));
	      });
	      return result;
	    }

	    /**
	     * The base implementation of `_.matches` which does not clone `source`.
	     *
	     * @private
	     * @param {Object} source The object of property values to match.
	     * @returns {Function} Returns the new function.
	     */
	    function baseMatches(source) {
	      var props = keys(source),
	          length = props.length;

	      if (!length) {
	        return constant(true);
	      }
	      if (length == 1) {
	        var key = props[0],
	            value = source[key];

	        if (isStrictComparable(value)) {
	          return function(object) {
	            return object != null && object[key] === value &&
	              (typeof value != 'undefined' || (key in toObject(object)));
	          };
	        }
	      }
	      var values = Array(length),
	          strictCompareFlags = Array(length);

	      while (length--) {
	        value = source[props[length]];
	        values[length] = value;
	        strictCompareFlags[length] = isStrictComparable(value);
	      }
	      return function(object) {
	        return object != null && baseIsMatch(toObject(object), props, values, strictCompareFlags);
	      };
	    }

	    /**
	     * The base implementation of `_.matchesProperty` which does not coerce `key`
	     * to a string.
	     *
	     * @private
	     * @param {string} key The key of the property to get.
	     * @param {*} value The value to compare.
	     * @returns {Function} Returns the new function.
	     */
	    function baseMatchesProperty(key, value) {
	      if (isStrictComparable(value)) {
	        return function(object) {
	          return object != null && object[key] === value &&
	            (typeof value != 'undefined' || (key in toObject(object)));
	        };
	      }
	      return function(object) {
	        return object != null && baseIsEqual(value, object[key], null, true);
	      };
	    }

	    /**
	     * The base implementation of `_.merge` without support for argument juggling,
	     * multiple sources, and `this` binding `customizer` functions.
	     *
	     * @private
	     * @param {Object} object The destination object.
	     * @param {Object} source The source object.
	     * @param {Function} [customizer] The function to customize merging properties.
	     * @param {Array} [stackA=[]] Tracks traversed source objects.
	     * @param {Array} [stackB=[]] Associates values with source counterparts.
	     * @returns {Object} Returns the destination object.
	     */
	    function baseMerge(object, source, customizer, stackA, stackB) {
	      if (!isObject(object)) {
	        return object;
	      }
	      var isSrcArr = isLength(source.length) && (isArray(source) || isTypedArray(source));
	      (isSrcArr ? arrayEach : baseForOwn)(source, function(srcValue, key, source) {
	        if (isObjectLike(srcValue)) {
	          stackA || (stackA = []);
	          stackB || (stackB = []);
	          return baseMergeDeep(object, source, key, baseMerge, customizer, stackA, stackB);
	        }
	        var value = object[key],
	            result = customizer ? customizer(value, srcValue, key, object, source) : undefined,
	            isCommon = typeof result == 'undefined';

	        if (isCommon) {
	          result = srcValue;
	        }
	        if ((isSrcArr || typeof result != 'undefined') &&
	            (isCommon || (result === result ? (result !== value) : (value === value)))) {
	          object[key] = result;
	        }
	      });
	      return object;
	    }

	    /**
	     * A specialized version of `baseMerge` for arrays and objects which performs
	     * deep merges and tracks traversed objects enabling objects with circular
	     * references to be merged.
	     *
	     * @private
	     * @param {Object} object The destination object.
	     * @param {Object} source The source object.
	     * @param {string} key The key of the value to merge.
	     * @param {Function} mergeFunc The function to merge values.
	     * @param {Function} [customizer] The function to customize merging properties.
	     * @param {Array} [stackA=[]] Tracks traversed source objects.
	     * @param {Array} [stackB=[]] Associates values with source counterparts.
	     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	     */
	    function baseMergeDeep(object, source, key, mergeFunc, customizer, stackA, stackB) {
	      var length = stackA.length,
	          srcValue = source[key];

	      while (length--) {
	        if (stackA[length] == srcValue) {
	          object[key] = stackB[length];
	          return;
	        }
	      }
	      var value = object[key],
	          result = customizer ? customizer(value, srcValue, key, object, source) : undefined,
	          isCommon = typeof result == 'undefined';

	      if (isCommon) {
	        result = srcValue;
	        if (isLength(srcValue.length) && (isArray(srcValue) || isTypedArray(srcValue))) {
	          result = isArray(value)
	            ? value
	            : ((value && value.length) ? arrayCopy(value) : []);
	        }
	        else if (isPlainObject(srcValue) || isArguments(srcValue)) {
	          result = isArguments(value)
	            ? toPlainObject(value)
	            : (isPlainObject(value) ? value : {});
	        }
	        else {
	          isCommon = false;
	        }
	      }
	      // Add the source value to the stack of traversed objects and associate
	      // it with its merged value.
	      stackA.push(srcValue);
	      stackB.push(result);

	      if (isCommon) {
	        // Recursively merge objects and arrays (susceptible to call stack limits).
	        object[key] = mergeFunc(result, srcValue, customizer, stackA, stackB);
	      } else if (result === result ? (result !== value) : (value === value)) {
	        object[key] = result;
	      }
	    }

	    /**
	     * The base implementation of `_.property` which does not coerce `key` to a string.
	     *
	     * @private
	     * @param {string} key The key of the property to get.
	     * @returns {Function} Returns the new function.
	     */
	    function baseProperty(key) {
	      return function(object) {
	        return object == null ? undefined : object[key];
	      };
	    }

	    /**
	     * The base implementation of `_.random` without support for argument juggling
	     * and returning floating-point numbers.
	     *
	     * @private
	     * @param {number} min The minimum possible value.
	     * @param {number} max The maximum possible value.
	     * @returns {number} Returns the random number.
	     */
	    function baseRandom(min, max) {
	      return min + floor(nativeRandom() * (max - min + 1));
	    }

	    /**
	     * The base implementation of `_.reduce` and `_.reduceRight` without support
	     * for callback shorthands and `this` binding, which iterates over `collection`
	     * using the provided `eachFunc`.
	     *
	     * @private
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @param {*} accumulator The initial value.
	     * @param {boolean} initFromCollection Specify using the first or last element
	     *  of `collection` as the initial value.
	     * @param {Function} eachFunc The function to iterate over `collection`.
	     * @returns {*} Returns the accumulated value.
	     */
	    function baseReduce(collection, iteratee, accumulator, initFromCollection, eachFunc) {
	      eachFunc(collection, function(value, index, collection) {
	        accumulator = initFromCollection
	          ? (initFromCollection = false, value)
	          : iteratee(accumulator, value, index, collection);
	      });
	      return accumulator;
	    }

	    /**
	     * The base implementation of `setData` without support for hot loop detection.
	     *
	     * @private
	     * @param {Function} func The function to associate metadata with.
	     * @param {*} data The metadata.
	     * @returns {Function} Returns `func`.
	     */
	    var baseSetData = !metaMap ? identity : function(func, data) {
	      metaMap.set(func, data);
	      return func;
	    };

	    /**
	     * The base implementation of `_.slice` without an iteratee call guard.
	     *
	     * @private
	     * @param {Array} array The array to slice.
	     * @param {number} [start=0] The start position.
	     * @param {number} [end=array.length] The end position.
	     * @returns {Array} Returns the slice of `array`.
	     */
	    function baseSlice(array, start, end) {
	      var index = -1,
	          length = array.length;

	      start = start == null ? 0 : (+start || 0);
	      if (start < 0) {
	        start = -start > length ? 0 : (length + start);
	      }
	      end = (typeof end == 'undefined' || end > length) ? length : (+end || 0);
	      if (end < 0) {
	        end += length;
	      }
	      length = start > end ? 0 : ((end - start) >>> 0);
	      start >>>= 0;

	      var result = Array(length);
	      while (++index < length) {
	        result[index] = array[index + start];
	      }
	      return result;
	    }

	    /**
	     * The base implementation of `_.some` without support for callback shorthands
	     * and `this` binding.
	     *
	     * @private
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function} predicate The function invoked per iteration.
	     * @returns {boolean} Returns `true` if any element passes the predicate check,
	     *  else `false`.
	     */
	    function baseSome(collection, predicate) {
	      var result;

	      baseEach(collection, function(value, index, collection) {
	        result = predicate(value, index, collection);
	        return !result;
	      });
	      return !!result;
	    }

	    /**
	     * The base implementation of `_.sortBy` which uses `comparer` to define
	     * the sort order of `array` and replaces criteria objects with their
	     * corresponding values.
	     *
	     * @private
	     * @param {Array} array The array to sort.
	     * @param {Function} comparer The function to define sort order.
	     * @returns {Array} Returns `array`.
	     */
	    function baseSortBy(array, comparer) {
	      var length = array.length;

	      array.sort(comparer);
	      while (length--) {
	        array[length] = array[length].value;
	      }
	      return array;
	    }

	    /**
	     * The base implementation of `_.sortByOrder` without param guards.
	     *
	     * @private
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {string[]} props The property names to sort by.
	     * @param {boolean[]} orders The sort orders of `props`.
	     * @returns {Array} Returns the new sorted array.
	     */
	    function baseSortByOrder(collection, props, orders) {
	      var index = -1,
	          length = collection.length,
	          result = isLength(length) ? Array(length) : [];

	      baseEach(collection, function(value) {
	        var length = props.length,
	            criteria = Array(length);

	        while (length--) {
	          criteria[length] = value == null ? undefined : value[props[length]];
	        }
	        result[++index] = { 'criteria': criteria, 'index': index, 'value': value };
	      });

	      return baseSortBy(result, function(object, other) {
	        return compareMultiple(object, other, orders);
	      });
	    }

	    /**
	     * The base implementation of `_.sum` without support for callback shorthands
	     * and `this` binding.
	     *
	     * @private
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @returns {number} Returns the sum.
	     */
	    function baseSum(collection, iteratee) {
	      var result = 0;
	      baseEach(collection, function(value, index, collection) {
	        result += +iteratee(value, index, collection) || 0;
	      });
	      return result;
	    }

	    /**
	     * The base implementation of `_.uniq` without support for callback shorthands
	     * and `this` binding.
	     *
	     * @private
	     * @param {Array} array The array to inspect.
	     * @param {Function} [iteratee] The function invoked per iteration.
	     * @returns {Array} Returns the new duplicate-value-free array.
	     */
	    function baseUniq(array, iteratee) {
	      var index = -1,
	          indexOf = getIndexOf(),
	          length = array.length,
	          isCommon = indexOf == baseIndexOf,
	          isLarge = isCommon && length >= 200,
	          seen = isLarge ? createCache() : null,
	          result = [];

	      if (seen) {
	        indexOf = cacheIndexOf;
	        isCommon = false;
	      } else {
	        isLarge = false;
	        seen = iteratee ? [] : result;
	      }
	      outer:
	      while (++index < length) {
	        var value = array[index],
	            computed = iteratee ? iteratee(value, index, array) : value;

	        if (isCommon && value === value) {
	          var seenIndex = seen.length;
	          while (seenIndex--) {
	            if (seen[seenIndex] === computed) {
	              continue outer;
	            }
	          }
	          if (iteratee) {
	            seen.push(computed);
	          }
	          result.push(value);
	        }
	        else if (indexOf(seen, computed, 0) < 0) {
	          if (iteratee || isLarge) {
	            seen.push(computed);
	          }
	          result.push(value);
	        }
	      }
	      return result;
	    }

	    /**
	     * The base implementation of `_.values` and `_.valuesIn` which creates an
	     * array of `object` property values corresponding to the property names
	     * returned by `keysFunc`.
	     *
	     * @private
	     * @param {Object} object The object to query.
	     * @param {Array} props The property names to get values for.
	     * @returns {Object} Returns the array of property values.
	     */
	    function baseValues(object, props) {
	      var index = -1,
	          length = props.length,
	          result = Array(length);

	      while (++index < length) {
	        result[index] = object[props[index]];
	      }
	      return result;
	    }

	    /**
	     * The base implementation of `_.dropRightWhile`, `_.dropWhile`, `_.takeRightWhile`,
	     * and `_.takeWhile` without support for callback shorthands and `this` binding.
	     *
	     * @private
	     * @param {Array} array The array to query.
	     * @param {Function} predicate The function invoked per iteration.
	     * @param {boolean} [isDrop] Specify dropping elements instead of taking them.
	     * @param {boolean} [fromRight] Specify iterating from right to left.
	     * @returns {Array} Returns the slice of `array`.
	     */
	    function baseWhile(array, predicate, isDrop, fromRight) {
	      var length = array.length,
	          index = fromRight ? length : -1;

	      while ((fromRight ? index-- : ++index < length) && predicate(array[index], index, array)) {}
	      return isDrop
	        ? baseSlice(array, (fromRight ? 0 : index), (fromRight ? index + 1 : length))
	        : baseSlice(array, (fromRight ? index + 1 : 0), (fromRight ? length : index));
	    }

	    /**
	     * The base implementation of `wrapperValue` which returns the result of
	     * performing a sequence of actions on the unwrapped `value`, where each
	     * successive action is supplied the return value of the previous.
	     *
	     * @private
	     * @param {*} value The unwrapped value.
	     * @param {Array} actions Actions to peform to resolve the unwrapped value.
	     * @returns {*} Returns the resolved value.
	     */
	    function baseWrapperValue(value, actions) {
	      var result = value;
	      if (result instanceof LazyWrapper) {
	        result = result.value();
	      }
	      var index = -1,
	          length = actions.length;

	      while (++index < length) {
	        var args = [result],
	            action = actions[index];

	        push.apply(args, action.args);
	        result = action.func.apply(action.thisArg, args);
	      }
	      return result;
	    }

	    /**
	     * Performs a binary search of `array` to determine the index at which `value`
	     * should be inserted into `array` in order to maintain its sort order.
	     *
	     * @private
	     * @param {Array} array The sorted array to inspect.
	     * @param {*} value The value to evaluate.
	     * @param {boolean} [retHighest] Specify returning the highest qualified index.
	     * @returns {number} Returns the index at which `value` should be inserted
	     *  into `array`.
	     */
	    function binaryIndex(array, value, retHighest) {
	      var low = 0,
	          high = array ? array.length : low;

	      if (typeof value == 'number' && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
	        while (low < high) {
	          var mid = (low + high) >>> 1,
	              computed = array[mid];

	          if (retHighest ? (computed <= value) : (computed < value)) {
	            low = mid + 1;
	          } else {
	            high = mid;
	          }
	        }
	        return high;
	      }
	      return binaryIndexBy(array, value, identity, retHighest);
	    }

	    /**
	     * This function is like `binaryIndex` except that it invokes `iteratee` for
	     * `value` and each element of `array` to compute their sort ranking. The
	     * iteratee is invoked with one argument; (value).
	     *
	     * @private
	     * @param {Array} array The sorted array to inspect.
	     * @param {*} value The value to evaluate.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @param {boolean} [retHighest] Specify returning the highest qualified index.
	     * @returns {number} Returns the index at which `value` should be inserted
	     *  into `array`.
	     */
	    function binaryIndexBy(array, value, iteratee, retHighest) {
	      value = iteratee(value);

	      var low = 0,
	          high = array ? array.length : 0,
	          valIsNaN = value !== value,
	          valIsUndef = typeof value == 'undefined';

	      while (low < high) {
	        var mid = floor((low + high) / 2),
	            computed = iteratee(array[mid]),
	            isReflexive = computed === computed;

	        if (valIsNaN) {
	          var setLow = isReflexive || retHighest;
	        } else if (valIsUndef) {
	          setLow = isReflexive && (retHighest || typeof computed != 'undefined');
	        } else {
	          setLow = retHighest ? (computed <= value) : (computed < value);
	        }
	        if (setLow) {
	          low = mid + 1;
	        } else {
	          high = mid;
	        }
	      }
	      return nativeMin(high, MAX_ARRAY_INDEX);
	    }

	    /**
	     * A specialized version of `baseCallback` which only supports `this` binding
	     * and specifying the number of arguments to provide to `func`.
	     *
	     * @private
	     * @param {Function} func The function to bind.
	     * @param {*} thisArg The `this` binding of `func`.
	     * @param {number} [argCount] The number of arguments to provide to `func`.
	     * @returns {Function} Returns the callback.
	     */
	    function bindCallback(func, thisArg, argCount) {
	      if (typeof func != 'function') {
	        return identity;
	      }
	      if (typeof thisArg == 'undefined') {
	        return func;
	      }
	      switch (argCount) {
	        case 1: return function(value) {
	          return func.call(thisArg, value);
	        };
	        case 3: return function(value, index, collection) {
	          return func.call(thisArg, value, index, collection);
	        };
	        case 4: return function(accumulator, value, index, collection) {
	          return func.call(thisArg, accumulator, value, index, collection);
	        };
	        case 5: return function(value, other, key, object, source) {
	          return func.call(thisArg, value, other, key, object, source);
	        };
	      }
	      return function() {
	        return func.apply(thisArg, arguments);
	      };
	    }

	    /**
	     * Creates a clone of the given array buffer.
	     *
	     * @private
	     * @param {ArrayBuffer} buffer The array buffer to clone.
	     * @returns {ArrayBuffer} Returns the cloned array buffer.
	     */
	    function bufferClone(buffer) {
	      return bufferSlice.call(buffer, 0);
	    }
	    if (!bufferSlice) {
	      // PhantomJS has `ArrayBuffer` and `Uint8Array` but not `Float64Array`.
	      bufferClone = !(ArrayBuffer && Uint8Array) ? constant(null) : function(buffer) {
	        var byteLength = buffer.byteLength,
	            floatLength = Float64Array ? floor(byteLength / FLOAT64_BYTES_PER_ELEMENT) : 0,
	            offset = floatLength * FLOAT64_BYTES_PER_ELEMENT,
	            result = new ArrayBuffer(byteLength);

	        if (floatLength) {
	          var view = new Float64Array(result, 0, floatLength);
	          view.set(new Float64Array(buffer, 0, floatLength));
	        }
	        if (byteLength != offset) {
	          view = new Uint8Array(result, offset);
	          view.set(new Uint8Array(buffer, offset));
	        }
	        return result;
	      };
	    }

	    /**
	     * Creates an array that is the composition of partially applied arguments,
	     * placeholders, and provided arguments into a single array of arguments.
	     *
	     * @private
	     * @param {Array|Object} args The provided arguments.
	     * @param {Array} partials The arguments to prepend to those provided.
	     * @param {Array} holders The `partials` placeholder indexes.
	     * @returns {Array} Returns the new array of composed arguments.
	     */
	    function composeArgs(args, partials, holders) {
	      var holdersLength = holders.length,
	          argsIndex = -1,
	          argsLength = nativeMax(args.length - holdersLength, 0),
	          leftIndex = -1,
	          leftLength = partials.length,
	          result = Array(argsLength + leftLength);

	      while (++leftIndex < leftLength) {
	        result[leftIndex] = partials[leftIndex];
	      }
	      while (++argsIndex < holdersLength) {
	        result[holders[argsIndex]] = args[argsIndex];
	      }
	      while (argsLength--) {
	        result[leftIndex++] = args[argsIndex++];
	      }
	      return result;
	    }

	    /**
	     * This function is like `composeArgs` except that the arguments composition
	     * is tailored for `_.partialRight`.
	     *
	     * @private
	     * @param {Array|Object} args The provided arguments.
	     * @param {Array} partials The arguments to append to those provided.
	     * @param {Array} holders The `partials` placeholder indexes.
	     * @returns {Array} Returns the new array of composed arguments.
	     */
	    function composeArgsRight(args, partials, holders) {
	      var holdersIndex = -1,
	          holdersLength = holders.length,
	          argsIndex = -1,
	          argsLength = nativeMax(args.length - holdersLength, 0),
	          rightIndex = -1,
	          rightLength = partials.length,
	          result = Array(argsLength + rightLength);

	      while (++argsIndex < argsLength) {
	        result[argsIndex] = args[argsIndex];
	      }
	      var pad = argsIndex;
	      while (++rightIndex < rightLength) {
	        result[pad + rightIndex] = partials[rightIndex];
	      }
	      while (++holdersIndex < holdersLength) {
	        result[pad + holders[holdersIndex]] = args[argsIndex++];
	      }
	      return result;
	    }

	    /**
	     * Creates a function that aggregates a collection, creating an accumulator
	     * object composed from the results of running each element in the collection
	     * through an iteratee.
	     *
	     * **Note:** This function is used to create `_.countBy`, `_.groupBy`, `_.indexBy`,
	     * and `_.partition`.
	     *
	     * @private
	     * @param {Function} setter The function to set keys and values of the accumulator object.
	     * @param {Function} [initializer] The function to initialize the accumulator object.
	     * @returns {Function} Returns the new aggregator function.
	     */
	    function createAggregator(setter, initializer) {
	      return function(collection, iteratee, thisArg) {
	        var result = initializer ? initializer() : {};
	        iteratee = getCallback(iteratee, thisArg, 3);

	        if (isArray(collection)) {
	          var index = -1,
	              length = collection.length;

	          while (++index < length) {
	            var value = collection[index];
	            setter(result, value, iteratee(value, index, collection), collection);
	          }
	        } else {
	          baseEach(collection, function(value, key, collection) {
	            setter(result, value, iteratee(value, key, collection), collection);
	          });
	        }
	        return result;
	      };
	    }

	    /**
	     * Creates a function that assigns properties of source object(s) to a given
	     * destination object.
	     *
	     * **Note:** This function is used to create `_.assign`, `_.defaults`, and `_.merge`.
	     *
	     * @private
	     * @param {Function} assigner The function to assign values.
	     * @returns {Function} Returns the new assigner function.
	     */
	    function createAssigner(assigner) {
	      return function() {
	        var args = arguments,
	            length = args.length,
	            object = args[0];

	        if (length < 2 || object == null) {
	          return object;
	        }
	        var customizer = args[length - 2],
	            thisArg = args[length - 1],
	            guard = args[3];

	        if (length > 3 && typeof customizer == 'function') {
	          customizer = bindCallback(customizer, thisArg, 5);
	          length -= 2;
	        } else {
	          customizer = (length > 2 && typeof thisArg == 'function') ? thisArg : null;
	          length -= (customizer ? 1 : 0);
	        }
	        if (guard && isIterateeCall(args[1], args[2], guard)) {
	          customizer = length == 3 ? null : customizer;
	          length = 2;
	        }
	        var index = 0;
	        while (++index < length) {
	          var source = args[index];
	          if (source) {
	            assigner(object, source, customizer);
	          }
	        }
	        return object;
	      };
	    }

	    /**
	     * Creates a `baseEach` or `baseEachRight` function.
	     *
	     * @private
	     * @param {Function} eachFunc The function to iterate over a collection.
	     * @param {boolean} [fromRight] Specify iterating from right to left.
	     * @returns {Function} Returns the new base function.
	     */
	    function createBaseEach(eachFunc, fromRight) {
	      return function(collection, iteratee) {
	        var length = collection ? collection.length : 0;
	        if (!isLength(length)) {
	          return eachFunc(collection, iteratee);
	        }
	        var index = fromRight ? length : -1,
	            iterable = toObject(collection);

	        while ((fromRight ? index-- : ++index < length)) {
	          if (iteratee(iterable[index], index, iterable) === false) {
	            break;
	          }
	        }
	        return collection;
	      };
	    }

	    /**
	     * Creates a base function for `_.forIn` or `_.forInRight`.
	     *
	     * @private
	     * @param {boolean} [fromRight] Specify iterating from right to left.
	     * @returns {Function} Returns the new base function.
	     */
	    function createBaseFor(fromRight) {
	      return function(object, iteratee, keysFunc) {
	        var iterable = toObject(object),
	            props = keysFunc(object),
	            length = props.length,
	            index = fromRight ? length : -1;

	        while ((fromRight ? index-- : ++index < length)) {
	          var key = props[index];
	          if (iteratee(iterable[key], key, iterable) === false) {
	            break;
	          }
	        }
	        return object;
	      };
	    }

	    /**
	     * Creates a function that wraps `func` and invokes it with the `this`
	     * binding of `thisArg`.
	     *
	     * @private
	     * @param {Function} func The function to bind.
	     * @param {*} [thisArg] The `this` binding of `func`.
	     * @returns {Function} Returns the new bound function.
	     */
	    function createBindWrapper(func, thisArg) {
	      var Ctor = createCtorWrapper(func);

	      function wrapper() {
	        var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
	        return fn.apply(thisArg, arguments);
	      }
	      return wrapper;
	    }

	    /**
	     * Creates a `Set` cache object to optimize linear searches of large arrays.
	     *
	     * @private
	     * @param {Array} [values] The values to cache.
	     * @returns {null|Object} Returns the new cache object if `Set` is supported, else `null`.
	     */
	    var createCache = !(nativeCreate && Set) ? constant(null) : function(values) {
	      return new SetCache(values);
	    };

	    /**
	     * Creates a function that produces compound words out of the words in a
	     * given string.
	     *
	     * @private
	     * @param {Function} callback The function to combine each word.
	     * @returns {Function} Returns the new compounder function.
	     */
	    function createCompounder(callback) {
	      return function(string) {
	        var index = -1,
	            array = words(deburr(string)),
	            length = array.length,
	            result = '';

	        while (++index < length) {
	          result = callback(result, array[index], index);
	        }
	        return result;
	      };
	    }

	    /**
	     * Creates a function that produces an instance of `Ctor` regardless of
	     * whether it was invoked as part of a `new` expression or by `call` or `apply`.
	     *
	     * @private
	     * @param {Function} Ctor The constructor to wrap.
	     * @returns {Function} Returns the new wrapped function.
	     */
	    function createCtorWrapper(Ctor) {
	      return function() {
	        var thisBinding = baseCreate(Ctor.prototype),
	            result = Ctor.apply(thisBinding, arguments);

	        // Mimic the constructor's `return` behavior.
	        // See https://es5.github.io/#x13.2.2 for more details.
	        return isObject(result) ? result : thisBinding;
	      };
	    }

	    /**
	     * Creates a `_.curry` or `_.curryRight` function.
	     *
	     * @private
	     * @param {boolean} flag The curry bit flag.
	     * @returns {Function} Returns the new curry function.
	     */
	    function createCurry(flag) {
	      function curryFunc(func, arity, guard) {
	        if (guard && isIterateeCall(func, arity, guard)) {
	          arity = null;
	        }
	        var result = createWrapper(func, flag, null, null, null, null, null, arity);
	        result.placeholder = curryFunc.placeholder;
	        return result;
	      }
	      return curryFunc;
	    }

	    /**
	     * Creates a `_.max` or `_.min` function.
	     *
	     * @private
	     * @param {Function} arrayFunc The function to get the extremum value from an array.
	     * @param {boolean} [isMin] Specify returning the minimum, instead of the maximum,
	     *  extremum value.
	     * @returns {Function} Returns the new extremum function.
	     */
	    function createExtremum(arrayFunc, isMin) {
	      return function(collection, iteratee, thisArg) {
	        if (thisArg && isIterateeCall(collection, iteratee, thisArg)) {
	          iteratee = null;
	        }
	        var func = getCallback(),
	            noIteratee = iteratee == null;

	        if (!(func === baseCallback && noIteratee)) {
	          noIteratee = false;
	          iteratee = func(iteratee, thisArg, 3);
	        }
	        if (noIteratee) {
	          var isArr = isArray(collection);
	          if (!isArr && isString(collection)) {
	            iteratee = charAtCallback;
	          } else {
	            return arrayFunc(isArr ? collection : toIterable(collection));
	          }
	        }
	        return extremumBy(collection, iteratee, isMin);
	      };
	    }

	    /**
	     * Creates a `_.find` or `_.findLast` function.
	     *
	     * @private
	     * @param {Function} eachFunc The function to iterate over a collection.
	     * @param {boolean} [fromRight] Specify iterating from right to left.
	     * @returns {Function} Returns the new find function.
	     */
	    function createFind(eachFunc, fromRight) {
	      return function(collection, predicate, thisArg) {
	        predicate = getCallback(predicate, thisArg, 3);
	        if (isArray(collection)) {
	          var index = baseFindIndex(collection, predicate, fromRight);
	          return index > -1 ? collection[index] : undefined;
	        }
	        return baseFind(collection, predicate, eachFunc);
	      }
	    }

	    /**
	     * Creates a `_.findIndex` or `_.findLastIndex` function.
	     *
	     * @private
	     * @param {boolean} [fromRight] Specify iterating from right to left.
	     * @returns {Function} Returns the new find function.
	     */
	    function createFindIndex(fromRight) {
	      return function(array, predicate, thisArg) {
	        if (!(array && array.length)) {
	          return -1;
	        }
	        predicate = getCallback(predicate, thisArg, 3);
	        return baseFindIndex(array, predicate, fromRight);
	      };
	    }

	    /**
	     * Creates a `_.findKey` or `_.findLastKey` function.
	     *
	     * @private
	     * @param {Function} objectFunc The function to iterate over an object.
	     * @returns {Function} Returns the new find function.
	     */
	    function createFindKey(objectFunc) {
	      return function(object, predicate, thisArg) {
	        predicate = getCallback(predicate, thisArg, 3);
	        return baseFind(object, predicate, objectFunc, true);
	      };
	    }

	    /**
	     * Creates a `_.flow` or `_.flowRight` function.
	     *
	     * @private
	     * @param {boolean} [fromRight] Specify iterating from right to left.
	     * @returns {Function} Returns the new flow function.
	     */
	    function createFlow(fromRight) {
	      return function() {
	        var length = arguments.length;
	        if (!length) {
	          return function() { return arguments[0]; };
	        }
	        var wrapper,
	            index = fromRight ? length : -1,
	            leftIndex = 0,
	            funcs = Array(length);

	        while ((fromRight ? index-- : ++index < length)) {
	          var func = funcs[leftIndex++] = arguments[index];
	          if (typeof func != 'function') {
	            throw new TypeError(FUNC_ERROR_TEXT);
	          }
	          var funcName = wrapper ? '' : getFuncName(func);
	          wrapper = funcName == 'wrapper' ? new LodashWrapper([]) : wrapper;
	        }
	        index = wrapper ? -1 : length;
	        while (++index < length) {
	          func = funcs[index];
	          funcName = getFuncName(func);

	          var data = funcName == 'wrapper' ? getData(func) : null;
	          if (data && isLaziable(data[0])) {
	            wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
	          } else {
	            wrapper = (func.length == 1 && isLaziable(func)) ? wrapper[funcName]() : wrapper.thru(func);
	          }
	        }
	        return function() {
	          var args = arguments;
	          if (wrapper && args.length == 1 && isArray(args[0])) {
	            return wrapper.plant(args[0]).value();
	          }
	          var index = 0,
	              result = funcs[index].apply(this, args);

	          while (++index < length) {
	            result = funcs[index].call(this, result);
	          }
	          return result;
	        };
	      };
	    }

	    /**
	     * Creates a function for `_.forEach` or `_.forEachRight`.
	     *
	     * @private
	     * @param {Function} arrayFunc The function to iterate over an array.
	     * @param {Function} eachFunc The function to iterate over a collection.
	     * @returns {Function} Returns the new each function.
	     */
	    function createForEach(arrayFunc, eachFunc) {
	      return function(collection, iteratee, thisArg) {
	        return (typeof iteratee == 'function' && typeof thisArg == 'undefined' && isArray(collection))
	          ? arrayFunc(collection, iteratee)
	          : eachFunc(collection, bindCallback(iteratee, thisArg, 3));
	      };
	    }

	    /**
	     * Creates a function for `_.forIn` or `_.forInRight`.
	     *
	     * @private
	     * @param {Function} objectFunc The function to iterate over an object.
	     * @returns {Function} Returns the new each function.
	     */
	    function createForIn(objectFunc) {
	      return function(object, iteratee, thisArg) {
	        if (typeof iteratee != 'function' || typeof thisArg != 'undefined') {
	          iteratee = bindCallback(iteratee, thisArg, 3);
	        }
	        return objectFunc(object, iteratee, keysIn);
	      };
	    }

	    /**
	     * Creates a function for `_.forOwn` or `_.forOwnRight`.
	     *
	     * @private
	     * @param {Function} objectFunc The function to iterate over an object.
	     * @returns {Function} Returns the new each function.
	     */
	    function createForOwn(objectFunc) {
	      return function(object, iteratee, thisArg) {
	        if (typeof iteratee != 'function' || typeof thisArg != 'undefined') {
	          iteratee = bindCallback(iteratee, thisArg, 3);
	        }
	        return objectFunc(object, iteratee);
	      };
	    }

	    /**
	     * Creates a function for `_.padLeft` or `_.padRight`.
	     *
	     * @private
	     * @param {boolean} [fromRight] Specify padding from the right.
	     * @returns {Function} Returns the new pad function.
	     */
	    function createPadDir(fromRight) {
	      return function(string, length, chars) {
	        string = baseToString(string);
	        return string && ((fromRight ? string : '') + createPadding(string, length, chars) + (fromRight ? '' : string));
	      };
	    }

	    /**
	     * Creates a `_.partial` or `_.partialRight` function.
	     *
	     * @private
	     * @param {boolean} flag The partial bit flag.
	     * @returns {Function} Returns the new partial function.
	     */
	    function createPartial(flag) {
	      var partialFunc = restParam(function(func, partials) {
	        var holders = replaceHolders(partials, partialFunc.placeholder);
	        return createWrapper(func, flag, null, partials, holders);
	      });
	      return partialFunc;
	    }

	    /**
	     * Creates a function for `_.reduce` or `_.reduceRight`.
	     *
	     * @private
	     * @param {Function} arrayFunc The function to iterate over an array.
	     * @param {Function} eachFunc The function to iterate over a collection.
	     * @returns {Function} Returns the new each function.
	     */
	    function createReduce(arrayFunc, eachFunc) {
	      return function(collection, iteratee, accumulator, thisArg) {
	        var initFromArray = arguments.length < 3;
	        return (typeof iteratee == 'function' && typeof thisArg == 'undefined' && isArray(collection))
	          ? arrayFunc(collection, iteratee, accumulator, initFromArray)
	          : baseReduce(collection, getCallback(iteratee, thisArg, 4), accumulator, initFromArray, eachFunc);
	      };
	    }

	    /**
	     * Creates a function that wraps `func` and invokes it with optional `this`
	     * binding of, partial application, and currying.
	     *
	     * @private
	     * @param {Function|string} func The function or method name to reference.
	     * @param {number} bitmask The bitmask of flags. See `createWrapper` for more details.
	     * @param {*} [thisArg] The `this` binding of `func`.
	     * @param {Array} [partials] The arguments to prepend to those provided to the new function.
	     * @param {Array} [holders] The `partials` placeholder indexes.
	     * @param {Array} [partialsRight] The arguments to append to those provided to the new function.
	     * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
	     * @param {Array} [argPos] The argument positions of the new function.
	     * @param {number} [ary] The arity cap of `func`.
	     * @param {number} [arity] The arity of `func`.
	     * @returns {Function} Returns the new wrapped function.
	     */
	    function createHybridWrapper(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
	      var isAry = bitmask & ARY_FLAG,
	          isBind = bitmask & BIND_FLAG,
	          isBindKey = bitmask & BIND_KEY_FLAG,
	          isCurry = bitmask & CURRY_FLAG,
	          isCurryBound = bitmask & CURRY_BOUND_FLAG,
	          isCurryRight = bitmask & CURRY_RIGHT_FLAG;

	      var Ctor = !isBindKey && createCtorWrapper(func),
	          key = func;

	      function wrapper() {
	        // Avoid `arguments` object use disqualifying optimizations by
	        // converting it to an array before providing it to other functions.
	        var length = arguments.length,
	            index = length,
	            args = Array(length);

	        while (index--) {
	          args[index] = arguments[index];
	        }
	        if (partials) {
	          args = composeArgs(args, partials, holders);
	        }
	        if (partialsRight) {
	          args = composeArgsRight(args, partialsRight, holdersRight);
	        }
	        if (isCurry || isCurryRight) {
	          var placeholder = wrapper.placeholder,
	              argsHolders = replaceHolders(args, placeholder);

	          length -= argsHolders.length;
	          if (length < arity) {
	            var newArgPos = argPos ? arrayCopy(argPos) : null,
	                newArity = nativeMax(arity - length, 0),
	                newsHolders = isCurry ? argsHolders : null,
	                newHoldersRight = isCurry ? null : argsHolders,
	                newPartials = isCurry ? args : null,
	                newPartialsRight = isCurry ? null : args;

	            bitmask |= (isCurry ? PARTIAL_FLAG : PARTIAL_RIGHT_FLAG);
	            bitmask &= ~(isCurry ? PARTIAL_RIGHT_FLAG : PARTIAL_FLAG);

	            if (!isCurryBound) {
	              bitmask &= ~(BIND_FLAG | BIND_KEY_FLAG);
	            }
	            var newData = [func, bitmask, thisArg, newPartials, newsHolders, newPartialsRight, newHoldersRight, newArgPos, ary, newArity],
	                result = createHybridWrapper.apply(undefined, newData);

	            if (isLaziable(func)) {
	              setData(result, newData);
	            }
	            result.placeholder = placeholder;
	            return result;
	          }
	        }
	        var thisBinding = isBind ? thisArg : this;
	        if (isBindKey) {
	          func = thisBinding[key];
	        }
	        if (argPos) {
	          args = reorder(args, argPos);
	        }
	        if (isAry && ary < args.length) {
	          args.length = ary;
	        }
	        var fn = (this && this !== root && this instanceof wrapper) ? (Ctor || createCtorWrapper(func)) : func;
	        return fn.apply(thisBinding, args);
	      }
	      return wrapper;
	    }

	    /**
	     * Creates the padding required for `string` based on the given `length`.
	     * The `chars` string is truncated if the number of characters exceeds `length`.
	     *
	     * @private
	     * @param {string} string The string to create padding for.
	     * @param {number} [length=0] The padding length.
	     * @param {string} [chars=' '] The string used as padding.
	     * @returns {string} Returns the pad for `string`.
	     */
	    function createPadding(string, length, chars) {
	      var strLength = string.length;
	      length = +length;

	      if (strLength >= length || !nativeIsFinite(length)) {
	        return '';
	      }
	      var padLength = length - strLength;
	      chars = chars == null ? ' ' : (chars + '');
	      return repeat(chars, ceil(padLength / chars.length)).slice(0, padLength);
	    }

	    /**
	     * Creates a function that wraps `func` and invokes it with the optional `this`
	     * binding of `thisArg` and the `partials` prepended to those provided to
	     * the wrapper.
	     *
	     * @private
	     * @param {Function} func The function to partially apply arguments to.
	     * @param {number} bitmask The bitmask of flags. See `createWrapper` for more details.
	     * @param {*} thisArg The `this` binding of `func`.
	     * @param {Array} partials The arguments to prepend to those provided to the new function.
	     * @returns {Function} Returns the new bound function.
	     */
	    function createPartialWrapper(func, bitmask, thisArg, partials) {
	      var isBind = bitmask & BIND_FLAG,
	          Ctor = createCtorWrapper(func);

	      function wrapper() {
	        // Avoid `arguments` object use disqualifying optimizations by
	        // converting it to an array before providing it `func`.
	        var argsIndex = -1,
	            argsLength = arguments.length,
	            leftIndex = -1,
	            leftLength = partials.length,
	            args = Array(argsLength + leftLength);

	        while (++leftIndex < leftLength) {
	          args[leftIndex] = partials[leftIndex];
	        }
	        while (argsLength--) {
	          args[leftIndex++] = arguments[++argsIndex];
	        }
	        var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
	        return fn.apply(isBind ? thisArg : this, args);
	      }
	      return wrapper;
	    }

	    /**
	     * Creates a `_.sortedIndex` or `_.sortedLastIndex` function.
	     *
	     * @private
	     * @param {boolean} [retHighest] Specify returning the highest qualified index.
	     * @returns {Function} Returns the new index function.
	     */
	    function createSortedIndex(retHighest) {
	      return function(array, value, iteratee, thisArg) {
	        var func = getCallback(iteratee);
	        return (func === baseCallback && iteratee == null)
	          ? binaryIndex(array, value, retHighest)
	          : binaryIndexBy(array, value, func(iteratee, thisArg, 1), retHighest);
	      };
	    }

	    /**
	     * Creates a function that either curries or invokes `func` with optional
	     * `this` binding and partially applied arguments.
	     *
	     * @private
	     * @param {Function|string} func The function or method name to reference.
	     * @param {number} bitmask The bitmask of flags.
	     *  The bitmask may be composed of the following flags:
	     *     1 - `_.bind`
	     *     2 - `_.bindKey`
	     *     4 - `_.curry` or `_.curryRight` of a bound function
	     *     8 - `_.curry`
	     *    16 - `_.curryRight`
	     *    32 - `_.partial`
	     *    64 - `_.partialRight`
	     *   128 - `_.rearg`
	     *   256 - `_.ary`
	     * @param {*} [thisArg] The `this` binding of `func`.
	     * @param {Array} [partials] The arguments to be partially applied.
	     * @param {Array} [holders] The `partials` placeholder indexes.
	     * @param {Array} [argPos] The argument positions of the new function.
	     * @param {number} [ary] The arity cap of `func`.
	     * @param {number} [arity] The arity of `func`.
	     * @returns {Function} Returns the new wrapped function.
	     */
	    function createWrapper(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
	      var isBindKey = bitmask & BIND_KEY_FLAG;
	      if (!isBindKey && typeof func != 'function') {
	        throw new TypeError(FUNC_ERROR_TEXT);
	      }
	      var length = partials ? partials.length : 0;
	      if (!length) {
	        bitmask &= ~(PARTIAL_FLAG | PARTIAL_RIGHT_FLAG);
	        partials = holders = null;
	      }
	      length -= (holders ? holders.length : 0);
	      if (bitmask & PARTIAL_RIGHT_FLAG) {
	        var partialsRight = partials,
	            holdersRight = holders;

	        partials = holders = null;
	      }
	      var data = isBindKey ? null : getData(func),
	          newData = [func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity];

	      if (data) {
	        mergeData(newData, data);
	        bitmask = newData[1];
	        arity = newData[9];
	      }
	      newData[9] = arity == null
	        ? (isBindKey ? 0 : func.length)
	        : (nativeMax(arity - length, 0) || 0);

	      if (bitmask == BIND_FLAG) {
	        var result = createBindWrapper(newData[0], newData[2]);
	      } else if ((bitmask == PARTIAL_FLAG || bitmask == (BIND_FLAG | PARTIAL_FLAG)) && !newData[4].length) {
	        result = createPartialWrapper.apply(undefined, newData);
	      } else {
	        result = createHybridWrapper.apply(undefined, newData);
	      }
	      var setter = data ? baseSetData : setData;
	      return setter(result, newData);
	    }

	    /**
	     * A specialized version of `baseIsEqualDeep` for arrays with support for
	     * partial deep comparisons.
	     *
	     * @private
	     * @param {Array} array The array to compare.
	     * @param {Array} other The other array to compare.
	     * @param {Function} equalFunc The function to determine equivalents of values.
	     * @param {Function} [customizer] The function to customize comparing arrays.
	     * @param {boolean} [isLoose] Specify performing partial comparisons.
	     * @param {Array} [stackA] Tracks traversed `value` objects.
	     * @param {Array} [stackB] Tracks traversed `other` objects.
	     * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
	     */
	    function equalArrays(array, other, equalFunc, customizer, isLoose, stackA, stackB) {
	      var index = -1,
	          arrLength = array.length,
	          othLength = other.length,
	          result = true;

	      if (arrLength != othLength && !(isLoose && othLength > arrLength)) {
	        return false;
	      }
	      // Deep compare the contents, ignoring non-numeric properties.
	      while (result && ++index < arrLength) {
	        var arrValue = array[index],
	            othValue = other[index];

	        result = undefined;
	        if (customizer) {
	          result = isLoose
	            ? customizer(othValue, arrValue, index)
	            : customizer(arrValue, othValue, index);
	        }
	        if (typeof result == 'undefined') {
	          // Recursively compare arrays (susceptible to call stack limits).
	          if (isLoose) {
	            var othIndex = othLength;
	            while (othIndex--) {
	              othValue = other[othIndex];
	              result = (arrValue && arrValue === othValue) || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
	              if (result) {
	                break;
	              }
	            }
	          } else {
	            result = (arrValue && arrValue === othValue) || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
	          }
	        }
	      }
	      return !!result;
	    }

	    /**
	     * A specialized version of `baseIsEqualDeep` for comparing objects of
	     * the same `toStringTag`.
	     *
	     * **Note:** This function only supports comparing values with tags of
	     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
	     *
	     * @private
	     * @param {Object} value The object to compare.
	     * @param {Object} other The other object to compare.
	     * @param {string} tag The `toStringTag` of the objects to compare.
	     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	     */
	    function equalByTag(object, other, tag) {
	      switch (tag) {
	        case boolTag:
	        case dateTag:
	          // Coerce dates and booleans to numbers, dates to milliseconds and booleans
	          // to `1` or `0` treating invalid dates coerced to `NaN` as not equal.
	          return +object == +other;

	        case errorTag:
	          return object.name == other.name && object.message == other.message;

	        case numberTag:
	          // Treat `NaN` vs. `NaN` as equal.
	          return (object != +object)
	            ? other != +other
	            // But, treat `-0` vs. `+0` as not equal.
	            : (object == 0 ? ((1 / object) == (1 / other)) : object == +other);

	        case regexpTag:
	        case stringTag:
	          // Coerce regexes to strings and treat strings primitives and string
	          // objects as equal. See https://es5.github.io/#x15.10.6.4 for more details.
	          return object == (other + '');
	      }
	      return false;
	    }

	    /**
	     * A specialized version of `baseIsEqualDeep` for objects with support for
	     * partial deep comparisons.
	     *
	     * @private
	     * @param {Object} object The object to compare.
	     * @param {Object} other The other object to compare.
	     * @param {Function} equalFunc The function to determine equivalents of values.
	     * @param {Function} [customizer] The function to customize comparing values.
	     * @param {boolean} [isLoose] Specify performing partial comparisons.
	     * @param {Array} [stackA] Tracks traversed `value` objects.
	     * @param {Array} [stackB] Tracks traversed `other` objects.
	     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	     */
	    function equalObjects(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
	      var objProps = keys(object),
	          objLength = objProps.length,
	          othProps = keys(other),
	          othLength = othProps.length;

	      if (objLength != othLength && !isLoose) {
	        return false;
	      }
	      var skipCtor = isLoose,
	          index = -1;

	      while (++index < objLength) {
	        var key = objProps[index],
	            result = isLoose ? key in other : hasOwnProperty.call(other, key);

	        if (result) {
	          var objValue = object[key],
	              othValue = other[key];

	          result = undefined;
	          if (customizer) {
	            result = isLoose
	              ? customizer(othValue, objValue, key)
	              : customizer(objValue, othValue, key);
	          }
	          if (typeof result == 'undefined') {
	            // Recursively compare objects (susceptible to call stack limits).
	            result = (objValue && objValue === othValue) || equalFunc(objValue, othValue, customizer, isLoose, stackA, stackB);
	          }
	        }
	        if (!result) {
	          return false;
	        }
	        skipCtor || (skipCtor = key == 'constructor');
	      }
	      if (!skipCtor) {
	        var objCtor = object.constructor,
	            othCtor = other.constructor;

	        // Non `Object` object instances with different constructors are not equal.
	        if (objCtor != othCtor &&
	            ('constructor' in object && 'constructor' in other) &&
	            !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
	              typeof othCtor == 'function' && othCtor instanceof othCtor)) {
	          return false;
	        }
	      }
	      return true;
	    }

	    /**
	     * Gets the extremum value of `collection` invoking `iteratee` for each value
	     * in `collection` to generate the criterion by which the value is ranked.
	     * The `iteratee` is invoked with three arguments: (value, index, collection).
	     *
	     * @private
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @param {boolean} [isMin] Specify returning the minimum, instead of the
	     *  maximum, extremum value.
	     * @returns {*} Returns the extremum value.
	     */
	    function extremumBy(collection, iteratee, isMin) {
	      var exValue = isMin ? POSITIVE_INFINITY : NEGATIVE_INFINITY,
	          computed = exValue,
	          result = computed;

	      baseEach(collection, function(value, index, collection) {
	        var current = iteratee(value, index, collection);
	        if ((isMin ? (current < computed) : (current > computed)) ||
	            (current === exValue && current === result)) {
	          computed = current;
	          result = value;
	        }
	      });
	      return result;
	    }

	    /**
	     * Gets the appropriate "callback" function. If the `_.callback` method is
	     * customized this function returns the custom method, otherwise it returns
	     * the `baseCallback` function. If arguments are provided the chosen function
	     * is invoked with them and its result is returned.
	     *
	     * @private
	     * @returns {Function} Returns the chosen function or its result.
	     */
	    function getCallback(func, thisArg, argCount) {
	      var result = lodash.callback || callback;
	      result = result === callback ? baseCallback : result;
	      return argCount ? result(func, thisArg, argCount) : result;
	    }

	    /**
	     * Gets metadata for `func`.
	     *
	     * @private
	     * @param {Function} func The function to query.
	     * @returns {*} Returns the metadata for `func`.
	     */
	    var getData = !metaMap ? noop : function(func) {
	      return metaMap.get(func);
	    };

	    /**
	     * Gets the name of `func`.
	     *
	     * @private
	     * @param {Function} func The function to query.
	     * @returns {string} Returns the function name.
	     */
	    var getFuncName = (function() {
	      if (!support.funcNames) {
	        return constant('');
	      }
	      if (constant.name == 'constant') {
	        return baseProperty('name');
	      }
	      return function(func) {
	        var result = func.name,
	            array = realNames[result],
	            length = array ? array.length : 0;

	        while (length--) {
	          var data = array[length],
	              otherFunc = data.func;

	          if (otherFunc == null || otherFunc == func) {
	            return data.name;
	          }
	        }
	        return result;
	      };
	    }());

	    /**
	     * Gets the appropriate "indexOf" function. If the `_.indexOf` method is
	     * customized this function returns the custom method, otherwise it returns
	     * the `baseIndexOf` function. If arguments are provided the chosen function
	     * is invoked with them and its result is returned.
	     *
	     * @private
	     * @returns {Function|number} Returns the chosen function or its result.
	     */
	    function getIndexOf(collection, target, fromIndex) {
	      var result = lodash.indexOf || indexOf;
	      result = result === indexOf ? baseIndexOf : result;
	      return collection ? result(collection, target, fromIndex) : result;
	    }

	    /**
	     * Gets the view, applying any `transforms` to the `start` and `end` positions.
	     *
	     * @private
	     * @param {number} start The start of the view.
	     * @param {number} end The end of the view.
	     * @param {Array} [transforms] The transformations to apply to the view.
	     * @returns {Object} Returns an object containing the `start` and `end`
	     *  positions of the view.
	     */
	    function getView(start, end, transforms) {
	      var index = -1,
	          length = transforms ? transforms.length : 0;

	      while (++index < length) {
	        var data = transforms[index],
	            size = data.size;

	        switch (data.type) {
	          case 'drop':      start += size; break;
	          case 'dropRight': end -= size; break;
	          case 'take':      end = nativeMin(end, start + size); break;
	          case 'takeRight': start = nativeMax(start, end - size); break;
	        }
	      }
	      return { 'start': start, 'end': end };
	    }

	    /**
	     * Initializes an array clone.
	     *
	     * @private
	     * @param {Array} array The array to clone.
	     * @returns {Array} Returns the initialized clone.
	     */
	    function initCloneArray(array) {
	      var length = array.length,
	          result = new array.constructor(length);

	      // Add array properties assigned by `RegExp#exec`.
	      if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
	        result.index = array.index;
	        result.input = array.input;
	      }
	      return result;
	    }

	    /**
	     * Initializes an object clone.
	     *
	     * @private
	     * @param {Object} object The object to clone.
	     * @returns {Object} Returns the initialized clone.
	     */
	    function initCloneObject(object) {
	      var Ctor = object.constructor;
	      if (!(typeof Ctor == 'function' && Ctor instanceof Ctor)) {
	        Ctor = Object;
	      }
	      return new Ctor;
	    }

	    /**
	     * Initializes an object clone based on its `toStringTag`.
	     *
	     * **Note:** This function only supports cloning values with tags of
	     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
	     *
	     *
	     * @private
	     * @param {Object} object The object to clone.
	     * @param {string} tag The `toStringTag` of the object to clone.
	     * @param {boolean} [isDeep] Specify a deep clone.
	     * @returns {Object} Returns the initialized clone.
	     */
	    function initCloneByTag(object, tag, isDeep) {
	      var Ctor = object.constructor;
	      switch (tag) {
	        case arrayBufferTag:
	          return bufferClone(object);

	        case boolTag:
	        case dateTag:
	          return new Ctor(+object);

	        case float32Tag: case float64Tag:
	        case int8Tag: case int16Tag: case int32Tag:
	        case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
	          var buffer = object.buffer;
	          return new Ctor(isDeep ? bufferClone(buffer) : buffer, object.byteOffset, object.length);

	        case numberTag:
	        case stringTag:
	          return new Ctor(object);

	        case regexpTag:
	          var result = new Ctor(object.source, reFlags.exec(object));
	          result.lastIndex = object.lastIndex;
	      }
	      return result;
	    }

	    /**
	     * Checks if `value` is a valid array-like index.
	     *
	     * @private
	     * @param {*} value The value to check.
	     * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	     * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	     */
	    function isIndex(value, length) {
	      value = +value;
	      length = length == null ? MAX_SAFE_INTEGER : length;
	      return value > -1 && value % 1 == 0 && value < length;
	    }

	    /**
	     * Checks if the provided arguments are from an iteratee call.
	     *
	     * @private
	     * @param {*} value The potential iteratee value argument.
	     * @param {*} index The potential iteratee index or key argument.
	     * @param {*} object The potential iteratee object argument.
	     * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
	     */
	    function isIterateeCall(value, index, object) {
	      if (!isObject(object)) {
	        return false;
	      }
	      var type = typeof index;
	      if (type == 'number') {
	        var length = object.length,
	            prereq = isLength(length) && isIndex(index, length);
	      } else {
	        prereq = type == 'string' && index in object;
	      }
	      if (prereq) {
	        var other = object[index];
	        return value === value ? (value === other) : (other !== other);
	      }
	      return false;
	    }

	    /**
	     * Checks if `func` has a lazy counterpart.
	     *
	     * @private
	     * @param {Function} func The function to check.
	     * @returns {boolean} Returns `true` if `func` has a lazy counterpart, else `false`.
	     */
	    function isLaziable(func) {
	      var funcName = getFuncName(func);
	      return !!funcName && func === lodash[funcName] && funcName in LazyWrapper.prototype;
	    }

	    /**
	     * Checks if `value` is a valid array-like length.
	     *
	     * **Note:** This function is based on [`ToLength`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength).
	     *
	     * @private
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	     */
	    function isLength(value) {
	      return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	    }

	    /**
	     * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
	     *
	     * @private
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` if suitable for strict
	     *  equality comparisons, else `false`.
	     */
	    function isStrictComparable(value) {
	      return value === value && (value === 0 ? ((1 / value) > 0) : !isObject(value));
	    }

	    /**
	     * Merges the function metadata of `source` into `data`.
	     *
	     * Merging metadata reduces the number of wrappers required to invoke a function.
	     * This is possible because methods like `_.bind`, `_.curry`, and `_.partial`
	     * may be applied regardless of execution order. Methods like `_.ary` and `_.rearg`
	     * augment function arguments, making the order in which they are executed important,
	     * preventing the merging of metadata. However, we make an exception for a safe
	     * common case where curried functions have `_.ary` and or `_.rearg` applied.
	     *
	     * @private
	     * @param {Array} data The destination metadata.
	     * @param {Array} source The source metadata.
	     * @returns {Array} Returns `data`.
	     */
	    function mergeData(data, source) {
	      var bitmask = data[1],
	          srcBitmask = source[1],
	          newBitmask = bitmask | srcBitmask,
	          isCommon = newBitmask < ARY_FLAG;

	      var isCombo =
	        (srcBitmask == ARY_FLAG && bitmask == CURRY_FLAG) ||
	        (srcBitmask == ARY_FLAG && bitmask == REARG_FLAG && data[7].length <= source[8]) ||
	        (srcBitmask == (ARY_FLAG | REARG_FLAG) && bitmask == CURRY_FLAG);

	      // Exit early if metadata can't be merged.
	      if (!(isCommon || isCombo)) {
	        return data;
	      }
	      // Use source `thisArg` if available.
	      if (srcBitmask & BIND_FLAG) {
	        data[2] = source[2];
	        // Set when currying a bound function.
	        newBitmask |= (bitmask & BIND_FLAG) ? 0 : CURRY_BOUND_FLAG;
	      }
	      // Compose partial arguments.
	      var value = source[3];
	      if (value) {
	        var partials = data[3];
	        data[3] = partials ? composeArgs(partials, value, source[4]) : arrayCopy(value);
	        data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : arrayCopy(source[4]);
	      }
	      // Compose partial right arguments.
	      value = source[5];
	      if (value) {
	        partials = data[5];
	        data[5] = partials ? composeArgsRight(partials, value, source[6]) : arrayCopy(value);
	        data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : arrayCopy(source[6]);
	      }
	      // Use source `argPos` if available.
	      value = source[7];
	      if (value) {
	        data[7] = arrayCopy(value);
	      }
	      // Use source `ary` if it's smaller.
	      if (srcBitmask & ARY_FLAG) {
	        data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
	      }
	      // Use source `arity` if one is not provided.
	      if (data[9] == null) {
	        data[9] = source[9];
	      }
	      // Use source `func` and merge bitmasks.
	      data[0] = source[0];
	      data[1] = newBitmask;

	      return data;
	    }

	    /**
	     * A specialized version of `_.pick` that picks `object` properties specified
	     * by the `props` array.
	     *
	     * @private
	     * @param {Object} object The source object.
	     * @param {string[]} props The property names to pick.
	     * @returns {Object} Returns the new object.
	     */
	    function pickByArray(object, props) {
	      object = toObject(object);

	      var index = -1,
	          length = props.length,
	          result = {};

	      while (++index < length) {
	        var key = props[index];
	        if (key in object) {
	          result[key] = object[key];
	        }
	      }
	      return result;
	    }

	    /**
	     * A specialized version of `_.pick` that picks `object` properties `predicate`
	     * returns truthy for.
	     *
	     * @private
	     * @param {Object} object The source object.
	     * @param {Function} predicate The function invoked per iteration.
	     * @returns {Object} Returns the new object.
	     */
	    function pickByCallback(object, predicate) {
	      var result = {};
	      baseForIn(object, function(value, key, object) {
	        if (predicate(value, key, object)) {
	          result[key] = value;
	        }
	      });
	      return result;
	    }

	    /**
	     * Reorder `array` according to the specified indexes where the element at
	     * the first index is assigned as the first element, the element at
	     * the second index is assigned as the second element, and so on.
	     *
	     * @private
	     * @param {Array} array The array to reorder.
	     * @param {Array} indexes The arranged array indexes.
	     * @returns {Array} Returns `array`.
	     */
	    function reorder(array, indexes) {
	      var arrLength = array.length,
	          length = nativeMin(indexes.length, arrLength),
	          oldArray = arrayCopy(array);

	      while (length--) {
	        var index = indexes[length];
	        array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined;
	      }
	      return array;
	    }

	    /**
	     * Sets metadata for `func`.
	     *
	     * **Note:** If this function becomes hot, i.e. is invoked a lot in a short
	     * period of time, it will trip its breaker and transition to an identity function
	     * to avoid garbage collection pauses in V8. See [V8 issue 2070](https://code.google.com/p/v8/issues/detail?id=2070)
	     * for more details.
	     *
	     * @private
	     * @param {Function} func The function to associate metadata with.
	     * @param {*} data The metadata.
	     * @returns {Function} Returns `func`.
	     */
	    var setData = (function() {
	      var count = 0,
	          lastCalled = 0;

	      return function(key, value) {
	        var stamp = now(),
	            remaining = HOT_SPAN - (stamp - lastCalled);

	        lastCalled = stamp;
	        if (remaining > 0) {
	          if (++count >= HOT_COUNT) {
	            return key;
	          }
	        } else {
	          count = 0;
	        }
	        return baseSetData(key, value);
	      };
	    }());

	    /**
	     * A fallback implementation of `_.isPlainObject` which checks if `value`
	     * is an object created by the `Object` constructor or has a `[[Prototype]]`
	     * of `null`.
	     *
	     * @private
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
	     */
	    function shimIsPlainObject(value) {
	      var Ctor,
	          support = lodash.support;

	      // Exit early for non `Object` objects.
	      if (!(isObjectLike(value) && objToString.call(value) == objectTag) ||
	          (!hasOwnProperty.call(value, 'constructor') &&
	            (Ctor = value.constructor, typeof Ctor == 'function' && !(Ctor instanceof Ctor)))) {
	        return false;
	      }
	      // IE < 9 iterates inherited properties before own properties. If the first
	      // iterated property is an object's own property then there are no inherited
	      // enumerable properties.
	      var result;
	      // In most environments an object's own properties are iterated before
	      // its inherited properties. If the last iterated property is an object's
	      // own property then there are no inherited enumerable properties.
	      baseForIn(value, function(subValue, key) {
	        result = key;
	      });
	      return typeof result == 'undefined' || hasOwnProperty.call(value, result);
	    }

	    /**
	     * A fallback implementation of `Object.keys` which creates an array of the
	     * own enumerable property names of `object`.
	     *
	     * @private
	     * @param {Object} object The object to inspect.
	     * @returns {Array} Returns the array of property names.
	     */
	    function shimKeys(object) {
	      var props = keysIn(object),
	          propsLength = props.length,
	          length = propsLength && object.length,
	          support = lodash.support;

	      var allowIndexes = length && isLength(length) &&
	        (isArray(object) || (support.nonEnumArgs && isArguments(object)));

	      var index = -1,
	          result = [];

	      while (++index < propsLength) {
	        var key = props[index];
	        if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
	          result.push(key);
	        }
	      }
	      return result;
	    }

	    /**
	     * Converts `value` to an array-like object if it is not one.
	     *
	     * @private
	     * @param {*} value The value to process.
	     * @returns {Array|Object} Returns the array-like object.
	     */
	    function toIterable(value) {
	      if (value == null) {
	        return [];
	      }
	      if (!isLength(value.length)) {
	        return values(value);
	      }
	      return isObject(value) ? value : Object(value);
	    }

	    /**
	     * Converts `value` to an object if it is not one.
	     *
	     * @private
	     * @param {*} value The value to process.
	     * @returns {Object} Returns the object.
	     */
	    function toObject(value) {
	      return isObject(value) ? value : Object(value);
	    }

	    /**
	     * Creates a clone of `wrapper`.
	     *
	     * @private
	     * @param {Object} wrapper The wrapper to clone.
	     * @returns {Object} Returns the cloned wrapper.
	     */
	    function wrapperClone(wrapper) {
	      return wrapper instanceof LazyWrapper
	        ? wrapper.clone()
	        : new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__, arrayCopy(wrapper.__actions__));
	    }

	    /*------------------------------------------------------------------------*/

	    /**
	     * Creates an array of elements split into groups the length of `size`.
	     * If `collection` can't be split evenly, the final chunk will be the remaining
	     * elements.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to process.
	     * @param {number} [size=1] The length of each chunk.
	     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
	     * @returns {Array} Returns the new array containing chunks.
	     * @example
	     *
	     * _.chunk(['a', 'b', 'c', 'd'], 2);
	     * // => [['a', 'b'], ['c', 'd']]
	     *
	     * _.chunk(['a', 'b', 'c', 'd'], 3);
	     * // => [['a', 'b', 'c'], ['d']]
	     */
	    function chunk(array, size, guard) {
	      if (guard ? isIterateeCall(array, size, guard) : size == null) {
	        size = 1;
	      } else {
	        size = nativeMax(+size || 1, 1);
	      }
	      var index = 0,
	          length = array ? array.length : 0,
	          resIndex = -1,
	          result = Array(ceil(length / size));

	      while (index < length) {
	        result[++resIndex] = baseSlice(array, index, (index += size));
	      }
	      return result;
	    }

	    /**
	     * Creates an array with all falsey values removed. The values `false`, `null`,
	     * `0`, `""`, `undefined`, and `NaN` are falsey.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to compact.
	     * @returns {Array} Returns the new array of filtered values.
	     * @example
	     *
	     * _.compact([0, 1, false, 2, '', 3]);
	     * // => [1, 2, 3]
	     */
	    function compact(array) {
	      var index = -1,
	          length = array ? array.length : 0,
	          resIndex = -1,
	          result = [];

	      while (++index < length) {
	        var value = array[index];
	        if (value) {
	          result[++resIndex] = value;
	        }
	      }
	      return result;
	    }

	    /**
	     * Creates an array excluding all values of the provided arrays using
	     * `SameValueZero` for equality comparisons.
	     *
	     * **Note:** [`SameValueZero`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevaluezero)
	     * comparisons are like strict equality comparisons, e.g. `===`, except that
	     * `NaN` matches `NaN`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to inspect.
	     * @param {...Array} [values] The arrays of values to exclude.
	     * @returns {Array} Returns the new array of filtered values.
	     * @example
	     *
	     * _.difference([1, 2, 3], [4, 2]);
	     * // => [1, 3]
	     */
	    var difference = restParam(function(array, values) {
	      return (isArray(array) || isArguments(array))
	        ? baseDifference(array, baseFlatten(values, false, true))
	        : [];
	    });

	    /**
	     * Creates a slice of `array` with `n` elements dropped from the beginning.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to query.
	     * @param {number} [n=1] The number of elements to drop.
	     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
	     * @returns {Array} Returns the slice of `array`.
	     * @example
	     *
	     * _.drop([1, 2, 3]);
	     * // => [2, 3]
	     *
	     * _.drop([1, 2, 3], 2);
	     * // => [3]
	     *
	     * _.drop([1, 2, 3], 5);
	     * // => []
	     *
	     * _.drop([1, 2, 3], 0);
	     * // => [1, 2, 3]
	     */
	    function drop(array, n, guard) {
	      var length = array ? array.length : 0;
	      if (!length) {
	        return [];
	      }
	      if (guard ? isIterateeCall(array, n, guard) : n == null) {
	        n = 1;
	      }
	      return baseSlice(array, n < 0 ? 0 : n);
	    }

	    /**
	     * Creates a slice of `array` with `n` elements dropped from the end.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to query.
	     * @param {number} [n=1] The number of elements to drop.
	     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
	     * @returns {Array} Returns the slice of `array`.
	     * @example
	     *
	     * _.dropRight([1, 2, 3]);
	     * // => [1, 2]
	     *
	     * _.dropRight([1, 2, 3], 2);
	     * // => [1]
	     *
	     * _.dropRight([1, 2, 3], 5);
	     * // => []
	     *
	     * _.dropRight([1, 2, 3], 0);
	     * // => [1, 2, 3]
	     */
	    function dropRight(array, n, guard) {
	      var length = array ? array.length : 0;
	      if (!length) {
	        return [];
	      }
	      if (guard ? isIterateeCall(array, n, guard) : n == null) {
	        n = 1;
	      }
	      n = length - (+n || 0);
	      return baseSlice(array, 0, n < 0 ? 0 : n);
	    }

	    /**
	     * Creates a slice of `array` excluding elements dropped from the end.
	     * Elements are dropped until `predicate` returns falsey. The predicate is
	     * bound to `thisArg` and invoked with three arguments: (value, index, array).
	     *
	     * If a property name is provided for `predicate` the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If a value is also provided for `thisArg` the created `_.matchesProperty`
	     * style callback returns `true` for elements that have a matching property
	     * value, else `false`.
	     *
	     * If an object is provided for `predicate` the created `_.matches` style
	     * callback returns `true` for elements that match the properties of the given
	     * object, else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to query.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked
	     *  per iteration.
	     * @param {*} [thisArg] The `this` binding of `predicate`.
	     * @returns {Array} Returns the slice of `array`.
	     * @example
	     *
	     * _.dropRightWhile([1, 2, 3], function(n) {
	     *   return n > 1;
	     * });
	     * // => [1]
	     *
	     * var users = [
	     *   { 'user': 'barney',  'active': true },
	     *   { 'user': 'fred',    'active': false },
	     *   { 'user': 'pebbles', 'active': false }
	     * ];
	     *
	     * // using the `_.matches` callback shorthand
	     * _.pluck(_.dropRightWhile(users, { 'user': 'pebbles', 'active': false }), 'user');
	     * // => ['barney', 'fred']
	     *
	     * // using the `_.matchesProperty` callback shorthand
	     * _.pluck(_.dropRightWhile(users, 'active', false), 'user');
	     * // => ['barney']
	     *
	     * // using the `_.property` callback shorthand
	     * _.pluck(_.dropRightWhile(users, 'active'), 'user');
	     * // => ['barney', 'fred', 'pebbles']
	     */
	    function dropRightWhile(array, predicate, thisArg) {
	      return (array && array.length)
	        ? baseWhile(array, getCallback(predicate, thisArg, 3), true, true)
	        : [];
	    }

	    /**
	     * Creates a slice of `array` excluding elements dropped from the beginning.
	     * Elements are dropped until `predicate` returns falsey. The predicate is
	     * bound to `thisArg` and invoked with three arguments: (value, index, array).
	     *
	     * If a property name is provided for `predicate` the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If a value is also provided for `thisArg` the created `_.matchesProperty`
	     * style callback returns `true` for elements that have a matching property
	     * value, else `false`.
	     *
	     * If an object is provided for `predicate` the created `_.matches` style
	     * callback returns `true` for elements that have the properties of the given
	     * object, else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to query.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked
	     *  per iteration.
	     * @param {*} [thisArg] The `this` binding of `predicate`.
	     * @returns {Array} Returns the slice of `array`.
	     * @example
	     *
	     * _.dropWhile([1, 2, 3], function(n) {
	     *   return n < 3;
	     * });
	     * // => [3]
	     *
	     * var users = [
	     *   { 'user': 'barney',  'active': false },
	     *   { 'user': 'fred',    'active': false },
	     *   { 'user': 'pebbles', 'active': true }
	     * ];
	     *
	     * // using the `_.matches` callback shorthand
	     * _.pluck(_.dropWhile(users, { 'user': 'barney', 'active': false }), 'user');
	     * // => ['fred', 'pebbles']
	     *
	     * // using the `_.matchesProperty` callback shorthand
	     * _.pluck(_.dropWhile(users, 'active', false), 'user');
	     * // => ['pebbles']
	     *
	     * // using the `_.property` callback shorthand
	     * _.pluck(_.dropWhile(users, 'active'), 'user');
	     * // => ['barney', 'fred', 'pebbles']
	     */
	    function dropWhile(array, predicate, thisArg) {
	      return (array && array.length)
	        ? baseWhile(array, getCallback(predicate, thisArg, 3), true)
	        : [];
	    }

	    /**
	     * Fills elements of `array` with `value` from `start` up to, but not
	     * including, `end`.
	     *
	     * **Note:** This method mutates `array`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to fill.
	     * @param {*} value The value to fill `array` with.
	     * @param {number} [start=0] The start position.
	     * @param {number} [end=array.length] The end position.
	     * @returns {Array} Returns `array`.
	     * @example
	     *
	     * var array = [1, 2, 3];
	     *
	     * _.fill(array, 'a');
	     * console.log(array);
	     * // => ['a', 'a', 'a']
	     *
	     * _.fill(Array(3), 2);
	     * // => [2, 2, 2]
	     *
	     * _.fill([4, 6, 8], '*', 1, 2);
	     * // => [4, '*', 8]
	     */
	    function fill(array, value, start, end) {
	      var length = array ? array.length : 0;
	      if (!length) {
	        return [];
	      }
	      if (start && typeof start != 'number' && isIterateeCall(array, value, start)) {
	        start = 0;
	        end = length;
	      }
	      return baseFill(array, value, start, end);
	    }

	    /**
	     * This method is like `_.find` except that it returns the index of the first
	     * element `predicate` returns truthy for instead of the element itself.
	     *
	     * If a property name is provided for `predicate` the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If a value is also provided for `thisArg` the created `_.matchesProperty`
	     * style callback returns `true` for elements that have a matching property
	     * value, else `false`.
	     *
	     * If an object is provided for `predicate` the created `_.matches` style
	     * callback returns `true` for elements that have the properties of the given
	     * object, else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to search.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked
	     *  per iteration.
	     * @param {*} [thisArg] The `this` binding of `predicate`.
	     * @returns {number} Returns the index of the found element, else `-1`.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney',  'active': false },
	     *   { 'user': 'fred',    'active': false },
	     *   { 'user': 'pebbles', 'active': true }
	     * ];
	     *
	     * _.findIndex(users, function(chr) {
	     *   return chr.user == 'barney';
	     * });
	     * // => 0
	     *
	     * // using the `_.matches` callback shorthand
	     * _.findIndex(users, { 'user': 'fred', 'active': false });
	     * // => 1
	     *
	     * // using the `_.matchesProperty` callback shorthand
	     * _.findIndex(users, 'active', false);
	     * // => 0
	     *
	     * // using the `_.property` callback shorthand
	     * _.findIndex(users, 'active');
	     * // => 2
	     */
	    var findIndex = createFindIndex();

	    /**
	     * This method is like `_.findIndex` except that it iterates over elements
	     * of `collection` from right to left.
	     *
	     * If a property name is provided for `predicate` the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If a value is also provided for `thisArg` the created `_.matchesProperty`
	     * style callback returns `true` for elements that have a matching property
	     * value, else `false`.
	     *
	     * If an object is provided for `predicate` the created `_.matches` style
	     * callback returns `true` for elements that have the properties of the given
	     * object, else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to search.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked
	     *  per iteration.
	     * @param {*} [thisArg] The `this` binding of `predicate`.
	     * @returns {number} Returns the index of the found element, else `-1`.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney',  'active': true },
	     *   { 'user': 'fred',    'active': false },
	     *   { 'user': 'pebbles', 'active': false }
	     * ];
	     *
	     * _.findLastIndex(users, function(chr) {
	     *   return chr.user == 'pebbles';
	     * });
	     * // => 2
	     *
	     * // using the `_.matches` callback shorthand
	     * _.findLastIndex(users, { 'user': 'barney', 'active': true });
	     * // => 0
	     *
	     * // using the `_.matchesProperty` callback shorthand
	     * _.findLastIndex(users, 'active', false);
	     * // => 2
	     *
	     * // using the `_.property` callback shorthand
	     * _.findLastIndex(users, 'active');
	     * // => 0
	     */
	    var findLastIndex = createFindIndex(true);

	    /**
	     * Gets the first element of `array`.
	     *
	     * @static
	     * @memberOf _
	     * @alias head
	     * @category Array
	     * @param {Array} array The array to query.
	     * @returns {*} Returns the first element of `array`.
	     * @example
	     *
	     * _.first([1, 2, 3]);
	     * // => 1
	     *
	     * _.first([]);
	     * // => undefined
	     */
	    function first(array) {
	      return array ? array[0] : undefined;
	    }

	    /**
	     * Flattens a nested array. If `isDeep` is `true` the array is recursively
	     * flattened, otherwise it is only flattened a single level.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to flatten.
	     * @param {boolean} [isDeep] Specify a deep flatten.
	     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
	     * @returns {Array} Returns the new flattened array.
	     * @example
	     *
	     * _.flatten([1, [2, 3, [4]]]);
	     * // => [1, 2, 3, [4]]
	     *
	     * // using `isDeep`
	     * _.flatten([1, [2, 3, [4]]], true);
	     * // => [1, 2, 3, 4]
	     */
	    function flatten(array, isDeep, guard) {
	      var length = array ? array.length : 0;
	      if (guard && isIterateeCall(array, isDeep, guard)) {
	        isDeep = false;
	      }
	      return length ? baseFlatten(array, isDeep) : [];
	    }

	    /**
	     * Recursively flattens a nested array.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to recursively flatten.
	     * @returns {Array} Returns the new flattened array.
	     * @example
	     *
	     * _.flattenDeep([1, [2, 3, [4]]]);
	     * // => [1, 2, 3, 4]
	     */
	    function flattenDeep(array) {
	      var length = array ? array.length : 0;
	      return length ? baseFlatten(array, true) : [];
	    }

	    /**
	     * Gets the index at which the first occurrence of `value` is found in `array`
	     * using `SameValueZero` for equality comparisons. If `fromIndex` is negative,
	     * it is used as the offset from the end of `array`. If `array` is sorted
	     * providing `true` for `fromIndex` performs a faster binary search.
	     *
	     * **Note:** [`SameValueZero`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevaluezero)
	     * comparisons are like strict equality comparisons, e.g. `===`, except that
	     * `NaN` matches `NaN`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to search.
	     * @param {*} value The value to search for.
	     * @param {boolean|number} [fromIndex=0] The index to search from or `true`
	     *  to perform a binary search on a sorted array.
	     * @returns {number} Returns the index of the matched value, else `-1`.
	     * @example
	     *
	     * _.indexOf([1, 2, 1, 2], 2);
	     * // => 1
	     *
	     * // using `fromIndex`
	     * _.indexOf([1, 2, 1, 2], 2, 2);
	     * // => 3
	     *
	     * // performing a binary search
	     * _.indexOf([1, 1, 2, 2], 2, true);
	     * // => 2
	     */
	    function indexOf(array, value, fromIndex) {
	      var length = array ? array.length : 0;
	      if (!length) {
	        return -1;
	      }
	      if (typeof fromIndex == 'number') {
	        fromIndex = fromIndex < 0 ? nativeMax(length + fromIndex, 0) : fromIndex;
	      } else if (fromIndex) {
	        var index = binaryIndex(array, value),
	            other = array[index];

	        if (value === value ? (value === other) : (other !== other)) {
	          return index;
	        }
	        return -1;
	      }
	      return baseIndexOf(array, value, fromIndex || 0);
	    }

	    /**
	     * Gets all but the last element of `array`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to query.
	     * @returns {Array} Returns the slice of `array`.
	     * @example
	     *
	     * _.initial([1, 2, 3]);
	     * // => [1, 2]
	     */
	    function initial(array) {
	      return dropRight(array, 1);
	    }

	    /**
	     * Creates an array of unique values in all provided arrays using `SameValueZero`
	     * for equality comparisons.
	     *
	     * **Note:** [`SameValueZero`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevaluezero)
	     * comparisons are like strict equality comparisons, e.g. `===`, except that
	     * `NaN` matches `NaN`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {...Array} [arrays] The arrays to inspect.
	     * @returns {Array} Returns the new array of shared values.
	     * @example
	     * _.intersection([1, 2], [4, 2], [2, 1]);
	     * // => [2]
	     */
	    function intersection() {
	      var args = [],
	          argsIndex = -1,
	          argsLength = arguments.length,
	          caches = [],
	          indexOf = getIndexOf(),
	          isCommon = indexOf == baseIndexOf;

	      while (++argsIndex < argsLength) {
	        var value = arguments[argsIndex];
	        if (isArray(value) || isArguments(value)) {
	          args.push(value);
	          caches.push((isCommon && value.length >= 120) ? createCache(argsIndex && value) : null);
	        }
	      }
	      argsLength = args.length;
	      var array = args[0],
	          index = -1,
	          length = array ? array.length : 0,
	          result = [],
	          seen = caches[0];

	      outer:
	      while (++index < length) {
	        value = array[index];
	        if ((seen ? cacheIndexOf(seen, value) : indexOf(result, value, 0)) < 0) {
	          argsIndex = argsLength;
	          while (--argsIndex) {
	            var cache = caches[argsIndex];
	            if ((cache ? cacheIndexOf(cache, value) : indexOf(args[argsIndex], value, 0)) < 0) {
	              continue outer;
	            }
	          }
	          if (seen) {
	            seen.push(value);
	          }
	          result.push(value);
	        }
	      }
	      return result;
	    }

	    /**
	     * Gets the last element of `array`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to query.
	     * @returns {*} Returns the last element of `array`.
	     * @example
	     *
	     * _.last([1, 2, 3]);
	     * // => 3
	     */
	    function last(array) {
	      var length = array ? array.length : 0;
	      return length ? array[length - 1] : undefined;
	    }

	    /**
	     * This method is like `_.indexOf` except that it iterates over elements of
	     * `array` from right to left.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to search.
	     * @param {*} value The value to search for.
	     * @param {boolean|number} [fromIndex=array.length-1] The index to search from
	     *  or `true` to perform a binary search on a sorted array.
	     * @returns {number} Returns the index of the matched value, else `-1`.
	     * @example
	     *
	     * _.lastIndexOf([1, 2, 1, 2], 2);
	     * // => 3
	     *
	     * // using `fromIndex`
	     * _.lastIndexOf([1, 2, 1, 2], 2, 2);
	     * // => 1
	     *
	     * // performing a binary search
	     * _.lastIndexOf([1, 1, 2, 2], 2, true);
	     * // => 3
	     */
	    function lastIndexOf(array, value, fromIndex) {
	      var length = array ? array.length : 0;
	      if (!length) {
	        return -1;
	      }
	      var index = length;
	      if (typeof fromIndex == 'number') {
	        index = (fromIndex < 0 ? nativeMax(length + fromIndex, 0) : nativeMin(fromIndex || 0, length - 1)) + 1;
	      } else if (fromIndex) {
	        index = binaryIndex(array, value, true) - 1;
	        var other = array[index];
	        if (value === value ? (value === other) : (other !== other)) {
	          return index;
	        }
	        return -1;
	      }
	      if (value !== value) {
	        return indexOfNaN(array, index, true);
	      }
	      while (index--) {
	        if (array[index] === value) {
	          return index;
	        }
	      }
	      return -1;
	    }

	    /**
	     * Removes all provided values from `array` using `SameValueZero` for equality
	     * comparisons.
	     *
	     * **Notes:**
	     *  - Unlike `_.without`, this method mutates `array`
	     *  - [`SameValueZero`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevaluezero)
	     *    comparisons are like strict equality comparisons, e.g. `===`, except
	     *    that `NaN` matches `NaN`
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to modify.
	     * @param {...*} [values] The values to remove.
	     * @returns {Array} Returns `array`.
	     * @example
	     *
	     * var array = [1, 2, 3, 1, 2, 3];
	     *
	     * _.pull(array, 2, 3);
	     * console.log(array);
	     * // => [1, 1]
	     */
	    function pull() {
	      var args = arguments,
	          array = args[0];

	      if (!(array && array.length)) {
	        return array;
	      }
	      var index = 0,
	          indexOf = getIndexOf(),
	          length = args.length;

	      while (++index < length) {
	        var fromIndex = 0,
	            value = args[index];

	        while ((fromIndex = indexOf(array, value, fromIndex)) > -1) {
	          splice.call(array, fromIndex, 1);
	        }
	      }
	      return array;
	    }

	    /**
	     * Removes elements from `array` corresponding to the given indexes and returns
	     * an array of the removed elements. Indexes may be specified as an array of
	     * indexes or as individual arguments.
	     *
	     * **Note:** Unlike `_.at`, this method mutates `array`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to modify.
	     * @param {...(number|number[])} [indexes] The indexes of elements to remove,
	     *  specified as individual indexes or arrays of indexes.
	     * @returns {Array} Returns the new array of removed elements.
	     * @example
	     *
	     * var array = [5, 10, 15, 20];
	     * var evens = _.pullAt(array, 1, 3);
	     *
	     * console.log(array);
	     * // => [5, 15]
	     *
	     * console.log(evens);
	     * // => [10, 20]
	     */
	    var pullAt = restParam(function(array, indexes) {
	      array || (array = []);
	      indexes = baseFlatten(indexes);

	      var length = indexes.length,
	          result = baseAt(array, indexes);

	      indexes.sort(baseCompareAscending);
	      while (length--) {
	        var index = parseFloat(indexes[length]);
	        if (index != previous && isIndex(index)) {
	          var previous = index;
	          splice.call(array, index, 1);
	        }
	      }
	      return result;
	    });

	    /**
	     * Removes all elements from `array` that `predicate` returns truthy for
	     * and returns an array of the removed elements. The predicate is bound to
	     * `thisArg` and invoked with three arguments: (value, index, array).
	     *
	     * If a property name is provided for `predicate` the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If a value is also provided for `thisArg` the created `_.matchesProperty`
	     * style callback returns `true` for elements that have a matching property
	     * value, else `false`.
	     *
	     * If an object is provided for `predicate` the created `_.matches` style
	     * callback returns `true` for elements that have the properties of the given
	     * object, else `false`.
	     *
	     * **Note:** Unlike `_.filter`, this method mutates `array`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to modify.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked
	     *  per iteration.
	     * @param {*} [thisArg] The `this` binding of `predicate`.
	     * @returns {Array} Returns the new array of removed elements.
	     * @example
	     *
	     * var array = [1, 2, 3, 4];
	     * var evens = _.remove(array, function(n) {
	     *   return n % 2 == 0;
	     * });
	     *
	     * console.log(array);
	     * // => [1, 3]
	     *
	     * console.log(evens);
	     * // => [2, 4]
	     */
	    function remove(array, predicate, thisArg) {
	      var index = -1,
	          length = array ? array.length : 0,
	          result = [];

	      predicate = getCallback(predicate, thisArg, 3);
	      while (++index < length) {
	        var value = array[index];
	        if (predicate(value, index, array)) {
	          result.push(value);
	          splice.call(array, index--, 1);
	          length--;
	        }
	      }
	      return result;
	    }

	    /**
	     * Gets all but the first element of `array`.
	     *
	     * @static
	     * @memberOf _
	     * @alias tail
	     * @category Array
	     * @param {Array} array The array to query.
	     * @returns {Array} Returns the slice of `array`.
	     * @example
	     *
	     * _.rest([1, 2, 3]);
	     * // => [2, 3]
	     */
	    function rest(array) {
	      return drop(array, 1);
	    }

	    /**
	     * Creates a slice of `array` from `start` up to, but not including, `end`.
	     *
	     * **Note:** This function is used instead of `Array#slice` to support node
	     * lists in IE < 9 and to ensure dense arrays are returned.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to slice.
	     * @param {number} [start=0] The start position.
	     * @param {number} [end=array.length] The end position.
	     * @returns {Array} Returns the slice of `array`.
	     */
	    function slice(array, start, end) {
	      var length = array ? array.length : 0;
	      if (!length) {
	        return [];
	      }
	      if (end && typeof end != 'number' && isIterateeCall(array, start, end)) {
	        start = 0;
	        end = length;
	      }
	      return baseSlice(array, start, end);
	    }

	    /**
	     * Uses a binary search to determine the lowest index at which `value` should
	     * be inserted into `array` in order to maintain its sort order. If an iteratee
	     * function is provided it is invoked for `value` and each element of `array`
	     * to compute their sort ranking. The iteratee is bound to `thisArg` and
	     * invoked with one argument; (value).
	     *
	     * If a property name is provided for `iteratee` the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If a value is also provided for `thisArg` the created `_.matchesProperty`
	     * style callback returns `true` for elements that have a matching property
	     * value, else `false`.
	     *
	     * If an object is provided for `iteratee` the created `_.matches` style
	     * callback returns `true` for elements that have the properties of the given
	     * object, else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The sorted array to inspect.
	     * @param {*} value The value to evaluate.
	     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
	     *  per iteration.
	     * @param {*} [thisArg] The `this` binding of `iteratee`.
	     * @returns {number} Returns the index at which `value` should be inserted
	     *  into `array`.
	     * @example
	     *
	     * _.sortedIndex([30, 50], 40);
	     * // => 1
	     *
	     * _.sortedIndex([4, 4, 5, 5], 5);
	     * // => 2
	     *
	     * var dict = { 'data': { 'thirty': 30, 'forty': 40, 'fifty': 50 } };
	     *
	     * // using an iteratee function
	     * _.sortedIndex(['thirty', 'fifty'], 'forty', function(word) {
	     *   return this.data[word];
	     * }, dict);
	     * // => 1
	     *
	     * // using the `_.property` callback shorthand
	     * _.sortedIndex([{ 'x': 30 }, { 'x': 50 }], { 'x': 40 }, 'x');
	     * // => 1
	     */
	    var sortedIndex = createSortedIndex();

	    /**
	     * This method is like `_.sortedIndex` except that it returns the highest
	     * index at which `value` should be inserted into `array` in order to
	     * maintain its sort order.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The sorted array to inspect.
	     * @param {*} value The value to evaluate.
	     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
	     *  per iteration.
	     * @param {*} [thisArg] The `this` binding of `iteratee`.
	     * @returns {number} Returns the index at which `value` should be inserted
	     *  into `array`.
	     * @example
	     *
	     * _.sortedLastIndex([4, 4, 5, 5], 5);
	     * // => 4
	     */
	    var sortedLastIndex = createSortedIndex(true);

	    /**
	     * Creates a slice of `array` with `n` elements taken from the beginning.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to query.
	     * @param {number} [n=1] The number of elements to take.
	     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
	     * @returns {Array} Returns the slice of `array`.
	     * @example
	     *
	     * _.take([1, 2, 3]);
	     * // => [1]
	     *
	     * _.take([1, 2, 3], 2);
	     * // => [1, 2]
	     *
	     * _.take([1, 2, 3], 5);
	     * // => [1, 2, 3]
	     *
	     * _.take([1, 2, 3], 0);
	     * // => []
	     */
	    function take(array, n, guard) {
	      var length = array ? array.length : 0;
	      if (!length) {
	        return [];
	      }
	      if (guard ? isIterateeCall(array, n, guard) : n == null) {
	        n = 1;
	      }
	      return baseSlice(array, 0, n < 0 ? 0 : n);
	    }

	    /**
	     * Creates a slice of `array` with `n` elements taken from the end.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to query.
	     * @param {number} [n=1] The number of elements to take.
	     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
	     * @returns {Array} Returns the slice of `array`.
	     * @example
	     *
	     * _.takeRight([1, 2, 3]);
	     * // => [3]
	     *
	     * _.takeRight([1, 2, 3], 2);
	     * // => [2, 3]
	     *
	     * _.takeRight([1, 2, 3], 5);
	     * // => [1, 2, 3]
	     *
	     * _.takeRight([1, 2, 3], 0);
	     * // => []
	     */
	    function takeRight(array, n, guard) {
	      var length = array ? array.length : 0;
	      if (!length) {
	        return [];
	      }
	      if (guard ? isIterateeCall(array, n, guard) : n == null) {
	        n = 1;
	      }
	      n = length - (+n || 0);
	      return baseSlice(array, n < 0 ? 0 : n);
	    }

	    /**
	     * Creates a slice of `array` with elements taken from the end. Elements are
	     * taken until `predicate` returns falsey. The predicate is bound to `thisArg`
	     * and invoked with three arguments: (value, index, array).
	     *
	     * If a property name is provided for `predicate` the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If a value is also provided for `thisArg` the created `_.matchesProperty`
	     * style callback returns `true` for elements that have a matching property
	     * value, else `false`.
	     *
	     * If an object is provided for `predicate` the created `_.matches` style
	     * callback returns `true` for elements that have the properties of the given
	     * object, else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to query.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked
	     *  per iteration.
	     * @param {*} [thisArg] The `this` binding of `predicate`.
	     * @returns {Array} Returns the slice of `array`.
	     * @example
	     *
	     * _.takeRightWhile([1, 2, 3], function(n) {
	     *   return n > 1;
	     * });
	     * // => [2, 3]
	     *
	     * var users = [
	     *   { 'user': 'barney',  'active': true },
	     *   { 'user': 'fred',    'active': false },
	     *   { 'user': 'pebbles', 'active': false }
	     * ];
	     *
	     * // using the `_.matches` callback shorthand
	     * _.pluck(_.takeRightWhile(users, { 'user': 'pebbles', 'active': false }), 'user');
	     * // => ['pebbles']
	     *
	     * // using the `_.matchesProperty` callback shorthand
	     * _.pluck(_.takeRightWhile(users, 'active', false), 'user');
	     * // => ['fred', 'pebbles']
	     *
	     * // using the `_.property` callback shorthand
	     * _.pluck(_.takeRightWhile(users, 'active'), 'user');
	     * // => []
	     */
	    function takeRightWhile(array, predicate, thisArg) {
	      return (array && array.length)
	        ? baseWhile(array, getCallback(predicate, thisArg, 3), false, true)
	        : [];
	    }

	    /**
	     * Creates a slice of `array` with elements taken from the beginning. Elements
	     * are taken until `predicate` returns falsey. The predicate is bound to
	     * `thisArg` and invoked with three arguments: (value, index, array).
	     *
	     * If a property name is provided for `predicate` the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If a value is also provided for `thisArg` the created `_.matchesProperty`
	     * style callback returns `true` for elements that have a matching property
	     * value, else `false`.
	     *
	     * If an object is provided for `predicate` the created `_.matches` style
	     * callback returns `true` for elements that have the properties of the given
	     * object, else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to query.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked
	     *  per iteration.
	     * @param {*} [thisArg] The `this` binding of `predicate`.
	     * @returns {Array} Returns the slice of `array`.
	     * @example
	     *
	     * _.takeWhile([1, 2, 3], function(n) {
	     *   return n < 3;
	     * });
	     * // => [1, 2]
	     *
	     * var users = [
	     *   { 'user': 'barney',  'active': false },
	     *   { 'user': 'fred',    'active': false},
	     *   { 'user': 'pebbles', 'active': true }
	     * ];
	     *
	     * // using the `_.matches` callback shorthand
	     * _.pluck(_.takeWhile(users, { 'user': 'barney', 'active': false }), 'user');
	     * // => ['barney']
	     *
	     * // using the `_.matchesProperty` callback shorthand
	     * _.pluck(_.takeWhile(users, 'active', false), 'user');
	     * // => ['barney', 'fred']
	     *
	     * // using the `_.property` callback shorthand
	     * _.pluck(_.takeWhile(users, 'active'), 'user');
	     * // => []
	     */
	    function takeWhile(array, predicate, thisArg) {
	      return (array && array.length)
	        ? baseWhile(array, getCallback(predicate, thisArg, 3))
	        : [];
	    }

	    /**
	     * Creates an array of unique values, in order, of the provided arrays using
	     * `SameValueZero` for equality comparisons.
	     *
	     * **Note:** [`SameValueZero`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevaluezero)
	     * comparisons are like strict equality comparisons, e.g. `===`, except that
	     * `NaN` matches `NaN`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {...Array} [arrays] The arrays to inspect.
	     * @returns {Array} Returns the new array of combined values.
	     * @example
	     *
	     * _.union([1, 2], [4, 2], [2, 1]);
	     * // => [1, 2, 4]
	     */
	    var union = restParam(function(arrays) {
	      return baseUniq(baseFlatten(arrays, false, true));
	    });

	    /**
	     * Creates a duplicate-value-free version of an array using `SameValueZero`
	     * for equality comparisons. Providing `true` for `isSorted` performs a faster
	     * search algorithm for sorted arrays. If an iteratee function is provided it
	     * is invoked for each value in the array to generate the criterion by which
	     * uniqueness is computed. The `iteratee` is bound to `thisArg` and invoked
	     * with three arguments: (value, index, array).
	     *
	     * If a property name is provided for `iteratee` the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If a value is also provided for `thisArg` the created `_.matchesProperty`
	     * style callback returns `true` for elements that have a matching property
	     * value, else `false`.
	     *
	     * If an object is provided for `iteratee` the created `_.matches` style
	     * callback returns `true` for elements that have the properties of the given
	     * object, else `false`.
	     *
	     * **Note:** [`SameValueZero`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevaluezero)
	     * comparisons are like strict equality comparisons, e.g. `===`, except that
	     * `NaN` matches `NaN`.
	     *
	     * @static
	     * @memberOf _
	     * @alias unique
	     * @category Array
	     * @param {Array} array The array to inspect.
	     * @param {boolean} [isSorted] Specify the array is sorted.
	     * @param {Function|Object|string} [iteratee] The function invoked per iteration.
	     * @param {*} [thisArg] The `this` binding of `iteratee`.
	     * @returns {Array} Returns the new duplicate-value-free array.
	     * @example
	     *
	     * _.uniq([1, 2, 1]);
	     * // => [1, 2]
	     *
	     * // using `isSorted`
	     * _.uniq([1, 1, 2], true);
	     * // => [1, 2]
	     *
	     * // using an iteratee function
	     * _.uniq([1, 2.5, 1.5, 2], function(n) {
	     *   return this.floor(n);
	     * }, Math);
	     * // => [1, 2.5]
	     *
	     * // using the `_.property` callback shorthand
	     * _.uniq([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
	     * // => [{ 'x': 1 }, { 'x': 2 }]
	     */
	    function uniq(array, isSorted, iteratee, thisArg) {
	      var length = array ? array.length : 0;
	      if (!length) {
	        return [];
	      }
	      if (isSorted != null && typeof isSorted != 'boolean') {
	        thisArg = iteratee;
	        iteratee = isIterateeCall(array, isSorted, thisArg) ? null : isSorted;
	        isSorted = false;
	      }
	      var func = getCallback();
	      if (!(func === baseCallback && iteratee == null)) {
	        iteratee = func(iteratee, thisArg, 3);
	      }
	      return (isSorted && getIndexOf() == baseIndexOf)
	        ? sortedUniq(array, iteratee)
	        : baseUniq(array, iteratee);
	    }

	    /**
	     * This method is like `_.zip` except that it accepts an array of grouped
	     * elements and creates an array regrouping the elements to their pre-`_.zip`
	     * configuration.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array of grouped elements to process.
	     * @returns {Array} Returns the new array of regrouped elements.
	     * @example
	     *
	     * var zipped = _.zip(['fred', 'barney'], [30, 40], [true, false]);
	     * // => [['fred', 30, true], ['barney', 40, false]]
	     *
	     * _.unzip(zipped);
	     * // => [['fred', 'barney'], [30, 40], [true, false]]
	     */
	    function unzip(array) {
	      var index = -1,
	          length = (array && array.length && arrayMax(arrayMap(array, getLength))) >>> 0,
	          result = Array(length);

	      while (++index < length) {
	        result[index] = arrayMap(array, baseProperty(index));
	      }
	      return result;
	    }

	    /**
	     * Creates an array excluding all provided values using `SameValueZero` for
	     * equality comparisons.
	     *
	     * **Note:** [`SameValueZero`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevaluezero)
	     * comparisons are like strict equality comparisons, e.g. `===`, except that
	     * `NaN` matches `NaN`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to filter.
	     * @param {...*} [values] The values to exclude.
	     * @returns {Array} Returns the new array of filtered values.
	     * @example
	     *
	     * _.without([1, 2, 1, 3], 1, 2);
	     * // => [3]
	     */
	    var without = restParam(function(array, values) {
	      return (isArray(array) || isArguments(array))
	        ? baseDifference(array, values)
	        : [];
	    });

	    /**
	     * Creates an array that is the [symmetric difference](https://en.wikipedia.org/wiki/Symmetric_difference)
	     * of the provided arrays.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {...Array} [arrays] The arrays to inspect.
	     * @returns {Array} Returns the new array of values.
	     * @example
	     *
	     * _.xor([1, 2], [4, 2]);
	     * // => [1, 4]
	     */
	    function xor() {
	      var index = -1,
	          length = arguments.length;

	      while (++index < length) {
	        var array = arguments[index];
	        if (isArray(array) || isArguments(array)) {
	          var result = result
	            ? baseDifference(result, array).concat(baseDifference(array, result))
	            : array;
	        }
	      }
	      return result ? baseUniq(result) : [];
	    }

	    /**
	     * Creates an array of grouped elements, the first of which contains the first
	     * elements of the given arrays, the second of which contains the second elements
	     * of the given arrays, and so on.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {...Array} [arrays] The arrays to process.
	     * @returns {Array} Returns the new array of grouped elements.
	     * @example
	     *
	     * _.zip(['fred', 'barney'], [30, 40], [true, false]);
	     * // => [['fred', 30, true], ['barney', 40, false]]
	     */
	    var zip = restParam(unzip);

	    /**
	     * The inverse of `_.pairs`; this method returns an object composed from arrays
	     * of property names and values. Provide either a single two dimensional array,
	     * e.g. `[[key1, value1], [key2, value2]]` or two arrays, one of property names
	     * and one of corresponding values.
	     *
	     * @static
	     * @memberOf _
	     * @alias object
	     * @category Array
	     * @param {Array} props The property names.
	     * @param {Array} [values=[]] The property values.
	     * @returns {Object} Returns the new object.
	     * @example
	     *
	     * _.zipObject([['fred', 30], ['barney', 40]]);
	     * // => { 'fred': 30, 'barney': 40 }
	     *
	     * _.zipObject(['fred', 'barney'], [30, 40]);
	     * // => { 'fred': 30, 'barney': 40 }
	     */
	    function zipObject(props, values) {
	      var index = -1,
	          length = props ? props.length : 0,
	          result = {};

	      if (length && !values && !isArray(props[0])) {
	        values = [];
	      }
	      while (++index < length) {
	        var key = props[index];
	        if (values) {
	          result[key] = values[index];
	        } else if (key) {
	          result[key[0]] = key[1];
	        }
	      }
	      return result;
	    }

	    /*------------------------------------------------------------------------*/

	    /**
	     * Creates a `lodash` object that wraps `value` with explicit method
	     * chaining enabled.
	     *
	     * @static
	     * @memberOf _
	     * @category Chain
	     * @param {*} value The value to wrap.
	     * @returns {Object} Returns the new `lodash` wrapper instance.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney',  'age': 36 },
	     *   { 'user': 'fred',    'age': 40 },
	     *   { 'user': 'pebbles', 'age': 1 }
	     * ];
	     *
	     * var youngest = _.chain(users)
	     *   .sortBy('age')
	     *   .map(function(chr) {
	     *     return chr.user + ' is ' + chr.age;
	     *   })
	     *   .first()
	     *   .value();
	     * // => 'pebbles is 1'
	     */
	    function chain(value) {
	      var result = lodash(value);
	      result.__chain__ = true;
	      return result;
	    }

	    /**
	     * This method invokes `interceptor` and returns `value`. The interceptor is
	     * bound to `thisArg` and invoked with one argument; (value). The purpose of
	     * this method is to "tap into" a method chain in order to perform operations
	     * on intermediate results within the chain.
	     *
	     * @static
	     * @memberOf _
	     * @category Chain
	     * @param {*} value The value to provide to `interceptor`.
	     * @param {Function} interceptor The function to invoke.
	     * @param {*} [thisArg] The `this` binding of `interceptor`.
	     * @returns {*} Returns `value`.
	     * @example
	     *
	     * _([1, 2, 3])
	     *  .tap(function(array) {
	     *    array.pop();
	     *  })
	     *  .reverse()
	     *  .value();
	     * // => [2, 1]
	     */
	    function tap(value, interceptor, thisArg) {
	      interceptor.call(thisArg, value);
	      return value;
	    }

	    /**
	     * This method is like `_.tap` except that it returns the result of `interceptor`.
	     *
	     * @static
	     * @memberOf _
	     * @category Chain
	     * @param {*} value The value to provide to `interceptor`.
	     * @param {Function} interceptor The function to invoke.
	     * @param {*} [thisArg] The `this` binding of `interceptor`.
	     * @returns {*} Returns the result of `interceptor`.
	     * @example
	     *
	     * _('  abc  ')
	     *  .chain()
	     *  .trim()
	     *  .thru(function(value) {
	     *    return [value];
	     *  })
	     *  .value();
	     * // => ['abc']
	     */
	    function thru(value, interceptor, thisArg) {
	      return interceptor.call(thisArg, value);
	    }

	    /**
	     * Enables explicit method chaining on the wrapper object.
	     *
	     * @name chain
	     * @memberOf _
	     * @category Chain
	     * @returns {Object} Returns the new `lodash` wrapper instance.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney', 'age': 36 },
	     *   { 'user': 'fred',   'age': 40 }
	     * ];
	     *
	     * // without explicit chaining
	     * _(users).first();
	     * // => { 'user': 'barney', 'age': 36 }
	     *
	     * // with explicit chaining
	     * _(users).chain()
	     *   .first()
	     *   .pick('user')
	     *   .value();
	     * // => { 'user': 'barney' }
	     */
	    function wrapperChain() {
	      return chain(this);
	    }

	    /**
	     * Executes the chained sequence and returns the wrapped result.
	     *
	     * @name commit
	     * @memberOf _
	     * @category Chain
	     * @returns {Object} Returns the new `lodash` wrapper instance.
	     * @example
	     *
	     * var array = [1, 2];
	     * var wrapper = _(array).push(3);
	     *
	     * console.log(array);
	     * // => [1, 2]
	     *
	     * wrapper = wrapper.commit();
	     * console.log(array);
	     * // => [1, 2, 3]
	     *
	     * wrapper.last();
	     * // => 3
	     *
	     * console.log(array);
	     * // => [1, 2, 3]
	     */
	    function wrapperCommit() {
	      return new LodashWrapper(this.value(), this.__chain__);
	    }

	    /**
	     * Creates a clone of the chained sequence planting `value` as the wrapped value.
	     *
	     * @name plant
	     * @memberOf _
	     * @category Chain
	     * @returns {Object} Returns the new `lodash` wrapper instance.
	     * @example
	     *
	     * var array = [1, 2];
	     * var wrapper = _(array).map(function(value) {
	     *   return Math.pow(value, 2);
	     * });
	     *
	     * var other = [3, 4];
	     * var otherWrapper = wrapper.plant(other);
	     *
	     * otherWrapper.value();
	     * // => [9, 16]
	     *
	     * wrapper.value();
	     * // => [1, 4]
	     */
	    function wrapperPlant(value) {
	      var result,
	          parent = this;

	      while (parent instanceof baseLodash) {
	        var clone = wrapperClone(parent);
	        if (result) {
	          previous.__wrapped__ = clone;
	        } else {
	          result = clone;
	        }
	        var previous = clone;
	        parent = parent.__wrapped__;
	      }
	      previous.__wrapped__ = value;
	      return result;
	    }

	    /**
	     * Reverses the wrapped array so the first element becomes the last, the
	     * second element becomes the second to last, and so on.
	     *
	     * **Note:** This method mutates the wrapped array.
	     *
	     * @name reverse
	     * @memberOf _
	     * @category Chain
	     * @returns {Object} Returns the new reversed `lodash` wrapper instance.
	     * @example
	     *
	     * var array = [1, 2, 3];
	     *
	     * _(array).reverse().value()
	     * // => [3, 2, 1]
	     *
	     * console.log(array);
	     * // => [3, 2, 1]
	     */
	    function wrapperReverse() {
	      var value = this.__wrapped__;
	      if (value instanceof LazyWrapper) {
	        if (this.__actions__.length) {
	          value = new LazyWrapper(this);
	        }
	        return new LodashWrapper(value.reverse(), this.__chain__);
	      }
	      return this.thru(function(value) {
	        return value.reverse();
	      });
	    }

	    /**
	     * Produces the result of coercing the unwrapped value to a string.
	     *
	     * @name toString
	     * @memberOf _
	     * @category Chain
	     * @returns {string} Returns the coerced string value.
	     * @example
	     *
	     * _([1, 2, 3]).toString();
	     * // => '1,2,3'
	     */
	    function wrapperToString() {
	      return (this.value() + '');
	    }

	    /**
	     * Executes the chained sequence to extract the unwrapped value.
	     *
	     * @name value
	     * @memberOf _
	     * @alias run, toJSON, valueOf
	     * @category Chain
	     * @returns {*} Returns the resolved unwrapped value.
	     * @example
	     *
	     * _([1, 2, 3]).value();
	     * // => [1, 2, 3]
	     */
	    function wrapperValue() {
	      return baseWrapperValue(this.__wrapped__, this.__actions__);
	    }

	    /*------------------------------------------------------------------------*/

	    /**
	     * Creates an array of elements corresponding to the given keys, or indexes,
	     * of `collection`. Keys may be specified as individual arguments or as arrays
	     * of keys.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {...(number|number[]|string|string[])} [props] The property names
	     *  or indexes of elements to pick, specified individually or in arrays.
	     * @returns {Array} Returns the new array of picked elements.
	     * @example
	     *
	     * _.at(['a', 'b', 'c'], [0, 2]);
	     * // => ['a', 'c']
	     *
	     * _.at(['barney', 'fred', 'pebbles'], 0, 2);
	     * // => ['barney', 'pebbles']
	     */
	    var at = restParam(function(collection, props) {
	      var length = collection ? collection.length : 0;
	      if (isLength(length)) {
	        collection = toIterable(collection);
	      }
	      return baseAt(collection, baseFlatten(props));
	    });

	    /**
	     * Creates an object composed of keys generated from the results of running
	     * each element of `collection` through `iteratee`. The corresponding value
	     * of each key is the number of times the key was returned by `iteratee`.
	     * The `iteratee` is bound to `thisArg` and invoked with three arguments:
	     * (value, index|key, collection).
	     *
	     * If a property name is provided for `iteratee` the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If a value is also provided for `thisArg` the created `_.matchesProperty`
	     * style callback returns `true` for elements that have a matching property
	     * value, else `false`.
	     *
	     * If an object is provided for `iteratee` the created `_.matches` style
	     * callback returns `true` for elements that have the properties of the given
	     * object, else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
	     *  per iteration.
	     * @param {*} [thisArg] The `this` binding of `iteratee`.
	     * @returns {Object} Returns the composed aggregate object.
	     * @example
	     *
	     * _.countBy([4.3, 6.1, 6.4], function(n) {
	     *   return Math.floor(n);
	     * });
	     * // => { '4': 1, '6': 2 }
	     *
	     * _.countBy([4.3, 6.1, 6.4], function(n) {
	     *   return this.floor(n);
	     * }, Math);
	     * // => { '4': 1, '6': 2 }
	     *
	     * _.countBy(['one', 'two', 'three'], 'length');
	     * // => { '3': 2, '5': 1 }
	     */
	    var countBy = createAggregator(function(result, value, key) {
	      hasOwnProperty.call(result, key) ? ++result[key] : (result[key] = 1);
	    });

	    /**
	     * Checks if `predicate` returns truthy for **all** elements of `collection`.
	     * The predicate is bound to `thisArg` and invoked with three arguments:
	     * (value, index|key, collection).
	     *
	     * If a property name is provided for `predicate` the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If a value is also provided for `thisArg` the created `_.matchesProperty`
	     * style callback returns `true` for elements that have a matching property
	     * value, else `false`.
	     *
	     * If an object is provided for `predicate` the created `_.matches` style
	     * callback returns `true` for elements that have the properties of the given
	     * object, else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @alias all
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked
	     *  per iteration.
	     * @param {*} [thisArg] The `this` binding of `predicate`.
	     * @returns {boolean} Returns `true` if all elements pass the predicate check,
	     *  else `false`.
	     * @example
	     *
	     * _.every([true, 1, null, 'yes'], Boolean);
	     * // => false
	     *
	     * var users = [
	     *   { 'user': 'barney', 'active': false },
	     *   { 'user': 'fred',   'active': false }
	     * ];
	     *
	     * // using the `_.matches` callback shorthand
	     * _.every(users, { 'user': 'barney', 'active': false });
	     * // => false
	     *
	     * // using the `_.matchesProperty` callback shorthand
	     * _.every(users, 'active', false);
	     * // => true
	     *
	     * // using the `_.property` callback shorthand
	     * _.every(users, 'active');
	     * // => false
	     */
	    function every(collection, predicate, thisArg) {
	      var func = isArray(collection) ? arrayEvery : baseEvery;
	      if (thisArg && isIterateeCall(collection, predicate, thisArg)) {
	        predicate = null;
	      }
	      if (typeof predicate != 'function' || typeof thisArg != 'undefined') {
	        predicate = getCallback(predicate, thisArg, 3);
	      }
	      return func(collection, predicate);
	    }

	    /**
	     * Iterates over elements of `collection`, returning an array of all elements
	     * `predicate` returns truthy for. The predicate is bound to `thisArg` and
	     * invoked with three arguments: (value, index|key, collection).
	     *
	     * If a property name is provided for `predicate` the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If a value is also provided for `thisArg` the created `_.matchesProperty`
	     * style callback returns `true` for elements that have a matching property
	     * value, else `false`.
	     *
	     * If an object is provided for `predicate` the created `_.matches` style
	     * callback returns `true` for elements that have the properties of the given
	     * object, else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @alias select
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked
	     *  per iteration.
	     * @param {*} [thisArg] The `this` binding of `predicate`.
	     * @returns {Array} Returns the new filtered array.
	     * @example
	     *
	     * _.filter([4, 5, 6], function(n) {
	     *   return n % 2 == 0;
	     * });
	     * // => [4, 6]
	     *
	     * var users = [
	     *   { 'user': 'barney', 'age': 36, 'active': true },
	     *   { 'user': 'fred',   'age': 40, 'active': false }
	     * ];
	     *
	     * // using the `_.matches` callback shorthand
	     * _.pluck(_.filter(users, { 'age': 36, 'active': true }), 'user');
	     * // => ['barney']
	     *
	     * // using the `_.matchesProperty` callback shorthand
	     * _.pluck(_.filter(users, 'active', false), 'user');
	     * // => ['fred']
	     *
	     * // using the `_.property` callback shorthand
	     * _.pluck(_.filter(users, 'active'), 'user');
	     * // => ['barney']
	     */
	    function filter(collection, predicate, thisArg) {
	      var func = isArray(collection) ? arrayFilter : baseFilter;
	      predicate = getCallback(predicate, thisArg, 3);
	      return func(collection, predicate);
	    }

	    /**
	     * Iterates over elements of `collection`, returning the first element
	     * `predicate` returns truthy for. The predicate is bound to `thisArg` and
	     * invoked with three arguments: (value, index|key, collection).
	     *
	     * If a property name is provided for `predicate` the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If a value is also provided for `thisArg` the created `_.matchesProperty`
	     * style callback returns `true` for elements that have a matching property
	     * value, else `false`.
	     *
	     * If an object is provided for `predicate` the created `_.matches` style
	     * callback returns `true` for elements that have the properties of the given
	     * object, else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @alias detect
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to search.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked
	     *  per iteration.
	     * @param {*} [thisArg] The `this` binding of `predicate`.
	     * @returns {*} Returns the matched element, else `undefined`.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney',  'age': 36, 'active': true },
	     *   { 'user': 'fred',    'age': 40, 'active': false },
	     *   { 'user': 'pebbles', 'age': 1,  'active': true }
	     * ];
	     *
	     * _.result(_.find(users, function(chr) {
	     *   return chr.age < 40;
	     * }), 'user');
	     * // => 'barney'
	     *
	     * // using the `_.matches` callback shorthand
	     * _.result(_.find(users, { 'age': 1, 'active': true }), 'user');
	     * // => 'pebbles'
	     *
	     * // using the `_.matchesProperty` callback shorthand
	     * _.result(_.find(users, 'active', false), 'user');
	     * // => 'fred'
	     *
	     * // using the `_.property` callback shorthand
	     * _.result(_.find(users, 'active'), 'user');
	     * // => 'barney'
	     */
	    var find = createFind(baseEach);

	    /**
	     * This method is like `_.find` except that it iterates over elements of
	     * `collection` from right to left.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to search.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked
	     *  per iteration.
	     * @param {*} [thisArg] The `this` binding of `predicate`.
	     * @returns {*} Returns the matched element, else `undefined`.
	     * @example
	     *
	     * _.findLast([1, 2, 3, 4], function(n) {
	     *   return n % 2 == 1;
	     * });
	     * // => 3
	     */
	    var findLast = createFind(baseEachRight, true);

	    /**
	     * Performs a deep comparison between each element in `collection` and the
	     * source object, returning the first element that has equivalent property
	     * values.
	     *
	     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
	     * numbers, `Object` objects, regexes, and strings. Objects are compared by
	     * their own, not inherited, enumerable properties. For comparing a single
	     * own or inherited property value see `_.matchesProperty`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to search.
	     * @param {Object} source The object of property values to match.
	     * @returns {*} Returns the matched element, else `undefined`.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney', 'age': 36, 'active': true },
	     *   { 'user': 'fred',   'age': 40, 'active': false }
	     * ];
	     *
	     * _.result(_.findWhere(users, { 'age': 36, 'active': true }), 'user');
	     * // => 'barney'
	     *
	     * _.result(_.findWhere(users, { 'age': 40, 'active': false }), 'user');
	     * // => 'fred'
	     */
	    function findWhere(collection, source) {
	      return find(collection, baseMatches(source));
	    }

	    /**
	     * Iterates over elements of `collection` invoking `iteratee` for each element.
	     * The `iteratee` is bound to `thisArg` and invoked with three arguments:
	     * (value, index|key, collection). Iterator functions may exit iteration early
	     * by explicitly returning `false`.
	     *
	     * **Note:** As with other "Collections" methods, objects with a `length` property
	     * are iterated like arrays. To avoid this behavior `_.forIn` or `_.forOwn`
	     * may be used for object iteration.
	     *
	     * @static
	     * @memberOf _
	     * @alias each
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	     * @param {*} [thisArg] The `this` binding of `iteratee`.
	     * @returns {Array|Object|string} Returns `collection`.
	     * @example
	     *
	     * _([1, 2]).forEach(function(n) {
	     *   console.log(n);
	     * }).value();
	     * // => logs each value from left to right and returns the array
	     *
	     * _.forEach({ 'a': 1, 'b': 2 }, function(n, key) {
	     *   console.log(n, key);
	     * });
	     * // => logs each value-key pair and returns the object (iteration order is not guaranteed)
	     */
	    var forEach = createForEach(arrayEach, baseEach);

	    /**
	     * This method is like `_.forEach` except that it iterates over elements of
	     * `collection` from right to left.
	     *
	     * @static
	     * @memberOf _
	     * @alias eachRight
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	     * @param {*} [thisArg] The `this` binding of `iteratee`.
	     * @returns {Array|Object|string} Returns `collection`.
	     * @example
	     *
	     * _([1, 2]).forEachRight(function(n) {
	     *   console.log(n);
	     * }).value();
	     * // => logs each value from right to left and returns the array
	     */
	    var forEachRight = createForEach(arrayEachRight, baseEachRight);

	    /**
	     * Creates an object composed of keys generated from the results of running
	     * each element of `collection` through `iteratee`. The corresponding value
	     * of each key is an array of the elements responsible for generating the key.
	     * The `iteratee` is bound to `thisArg` and invoked with three arguments:
	     * (value, index|key, collection).
	     *
	     * If a property name is provided for `iteratee` the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If a value is also provided for `thisArg` the created `_.matchesProperty`
	     * style callback returns `true` for elements that have a matching property
	     * value, else `false`.
	     *
	     * If an object is provided for `iteratee` the created `_.matches` style
	     * callback returns `true` for elements that have the properties of the given
	     * object, else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
	     *  per iteration.
	     * @param {*} [thisArg] The `this` binding of `iteratee`.
	     * @returns {Object} Returns the composed aggregate object.
	     * @example
	     *
	     * _.groupBy([4.2, 6.1, 6.4], function(n) {
	     *   return Math.floor(n);
	     * });
	     * // => { '4': [4.2], '6': [6.1, 6.4] }
	     *
	     * _.groupBy([4.2, 6.1, 6.4], function(n) {
	     *   return this.floor(n);
	     * }, Math);
	     * // => { '4': [4.2], '6': [6.1, 6.4] }
	     *
	     * // using the `_.property` callback shorthand
	     * _.groupBy(['one', 'two', 'three'], 'length');
	     * // => { '3': ['one', 'two'], '5': ['three'] }
	     */
	    var groupBy = createAggregator(function(result, value, key) {
	      if (hasOwnProperty.call(result, key)) {
	        result[key].push(value);
	      } else {
	        result[key] = [value];
	      }
	    });

	    /**
	     * Checks if `value` is in `collection` using `SameValueZero` for equality
	     * comparisons. If `fromIndex` is negative, it is used as the offset from
	     * the end of `collection`.
	     *
	     * **Note:** [`SameValueZero`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevaluezero)
	     * comparisons are like strict equality comparisons, e.g. `===`, except that
	     * `NaN` matches `NaN`.
	     *
	     * @static
	     * @memberOf _
	     * @alias contains, include
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to search.
	     * @param {*} target The value to search for.
	     * @param {number} [fromIndex=0] The index to search from.
	     * @param- {Object} [guard] Enables use as a callback for functions like `_.reduce`.
	     * @returns {boolean} Returns `true` if a matching element is found, else `false`.
	     * @example
	     *
	     * _.includes([1, 2, 3], 1);
	     * // => true
	     *
	     * _.includes([1, 2, 3], 1, 2);
	     * // => false
	     *
	     * _.includes({ 'user': 'fred', 'age': 40 }, 'fred');
	     * // => true
	     *
	     * _.includes('pebbles', 'eb');
	     * // => true
	     */
	    function includes(collection, target, fromIndex, guard) {
	      var length = collection ? collection.length : 0;
	      if (!isLength(length)) {
	        collection = values(collection);
	        length = collection.length;
	      }
	      if (!length) {
	        return false;
	      }
	      if (typeof fromIndex != 'number' || (guard && isIterateeCall(target, fromIndex, guard))) {
	        fromIndex = 0;
	      } else {
	        fromIndex = fromIndex < 0 ? nativeMax(length + fromIndex, 0) : (fromIndex || 0);
	      }
	      return (typeof collection == 'string' || !isArray(collection) && isString(collection))
	        ? (fromIndex < length && collection.indexOf(target, fromIndex) > -1)
	        : (getIndexOf(collection, target, fromIndex) > -1);
	    }

	    /**
	     * Creates an object composed of keys generated from the results of running
	     * each element of `collection` through `iteratee`. The corresponding value
	     * of each key is the last element responsible for generating the key. The
	     * iteratee function is bound to `thisArg` and invoked with three arguments:
	     * (value, index|key, collection).
	     *
	     * If a property name is provided for `iteratee` the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If a value is also provided for `thisArg` the created `_.matchesProperty`
	     * style callback returns `true` for elements that have a matching property
	     * value, else `false`.
	     *
	     * If an object is provided for `iteratee` the created `_.matches` style
	     * callback returns `true` for elements that have the properties of the given
	     * object, else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
	     *  per iteration.
	     * @param {*} [thisArg] The `this` binding of `iteratee`.
	     * @returns {Object} Returns the composed aggregate object.
	     * @example
	     *
	     * var keyData = [
	     *   { 'dir': 'left', 'code': 97 },
	     *   { 'dir': 'right', 'code': 100 }
	     * ];
	     *
	     * _.indexBy(keyData, 'dir');
	     * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
	     *
	     * _.indexBy(keyData, function(object) {
	     *   return String.fromCharCode(object.code);
	     * });
	     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
	     *
	     * _.indexBy(keyData, function(object) {
	     *   return this.fromCharCode(object.code);
	     * }, String);
	     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
	     */
	    var indexBy = createAggregator(function(result, value, key) {
	      result[key] = value;
	    });

	    /**
	     * Invokes the method named by `methodName` on each element in `collection`,
	     * returning an array of the results of each invoked method. Any additional
	     * arguments are provided to each invoked method. If `methodName` is a function
	     * it is invoked for, and `this` bound to, each element in `collection`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|string} methodName The name of the method to invoke or
	     *  the function invoked per iteration.
	     * @param {...*} [args] The arguments to invoke the method with.
	     * @returns {Array} Returns the array of results.
	     * @example
	     *
	     * _.invoke([[5, 1, 7], [3, 2, 1]], 'sort');
	     * // => [[1, 5, 7], [1, 2, 3]]
	     *
	     * _.invoke([123, 456], String.prototype.split, '');
	     * // => [['1', '2', '3'], ['4', '5', '6']]
	     */
	    var invoke = restParam(function(collection, methodName, args) {
	      var index = -1,
	          isFunc = typeof methodName == 'function',
	          length = collection ? collection.length : 0,
	          result = isLength(length) ? Array(length) : [];

	      baseEach(collection, function(value) {
	        var func = isFunc ? methodName : (value != null && value[methodName]);
	        result[++index] = func ? func.apply(value, args) : undefined;
	      });
	      return result;
	    });

	    /**
	     * Creates an array of values by running each element in `collection` through
	     * `iteratee`. The `iteratee` is bound to `thisArg` and invoked with three
	     * arguments: (value, index|key, collection).
	     *
	     * If a property name is provided for `iteratee` the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If a value is also provided for `thisArg` the created `_.matchesProperty`
	     * style callback returns `true` for elements that have a matching property
	     * value, else `false`.
	     *
	     * If an object is provided for `iteratee` the created `_.matches` style
	     * callback returns `true` for elements that have the properties of the given
	     * object, else `false`.
	     *
	     * Many lodash methods are guarded to work as interatees for methods like
	     * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
	     *
	     * The guarded methods are:
	     * `ary`, `callback`, `chunk`, `clone`, `create`, `curry`, `curryRight`, `drop`,
	     * `dropRight`, `every`, `fill`, `flatten`, `invert`, `max`, `min`, `parseInt`,
	     * `slice`, `sortBy`, `take`, `takeRight`, `template`, `trim`, `trimLeft`,
	     * `trimRight`, `trunc`, `random`, `range`, `sample`, `some`, `uniq`, and `words`
	     *
	     * @static
	     * @memberOf _
	     * @alias collect
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
	     *  per iteration.
	     *  create a `_.property` or `_.matches` style callback respectively.
	     * @param {*} [thisArg] The `this` binding of `iteratee`.
	     * @returns {Array} Returns the new mapped array.
	     * @example
	     *
	     * function timesThree(n) {
	     *   return n * 3;
	     * }
	     *
	     * _.map([1, 2], timesThree);
	     * // => [3, 6]
	     *
	     * _.map({ 'a': 1, 'b': 2 }, timesThree);
	     * // => [3, 6] (iteration order is not guaranteed)
	     *
	     * var users = [
	     *   { 'user': 'barney' },
	     *   { 'user': 'fred' }
	     * ];
	     *
	     * // using the `_.property` callback shorthand
	     * _.map(users, 'user');
	     * // => ['barney', 'fred']
	     */
	    function map(collection, iteratee, thisArg) {
	      var func = isArray(collection) ? arrayMap : baseMap;
	      iteratee = getCallback(iteratee, thisArg, 3);
	      return func(collection, iteratee);
	    }

	    /**
	     * Creates an array of elements split into two groups, the first of which
	     * contains elements `predicate` returns truthy for, while the second of which
	     * contains elements `predicate` returns falsey for. The predicate is bound
	     * to `thisArg` and invoked with three arguments: (value, index|key, collection).
	     *
	     * If a property name is provided for `predicate` the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If a value is also provided for `thisArg` the created `_.matchesProperty`
	     * style callback returns `true` for elements that have a matching property
	     * value, else `false`.
	     *
	     * If an object is provided for `predicate` the created `_.matches` style
	     * callback returns `true` for elements that have the properties of the given
	     * object, else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked
	     *  per iteration.
	     * @param {*} [thisArg] The `this` binding of `predicate`.
	     * @returns {Array} Returns the array of grouped elements.
	     * @example
	     *
	     * _.partition([1, 2, 3], function(n) {
	     *   return n % 2;
	     * });
	     * // => [[1, 3], [2]]
	     *
	     * _.partition([1.2, 2.3, 3.4], function(n) {
	     *   return this.floor(n) % 2;
	     * }, Math);
	     * // => [[1.2, 3.4], [2.3]]
	     *
	     * var users = [
	     *   { 'user': 'barney',  'age': 36, 'active': false },
	     *   { 'user': 'fred',    'age': 40, 'active': true },
	     *   { 'user': 'pebbles', 'age': 1,  'active': false }
	     * ];
	     *
	     * var mapper = function(array) {
	     *   return _.pluck(array, 'user');
	     * };
	     *
	     * // using the `_.matches` callback shorthand
	     * _.map(_.partition(users, { 'age': 1, 'active': false }), mapper);
	     * // => [['pebbles'], ['barney', 'fred']]
	     *
	     * // using the `_.matchesProperty` callback shorthand
	     * _.map(_.partition(users, 'active', false), mapper);
	     * // => [['barney', 'pebbles'], ['fred']]
	     *
	     * // using the `_.property` callback shorthand
	     * _.map(_.partition(users, 'active'), mapper);
	     * // => [['fred'], ['barney', 'pebbles']]
	     */
	    var partition = createAggregator(function(result, value, key) {
	      result[key ? 0 : 1].push(value);
	    }, function() { return [[], []]; });

	    /**
	     * Gets the value of `key` from all elements in `collection`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {string} key The key of the property to pluck.
	     * @returns {Array} Returns the property values.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney', 'age': 36 },
	     *   { 'user': 'fred',   'age': 40 }
	     * ];
	     *
	     * _.pluck(users, 'user');
	     * // => ['barney', 'fred']
	     *
	     * var userIndex = _.indexBy(users, 'user');
	     * _.pluck(userIndex, 'age');
	     * // => [36, 40] (iteration order is not guaranteed)
	     */
	    function pluck(collection, key) {
	      return map(collection, baseProperty(key));
	    }

	    /**
	     * Reduces `collection` to a value which is the accumulated result of running
	     * each element in `collection` through `iteratee`, where each successive
	     * invocation is supplied the return value of the previous. If `accumulator`
	     * is not provided the first element of `collection` is used as the initial
	     * value. The `iteratee` is bound to `thisArg` and invoked with four arguments:
	     * (accumulator, value, index|key, collection).
	     *
	     * Many lodash methods are guarded to work as interatees for methods like
	     * `_.reduce`, `_.reduceRight`, and `_.transform`.
	     *
	     * The guarded methods are:
	     * `assign`, `defaults`, `includes`, `merge`, `sortByAll`, and `sortByOrder`
	     *
	     * @static
	     * @memberOf _
	     * @alias foldl, inject
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	     * @param {*} [accumulator] The initial value.
	     * @param {*} [thisArg] The `this` binding of `iteratee`.
	     * @returns {*} Returns the accumulated value.
	     * @example
	     *
	     * _.reduce([1, 2], function(sum, n) {
	     *   return sum + n;
	     * });
	     * // => 3
	     *
	     * _.reduce({ 'a': 1, 'b': 2 }, function(result, n, key) {
	     *   result[key] = n * 3;
	     *   return result;
	     * }, {});
	     * // => { 'a': 3, 'b': 6 } (iteration order is not guaranteed)
	     */
	    var reduce = createReduce(arrayReduce, baseEach);

	    /**
	     * This method is like `_.reduce` except that it iterates over elements of
	     * `collection` from right to left.
	     *
	     * @static
	     * @memberOf _
	     * @alias foldr
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	     * @param {*} [accumulator] The initial value.
	     * @param {*} [thisArg] The `this` binding of `iteratee`.
	     * @returns {*} Returns the accumulated value.
	     * @example
	     *
	     * var array = [[0, 1], [2, 3], [4, 5]];
	     *
	     * _.reduceRight(array, function(flattened, other) {
	     *   return flattened.concat(other);
	     * }, []);
	     * // => [4, 5, 2, 3, 0, 1]
	     */
	    var reduceRight =  createReduce(arrayReduceRight, baseEachRight);

	    /**
	     * The opposite of `_.filter`; this method returns the elements of `collection`
	     * that `predicate` does **not** return truthy for.
	     *
	     * If a property name is provided for `predicate` the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If a value is also provided for `thisArg` the created `_.matchesProperty`
	     * style callback returns `true` for elements that have a matching property
	     * value, else `false`.
	     *
	     * If an object is provided for `predicate` the created `_.matches` style
	     * callback returns `true` for elements that have the properties of the given
	     * object, else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked
	     *  per iteration.
	     * @param {*} [thisArg] The `this` binding of `predicate`.
	     * @returns {Array} Returns the new filtered array.
	     * @example
	     *
	     * _.reject([1, 2, 3, 4], function(n) {
	     *   return n % 2 == 0;
	     * });
	     * // => [1, 3]
	     *
	     * var users = [
	     *   { 'user': 'barney', 'age': 36, 'active': false },
	     *   { 'user': 'fred',   'age': 40, 'active': true }
	     * ];
	     *
	     * // using the `_.matches` callback shorthand
	     * _.pluck(_.reject(users, { 'age': 40, 'active': true }), 'user');
	     * // => ['barney']
	     *
	     * // using the `_.matchesProperty` callback shorthand
	     * _.pluck(_.reject(users, 'active', false), 'user');
	     * // => ['fred']
	     *
	     * // using the `_.property` callback shorthand
	     * _.pluck(_.reject(users, 'active'), 'user');
	     * // => ['barney']
	     */
	    function reject(collection, predicate, thisArg) {
	      var func = isArray(collection) ? arrayFilter : baseFilter;
	      predicate = getCallback(predicate, thisArg, 3);
	      return func(collection, function(value, index, collection) {
	        return !predicate(value, index, collection);
	      });
	    }

	    /**
	     * Gets a random element or `n` random elements from a collection.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to sample.
	     * @param {number} [n] The number of elements to sample.
	     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
	     * @returns {*} Returns the random sample(s).
	     * @example
	     *
	     * _.sample([1, 2, 3, 4]);
	     * // => 2
	     *
	     * _.sample([1, 2, 3, 4], 2);
	     * // => [3, 1]
	     */
	    function sample(collection, n, guard) {
	      if (guard ? isIterateeCall(collection, n, guard) : n == null) {
	        collection = toIterable(collection);
	        var length = collection.length;
	        return length > 0 ? collection[baseRandom(0, length - 1)] : undefined;
	      }
	      var result = shuffle(collection);
	      result.length = nativeMin(n < 0 ? 0 : (+n || 0), result.length);
	      return result;
	    }

	    /**
	     * Creates an array of shuffled values, using a version of the
	     * [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher-Yates_shuffle).
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to shuffle.
	     * @returns {Array} Returns the new shuffled array.
	     * @example
	     *
	     * _.shuffle([1, 2, 3, 4]);
	     * // => [4, 1, 3, 2]
	     */
	    function shuffle(collection) {
	      collection = toIterable(collection);

	      var index = -1,
	          length = collection.length,
	          result = Array(length);

	      while (++index < length) {
	        var rand = baseRandom(0, index);
	        if (index != rand) {
	          result[index] = result[rand];
	        }
	        result[rand] = collection[index];
	      }
	      return result;
	    }

	    /**
	     * Gets the size of `collection` by returning its length for array-like
	     * values or the number of own enumerable properties for objects.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to inspect.
	     * @returns {number} Returns the size of `collection`.
	     * @example
	     *
	     * _.size([1, 2, 3]);
	     * // => 3
	     *
	     * _.size({ 'a': 1, 'b': 2 });
	     * // => 2
	     *
	     * _.size('pebbles');
	     * // => 7
	     */
	    function size(collection) {
	      var length = collection ? collection.length : 0;
	      return isLength(length) ? length : keys(collection).length;
	    }

	    /**
	     * Checks if `predicate` returns truthy for **any** element of `collection`.
	     * The function returns as soon as it finds a passing value and does not iterate
	     * over the entire collection. The predicate is bound to `thisArg` and invoked
	     * with three arguments: (value, index|key, collection).
	     *
	     * If a property name is provided for `predicate` the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If a value is also provided for `thisArg` the created `_.matchesProperty`
	     * style callback returns `true` for elements that have a matching property
	     * value, else `false`.
	     *
	     * If an object is provided for `predicate` the created `_.matches` style
	     * callback returns `true` for elements that have the properties of the given
	     * object, else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @alias any
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked
	     *  per iteration.
	     * @param {*} [thisArg] The `this` binding of `predicate`.
	     * @returns {boolean} Returns `true` if any element passes the predicate check,
	     *  else `false`.
	     * @example
	     *
	     * _.some([null, 0, 'yes', false], Boolean);
	     * // => true
	     *
	     * var users = [
	     *   { 'user': 'barney', 'active': true },
	     *   { 'user': 'fred',   'active': false }
	     * ];
	     *
	     * // using the `_.matches` callback shorthand
	     * _.some(users, { 'user': 'barney', 'active': false });
	     * // => false
	     *
	     * // using the `_.matchesProperty` callback shorthand
	     * _.some(users, 'active', false);
	     * // => true
	     *
	     * // using the `_.property` callback shorthand
	     * _.some(users, 'active');
	     * // => true
	     */
	    function some(collection, predicate, thisArg) {
	      var func = isArray(collection) ? arraySome : baseSome;
	      if (thisArg && isIterateeCall(collection, predicate, thisArg)) {
	        predicate = null;
	      }
	      if (typeof predicate != 'function' || typeof thisArg != 'undefined') {
	        predicate = getCallback(predicate, thisArg, 3);
	      }
	      return func(collection, predicate);
	    }

	    /**
	     * Creates an array of elements, sorted in ascending order by the results of
	     * running each element in a collection through `iteratee`. This method performs
	     * a stable sort, that is, it preserves the original sort order of equal elements.
	     * The `iteratee` is bound to `thisArg` and invoked with three arguments:
	     * (value, index|key, collection).
	     *
	     * If a property name is provided for `iteratee` the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If a value is also provided for `thisArg` the created `_.matchesProperty`
	     * style callback returns `true` for elements that have a matching property
	     * value, else `false`.
	     *
	     * If an object is provided for `iteratee` the created `_.matches` style
	     * callback returns `true` for elements that have the properties of the given
	     * object, else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Array|Function|Object|string} [iteratee=_.identity] The function
	     *  invoked per iteration. If a property name or an object is provided it is
	     *  used to create a `_.property` or `_.matches` style callback respectively.
	     * @param {*} [thisArg] The `this` binding of `iteratee`.
	     * @returns {Array} Returns the new sorted array.
	     * @example
	     *
	     * _.sortBy([1, 2, 3], function(n) {
	     *   return Math.sin(n);
	     * });
	     * // => [3, 1, 2]
	     *
	     * _.sortBy([1, 2, 3], function(n) {
	     *   return this.sin(n);
	     * }, Math);
	     * // => [3, 1, 2]
	     *
	     * var users = [
	     *   { 'user': 'fred' },
	     *   { 'user': 'pebbles' },
	     *   { 'user': 'barney' }
	     * ];
	     *
	     * // using the `_.property` callback shorthand
	     * _.pluck(_.sortBy(users, 'user'), 'user');
	     * // => ['barney', 'fred', 'pebbles']
	     */
	    function sortBy(collection, iteratee, thisArg) {
	      if (collection == null) {
	        return [];
	      }
	      var index = -1,
	          length = collection.length,
	          result = isLength(length) ? Array(length) : [];

	      if (thisArg && isIterateeCall(collection, iteratee, thisArg)) {
	        iteratee = null;
	      }
	      iteratee = getCallback(iteratee, thisArg, 3);
	      baseEach(collection, function(value, key, collection) {
	        result[++index] = { 'criteria': iteratee(value, key, collection), 'index': index, 'value': value };
	      });
	      return baseSortBy(result, compareAscending);
	    }

	    /**
	     * This method is like `_.sortBy` except that it sorts by property names
	     * instead of an iteratee function.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {...(string|string[])} props The property names to sort by,
	     *  specified as individual property names or arrays of property names.
	     * @returns {Array} Returns the new sorted array.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney', 'age': 36 },
	     *   { 'user': 'fred',   'age': 40 },
	     *   { 'user': 'barney', 'age': 26 },
	     *   { 'user': 'fred',   'age': 30 }
	     * ];
	     *
	     * _.map(_.sortByAll(users, ['user', 'age']), _.values);
	     * // => [['barney', 26], ['barney', 36], ['fred', 30], ['fred', 40]]
	     */
	    function sortByAll() {
	      var args = arguments,
	          collection = args[0],
	          guard = args[3],
	          index = 0,
	          length = args.length - 1;

	      if (collection == null) {
	        return [];
	      }
	      var props = Array(length);
	      while (index < length) {
	        props[index] = args[++index];
	      }
	      if (guard && isIterateeCall(args[1], args[2], guard)) {
	        props = args[1];
	      }
	      return baseSortByOrder(collection, baseFlatten(props), []);
	    }

	    /**
	     * This method is like `_.sortByAll` except that it allows specifying the
	     * sort orders of the property names to sort by. A truthy value in `orders`
	     * will sort the corresponding property name in ascending order while a
	     * falsey value will sort it in descending order.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {string[]} props The property names to sort by.
	     * @param {boolean[]} orders The sort orders of `props`.
	     * @param- {Object} [guard] Enables use as a callback for functions like `_.reduce`.
	     * @returns {Array} Returns the new sorted array.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney', 'age': 26 },
	     *   { 'user': 'fred',   'age': 40 },
	     *   { 'user': 'barney', 'age': 36 },
	     *   { 'user': 'fred',   'age': 30 }
	     * ];
	     *
	     * // sort by `user` in ascending order and by `age` in descending order
	     * _.map(_.sortByOrder(users, ['user', 'age'], [true, false]), _.values);
	     * // => [['barney', 36], ['barney', 26], ['fred', 40], ['fred', 30]]
	     */
	    function sortByOrder(collection, props, orders, guard) {
	      if (collection == null) {
	        return [];
	      }
	      if (guard && isIterateeCall(props, orders, guard)) {
	        orders = null;
	      }
	      if (!isArray(props)) {
	        props = props == null ? [] : [props];
	      }
	      if (!isArray(orders)) {
	        orders = orders == null ? [] : [orders];
	      }
	      return baseSortByOrder(collection, props, orders);
	    }

	    /**
	     * Performs a deep comparison between each element in `collection` and the
	     * source object, returning an array of all elements that have equivalent
	     * property values.
	     *
	     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
	     * numbers, `Object` objects, regexes, and strings. Objects are compared by
	     * their own, not inherited, enumerable properties. For comparing a single
	     * own or inherited property value see `_.matchesProperty`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to search.
	     * @param {Object} source The object of property values to match.
	     * @returns {Array} Returns the new filtered array.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney', 'age': 36, 'active': false, 'pets': ['hoppy'] },
	     *   { 'user': 'fred',   'age': 40, 'active': true, 'pets': ['baby puss', 'dino'] }
	     * ];
	     *
	     * _.pluck(_.where(users, { 'age': 36, 'active': false }), 'user');
	     * // => ['barney']
	     *
	     * _.pluck(_.where(users, { 'pets': ['dino'] }), 'user');
	     * // => ['fred']
	     */
	    function where(collection, source) {
	      return filter(collection, baseMatches(source));
	    }

	    /*------------------------------------------------------------------------*/

	    /**
	     * Gets the number of milliseconds that have elapsed since the Unix epoch
	     * (1 January 1970 00:00:00 UTC).
	     *
	     * @static
	     * @memberOf _
	     * @category Date
	     * @example
	     *
	     * _.defer(function(stamp) {
	     *   console.log(_.now() - stamp);
	     * }, _.now());
	     * // => logs the number of milliseconds it took for the deferred function to be invoked
	     */
	    var now = nativeNow || function() {
	      return new Date().getTime();
	    };

	    /*------------------------------------------------------------------------*/

	    /**
	     * The opposite of `_.before`; this method creates a function that invokes
	     * `func` once it is called `n` or more times.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {number} n The number of calls before `func` is invoked.
	     * @param {Function} func The function to restrict.
	     * @returns {Function} Returns the new restricted function.
	     * @example
	     *
	     * var saves = ['profile', 'settings'];
	     *
	     * var done = _.after(saves.length, function() {
	     *   console.log('done saving!');
	     * });
	     *
	     * _.forEach(saves, function(type) {
	     *   asyncSave({ 'type': type, 'complete': done });
	     * });
	     * // => logs 'done saving!' after the two async saves have completed
	     */
	    function after(n, func) {
	      if (typeof func != 'function') {
	        if (typeof n == 'function') {
	          var temp = n;
	          n = func;
	          func = temp;
	        } else {
	          throw new TypeError(FUNC_ERROR_TEXT);
	        }
	      }
	      n = nativeIsFinite(n = +n) ? n : 0;
	      return function() {
	        if (--n < 1) {
	          return func.apply(this, arguments);
	        }
	      };
	    }

	    /**
	     * Creates a function that accepts up to `n` arguments ignoring any
	     * additional arguments.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to cap arguments for.
	     * @param {number} [n=func.length] The arity cap.
	     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * _.map(['6', '8', '10'], _.ary(parseInt, 1));
	     * // => [6, 8, 10]
	     */
	    function ary(func, n, guard) {
	      if (guard && isIterateeCall(func, n, guard)) {
	        n = null;
	      }
	      n = (func && n == null) ? func.length : nativeMax(+n || 0, 0);
	      return createWrapper(func, ARY_FLAG, null, null, null, null, n);
	    }

	    /**
	     * Creates a function that invokes `func`, with the `this` binding and arguments
	     * of the created function, while it is called less than `n` times. Subsequent
	     * calls to the created function return the result of the last `func` invocation.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {number} n The number of calls at which `func` is no longer invoked.
	     * @param {Function} func The function to restrict.
	     * @returns {Function} Returns the new restricted function.
	     * @example
	     *
	     * jQuery('#add').on('click', _.before(5, addContactToList));
	     * // => allows adding up to 4 contacts to the list
	     */
	    function before(n, func) {
	      var result;
	      if (typeof func != 'function') {
	        if (typeof n == 'function') {
	          var temp = n;
	          n = func;
	          func = temp;
	        } else {
	          throw new TypeError(FUNC_ERROR_TEXT);
	        }
	      }
	      return function() {
	        if (--n > 0) {
	          result = func.apply(this, arguments);
	        } else {
	          func = null;
	        }
	        return result;
	      };
	    }

	    /**
	     * Creates a function that invokes `func` with the `this` binding of `thisArg`
	     * and prepends any additional `_.bind` arguments to those provided to the
	     * bound function.
	     *
	     * The `_.bind.placeholder` value, which defaults to `_` in monolithic builds,
	     * may be used as a placeholder for partially applied arguments.
	     *
	     * **Note:** Unlike native `Function#bind` this method does not set the `length`
	     * property of bound functions.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to bind.
	     * @param {*} thisArg The `this` binding of `func`.
	     * @param {...*} [partials] The arguments to be partially applied.
	     * @returns {Function} Returns the new bound function.
	     * @example
	     *
	     * var greet = function(greeting, punctuation) {
	     *   return greeting + ' ' + this.user + punctuation;
	     * };
	     *
	     * var object = { 'user': 'fred' };
	     *
	     * var bound = _.bind(greet, object, 'hi');
	     * bound('!');
	     * // => 'hi fred!'
	     *
	     * // using placeholders
	     * var bound = _.bind(greet, object, _, '!');
	     * bound('hi');
	     * // => 'hi fred!'
	     */
	    var bind = restParam(function(func, thisArg, partials) {
	      var bitmask = BIND_FLAG;
	      if (partials.length) {
	        var holders = replaceHolders(partials, bind.placeholder);
	        bitmask |= PARTIAL_FLAG;
	      }
	      return createWrapper(func, bitmask, thisArg, partials, holders);
	    });

	    /**
	     * Binds methods of an object to the object itself, overwriting the existing
	     * method. Method names may be specified as individual arguments or as arrays
	     * of method names. If no method names are provided all enumerable function
	     * properties, own and inherited, of `object` are bound.
	     *
	     * **Note:** This method does not set the `length` property of bound functions.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Object} object The object to bind and assign the bound methods to.
	     * @param {...(string|string[])} [methodNames] The object method names to bind,
	     *  specified as individual method names or arrays of method names.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * var view = {
	     *   'label': 'docs',
	     *   'onClick': function() {
	     *     console.log('clicked ' + this.label);
	     *   }
	     * };
	     *
	     * _.bindAll(view);
	     * jQuery('#docs').on('click', view.onClick);
	     * // => logs 'clicked docs' when the element is clicked
	     */
	    var bindAll = restParam(function(object, methodNames) {
	      methodNames = methodNames.length ? baseFlatten(methodNames) : functions(object);

	      var index = -1,
	          length = methodNames.length;

	      while (++index < length) {
	        var key = methodNames[index];
	        object[key] = createWrapper(object[key], BIND_FLAG, object);
	      }
	      return object;
	    });

	    /**
	     * Creates a function that invokes the method at `object[key]` and prepends
	     * any additional `_.bindKey` arguments to those provided to the bound function.
	     *
	     * This method differs from `_.bind` by allowing bound functions to reference
	     * methods that may be redefined or don't yet exist.
	     * See [Peter Michaux's article](http://michaux.ca/articles/lazy-function-definition-pattern)
	     * for more details.
	     *
	     * The `_.bindKey.placeholder` value, which defaults to `_` in monolithic
	     * builds, may be used as a placeholder for partially applied arguments.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Object} object The object the method belongs to.
	     * @param {string} key The key of the method.
	     * @param {...*} [partials] The arguments to be partially applied.
	     * @returns {Function} Returns the new bound function.
	     * @example
	     *
	     * var object = {
	     *   'user': 'fred',
	     *   'greet': function(greeting, punctuation) {
	     *     return greeting + ' ' + this.user + punctuation;
	     *   }
	     * };
	     *
	     * var bound = _.bindKey(object, 'greet', 'hi');
	     * bound('!');
	     * // => 'hi fred!'
	     *
	     * object.greet = function(greeting, punctuation) {
	     *   return greeting + 'ya ' + this.user + punctuation;
	     * };
	     *
	     * bound('!');
	     * // => 'hiya fred!'
	     *
	     * // using placeholders
	     * var bound = _.bindKey(object, 'greet', _, '!');
	     * bound('hi');
	     * // => 'hiya fred!'
	     */
	    var bindKey = restParam(function(object, key, partials) {
	      var bitmask = BIND_FLAG | BIND_KEY_FLAG;
	      if (partials.length) {
	        var holders = replaceHolders(partials, bindKey.placeholder);
	        bitmask |= PARTIAL_FLAG;
	      }
	      return createWrapper(key, bitmask, object, partials, holders);
	    });

	    /**
	     * Creates a function that accepts one or more arguments of `func` that when
	     * called either invokes `func` returning its result, if all `func` arguments
	     * have been provided, or returns a function that accepts one or more of the
	     * remaining `func` arguments, and so on. The arity of `func` may be specified
	     * if `func.length` is not sufficient.
	     *
	     * The `_.curry.placeholder` value, which defaults to `_` in monolithic builds,
	     * may be used as a placeholder for provided arguments.
	     *
	     * **Note:** This method does not set the `length` property of curried functions.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to curry.
	     * @param {number} [arity=func.length] The arity of `func`.
	     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
	     * @returns {Function} Returns the new curried function.
	     * @example
	     *
	     * var abc = function(a, b, c) {
	     *   return [a, b, c];
	     * };
	     *
	     * var curried = _.curry(abc);
	     *
	     * curried(1)(2)(3);
	     * // => [1, 2, 3]
	     *
	     * curried(1, 2)(3);
	     * // => [1, 2, 3]
	     *
	     * curried(1, 2, 3);
	     * // => [1, 2, 3]
	     *
	     * // using placeholders
	     * curried(1)(_, 3)(2);
	     * // => [1, 2, 3]
	     */
	    var curry = createCurry(CURRY_FLAG);

	    /**
	     * This method is like `_.curry` except that arguments are applied to `func`
	     * in the manner of `_.partialRight` instead of `_.partial`.
	     *
	     * The `_.curryRight.placeholder` value, which defaults to `_` in monolithic
	     * builds, may be used as a placeholder for provided arguments.
	     *
	     * **Note:** This method does not set the `length` property of curried functions.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to curry.
	     * @param {number} [arity=func.length] The arity of `func`.
	     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
	     * @returns {Function} Returns the new curried function.
	     * @example
	     *
	     * var abc = function(a, b, c) {
	     *   return [a, b, c];
	     * };
	     *
	     * var curried = _.curryRight(abc);
	     *
	     * curried(3)(2)(1);
	     * // => [1, 2, 3]
	     *
	     * curried(2, 3)(1);
	     * // => [1, 2, 3]
	     *
	     * curried(1, 2, 3);
	     * // => [1, 2, 3]
	     *
	     * // using placeholders
	     * curried(3)(1, _)(2);
	     * // => [1, 2, 3]
	     */
	    var curryRight = createCurry(CURRY_RIGHT_FLAG);

	    /**
	     * Creates a function that delays invoking `func` until after `wait` milliseconds
	     * have elapsed since the last time it was invoked. The created function comes
	     * with a `cancel` method to cancel delayed invocations. Provide an options
	     * object to indicate that `func` should be invoked on the leading and/or
	     * trailing edge of the `wait` timeout. Subsequent calls to the debounced
	     * function return the result of the last `func` invocation.
	     *
	     * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
	     * on the trailing edge of the timeout only if the the debounced function is
	     * invoked more than once during the `wait` timeout.
	     *
	     * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
	     * for details over the differences between `_.debounce` and `_.throttle`.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to debounce.
	     * @param {number} [wait=0] The number of milliseconds to delay.
	     * @param {Object} [options] The options object.
	     * @param {boolean} [options.leading=false] Specify invoking on the leading
	     *  edge of the timeout.
	     * @param {number} [options.maxWait] The maximum time `func` is allowed to be
	     *  delayed before it is invoked.
	     * @param {boolean} [options.trailing=true] Specify invoking on the trailing
	     *  edge of the timeout.
	     * @returns {Function} Returns the new debounced function.
	     * @example
	     *
	     * // avoid costly calculations while the window size is in flux
	     * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
	     *
	     * // invoke `sendMail` when the click event is fired, debouncing subsequent calls
	     * jQuery('#postbox').on('click', _.debounce(sendMail, 300, {
	     *   'leading': true,
	     *   'trailing': false
	     * }));
	     *
	     * // ensure `batchLog` is invoked once after 1 second of debounced calls
	     * var source = new EventSource('/stream');
	     * jQuery(source).on('message', _.debounce(batchLog, 250, {
	     *   'maxWait': 1000
	     * }));
	     *
	     * // cancel a debounced call
	     * var todoChanges = _.debounce(batchLog, 1000);
	     * Object.observe(models.todo, todoChanges);
	     *
	     * Object.observe(models, function(changes) {
	     *   if (_.find(changes, { 'user': 'todo', 'type': 'delete'})) {
	     *     todoChanges.cancel();
	     *   }
	     * }, ['delete']);
	     *
	     * // ...at some point `models.todo` is changed
	     * models.todo.completed = true;
	     *
	     * // ...before 1 second has passed `models.todo` is deleted
	     * // which cancels the debounced `todoChanges` call
	     * delete models.todo;
	     */
	    function debounce(func, wait, options) {
	      var args,
	          maxTimeoutId,
	          result,
	          stamp,
	          thisArg,
	          timeoutId,
	          trailingCall,
	          lastCalled = 0,
	          maxWait = false,
	          trailing = true;

	      if (typeof func != 'function') {
	        throw new TypeError(FUNC_ERROR_TEXT);
	      }
	      wait = wait < 0 ? 0 : (+wait || 0);
	      if (options === true) {
	        var leading = true;
	        trailing = false;
	      } else if (isObject(options)) {
	        leading = options.leading;
	        maxWait = 'maxWait' in options && nativeMax(+options.maxWait || 0, wait);
	        trailing = 'trailing' in options ? options.trailing : trailing;
	      }

	      function cancel() {
	        if (timeoutId) {
	          clearTimeout(timeoutId);
	        }
	        if (maxTimeoutId) {
	          clearTimeout(maxTimeoutId);
	        }
	        maxTimeoutId = timeoutId = trailingCall = undefined;
	      }

	      function delayed() {
	        var remaining = wait - (now() - stamp);
	        if (remaining <= 0 || remaining > wait) {
	          if (maxTimeoutId) {
	            clearTimeout(maxTimeoutId);
	          }
	          var isCalled = trailingCall;
	          maxTimeoutId = timeoutId = trailingCall = undefined;
	          if (isCalled) {
	            lastCalled = now();
	            result = func.apply(thisArg, args);
	            if (!timeoutId && !maxTimeoutId) {
	              args = thisArg = null;
	            }
	          }
	        } else {
	          timeoutId = setTimeout(delayed, remaining);
	        }
	      }

	      function maxDelayed() {
	        if (timeoutId) {
	          clearTimeout(timeoutId);
	        }
	        maxTimeoutId = timeoutId = trailingCall = undefined;
	        if (trailing || (maxWait !== wait)) {
	          lastCalled = now();
	          result = func.apply(thisArg, args);
	          if (!timeoutId && !maxTimeoutId) {
	            args = thisArg = null;
	          }
	        }
	      }

	      function debounced() {
	        args = arguments;
	        stamp = now();
	        thisArg = this;
	        trailingCall = trailing && (timeoutId || !leading);

	        if (maxWait === false) {
	          var leadingCall = leading && !timeoutId;
	        } else {
	          if (!maxTimeoutId && !leading) {
	            lastCalled = stamp;
	          }
	          var remaining = maxWait - (stamp - lastCalled),
	              isCalled = remaining <= 0 || remaining > maxWait;

	          if (isCalled) {
	            if (maxTimeoutId) {
	              maxTimeoutId = clearTimeout(maxTimeoutId);
	            }
	            lastCalled = stamp;
	            result = func.apply(thisArg, args);
	          }
	          else if (!maxTimeoutId) {
	            maxTimeoutId = setTimeout(maxDelayed, remaining);
	          }
	        }
	        if (isCalled && timeoutId) {
	          timeoutId = clearTimeout(timeoutId);
	        }
	        else if (!timeoutId && wait !== maxWait) {
	          timeoutId = setTimeout(delayed, wait);
	        }
	        if (leadingCall) {
	          isCalled = true;
	          result = func.apply(thisArg, args);
	        }
	        if (isCalled && !timeoutId && !maxTimeoutId) {
	          args = thisArg = null;
	        }
	        return result;
	      }
	      debounced.cancel = cancel;
	      return debounced;
	    }

	    /**
	     * Defers invoking the `func` until the current call stack has cleared. Any
	     * additional arguments are provided to `func` when it is invoked.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to defer.
	     * @param {...*} [args] The arguments to invoke the function with.
	     * @returns {number} Returns the timer id.
	     * @example
	     *
	     * _.defer(function(text) {
	     *   console.log(text);
	     * }, 'deferred');
	     * // logs 'deferred' after one or more milliseconds
	     */
	    var defer = restParam(function(func, args) {
	      return baseDelay(func, 1, args);
	    });

	    /**
	     * Invokes `func` after `wait` milliseconds. Any additional arguments are
	     * provided to `func` when it is invoked.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to delay.
	     * @param {number} wait The number of milliseconds to delay invocation.
	     * @param {...*} [args] The arguments to invoke the function with.
	     * @returns {number} Returns the timer id.
	     * @example
	     *
	     * _.delay(function(text) {
	     *   console.log(text);
	     * }, 1000, 'later');
	     * // => logs 'later' after one second
	     */
	    var delay = restParam(function(func, wait, args) {
	      return baseDelay(func, wait, args);
	    });

	    /**
	     * Creates a function that returns the result of invoking the provided
	     * functions with the `this` binding of the created function, where each
	     * successive invocation is supplied the return value of the previous.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {...Function} [funcs] Functions to invoke.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * function square(n) {
	     *   return n * n;
	     * }
	     *
	     * var addSquare = _.flow(_.add, square);
	     * addSquare(1, 2);
	     * // => 9
	     */
	    var flow = createFlow();

	    /**
	     * This method is like `_.flow` except that it creates a function that
	     * invokes the provided functions from right to left.
	     *
	     * @static
	     * @memberOf _
	     * @alias backflow, compose
	     * @category Function
	     * @param {...Function} [funcs] Functions to invoke.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * function square(n) {
	     *   return n * n;
	     * }
	     *
	     * var addSquare = _.flowRight(square, _.add);
	     * addSquare(1, 2);
	     * // => 9
	     */
	    var flowRight = createFlow(true);

	    /**
	     * Creates a function that memoizes the result of `func`. If `resolver` is
	     * provided it determines the cache key for storing the result based on the
	     * arguments provided to the memoized function. By default, the first argument
	     * provided to the memoized function is coerced to a string and used as the
	     * cache key. The `func` is invoked with the `this` binding of the memoized
	     * function.
	     *
	     * **Note:** The cache is exposed as the `cache` property on the memoized
	     * function. Its creation may be customized by replacing the `_.memoize.Cache`
	     * constructor with one whose instances implement the [`Map`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-properties-of-the-map-prototype-object)
	     * method interface of `get`, `has`, and `set`.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to have its output memoized.
	     * @param {Function} [resolver] The function to resolve the cache key.
	     * @returns {Function} Returns the new memoizing function.
	     * @example
	     *
	     * var upperCase = _.memoize(function(string) {
	     *   return string.toUpperCase();
	     * });
	     *
	     * upperCase('fred');
	     * // => 'FRED'
	     *
	     * // modifying the result cache
	     * upperCase.cache.set('fred', 'BARNEY');
	     * upperCase('fred');
	     * // => 'BARNEY'
	     *
	     * // replacing `_.memoize.Cache`
	     * var object = { 'user': 'fred' };
	     * var other = { 'user': 'barney' };
	     * var identity = _.memoize(_.identity);
	     *
	     * identity(object);
	     * // => { 'user': 'fred' }
	     * identity(other);
	     * // => { 'user': 'fred' }
	     *
	     * _.memoize.Cache = WeakMap;
	     * var identity = _.memoize(_.identity);
	     *
	     * identity(object);
	     * // => { 'user': 'fred' }
	     * identity(other);
	     * // => { 'user': 'barney' }
	     */
	    function memoize(func, resolver) {
	      if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
	        throw new TypeError(FUNC_ERROR_TEXT);
	      }
	      var memoized = function() {
	        var args = arguments,
	            cache = memoized.cache,
	            key = resolver ? resolver.apply(this, args) : args[0];

	        if (cache.has(key)) {
	          return cache.get(key);
	        }
	        var result = func.apply(this, args);
	        cache.set(key, result);
	        return result;
	      };
	      memoized.cache = new memoize.Cache;
	      return memoized;
	    }

	    /**
	     * Creates a function that negates the result of the predicate `func`. The
	     * `func` predicate is invoked with the `this` binding and arguments of the
	     * created function.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} predicate The predicate to negate.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * function isEven(n) {
	     *   return n % 2 == 0;
	     * }
	     *
	     * _.filter([1, 2, 3, 4, 5, 6], _.negate(isEven));
	     * // => [1, 3, 5]
	     */
	    function negate(predicate) {
	      if (typeof predicate != 'function') {
	        throw new TypeError(FUNC_ERROR_TEXT);
	      }
	      return function() {
	        return !predicate.apply(this, arguments);
	      };
	    }

	    /**
	     * Creates a function that is restricted to invoking `func` once. Repeat calls
	     * to the function return the value of the first call. The `func` is invoked
	     * with the `this` binding and arguments of the created function.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to restrict.
	     * @returns {Function} Returns the new restricted function.
	     * @example
	     *
	     * var initialize = _.once(createApplication);
	     * initialize();
	     * initialize();
	     * // `initialize` invokes `createApplication` once
	     */
	    function once(func) {
	      return before(func, 2);
	    }

	    /**
	     * Creates a function that invokes `func` with `partial` arguments prepended
	     * to those provided to the new function. This method is like `_.bind` except
	     * it does **not** alter the `this` binding.
	     *
	     * The `_.partial.placeholder` value, which defaults to `_` in monolithic
	     * builds, may be used as a placeholder for partially applied arguments.
	     *
	     * **Note:** This method does not set the `length` property of partially
	     * applied functions.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to partially apply arguments to.
	     * @param {...*} [partials] The arguments to be partially applied.
	     * @returns {Function} Returns the new partially applied function.
	     * @example
	     *
	     * var greet = function(greeting, name) {
	     *   return greeting + ' ' + name;
	     * };
	     *
	     * var sayHelloTo = _.partial(greet, 'hello');
	     * sayHelloTo('fred');
	     * // => 'hello fred'
	     *
	     * // using placeholders
	     * var greetFred = _.partial(greet, _, 'fred');
	     * greetFred('hi');
	     * // => 'hi fred'
	     */
	    var partial = createPartial(PARTIAL_FLAG);

	    /**
	     * This method is like `_.partial` except that partially applied arguments
	     * are appended to those provided to the new function.
	     *
	     * The `_.partialRight.placeholder` value, which defaults to `_` in monolithic
	     * builds, may be used as a placeholder for partially applied arguments.
	     *
	     * **Note:** This method does not set the `length` property of partially
	     * applied functions.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to partially apply arguments to.
	     * @param {...*} [partials] The arguments to be partially applied.
	     * @returns {Function} Returns the new partially applied function.
	     * @example
	     *
	     * var greet = function(greeting, name) {
	     *   return greeting + ' ' + name;
	     * };
	     *
	     * var greetFred = _.partialRight(greet, 'fred');
	     * greetFred('hi');
	     * // => 'hi fred'
	     *
	     * // using placeholders
	     * var sayHelloTo = _.partialRight(greet, 'hello', _);
	     * sayHelloTo('fred');
	     * // => 'hello fred'
	     */
	    var partialRight = createPartial(PARTIAL_RIGHT_FLAG);

	    /**
	     * Creates a function that invokes `func` with arguments arranged according
	     * to the specified indexes where the argument value at the first index is
	     * provided as the first argument, the argument value at the second index is
	     * provided as the second argument, and so on.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to rearrange arguments for.
	     * @param {...(number|number[])} indexes The arranged argument indexes,
	     *  specified as individual indexes or arrays of indexes.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var rearged = _.rearg(function(a, b, c) {
	     *   return [a, b, c];
	     * }, 2, 0, 1);
	     *
	     * rearged('b', 'c', 'a')
	     * // => ['a', 'b', 'c']
	     *
	     * var map = _.rearg(_.map, [1, 0]);
	     * map(function(n) {
	     *   return n * 3;
	     * }, [1, 2, 3]);
	     * // => [3, 6, 9]
	     */
	    var rearg = restParam(function(func, indexes) {
	      return createWrapper(func, REARG_FLAG, null, null, null, baseFlatten(indexes));
	    });

	    /**
	     * Creates a function that invokes `func` with the `this` binding of the
	     * created function and arguments from `start` and beyond provided as an array.
	     *
	     * **Note:** This method is based on the [rest parameter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters).
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to apply a rest parameter to.
	     * @param {number} [start=func.length-1] The start position of the rest parameter.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var say = _.restParam(function(what, names) {
	     *   return what + ' ' + _.initial(names).join(', ') +
	     *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
	     * });
	     *
	     * say('hello', 'fred', 'barney', 'pebbles');
	     * // => 'hello fred, barney, & pebbles'
	     */
	    function restParam(func, start) {
	      if (typeof func != 'function') {
	        throw new TypeError(FUNC_ERROR_TEXT);
	      }
	      start = nativeMax(typeof start == 'undefined' ? (func.length - 1) : (+start || 0), 0);
	      return function() {
	        var args = arguments,
	            index = -1,
	            length = nativeMax(args.length - start, 0),
	            rest = Array(length);

	        while (++index < length) {
	          rest[index] = args[start + index];
	        }
	        switch (start) {
	          case 0: return func.call(this, rest);
	          case 1: return func.call(this, args[0], rest);
	          case 2: return func.call(this, args[0], args[1], rest);
	        }
	        var otherArgs = Array(start + 1);
	        index = -1;
	        while (++index < start) {
	          otherArgs[index] = args[index];
	        }
	        otherArgs[start] = rest;
	        return func.apply(this, otherArgs);
	      };
	    }

	    /**
	     * Creates a function that invokes `func` with the `this` binding of the created
	     * function and an array of arguments much like [`Function#apply`](https://es5.github.io/#x15.3.4.3).
	     *
	     * **Note:** This method is based on the [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator).
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to spread arguments over.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var say = _.spread(function(who, what) {
	     *   return who + ' says ' + what;
	     * });
	     *
	     * say(['fred', 'hello']);
	     * // => 'fred says hello'
	     *
	     * // with a Promise
	     * var numbers = Promise.all([
	     *   Promise.resolve(40),
	     *   Promise.resolve(36)
	     * ]);
	     *
	     * numbers.then(_.spread(function(x, y) {
	     *   return x + y;
	     * }));
	     * // => a Promise of 76
	     */
	    function spread(func) {
	      if (typeof func != 'function') {
	        throw new TypeError(FUNC_ERROR_TEXT);
	      }
	      return function(array) {
	        return func.apply(this, array);
	      };
	    }

	    /**
	     * Creates a function that only invokes `func` at most once per every `wait`
	     * milliseconds. The created function comes with a `cancel` method to cancel
	     * delayed invocations. Provide an options object to indicate that `func`
	     * should be invoked on the leading and/or trailing edge of the `wait` timeout.
	     * Subsequent calls to the throttled function return the result of the last
	     * `func` call.
	     *
	     * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
	     * on the trailing edge of the timeout only if the the throttled function is
	     * invoked more than once during the `wait` timeout.
	     *
	     * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
	     * for details over the differences between `_.throttle` and `_.debounce`.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to throttle.
	     * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
	     * @param {Object} [options] The options object.
	     * @param {boolean} [options.leading=true] Specify invoking on the leading
	     *  edge of the timeout.
	     * @param {boolean} [options.trailing=true] Specify invoking on the trailing
	     *  edge of the timeout.
	     * @returns {Function} Returns the new throttled function.
	     * @example
	     *
	     * // avoid excessively updating the position while scrolling
	     * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
	     *
	     * // invoke `renewToken` when the click event is fired, but not more than once every 5 minutes
	     * jQuery('.interactive').on('click', _.throttle(renewToken, 300000, {
	     *   'trailing': false
	     * }));
	     *
	     * // cancel a trailing throttled call
	     * jQuery(window).on('popstate', throttled.cancel);
	     */
	    function throttle(func, wait, options) {
	      var leading = true,
	          trailing = true;

	      if (typeof func != 'function') {
	        throw new TypeError(FUNC_ERROR_TEXT);
	      }
	      if (options === false) {
	        leading = false;
	      } else if (isObject(options)) {
	        leading = 'leading' in options ? !!options.leading : leading;
	        trailing = 'trailing' in options ? !!options.trailing : trailing;
	      }
	      debounceOptions.leading = leading;
	      debounceOptions.maxWait = +wait;
	      debounceOptions.trailing = trailing;
	      return debounce(func, wait, debounceOptions);
	    }

	    /**
	     * Creates a function that provides `value` to the wrapper function as its
	     * first argument. Any additional arguments provided to the function are
	     * appended to those provided to the wrapper function. The wrapper is invoked
	     * with the `this` binding of the created function.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {*} value The value to wrap.
	     * @param {Function} wrapper The wrapper function.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var p = _.wrap(_.escape, function(func, text) {
	     *   return '<p>' + func(text) + '</p>';
	     * });
	     *
	     * p('fred, barney, & pebbles');
	     * // => '<p>fred, barney, &amp; pebbles</p>'
	     */
	    function wrap(value, wrapper) {
	      wrapper = wrapper == null ? identity : wrapper;
	      return createWrapper(wrapper, PARTIAL_FLAG, null, [value], []);
	    }

	    /*------------------------------------------------------------------------*/

	    /**
	     * Creates a clone of `value`. If `isDeep` is `true` nested objects are cloned,
	     * otherwise they are assigned by reference. If `customizer` is provided it is
	     * invoked to produce the cloned values. If `customizer` returns `undefined`
	     * cloning is handled by the method instead. The `customizer` is bound to
	     * `thisArg` and invoked with two argument; (value [, index|key, object]).
	     *
	     * **Note:** This method is loosely based on the
	     * [structured clone algorithm](http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm).
	     * The enumerable properties of `arguments` objects and objects created by
	     * constructors other than `Object` are cloned to plain `Object` objects. An
	     * empty object is returned for uncloneable values such as functions, DOM nodes,
	     * Maps, Sets, and WeakMaps.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to clone.
	     * @param {boolean} [isDeep] Specify a deep clone.
	     * @param {Function} [customizer] The function to customize cloning values.
	     * @param {*} [thisArg] The `this` binding of `customizer`.
	     * @returns {*} Returns the cloned value.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney' },
	     *   { 'user': 'fred' }
	     * ];
	     *
	     * var shallow = _.clone(users);
	     * shallow[0] === users[0];
	     * // => true
	     *
	     * var deep = _.clone(users, true);
	     * deep[0] === users[0];
	     * // => false
	     *
	     * // using a customizer callback
	     * var el = _.clone(document.body, function(value) {
	     *   if (_.isElement(value)) {
	     *     return value.cloneNode(false);
	     *   }
	     * });
	     *
	     * el === document.body
	     * // => false
	     * el.nodeName
	     * // => BODY
	     * el.childNodes.length;
	     * // => 0
	     */
	    function clone(value, isDeep, customizer, thisArg) {
	      if (isDeep && typeof isDeep != 'boolean' && isIterateeCall(value, isDeep, customizer)) {
	        isDeep = false;
	      }
	      else if (typeof isDeep == 'function') {
	        thisArg = customizer;
	        customizer = isDeep;
	        isDeep = false;
	      }
	      customizer = typeof customizer == 'function' && bindCallback(customizer, thisArg, 1);
	      return baseClone(value, isDeep, customizer);
	    }

	    /**
	     * Creates a deep clone of `value`. If `customizer` is provided it is invoked
	     * to produce the cloned values. If `customizer` returns `undefined` cloning
	     * is handled by the method instead. The `customizer` is bound to `thisArg`
	     * and invoked with two argument; (value [, index|key, object]).
	     *
	     * **Note:** This method is loosely based on the
	     * [structured clone algorithm](http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm).
	     * The enumerable properties of `arguments` objects and objects created by
	     * constructors other than `Object` are cloned to plain `Object` objects. An
	     * empty object is returned for uncloneable values such as functions, DOM nodes,
	     * Maps, Sets, and WeakMaps.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to deep clone.
	     * @param {Function} [customizer] The function to customize cloning values.
	     * @param {*} [thisArg] The `this` binding of `customizer`.
	     * @returns {*} Returns the deep cloned value.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney' },
	     *   { 'user': 'fred' }
	     * ];
	     *
	     * var deep = _.cloneDeep(users);
	     * deep[0] === users[0];
	     * // => false
	     *
	     * // using a customizer callback
	     * var el = _.cloneDeep(document.body, function(value) {
	     *   if (_.isElement(value)) {
	     *     return value.cloneNode(true);
	     *   }
	     * });
	     *
	     * el === document.body
	     * // => false
	     * el.nodeName
	     * // => BODY
	     * el.childNodes.length;
	     * // => 20
	     */
	    function cloneDeep(value, customizer, thisArg) {
	      customizer = typeof customizer == 'function' && bindCallback(customizer, thisArg, 1);
	      return baseClone(value, true, customizer);
	    }

	    /**
	     * Checks if `value` is classified as an `arguments` object.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	     * @example
	     *
	     * _.isArguments(function() { return arguments; }());
	     * // => true
	     *
	     * _.isArguments([1, 2, 3]);
	     * // => false
	     */
	    function isArguments(value) {
	      var length = isObjectLike(value) ? value.length : undefined;
	      return isLength(length) && objToString.call(value) == argsTag;
	    }

	    /**
	     * Checks if `value` is classified as an `Array` object.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	     * @example
	     *
	     * _.isArray([1, 2, 3]);
	     * // => true
	     *
	     * _.isArray(function() { return arguments; }());
	     * // => false
	     */
	    var isArray = nativeIsArray || function(value) {
	      return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
	    };

	    /**
	     * Checks if `value` is classified as a boolean primitive or object.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	     * @example
	     *
	     * _.isBoolean(false);
	     * // => true
	     *
	     * _.isBoolean(null);
	     * // => false
	     */
	    function isBoolean(value) {
	      return value === true || value === false || (isObjectLike(value) && objToString.call(value) == boolTag);
	    }

	    /**
	     * Checks if `value` is classified as a `Date` object.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	     * @example
	     *
	     * _.isDate(new Date);
	     * // => true
	     *
	     * _.isDate('Mon April 23 2012');
	     * // => false
	     */
	    function isDate(value) {
	      return isObjectLike(value) && objToString.call(value) == dateTag;
	    }

	    /**
	     * Checks if `value` is a DOM element.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is a DOM element, else `false`.
	     * @example
	     *
	     * _.isElement(document.body);
	     * // => true
	     *
	     * _.isElement('<body>');
	     * // => false
	     */
	    function isElement(value) {
	      return !!value && value.nodeType === 1 && isObjectLike(value) &&
	        (objToString.call(value).indexOf('Element') > -1);
	    }
	    // Fallback for environments without DOM support.
	    if (!support.dom) {
	      isElement = function(value) {
	        return !!value && value.nodeType === 1 && isObjectLike(value) && !isPlainObject(value);
	      };
	    }

	    /**
	     * Checks if `value` is empty. A value is considered empty unless it is an
	     * `arguments` object, array, string, or jQuery-like collection with a length
	     * greater than `0` or an object with own enumerable properties.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {Array|Object|string} value The value to inspect.
	     * @returns {boolean} Returns `true` if `value` is empty, else `false`.
	     * @example
	     *
	     * _.isEmpty(null);
	     * // => true
	     *
	     * _.isEmpty(true);
	     * // => true
	     *
	     * _.isEmpty(1);
	     * // => true
	     *
	     * _.isEmpty([1, 2, 3]);
	     * // => false
	     *
	     * _.isEmpty({ 'a': 1 });
	     * // => false
	     */
	    function isEmpty(value) {
	      if (value == null) {
	        return true;
	      }
	      var length = value.length;
	      if (isLength(length) && (isArray(value) || isString(value) || isArguments(value) ||
	          (isObjectLike(value) && isFunction(value.splice)))) {
	        return !length;
	      }
	      return !keys(value).length;
	    }

	    /**
	     * Performs a deep comparison between two values to determine if they are
	     * equivalent. If `customizer` is provided it is invoked to compare values.
	     * If `customizer` returns `undefined` comparisons are handled by the method
	     * instead. The `customizer` is bound to `thisArg` and invoked with three
	     * arguments: (value, other [, index|key]).
	     *
	     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
	     * numbers, `Object` objects, regexes, and strings. Objects are compared by
	     * their own, not inherited, enumerable properties. Functions and DOM nodes
	     * are **not** supported. Provide a customizer function to extend support
	     * for comparing other values.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to compare.
	     * @param {*} other The other value to compare.
	     * @param {Function} [customizer] The function to customize comparing values.
	     * @param {*} [thisArg] The `this` binding of `customizer`.
	     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	     * @example
	     *
	     * var object = { 'user': 'fred' };
	     * var other = { 'user': 'fred' };
	     *
	     * object == other;
	     * // => false
	     *
	     * _.isEqual(object, other);
	     * // => true
	     *
	     * // using a customizer callback
	     * var array = ['hello', 'goodbye'];
	     * var other = ['hi', 'goodbye'];
	     *
	     * _.isEqual(array, other, function(value, other) {
	     *   if (_.every([value, other], RegExp.prototype.test, /^h(?:i|ello)$/)) {
	     *     return true;
	     *   }
	     * });
	     * // => true
	     */
	    function isEqual(value, other, customizer, thisArg) {
	      customizer = typeof customizer == 'function' && bindCallback(customizer, thisArg, 3);
	      if (!customizer && isStrictComparable(value) && isStrictComparable(other)) {
	        return value === other;
	      }
	      var result = customizer ? customizer(value, other) : undefined;
	      return typeof result == 'undefined' ? baseIsEqual(value, other, customizer) : !!result;
	    }

	    /**
	     * Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
	     * `SyntaxError`, `TypeError`, or `URIError` object.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is an error object, else `false`.
	     * @example
	     *
	     * _.isError(new Error);
	     * // => true
	     *
	     * _.isError(Error);
	     * // => false
	     */
	    function isError(value) {
	      return isObjectLike(value) && typeof value.message == 'string' && objToString.call(value) == errorTag;
	    }

	    /**
	     * Checks if `value` is a finite primitive number.
	     *
	     * **Note:** This method is based on [`Number.isFinite`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.isfinite).
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is a finite number, else `false`.
	     * @example
	     *
	     * _.isFinite(10);
	     * // => true
	     *
	     * _.isFinite('10');
	     * // => false
	     *
	     * _.isFinite(true);
	     * // => false
	     *
	     * _.isFinite(Object(10));
	     * // => false
	     *
	     * _.isFinite(Infinity);
	     * // => false
	     */
	    var isFinite = nativeNumIsFinite || function(value) {
	      return typeof value == 'number' && nativeIsFinite(value);
	    };

	    /**
	     * Checks if `value` is classified as a `Function` object.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	     * @example
	     *
	     * _.isFunction(_);
	     * // => true
	     *
	     * _.isFunction(/abc/);
	     * // => false
	     */
	    var isFunction = !(baseIsFunction(/x/) || (Uint8Array && !baseIsFunction(Uint8Array))) ? baseIsFunction : function(value) {
	      // The use of `Object#toString` avoids issues with the `typeof` operator
	      // in older versions of Chrome and Safari which return 'function' for regexes
	      // and Safari 8 equivalents which return 'object' for typed array constructors.
	      return objToString.call(value) == funcTag;
	    };

	    /**
	     * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	     * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	     * @example
	     *
	     * _.isObject({});
	     * // => true
	     *
	     * _.isObject([1, 2, 3]);
	     * // => true
	     *
	     * _.isObject(1);
	     * // => false
	     */
	    function isObject(value) {
	      // Avoid a V8 JIT bug in Chrome 19-20.
	      // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	      var type = typeof value;
	      return type == 'function' || (!!value && type == 'object');
	    }

	    /**
	     * Performs a deep comparison between `object` and `source` to determine if
	     * `object` contains equivalent property values. If `customizer` is provided
	     * it is invoked to compare values. If `customizer` returns `undefined`
	     * comparisons are handled by the method instead. The `customizer` is bound
	     * to `thisArg` and invoked with three arguments: (value, other, index|key).
	     *
	     * **Note:** This method supports comparing properties of arrays, booleans,
	     * `Date` objects, numbers, `Object` objects, regexes, and strings. Functions
	     * and DOM nodes are **not** supported. Provide a customizer function to extend
	     * support for comparing other values.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {Object} object The object to inspect.
	     * @param {Object} source The object of property values to match.
	     * @param {Function} [customizer] The function to customize comparing values.
	     * @param {*} [thisArg] The `this` binding of `customizer`.
	     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
	     * @example
	     *
	     * var object = { 'user': 'fred', 'age': 40 };
	     *
	     * _.isMatch(object, { 'age': 40 });
	     * // => true
	     *
	     * _.isMatch(object, { 'age': 36 });
	     * // => false
	     *
	     * // using a customizer callback
	     * var object = { 'greeting': 'hello' };
	     * var source = { 'greeting': 'hi' };
	     *
	     * _.isMatch(object, source, function(value, other) {
	     *   return _.every([value, other], RegExp.prototype.test, /^h(?:i|ello)$/) || undefined;
	     * });
	     * // => true
	     */
	    function isMatch(object, source, customizer, thisArg) {
	      var props = keys(source),
	          length = props.length;

	      if (!length) {
	        return true;
	      }
	      if (object == null) {
	        return false;
	      }
	      customizer = typeof customizer == 'function' && bindCallback(customizer, thisArg, 3);
	      if (!customizer && length == 1) {
	        var key = props[0],
	            value = source[key];

	        if (isStrictComparable(value)) {
	          return value === object[key] && (typeof value != 'undefined' || (key in toObject(object)));
	        }
	      }
	      var values = Array(length),
	          strictCompareFlags = Array(length);

	      while (length--) {
	        value = values[length] = source[props[length]];
	        strictCompareFlags[length] = isStrictComparable(value);
	      }
	      return baseIsMatch(toObject(object), props, values, strictCompareFlags, customizer);
	    }

	    /**
	     * Checks if `value` is `NaN`.
	     *
	     * **Note:** This method is not the same as [`isNaN`](https://es5.github.io/#x15.1.2.4)
	     * which returns `true` for `undefined` and other non-numeric values.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
	     * @example
	     *
	     * _.isNaN(NaN);
	     * // => true
	     *
	     * _.isNaN(new Number(NaN));
	     * // => true
	     *
	     * isNaN(undefined);
	     * // => true
	     *
	     * _.isNaN(undefined);
	     * // => false
	     */
	    function isNaN(value) {
	      // An `NaN` primitive is the only value that is not equal to itself.
	      // Perform the `toStringTag` check first to avoid errors with some host objects in IE.
	      return isNumber(value) && value != +value;
	    }

	    /**
	     * Checks if `value` is a native function.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
	     * @example
	     *
	     * _.isNative(Array.prototype.push);
	     * // => true
	     *
	     * _.isNative(_);
	     * // => false
	     */
	    function isNative(value) {
	      if (value == null) {
	        return false;
	      }
	      if (objToString.call(value) == funcTag) {
	        return reNative.test(fnToString.call(value));
	      }
	      return isObjectLike(value) && reHostCtor.test(value);
	    }

	    /**
	     * Checks if `value` is `null`.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is `null`, else `false`.
	     * @example
	     *
	     * _.isNull(null);
	     * // => true
	     *
	     * _.isNull(void 0);
	     * // => false
	     */
	    function isNull(value) {
	      return value === null;
	    }

	    /**
	     * Checks if `value` is classified as a `Number` primitive or object.
	     *
	     * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are classified
	     * as numbers, use the `_.isFinite` method.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	     * @example
	     *
	     * _.isNumber(8.4);
	     * // => true
	     *
	     * _.isNumber(NaN);
	     * // => true
	     *
	     * _.isNumber('8.4');
	     * // => false
	     */
	    function isNumber(value) {
	      return typeof value == 'number' || (isObjectLike(value) && objToString.call(value) == numberTag);
	    }

	    /**
	     * Checks if `value` is a plain object, that is, an object created by the
	     * `Object` constructor or one with a `[[Prototype]]` of `null`.
	     *
	     * **Note:** This method assumes objects created by the `Object` constructor
	     * have no inherited enumerable properties.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
	     * @example
	     *
	     * function Foo() {
	     *   this.a = 1;
	     * }
	     *
	     * _.isPlainObject(new Foo);
	     * // => false
	     *
	     * _.isPlainObject([1, 2, 3]);
	     * // => false
	     *
	     * _.isPlainObject({ 'x': 0, 'y': 0 });
	     * // => true
	     *
	     * _.isPlainObject(Object.create(null));
	     * // => true
	     */
	    var isPlainObject = !getPrototypeOf ? shimIsPlainObject : function(value) {
	      if (!(value && objToString.call(value) == objectTag)) {
	        return false;
	      }
	      var valueOf = value.valueOf,
	          objProto = isNative(valueOf) && (objProto = getPrototypeOf(valueOf)) && getPrototypeOf(objProto);

	      return objProto
	        ? (value == objProto || getPrototypeOf(value) == objProto)
	        : shimIsPlainObject(value);
	    };

	    /**
	     * Checks if `value` is classified as a `RegExp` object.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	     * @example
	     *
	     * _.isRegExp(/abc/);
	     * // => true
	     *
	     * _.isRegExp('/abc/');
	     * // => false
	     */
	    function isRegExp(value) {
	      return (isObjectLike(value) && objToString.call(value) == regexpTag) || false;
	    }

	    /**
	     * Checks if `value` is classified as a `String` primitive or object.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	     * @example
	     *
	     * _.isString('abc');
	     * // => true
	     *
	     * _.isString(1);
	     * // => false
	     */
	    function isString(value) {
	      return typeof value == 'string' || (isObjectLike(value) && objToString.call(value) == stringTag);
	    }

	    /**
	     * Checks if `value` is classified as a typed array.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	     * @example
	     *
	     * _.isTypedArray(new Uint8Array);
	     * // => true
	     *
	     * _.isTypedArray([]);
	     * // => false
	     */
	    function isTypedArray(value) {
	      return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objToString.call(value)];
	    }

	    /**
	     * Checks if `value` is `undefined`.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
	     * @example
	     *
	     * _.isUndefined(void 0);
	     * // => true
	     *
	     * _.isUndefined(null);
	     * // => false
	     */
	    function isUndefined(value) {
	      return typeof value == 'undefined';
	    }

	    /**
	     * Converts `value` to an array.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to convert.
	     * @returns {Array} Returns the converted array.
	     * @example
	     *
	     * (function() {
	     *   return _.toArray(arguments).slice(1);
	     * }(1, 2, 3));
	     * // => [2, 3]
	     */
	    function toArray(value) {
	      var length = value ? value.length : 0;
	      if (!isLength(length)) {
	        return values(value);
	      }
	      if (!length) {
	        return [];
	      }
	      return arrayCopy(value);
	    }

	    /**
	     * Converts `value` to a plain object flattening inherited enumerable
	     * properties of `value` to own properties of the plain object.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to convert.
	     * @returns {Object} Returns the converted plain object.
	     * @example
	     *
	     * function Foo() {
	     *   this.b = 2;
	     * }
	     *
	     * Foo.prototype.c = 3;
	     *
	     * _.assign({ 'a': 1 }, new Foo);
	     * // => { 'a': 1, 'b': 2 }
	     *
	     * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
	     * // => { 'a': 1, 'b': 2, 'c': 3 }
	     */
	    function toPlainObject(value) {
	      return baseCopy(value, keysIn(value));
	    }

	    /*------------------------------------------------------------------------*/

	    /**
	     * Assigns own enumerable properties of source object(s) to the destination
	     * object. Subsequent sources overwrite property assignments of previous sources.
	     * If `customizer` is provided it is invoked to produce the assigned values.
	     * The `customizer` is bound to `thisArg` and invoked with five arguments:
	     * (objectValue, sourceValue, key, object, source).
	     *
	     * @static
	     * @memberOf _
	     * @alias extend
	     * @category Object
	     * @param {Object} object The destination object.
	     * @param {...Object} [sources] The source objects.
	     * @param {Function} [customizer] The function to customize assigning values.
	     * @param {*} [thisArg] The `this` binding of `customizer`.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * _.assign({ 'user': 'barney' }, { 'age': 40 }, { 'user': 'fred' });
	     * // => { 'user': 'fred', 'age': 40 }
	     *
	     * // using a customizer callback
	     * var defaults = _.partialRight(_.assign, function(value, other) {
	     *   return typeof value == 'undefined' ? other : value;
	     * });
	     *
	     * defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
	     * // => { 'user': 'barney', 'age': 36 }
	     */
	    var assign = createAssigner(baseAssign);

	    /**
	     * Creates an object that inherits from the given `prototype` object. If a
	     * `properties` object is provided its own enumerable properties are assigned
	     * to the created object.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} prototype The object to inherit from.
	     * @param {Object} [properties] The properties to assign to the object.
	     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
	     * @returns {Object} Returns the new object.
	     * @example
	     *
	     * function Shape() {
	     *   this.x = 0;
	     *   this.y = 0;
	     * }
	     *
	     * function Circle() {
	     *   Shape.call(this);
	     * }
	     *
	     * Circle.prototype = _.create(Shape.prototype, {
	     *   'constructor': Circle
	     * });
	     *
	     * var circle = new Circle;
	     * circle instanceof Circle;
	     * // => true
	     *
	     * circle instanceof Shape;
	     * // => true
	     */
	    function create(prototype, properties, guard) {
	      var result = baseCreate(prototype);
	      if (guard && isIterateeCall(prototype, properties, guard)) {
	        properties = null;
	      }
	      return properties ? baseCopy(properties, result, keys(properties)) : result;
	    }

	    /**
	     * Assigns own enumerable properties of source object(s) to the destination
	     * object for all destination properties that resolve to `undefined`. Once a
	     * property is set, additional values of the same property are ignored.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The destination object.
	     * @param {...Object} [sources] The source objects.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * _.defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
	     * // => { 'user': 'barney', 'age': 36 }
	     */
	    var defaults = restParam(function(args) {
	      var object = args[0];
	      if (object == null) {
	        return object;
	      }
	      args.push(assignDefaults);
	      return assign.apply(undefined, args);
	    });

	    /**
	     * This method is like `_.find` except that it returns the key of the first
	     * element `predicate` returns truthy for instead of the element itself.
	     *
	     * If a property name is provided for `predicate` the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If a value is also provided for `thisArg` the created `_.matchesProperty`
	     * style callback returns `true` for elements that have a matching property
	     * value, else `false`.
	     *
	     * If an object is provided for `predicate` the created `_.matches` style
	     * callback returns `true` for elements that have the properties of the given
	     * object, else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to search.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked
	     *  per iteration.
	     * @param {*} [thisArg] The `this` binding of `predicate`.
	     * @returns {string|undefined} Returns the key of the matched element, else `undefined`.
	     * @example
	     *
	     * var users = {
	     *   'barney':  { 'age': 36, 'active': true },
	     *   'fred':    { 'age': 40, 'active': false },
	     *   'pebbles': { 'age': 1,  'active': true }
	     * };
	     *
	     * _.findKey(users, function(chr) {
	     *   return chr.age < 40;
	     * });
	     * // => 'barney' (iteration order is not guaranteed)
	     *
	     * // using the `_.matches` callback shorthand
	     * _.findKey(users, { 'age': 1, 'active': true });
	     * // => 'pebbles'
	     *
	     * // using the `_.matchesProperty` callback shorthand
	     * _.findKey(users, 'active', false);
	     * // => 'fred'
	     *
	     * // using the `_.property` callback shorthand
	     * _.findKey(users, 'active');
	     * // => 'barney'
	     */
	    var findKey = createFindKey(baseForOwn);

	    /**
	     * This method is like `_.findKey` except that it iterates over elements of
	     * a collection in the opposite order.
	     *
	     * If a property name is provided for `predicate` the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If a value is also provided for `thisArg` the created `_.matchesProperty`
	     * style callback returns `true` for elements that have a matching property
	     * value, else `false`.
	     *
	     * If an object is provided for `predicate` the created `_.matches` style
	     * callback returns `true` for elements that have the properties of the given
	     * object, else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to search.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked
	     *  per iteration.
	     * @param {*} [thisArg] The `this` binding of `predicate`.
	     * @returns {string|undefined} Returns the key of the matched element, else `undefined`.
	     * @example
	     *
	     * var users = {
	     *   'barney':  { 'age': 36, 'active': true },
	     *   'fred':    { 'age': 40, 'active': false },
	     *   'pebbles': { 'age': 1,  'active': true }
	     * };
	     *
	     * _.findLastKey(users, function(chr) {
	     *   return chr.age < 40;
	     * });
	     * // => returns `pebbles` assuming `_.findKey` returns `barney`
	     *
	     * // using the `_.matches` callback shorthand
	     * _.findLastKey(users, { 'age': 36, 'active': true });
	     * // => 'barney'
	     *
	     * // using the `_.matchesProperty` callback shorthand
	     * _.findLastKey(users, 'active', false);
	     * // => 'fred'
	     *
	     * // using the `_.property` callback shorthand
	     * _.findLastKey(users, 'active');
	     * // => 'pebbles'
	     */
	    var findLastKey = createFindKey(baseForOwnRight);

	    /**
	     * Iterates over own and inherited enumerable properties of an object invoking
	     * `iteratee` for each property. The `iteratee` is bound to `thisArg` and invoked
	     * with three arguments: (value, key, object). Iterator functions may exit
	     * iteration early by explicitly returning `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to iterate over.
	     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	     * @param {*} [thisArg] The `this` binding of `iteratee`.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * function Foo() {
	     *   this.a = 1;
	     *   this.b = 2;
	     * }
	     *
	     * Foo.prototype.c = 3;
	     *
	     * _.forIn(new Foo, function(value, key) {
	     *   console.log(key);
	     * });
	     * // => logs 'a', 'b', and 'c' (iteration order is not guaranteed)
	     */
	    var forIn = createForIn(baseFor);

	    /**
	     * This method is like `_.forIn` except that it iterates over properties of
	     * `object` in the opposite order.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to iterate over.
	     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	     * @param {*} [thisArg] The `this` binding of `iteratee`.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * function Foo() {
	     *   this.a = 1;
	     *   this.b = 2;
	     * }
	     *
	     * Foo.prototype.c = 3;
	     *
	     * _.forInRight(new Foo, function(value, key) {
	     *   console.log(key);
	     * });
	     * // => logs 'c', 'b', and 'a' assuming `_.forIn ` logs 'a', 'b', and 'c'
	     */
	    var forInRight = createForIn(baseForRight);

	    /**
	     * Iterates over own enumerable properties of an object invoking `iteratee`
	     * for each property. The `iteratee` is bound to `thisArg` and invoked with
	     * three arguments: (value, key, object). Iterator functions may exit iteration
	     * early by explicitly returning `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to iterate over.
	     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	     * @param {*} [thisArg] The `this` binding of `iteratee`.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * function Foo() {
	     *   this.a = 1;
	     *   this.b = 2;
	     * }
	     *
	     * Foo.prototype.c = 3;
	     *
	     * _.forOwn(new Foo, function(value, key) {
	     *   console.log(key);
	     * });
	     * // => logs 'a' and 'b' (iteration order is not guaranteed)
	     */
	    var forOwn = createForOwn(baseForOwn);

	    /**
	     * This method is like `_.forOwn` except that it iterates over properties of
	     * `object` in the opposite order.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to iterate over.
	     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	     * @param {*} [thisArg] The `this` binding of `iteratee`.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * function Foo() {
	     *   this.a = 1;
	     *   this.b = 2;
	     * }
	     *
	     * Foo.prototype.c = 3;
	     *
	     * _.forOwnRight(new Foo, function(value, key) {
	     *   console.log(key);
	     * });
	     * // => logs 'b' and 'a' assuming `_.forOwn` logs 'a' and 'b'
	     */
	    var forOwnRight = createForOwn(baseForOwnRight);

	    /**
	     * Creates an array of function property names from all enumerable properties,
	     * own and inherited, of `object`.
	     *
	     * @static
	     * @memberOf _
	     * @alias methods
	     * @category Object
	     * @param {Object} object The object to inspect.
	     * @returns {Array} Returns the new array of property names.
	     * @example
	     *
	     * _.functions(_);
	     * // => ['after', 'ary', 'assign', ...]
	     */
	    function functions(object) {
	      return baseFunctions(object, keysIn(object));
	    }

	    /**
	     * Checks if `key` exists as a direct property of `object` instead of an
	     * inherited property.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to inspect.
	     * @param {string} key The key to check.
	     * @returns {boolean} Returns `true` if `key` is a direct property, else `false`.
	     * @example
	     *
	     * var object = { 'a': 1, 'b': 2, 'c': 3 };
	     *
	     * _.has(object, 'b');
	     * // => true
	     */
	    function has(object, key) {
	      return object ? hasOwnProperty.call(object, key) : false;
	    }

	    /**
	     * Creates an object composed of the inverted keys and values of `object`.
	     * If `object` contains duplicate values, subsequent values overwrite property
	     * assignments of previous values unless `multiValue` is `true`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to invert.
	     * @param {boolean} [multiValue] Allow multiple values per key.
	     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
	     * @returns {Object} Returns the new inverted object.
	     * @example
	     *
	     * var object = { 'a': 1, 'b': 2, 'c': 1 };
	     *
	     * _.invert(object);
	     * // => { '1': 'c', '2': 'b' }
	     *
	     * // with `multiValue`
	     * _.invert(object, true);
	     * // => { '1': ['a', 'c'], '2': ['b'] }
	     */
	    function invert(object, multiValue, guard) {
	      if (guard && isIterateeCall(object, multiValue, guard)) {
	        multiValue = null;
	      }
	      var index = -1,
	          props = keys(object),
	          length = props.length,
	          result = {};

	      while (++index < length) {
	        var key = props[index],
	            value = object[key];

	        if (multiValue) {
	          if (hasOwnProperty.call(result, value)) {
	            result[value].push(key);
	          } else {
	            result[value] = [key];
	          }
	        }
	        else {
	          result[value] = key;
	        }
	      }
	      return result;
	    }

	    /**
	     * Creates an array of the own enumerable property names of `object`.
	     *
	     * **Note:** Non-object values are coerced to objects. See the
	     * [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.keys)
	     * for more details.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to inspect.
	     * @returns {Array} Returns the array of property names.
	     * @example
	     *
	     * function Foo() {
	     *   this.a = 1;
	     *   this.b = 2;
	     * }
	     *
	     * Foo.prototype.c = 3;
	     *
	     * _.keys(new Foo);
	     * // => ['a', 'b'] (iteration order is not guaranteed)
	     *
	     * _.keys('hi');
	     * // => ['0', '1']
	     */
	    var keys = !nativeKeys ? shimKeys : function(object) {
	      if (object) {
	        var Ctor = object.constructor,
	            length = object.length;
	      }
	      if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
	          (typeof object != 'function' && (length && isLength(length)))) {
	        return shimKeys(object);
	      }
	      return isObject(object) ? nativeKeys(object) : [];
	    };

	    /**
	     * Creates an array of the own and inherited enumerable property names of `object`.
	     *
	     * **Note:** Non-object values are coerced to objects.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to inspect.
	     * @returns {Array} Returns the array of property names.
	     * @example
	     *
	     * function Foo() {
	     *   this.a = 1;
	     *   this.b = 2;
	     * }
	     *
	     * Foo.prototype.c = 3;
	     *
	     * _.keysIn(new Foo);
	     * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
	     */
	    function keysIn(object) {
	      if (object == null) {
	        return [];
	      }
	      if (!isObject(object)) {
	        object = Object(object);
	      }
	      var length = object.length;
	      length = (length && isLength(length) &&
	        (isArray(object) || (support.nonEnumArgs && isArguments(object))) && length) || 0;

	      var Ctor = object.constructor,
	          index = -1,
	          isProto = typeof Ctor == 'function' && Ctor.prototype === object,
	          result = Array(length),
	          skipIndexes = length > 0;

	      while (++index < length) {
	        result[index] = (index + '');
	      }
	      for (var key in object) {
	        if (!(skipIndexes && isIndex(key, length)) &&
	            !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
	          result.push(key);
	        }
	      }
	      return result;
	    }

	    /**
	     * Creates an object with the same keys as `object` and values generated by
	     * running each own enumerable property of `object` through `iteratee`. The
	     * iteratee function is bound to `thisArg` and invoked with three arguments:
	     * (value, key, object).
	     *
	     * If a property name is provided for `iteratee` the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If a value is also provided for `thisArg` the created `_.matchesProperty`
	     * style callback returns `true` for elements that have a matching property
	     * value, else `false`.
	     *
	     * If an object is provided for `iteratee` the created `_.matches` style
	     * callback returns `true` for elements that have the properties of the given
	     * object, else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to iterate over.
	     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
	     *  per iteration.
	     * @param {*} [thisArg] The `this` binding of `iteratee`.
	     * @returns {Object} Returns the new mapped object.
	     * @example
	     *
	     * _.mapValues({ 'a': 1, 'b': 2 }, function(n) {
	     *   return n * 3;
	     * });
	     * // => { 'a': 3, 'b': 6 }
	     *
	     * var users = {
	     *   'fred':    { 'user': 'fred',    'age': 40 },
	     *   'pebbles': { 'user': 'pebbles', 'age': 1 }
	     * };
	     *
	     * // using the `_.property` callback shorthand
	     * _.mapValues(users, 'age');
	     * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
	     */
	    function mapValues(object, iteratee, thisArg) {
	      var result = {};
	      iteratee = getCallback(iteratee, thisArg, 3);

	      baseForOwn(object, function(value, key, object) {
	        result[key] = iteratee(value, key, object);
	      });
	      return result;
	    }

	    /**
	     * Recursively merges own enumerable properties of the source object(s), that
	     * don't resolve to `undefined` into the destination object. Subsequent sources
	     * overwrite property assignments of previous sources. If `customizer` is
	     * provided it is invoked to produce the merged values of the destination and
	     * source properties. If `customizer` returns `undefined` merging is handled
	     * by the method instead. The `customizer` is bound to `thisArg` and invoked
	     * with five arguments: (objectValue, sourceValue, key, object, source).
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The destination object.
	     * @param {...Object} [sources] The source objects.
	     * @param {Function} [customizer] The function to customize merging properties.
	     * @param {*} [thisArg] The `this` binding of `customizer`.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * var users = {
	     *   'data': [{ 'user': 'barney' }, { 'user': 'fred' }]
	     * };
	     *
	     * var ages = {
	     *   'data': [{ 'age': 36 }, { 'age': 40 }]
	     * };
	     *
	     * _.merge(users, ages);
	     * // => { 'data': [{ 'user': 'barney', 'age': 36 }, { 'user': 'fred', 'age': 40 }] }
	     *
	     * // using a customizer callback
	     * var object = {
	     *   'fruits': ['apple'],
	     *   'vegetables': ['beet']
	     * };
	     *
	     * var other = {
	     *   'fruits': ['banana'],
	     *   'vegetables': ['carrot']
	     * };
	     *
	     * _.merge(object, other, function(a, b) {
	     *   if (_.isArray(a)) {
	     *     return a.concat(b);
	     *   }
	     * });
	     * // => { 'fruits': ['apple', 'banana'], 'vegetables': ['beet', 'carrot'] }
	     */
	    var merge = createAssigner(baseMerge);

	    /**
	     * The opposite of `_.pick`; this method creates an object composed of the
	     * own and inherited enumerable properties of `object` that are not omitted.
	     * Property names may be specified as individual arguments or as arrays of
	     * property names. If `predicate` is provided it is invoked for each property
	     * of `object` omitting the properties `predicate` returns truthy for. The
	     * predicate is bound to `thisArg` and invoked with three arguments:
	     * (value, key, object).
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The source object.
	     * @param {Function|...(string|string[])} [predicate] The function invoked per
	     *  iteration or property names to omit, specified as individual property
	     *  names or arrays of property names.
	     * @param {*} [thisArg] The `this` binding of `predicate`.
	     * @returns {Object} Returns the new object.
	     * @example
	     *
	     * var object = { 'user': 'fred', 'age': 40 };
	     *
	     * _.omit(object, 'age');
	     * // => { 'user': 'fred' }
	     *
	     * _.omit(object, _.isNumber);
	     * // => { 'user': 'fred' }
	     */
	    var omit = restParam(function(object, props) {
	      if (object == null) {
	        return {};
	      }
	      if (typeof props[0] != 'function') {
	        var props = arrayMap(baseFlatten(props), String);
	        return pickByArray(object, baseDifference(keysIn(object), props));
	      }
	      var predicate = bindCallback(props[0], props[1], 3);
	      return pickByCallback(object, function(value, key, object) {
	        return !predicate(value, key, object);
	      });
	    });

	    /**
	     * Creates a two dimensional array of the key-value pairs for `object`,
	     * e.g. `[[key1, value1], [key2, value2]]`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to inspect.
	     * @returns {Array} Returns the new array of key-value pairs.
	     * @example
	     *
	     * _.pairs({ 'barney': 36, 'fred': 40 });
	     * // => [['barney', 36], ['fred', 40]] (iteration order is not guaranteed)
	     */
	    function pairs(object) {
	      var index = -1,
	          props = keys(object),
	          length = props.length,
	          result = Array(length);

	      while (++index < length) {
	        var key = props[index];
	        result[index] = [key, object[key]];
	      }
	      return result;
	    }

	    /**
	     * Creates an object composed of the picked `object` properties. Property
	     * names may be specified as individual arguments or as arrays of property
	     * names. If `predicate` is provided it is invoked for each property of `object`
	     * picking the properties `predicate` returns truthy for. The predicate is
	     * bound to `thisArg` and invoked with three arguments: (value, key, object).
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The source object.
	     * @param {Function|...(string|string[])} [predicate] The function invoked per
	     *  iteration or property names to pick, specified as individual property
	     *  names or arrays of property names.
	     * @param {*} [thisArg] The `this` binding of `predicate`.
	     * @returns {Object} Returns the new object.
	     * @example
	     *
	     * var object = { 'user': 'fred', 'age': 40 };
	     *
	     * _.pick(object, 'user');
	     * // => { 'user': 'fred' }
	     *
	     * _.pick(object, _.isString);
	     * // => { 'user': 'fred' }
	     */
	    var pick = restParam(function(object, props) {
	      if (object == null) {
	        return {};
	      }
	      return typeof props[0] == 'function'
	        ? pickByCallback(object, bindCallback(props[0], props[1], 3))
	        : pickByArray(object, baseFlatten(props));
	    });

	    /**
	     * Resolves the value of property `key` on `object`. If the value of `key` is
	     * a function it is invoked with the `this` binding of `object` and its result
	     * is returned, else the property value is returned. If the property value is
	     * `undefined` the `defaultValue` is used in its place.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to query.
	     * @param {string} key The key of the property to resolve.
	     * @param {*} [defaultValue] The value returned if the property value
	     *  resolves to `undefined`.
	     * @returns {*} Returns the resolved value.
	     * @example
	     *
	     * var object = { 'user': 'fred', 'age': _.constant(40) };
	     *
	     * _.result(object, 'user');
	     * // => 'fred'
	     *
	     * _.result(object, 'age');
	     * // => 40
	     *
	     * _.result(object, 'status', 'busy');
	     * // => 'busy'
	     *
	     * _.result(object, 'status', _.constant('busy'));
	     * // => 'busy'
	     */
	    function result(object, key, defaultValue) {
	      var value = object == null ? undefined : object[key];
	      if (typeof value == 'undefined') {
	        value = defaultValue;
	      }
	      return isFunction(value) ? value.call(object) : value;
	    }

	    /**
	     * An alternative to `_.reduce`; this method transforms `object` to a new
	     * `accumulator` object which is the result of running each of its own enumerable
	     * properties through `iteratee`, with each invocation potentially mutating
	     * the `accumulator` object. The `iteratee` is bound to `thisArg` and invoked
	     * with four arguments: (accumulator, value, key, object). Iterator functions
	     * may exit iteration early by explicitly returning `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Array|Object} object The object to iterate over.
	     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	     * @param {*} [accumulator] The custom accumulator value.
	     * @param {*} [thisArg] The `this` binding of `iteratee`.
	     * @returns {*} Returns the accumulated value.
	     * @example
	     *
	     * _.transform([2, 3, 4], function(result, n) {
	     *   result.push(n *= n);
	     *   return n % 2 == 0;
	     * });
	     * // => [4, 9]
	     *
	     * _.transform({ 'a': 1, 'b': 2 }, function(result, n, key) {
	     *   result[key] = n * 3;
	     * });
	     * // => { 'a': 3, 'b': 6 }
	     */
	    function transform(object, iteratee, accumulator, thisArg) {
	      var isArr = isArray(object) || isTypedArray(object);
	      iteratee = getCallback(iteratee, thisArg, 4);

	      if (accumulator == null) {
	        if (isArr || isObject(object)) {
	          var Ctor = object.constructor;
	          if (isArr) {
	            accumulator = isArray(object) ? new Ctor : [];
	          } else {
	            accumulator = baseCreate(isFunction(Ctor) && Ctor.prototype);
	          }
	        } else {
	          accumulator = {};
	        }
	      }
	      (isArr ? arrayEach : baseForOwn)(object, function(value, index, object) {
	        return iteratee(accumulator, value, index, object);
	      });
	      return accumulator;
	    }

	    /**
	     * Creates an array of the own enumerable property values of `object`.
	     *
	     * **Note:** Non-object values are coerced to objects.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to query.
	     * @returns {Array} Returns the array of property values.
	     * @example
	     *
	     * function Foo() {
	     *   this.a = 1;
	     *   this.b = 2;
	     * }
	     *
	     * Foo.prototype.c = 3;
	     *
	     * _.values(new Foo);
	     * // => [1, 2] (iteration order is not guaranteed)
	     *
	     * _.values('hi');
	     * // => ['h', 'i']
	     */
	    function values(object) {
	      return baseValues(object, keys(object));
	    }

	    /**
	     * Creates an array of the own and inherited enumerable property values
	     * of `object`.
	     *
	     * **Note:** Non-object values are coerced to objects.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to query.
	     * @returns {Array} Returns the array of property values.
	     * @example
	     *
	     * function Foo() {
	     *   this.a = 1;
	     *   this.b = 2;
	     * }
	     *
	     * Foo.prototype.c = 3;
	     *
	     * _.valuesIn(new Foo);
	     * // => [1, 2, 3] (iteration order is not guaranteed)
	     */
	    function valuesIn(object) {
	      return baseValues(object, keysIn(object));
	    }

	    /*------------------------------------------------------------------------*/

	    /**
	     * Checks if `n` is between `start` and up to but not including, `end`. If
	     * `end` is not specified it is set to `start` with `start` then set to `0`.
	     *
	     * @static
	     * @memberOf _
	     * @category Number
	     * @param {number} n The number to check.
	     * @param {number} [start=0] The start of the range.
	     * @param {number} end The end of the range.
	     * @returns {boolean} Returns `true` if `n` is in the range, else `false`.
	     * @example
	     *
	     * _.inRange(3, 2, 4);
	     * // => true
	     *
	     * _.inRange(4, 8);
	     * // => true
	     *
	     * _.inRange(4, 2);
	     * // => false
	     *
	     * _.inRange(2, 2);
	     * // => false
	     *
	     * _.inRange(1.2, 2);
	     * // => true
	     *
	     * _.inRange(5.2, 4);
	     * // => false
	     */
	    function inRange(value, start, end) {
	      start = +start || 0;
	      if (typeof end === 'undefined') {
	        end = start;
	        start = 0;
	      } else {
	        end = +end || 0;
	      }
	      return value >= start && value < end;
	    }

	    /**
	     * Produces a random number between `min` and `max` (inclusive). If only one
	     * argument is provided a number between `0` and the given number is returned.
	     * If `floating` is `true`, or either `min` or `max` are floats, a floating-point
	     * number is returned instead of an integer.
	     *
	     * @static
	     * @memberOf _
	     * @category Number
	     * @param {number} [min=0] The minimum possible value.
	     * @param {number} [max=1] The maximum possible value.
	     * @param {boolean} [floating] Specify returning a floating-point number.
	     * @returns {number} Returns the random number.
	     * @example
	     *
	     * _.random(0, 5);
	     * // => an integer between 0 and 5
	     *
	     * _.random(5);
	     * // => also an integer between 0 and 5
	     *
	     * _.random(5, true);
	     * // => a floating-point number between 0 and 5
	     *
	     * _.random(1.2, 5.2);
	     * // => a floating-point number between 1.2 and 5.2
	     */
	    function random(min, max, floating) {
	      if (floating && isIterateeCall(min, max, floating)) {
	        max = floating = null;
	      }
	      var noMin = min == null,
	          noMax = max == null;

	      if (floating == null) {
	        if (noMax && typeof min == 'boolean') {
	          floating = min;
	          min = 1;
	        }
	        else if (typeof max == 'boolean') {
	          floating = max;
	          noMax = true;
	        }
	      }
	      if (noMin && noMax) {
	        max = 1;
	        noMax = false;
	      }
	      min = +min || 0;
	      if (noMax) {
	        max = min;
	        min = 0;
	      } else {
	        max = +max || 0;
	      }
	      if (floating || min % 1 || max % 1) {
	        var rand = nativeRandom();
	        return nativeMin(min + (rand * (max - min + parseFloat('1e-' + ((rand + '').length - 1)))), max);
	      }
	      return baseRandom(min, max);
	    }

	    /*------------------------------------------------------------------------*/

	    /**
	     * Converts `string` to [camel case](https://en.wikipedia.org/wiki/CamelCase).
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to convert.
	     * @returns {string} Returns the camel cased string.
	     * @example
	     *
	     * _.camelCase('Foo Bar');
	     * // => 'fooBar'
	     *
	     * _.camelCase('--foo-bar');
	     * // => 'fooBar'
	     *
	     * _.camelCase('__foo_bar__');
	     * // => 'fooBar'
	     */
	    var camelCase = createCompounder(function(result, word, index) {
	      word = word.toLowerCase();
	      return result + (index ? (word.charAt(0).toUpperCase() + word.slice(1)) : word);
	    });

	    /**
	     * Capitalizes the first character of `string`.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to capitalize.
	     * @returns {string} Returns the capitalized string.
	     * @example
	     *
	     * _.capitalize('fred');
	     * // => 'Fred'
	     */
	    function capitalize(string) {
	      string = baseToString(string);
	      return string && (string.charAt(0).toUpperCase() + string.slice(1));
	    }

	    /**
	     * Deburrs `string` by converting [latin-1 supplementary letters](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
	     * to basic latin letters and removing [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to deburr.
	     * @returns {string} Returns the deburred string.
	     * @example
	     *
	     * _.deburr('déjà vu');
	     * // => 'deja vu'
	     */
	    function deburr(string) {
	      string = baseToString(string);
	      return string && string.replace(reLatin1, deburrLetter).replace(reComboMarks, '');
	    }

	    /**
	     * Checks if `string` ends with the given target string.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to search.
	     * @param {string} [target] The string to search for.
	     * @param {number} [position=string.length] The position to search from.
	     * @returns {boolean} Returns `true` if `string` ends with `target`, else `false`.
	     * @example
	     *
	     * _.endsWith('abc', 'c');
	     * // => true
	     *
	     * _.endsWith('abc', 'b');
	     * // => false
	     *
	     * _.endsWith('abc', 'b', 2);
	     * // => true
	     */
	    function endsWith(string, target, position) {
	      string = baseToString(string);
	      target = (target + '');

	      var length = string.length;
	      position = typeof position == 'undefined'
	        ? length
	        : nativeMin(position < 0 ? 0 : (+position || 0), length);

	      position -= target.length;
	      return position >= 0 && string.indexOf(target, position) == position;
	    }

	    /**
	     * Converts the characters "&", "<", ">", '"', "'", and "\`", in `string` to
	     * their corresponding HTML entities.
	     *
	     * **Note:** No other characters are escaped. To escape additional characters
	     * use a third-party library like [_he_](https://mths.be/he).
	     *
	     * Though the ">" character is escaped for symmetry, characters like
	     * ">" and "/" don't require escaping in HTML and have no special meaning
	     * unless they're part of a tag or unquoted attribute value.
	     * See [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
	     * (under "semi-related fun fact") for more details.
	     *
	     * Backticks are escaped because in Internet Explorer < 9, they can break out
	     * of attribute values or HTML comments. See [#102](https://html5sec.org/#102),
	     * [#108](https://html5sec.org/#108), and [#133](https://html5sec.org/#133) of
	     * the [HTML5 Security Cheatsheet](https://html5sec.org/) for more details.
	     *
	     * When working with HTML you should always [quote attribute values](http://wonko.com/post/html-escaping)
	     * to reduce XSS vectors.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to escape.
	     * @returns {string} Returns the escaped string.
	     * @example
	     *
	     * _.escape('fred, barney, & pebbles');
	     * // => 'fred, barney, &amp; pebbles'
	     */
	    function escape(string) {
	      // Reset `lastIndex` because in IE < 9 `String#replace` does not.
	      string = baseToString(string);
	      return (string && reHasUnescapedHtml.test(string))
	        ? string.replace(reUnescapedHtml, escapeHtmlChar)
	        : string;
	    }

	    /**
	     * Escapes the `RegExp` special characters "\", "/", "^", "$", ".", "|", "?",
	     * "*", "+", "(", ")", "[", "]", "{" and "}" in `string`.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to escape.
	     * @returns {string} Returns the escaped string.
	     * @example
	     *
	     * _.escapeRegExp('[lodash](https://lodash.com/)');
	     * // => '\[lodash\]\(https:\/\/lodash\.com\/\)'
	     */
	    function escapeRegExp(string) {
	      string = baseToString(string);
	      return (string && reHasRegExpChars.test(string))
	        ? string.replace(reRegExpChars, '\\$&')
	        : string;
	    }

	    /**
	     * Converts `string` to [kebab case](https://en.wikipedia.org/wiki/Letter_case#Special_case_styles).
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to convert.
	     * @returns {string} Returns the kebab cased string.
	     * @example
	     *
	     * _.kebabCase('Foo Bar');
	     * // => 'foo-bar'
	     *
	     * _.kebabCase('fooBar');
	     * // => 'foo-bar'
	     *
	     * _.kebabCase('__foo_bar__');
	     * // => 'foo-bar'
	     */
	    var kebabCase = createCompounder(function(result, word, index) {
	      return result + (index ? '-' : '') + word.toLowerCase();
	    });

	    /**
	     * Pads `string` on the left and right sides if it is shorter than `length`.
	     * Padding characters are truncated if they can't be evenly divided by `length`.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to pad.
	     * @param {number} [length=0] The padding length.
	     * @param {string} [chars=' '] The string used as padding.
	     * @returns {string} Returns the padded string.
	     * @example
	     *
	     * _.pad('abc', 8);
	     * // => '  abc   '
	     *
	     * _.pad('abc', 8, '_-');
	     * // => '_-abc_-_'
	     *
	     * _.pad('abc', 3);
	     * // => 'abc'
	     */
	    function pad(string, length, chars) {
	      string = baseToString(string);
	      length = +length;

	      var strLength = string.length;
	      if (strLength >= length || !nativeIsFinite(length)) {
	        return string;
	      }
	      var mid = (length - strLength) / 2,
	          leftLength = floor(mid),
	          rightLength = ceil(mid);

	      chars = createPadding('', rightLength, chars);
	      return chars.slice(0, leftLength) + string + chars;
	    }

	    /**
	     * Pads `string` on the left side if it is shorter than `length`. Padding
	     * characters are truncated if they exceed `length`.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to pad.
	     * @param {number} [length=0] The padding length.
	     * @param {string} [chars=' '] The string used as padding.
	     * @returns {string} Returns the padded string.
	     * @example
	     *
	     * _.padLeft('abc', 6);
	     * // => '   abc'
	     *
	     * _.padLeft('abc', 6, '_-');
	     * // => '_-_abc'
	     *
	     * _.padLeft('abc', 3);
	     * // => 'abc'
	     */
	    var padLeft = createPadDir();

	    /**
	     * Pads `string` on the right side if it is shorter than `length`. Padding
	     * characters are truncated if they exceed `length`.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to pad.
	     * @param {number} [length=0] The padding length.
	     * @param {string} [chars=' '] The string used as padding.
	     * @returns {string} Returns the padded string.
	     * @example
	     *
	     * _.padRight('abc', 6);
	     * // => 'abc   '
	     *
	     * _.padRight('abc', 6, '_-');
	     * // => 'abc_-_'
	     *
	     * _.padRight('abc', 3);
	     * // => 'abc'
	     */
	    var padRight = createPadDir(true);

	    /**
	     * Converts `string` to an integer of the specified radix. If `radix` is
	     * `undefined` or `0`, a `radix` of `10` is used unless `value` is a hexadecimal,
	     * in which case a `radix` of `16` is used.
	     *
	     * **Note:** This method aligns with the [ES5 implementation](https://es5.github.io/#E)
	     * of `parseInt`.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} string The string to convert.
	     * @param {number} [radix] The radix to interpret `value` by.
	     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
	     * @returns {number} Returns the converted integer.
	     * @example
	     *
	     * _.parseInt('08');
	     * // => 8
	     *
	     * _.map(['6', '08', '10'], _.parseInt);
	     * // => [6, 8, 10]
	     */
	    function parseInt(string, radix, guard) {
	      if (guard && isIterateeCall(string, radix, guard)) {
	        radix = 0;
	      }
	      return nativeParseInt(string, radix);
	    }
	    // Fallback for environments with pre-ES5 implementations.
	    if (nativeParseInt(whitespace + '08') != 8) {
	      parseInt = function(string, radix, guard) {
	        // Firefox < 21 and Opera < 15 follow ES3 for `parseInt`.
	        // Chrome fails to trim leading <BOM> whitespace characters.
	        // See https://code.google.com/p/v8/issues/detail?id=3109 for more details.
	        if (guard ? isIterateeCall(string, radix, guard) : radix == null) {
	          radix = 0;
	        } else if (radix) {
	          radix = +radix;
	        }
	        string = trim(string);
	        return nativeParseInt(string, radix || (reHexPrefix.test(string) ? 16 : 10));
	      };
	    }

	    /**
	     * Repeats the given string `n` times.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to repeat.
	     * @param {number} [n=0] The number of times to repeat the string.
	     * @returns {string} Returns the repeated string.
	     * @example
	     *
	     * _.repeat('*', 3);
	     * // => '***'
	     *
	     * _.repeat('abc', 2);
	     * // => 'abcabc'
	     *
	     * _.repeat('abc', 0);
	     * // => ''
	     */
	    function repeat(string, n) {
	      var result = '';
	      string = baseToString(string);
	      n = +n;
	      if (n < 1 || !string || !nativeIsFinite(n)) {
	        return result;
	      }
	      // Leverage the exponentiation by squaring algorithm for a faster repeat.
	      // See https://en.wikipedia.org/wiki/Exponentiation_by_squaring for more details.
	      do {
	        if (n % 2) {
	          result += string;
	        }
	        n = floor(n / 2);
	        string += string;
	      } while (n);

	      return result;
	    }

	    /**
	     * Converts `string` to [snake case](https://en.wikipedia.org/wiki/Snake_case).
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to convert.
	     * @returns {string} Returns the snake cased string.
	     * @example
	     *
	     * _.snakeCase('Foo Bar');
	     * // => 'foo_bar'
	     *
	     * _.snakeCase('fooBar');
	     * // => 'foo_bar'
	     *
	     * _.snakeCase('--foo-bar');
	     * // => 'foo_bar'
	     */
	    var snakeCase = createCompounder(function(result, word, index) {
	      return result + (index ? '_' : '') + word.toLowerCase();
	    });

	    /**
	     * Converts `string` to [start case](https://en.wikipedia.org/wiki/Letter_case#Stylistic_or_specialised_usage).
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to convert.
	     * @returns {string} Returns the start cased string.
	     * @example
	     *
	     * _.startCase('--foo-bar');
	     * // => 'Foo Bar'
	     *
	     * _.startCase('fooBar');
	     * // => 'Foo Bar'
	     *
	     * _.startCase('__foo_bar__');
	     * // => 'Foo Bar'
	     */
	    var startCase = createCompounder(function(result, word, index) {
	      return result + (index ? ' ' : '') + (word.charAt(0).toUpperCase() + word.slice(1));
	    });

	    /**
	     * Checks if `string` starts with the given target string.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to search.
	     * @param {string} [target] The string to search for.
	     * @param {number} [position=0] The position to search from.
	     * @returns {boolean} Returns `true` if `string` starts with `target`, else `false`.
	     * @example
	     *
	     * _.startsWith('abc', 'a');
	     * // => true
	     *
	     * _.startsWith('abc', 'b');
	     * // => false
	     *
	     * _.startsWith('abc', 'b', 1);
	     * // => true
	     */
	    function startsWith(string, target, position) {
	      string = baseToString(string);
	      position = position == null
	        ? 0
	        : nativeMin(position < 0 ? 0 : (+position || 0), string.length);

	      return string.lastIndexOf(target, position) == position;
	    }

	    /**
	     * Creates a compiled template function that can interpolate data properties
	     * in "interpolate" delimiters, HTML-escape interpolated data properties in
	     * "escape" delimiters, and execute JavaScript in "evaluate" delimiters. Data
	     * properties may be accessed as free variables in the template. If a setting
	     * object is provided it takes precedence over `_.templateSettings` values.
	     *
	     * **Note:** In the development build `_.template` utilizes
	     * [sourceURLs](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl)
	     * for easier debugging.
	     *
	     * For more information on precompiling templates see
	     * [lodash's custom builds documentation](https://lodash.com/custom-builds).
	     *
	     * For more information on Chrome extension sandboxes see
	     * [Chrome's extensions documentation](https://developer.chrome.com/extensions/sandboxingEval).
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The template string.
	     * @param {Object} [options] The options object.
	     * @param {RegExp} [options.escape] The HTML "escape" delimiter.
	     * @param {RegExp} [options.evaluate] The "evaluate" delimiter.
	     * @param {Object} [options.imports] An object to import into the template as free variables.
	     * @param {RegExp} [options.interpolate] The "interpolate" delimiter.
	     * @param {string} [options.sourceURL] The sourceURL of the template's compiled source.
	     * @param {string} [options.variable] The data object variable name.
	     * @param- {Object} [otherOptions] Enables the legacy `options` param signature.
	     * @returns {Function} Returns the compiled template function.
	     * @example
	     *
	     * // using the "interpolate" delimiter to create a compiled template
	     * var compiled = _.template('hello <%= user %>!');
	     * compiled({ 'user': 'fred' });
	     * // => 'hello fred!'
	     *
	     * // using the HTML "escape" delimiter to escape data property values
	     * var compiled = _.template('<b><%- value %></b>');
	     * compiled({ 'value': '<script>' });
	     * // => '<b>&lt;script&gt;</b>'
	     *
	     * // using the "evaluate" delimiter to execute JavaScript and generate HTML
	     * var compiled = _.template('<% _.forEach(users, function(user) { %><li><%- user %></li><% }); %>');
	     * compiled({ 'users': ['fred', 'barney'] });
	     * // => '<li>fred</li><li>barney</li>'
	     *
	     * // using the internal `print` function in "evaluate" delimiters
	     * var compiled = _.template('<% print("hello " + user); %>!');
	     * compiled({ 'user': 'barney' });
	     * // => 'hello barney!'
	     *
	     * // using the ES delimiter as an alternative to the default "interpolate" delimiter
	     * var compiled = _.template('hello ${ user }!');
	     * compiled({ 'user': 'pebbles' });
	     * // => 'hello pebbles!'
	     *
	     * // using custom template delimiters
	     * _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
	     * var compiled = _.template('hello {{ user }}!');
	     * compiled({ 'user': 'mustache' });
	     * // => 'hello mustache!'
	     *
	     * // using backslashes to treat delimiters as plain text
	     * var compiled = _.template('<%= "\\<%- value %\\>" %>');
	     * compiled({ 'value': 'ignored' });
	     * // => '<%- value %>'
	     *
	     * // using the `imports` option to import `jQuery` as `jq`
	     * var text = '<% jq.each(users, function(user) { %><li><%- user %></li><% }); %>';
	     * var compiled = _.template(text, { 'imports': { 'jq': jQuery } });
	     * compiled({ 'users': ['fred', 'barney'] });
	     * // => '<li>fred</li><li>barney</li>'
	     *
	     * // using the `sourceURL` option to specify a custom sourceURL for the template
	     * var compiled = _.template('hello <%= user %>!', { 'sourceURL': '/basic/greeting.jst' });
	     * compiled(data);
	     * // => find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector
	     *
	     * // using the `variable` option to ensure a with-statement isn't used in the compiled template
	     * var compiled = _.template('hi <%= data.user %>!', { 'variable': 'data' });
	     * compiled.source;
	     * // => function(data) {
	     * //   var __t, __p = '';
	     * //   __p += 'hi ' + ((__t = ( data.user )) == null ? '' : __t) + '!';
	     * //   return __p;
	     * // }
	     *
	     * // using the `source` property to inline compiled templates for meaningful
	     * // line numbers in error messages and a stack trace
	     * fs.writeFileSync(path.join(cwd, 'jst.js'), '\
	     *   var JST = {\
	     *     "main": ' + _.template(mainText).source + '\
	     *   };\
	     * ');
	     */
	    function template(string, options, otherOptions) {
	      // Based on John Resig's `tmpl` implementation (http://ejohn.org/blog/javascript-micro-templating/)
	      // and Laura Doktorova's doT.js (https://github.com/olado/doT).
	      var settings = lodash.templateSettings;

	      if (otherOptions && isIterateeCall(string, options, otherOptions)) {
	        options = otherOptions = null;
	      }
	      string = baseToString(string);
	      options = baseAssign(baseAssign({}, otherOptions || options), settings, assignOwnDefaults);

	      var imports = baseAssign(baseAssign({}, options.imports), settings.imports, assignOwnDefaults),
	          importsKeys = keys(imports),
	          importsValues = baseValues(imports, importsKeys);

	      var isEscaping,
	          isEvaluating,
	          index = 0,
	          interpolate = options.interpolate || reNoMatch,
	          source = "__p += '";

	      // Compile the regexp to match each delimiter.
	      var reDelimiters = RegExp(
	        (options.escape || reNoMatch).source + '|' +
	        interpolate.source + '|' +
	        (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
	        (options.evaluate || reNoMatch).source + '|$'
	      , 'g');

	      // Use a sourceURL for easier debugging.
	      var sourceURL = '//# sourceURL=' +
	        ('sourceURL' in options
	          ? options.sourceURL
	          : ('lodash.templateSources[' + (++templateCounter) + ']')
	        ) + '\n';

	      string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
	        interpolateValue || (interpolateValue = esTemplateValue);

	        // Escape characters that can't be included in string literals.
	        source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);

	        // Replace delimiters with snippets.
	        if (escapeValue) {
	          isEscaping = true;
	          source += "' +\n__e(" + escapeValue + ") +\n'";
	        }
	        if (evaluateValue) {
	          isEvaluating = true;
	          source += "';\n" + evaluateValue + ";\n__p += '";
	        }
	        if (interpolateValue) {
	          source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
	        }
	        index = offset + match.length;

	        // The JS engine embedded in Adobe products requires returning the `match`
	        // string in order to produce the correct `offset` value.
	        return match;
	      });

	      source += "';\n";

	      // If `variable` is not specified wrap a with-statement around the generated
	      // code to add the data object to the top of the scope chain.
	      var variable = options.variable;
	      if (!variable) {
	        source = 'with (obj) {\n' + source + '\n}\n';
	      }
	      // Cleanup code by stripping empty strings.
	      source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
	        .replace(reEmptyStringMiddle, '$1')
	        .replace(reEmptyStringTrailing, '$1;');

	      // Frame code as the function body.
	      source = 'function(' + (variable || 'obj') + ') {\n' +
	        (variable
	          ? ''
	          : 'obj || (obj = {});\n'
	        ) +
	        "var __t, __p = ''" +
	        (isEscaping
	           ? ', __e = _.escape'
	           : ''
	        ) +
	        (isEvaluating
	          ? ', __j = Array.prototype.join;\n' +
	            "function print() { __p += __j.call(arguments, '') }\n"
	          : ';\n'
	        ) +
	        source +
	        'return __p\n}';

	      var result = attempt(function() {
	        return Function(importsKeys, sourceURL + 'return ' + source).apply(undefined, importsValues);
	      });

	      // Provide the compiled function's source by its `toString` method or
	      // the `source` property as a convenience for inlining compiled templates.
	      result.source = source;
	      if (isError(result)) {
	        throw result;
	      }
	      return result;
	    }

	    /**
	     * Removes leading and trailing whitespace or specified characters from `string`.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to trim.
	     * @param {string} [chars=whitespace] The characters to trim.
	     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
	     * @returns {string} Returns the trimmed string.
	     * @example
	     *
	     * _.trim('  abc  ');
	     * // => 'abc'
	     *
	     * _.trim('-_-abc-_-', '_-');
	     * // => 'abc'
	     *
	     * _.map(['  foo  ', '  bar  '], _.trim);
	     * // => ['foo', 'bar']
	     */
	    function trim(string, chars, guard) {
	      var value = string;
	      string = baseToString(string);
	      if (!string) {
	        return string;
	      }
	      if (guard ? isIterateeCall(value, chars, guard) : chars == null) {
	        return string.slice(trimmedLeftIndex(string), trimmedRightIndex(string) + 1);
	      }
	      chars = (chars + '');
	      return string.slice(charsLeftIndex(string, chars), charsRightIndex(string, chars) + 1);
	    }

	    /**
	     * Removes leading whitespace or specified characters from `string`.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to trim.
	     * @param {string} [chars=whitespace] The characters to trim.
	     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
	     * @returns {string} Returns the trimmed string.
	     * @example
	     *
	     * _.trimLeft('  abc  ');
	     * // => 'abc  '
	     *
	     * _.trimLeft('-_-abc-_-', '_-');
	     * // => 'abc-_-'
	     */
	    function trimLeft(string, chars, guard) {
	      var value = string;
	      string = baseToString(string);
	      if (!string) {
	        return string;
	      }
	      if (guard ? isIterateeCall(value, chars, guard) : chars == null) {
	        return string.slice(trimmedLeftIndex(string));
	      }
	      return string.slice(charsLeftIndex(string, (chars + '')));
	    }

	    /**
	     * Removes trailing whitespace or specified characters from `string`.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to trim.
	     * @param {string} [chars=whitespace] The characters to trim.
	     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
	     * @returns {string} Returns the trimmed string.
	     * @example
	     *
	     * _.trimRight('  abc  ');
	     * // => '  abc'
	     *
	     * _.trimRight('-_-abc-_-', '_-');
	     * // => '-_-abc'
	     */
	    function trimRight(string, chars, guard) {
	      var value = string;
	      string = baseToString(string);
	      if (!string) {
	        return string;
	      }
	      if (guard ? isIterateeCall(value, chars, guard) : chars == null) {
	        return string.slice(0, trimmedRightIndex(string) + 1);
	      }
	      return string.slice(0, charsRightIndex(string, (chars + '')) + 1);
	    }

	    /**
	     * Truncates `string` if it is longer than the given maximum string length.
	     * The last characters of the truncated string are replaced with the omission
	     * string which defaults to "...".
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to truncate.
	     * @param {Object|number} [options] The options object or maximum string length.
	     * @param {number} [options.length=30] The maximum string length.
	     * @param {string} [options.omission='...'] The string to indicate text is omitted.
	     * @param {RegExp|string} [options.separator] The separator pattern to truncate to.
	     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
	     * @returns {string} Returns the truncated string.
	     * @example
	     *
	     * _.trunc('hi-diddly-ho there, neighborino');
	     * // => 'hi-diddly-ho there, neighbo...'
	     *
	     * _.trunc('hi-diddly-ho there, neighborino', 24);
	     * // => 'hi-diddly-ho there, n...'
	     *
	     * _.trunc('hi-diddly-ho there, neighborino', {
	     *   'length': 24,
	     *   'separator': ' '
	     * });
	     * // => 'hi-diddly-ho there,...'
	     *
	     * _.trunc('hi-diddly-ho there, neighborino', {
	     *   'length': 24,
	     *   'separator': /,? +/
	     * });
	     * // => 'hi-diddly-ho there...'
	     *
	     * _.trunc('hi-diddly-ho there, neighborino', {
	     *   'omission': ' [...]'
	     * });
	     * // => 'hi-diddly-ho there, neig [...]'
	     */
	    function trunc(string, options, guard) {
	      if (guard && isIterateeCall(string, options, guard)) {
	        options = null;
	      }
	      var length = DEFAULT_TRUNC_LENGTH,
	          omission = DEFAULT_TRUNC_OMISSION;

	      if (options != null) {
	        if (isObject(options)) {
	          var separator = 'separator' in options ? options.separator : separator;
	          length = 'length' in options ? (+options.length || 0) : length;
	          omission = 'omission' in options ? baseToString(options.omission) : omission;
	        } else {
	          length = +options || 0;
	        }
	      }
	      string = baseToString(string);
	      if (length >= string.length) {
	        return string;
	      }
	      var end = length - omission.length;
	      if (end < 1) {
	        return omission;
	      }
	      var result = string.slice(0, end);
	      if (separator == null) {
	        return result + omission;
	      }
	      if (isRegExp(separator)) {
	        if (string.slice(end).search(separator)) {
	          var match,
	              newEnd,
	              substring = string.slice(0, end);

	          if (!separator.global) {
	            separator = RegExp(separator.source, (reFlags.exec(separator) || '') + 'g');
	          }
	          separator.lastIndex = 0;
	          while ((match = separator.exec(substring))) {
	            newEnd = match.index;
	          }
	          result = result.slice(0, newEnd == null ? end : newEnd);
	        }
	      } else if (string.indexOf(separator, end) != end) {
	        var index = result.lastIndexOf(separator);
	        if (index > -1) {
	          result = result.slice(0, index);
	        }
	      }
	      return result + omission;
	    }

	    /**
	     * The inverse of `_.escape`; this method converts the HTML entities
	     * `&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;`, and `&#96;` in `string` to their
	     * corresponding characters.
	     *
	     * **Note:** No other HTML entities are unescaped. To unescape additional HTML
	     * entities use a third-party library like [_he_](https://mths.be/he).
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to unescape.
	     * @returns {string} Returns the unescaped string.
	     * @example
	     *
	     * _.unescape('fred, barney, &amp; pebbles');
	     * // => 'fred, barney, & pebbles'
	     */
	    function unescape(string) {
	      string = baseToString(string);
	      return (string && reHasEscapedHtml.test(string))
	        ? string.replace(reEscapedHtml, unescapeHtmlChar)
	        : string;
	    }

	    /**
	     * Splits `string` into an array of its words.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to inspect.
	     * @param {RegExp|string} [pattern] The pattern to match words.
	     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
	     * @returns {Array} Returns the words of `string`.
	     * @example
	     *
	     * _.words('fred, barney, & pebbles');
	     * // => ['fred', 'barney', 'pebbles']
	     *
	     * _.words('fred, barney, & pebbles', /[^, ]+/g);
	     * // => ['fred', 'barney', '&', 'pebbles']
	     */
	    function words(string, pattern, guard) {
	      if (guard && isIterateeCall(string, pattern, guard)) {
	        pattern = null;
	      }
	      string = baseToString(string);
	      return string.match(pattern || reWords) || [];
	    }

	    /*------------------------------------------------------------------------*/

	    /**
	     * Attempts to invoke `func`, returning either the result or the caught error
	     * object. Any additional arguments are provided to `func` when it is invoked.
	     *
	     * @static
	     * @memberOf _
	     * @category Utility
	     * @param {Function} func The function to attempt.
	     * @returns {*} Returns the `func` result or error object.
	     * @example
	     *
	     * // avoid throwing errors for invalid selectors
	     * var elements = _.attempt(function(selector) {
	     *   return document.querySelectorAll(selector);
	     * }, '>_>');
	     *
	     * if (_.isError(elements)) {
	     *   elements = [];
	     * }
	     */
	    var attempt = restParam(function(func, args) {
	      try {
	        return func.apply(undefined, args);
	      } catch(e) {
	        return isError(e) ? e : new Error(e);
	      }
	    });

	    /**
	     * Creates a function that invokes `func` with the `this` binding of `thisArg`
	     * and arguments of the created function. If `func` is a property name the
	     * created callback returns the property value for a given element. If `func`
	     * is an object the created callback returns `true` for elements that contain
	     * the equivalent object properties, otherwise it returns `false`.
	     *
	     * @static
	     * @memberOf _
	     * @alias iteratee
	     * @category Utility
	     * @param {*} [func=_.identity] The value to convert to a callback.
	     * @param {*} [thisArg] The `this` binding of `func`.
	     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
	     * @returns {Function} Returns the callback.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney', 'age': 36 },
	     *   { 'user': 'fred',   'age': 40 }
	     * ];
	     *
	     * // wrap to create custom callback shorthands
	     * _.callback = _.wrap(_.callback, function(callback, func, thisArg) {
	     *   var match = /^(.+?)__([gl]t)(.+)$/.exec(func);
	     *   if (!match) {
	     *     return callback(func, thisArg);
	     *   }
	     *   return function(object) {
	     *     return match[2] == 'gt'
	     *       ? object[match[1]] > match[3]
	     *       : object[match[1]] < match[3];
	     *   };
	     * });
	     *
	     * _.filter(users, 'age__gt36');
	     * // => [{ 'user': 'fred', 'age': 40 }]
	     */
	    function callback(func, thisArg, guard) {
	      if (guard && isIterateeCall(func, thisArg, guard)) {
	        thisArg = null;
	      }
	      return isObjectLike(func)
	        ? matches(func)
	        : baseCallback(func, thisArg);
	    }

	    /**
	     * Creates a function that returns `value`.
	     *
	     * @static
	     * @memberOf _
	     * @category Utility
	     * @param {*} value The value to return from the new function.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var object = { 'user': 'fred' };
	     * var getter = _.constant(object);
	     *
	     * getter() === object;
	     * // => true
	     */
	    function constant(value) {
	      return function() {
	        return value;
	      };
	    }

	    /**
	     * This method returns the first argument provided to it.
	     *
	     * @static
	     * @memberOf _
	     * @category Utility
	     * @param {*} value Any value.
	     * @returns {*} Returns `value`.
	     * @example
	     *
	     * var object = { 'user': 'fred' };
	     *
	     * _.identity(object) === object;
	     * // => true
	     */
	    function identity(value) {
	      return value;
	    }

	    /**
	     * Creates a function which performs a deep comparison between a given object
	     * and `source`, returning `true` if the given object has equivalent property
	     * values, else `false`.
	     *
	     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
	     * numbers, `Object` objects, regexes, and strings. Objects are compared by
	     * their own, not inherited, enumerable properties. For comparing a single
	     * own or inherited property value see `_.matchesProperty`.
	     *
	     * @static
	     * @memberOf _
	     * @category Utility
	     * @param {Object} source The object of property values to match.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney', 'age': 36, 'active': true },
	     *   { 'user': 'fred',   'age': 40, 'active': false }
	     * ];
	     *
	     * _.filter(users, _.matches({ 'age': 40, 'active': false }));
	     * // => [{ 'user': 'fred', 'age': 40, 'active': false }]
	     */
	    function matches(source) {
	      return baseMatches(baseClone(source, true));
	    }

	    /**
	     * Creates a function which compares the property value of `key` on a given
	     * object to `value`.
	     *
	     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
	     * numbers, `Object` objects, regexes, and strings. Objects are compared by
	     * their own, not inherited, enumerable properties.
	     *
	     * @static
	     * @memberOf _
	     * @category Utility
	     * @param {string} key The key of the property to get.
	     * @param {*} value The value to compare.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney' },
	     *   { 'user': 'fred' }
	     * ];
	     *
	     * _.find(users, _.matchesProperty('user', 'fred'));
	     * // => { 'user': 'fred' }
	     */
	    function matchesProperty(key, value) {
	      return baseMatchesProperty(key + '', baseClone(value, true));
	    }

	    /**
	     * Adds all own enumerable function properties of a source object to the
	     * destination object. If `object` is a function then methods are added to
	     * its prototype as well.
	     *
	     * **Note:** Use `_.runInContext` to create a pristine `lodash` function
	     * for mixins to avoid conflicts caused by modifying the original.
	     *
	     * @static
	     * @memberOf _
	     * @category Utility
	     * @param {Function|Object} [object=this] object The destination object.
	     * @param {Object} source The object of functions to add.
	     * @param {Object} [options] The options object.
	     * @param {boolean} [options.chain=true] Specify whether the functions added
	     *  are chainable.
	     * @returns {Function|Object} Returns `object`.
	     * @example
	     *
	     * function vowels(string) {
	     *   return _.filter(string, function(v) {
	     *     return /[aeiou]/i.test(v);
	     *   });
	     * }
	     *
	     * // use `_.runInContext` to avoid conflicts (esp. in Node.js)
	     * var _ = require('lodash').runInContext();
	     *
	     * _.mixin({ 'vowels': vowels });
	     * _.vowels('fred');
	     * // => ['e']
	     *
	     * _('fred').vowels().value();
	     * // => ['e']
	     *
	     * _.mixin({ 'vowels': vowels }, { 'chain': false });
	     * _('fred').vowels();
	     * // => ['e']
	     */
	    function mixin(object, source, options) {
	      if (options == null) {
	        var isObj = isObject(source),
	            props = isObj && keys(source),
	            methodNames = props && props.length && baseFunctions(source, props);

	        if (!(methodNames ? methodNames.length : isObj)) {
	          methodNames = false;
	          options = source;
	          source = object;
	          object = this;
	        }
	      }
	      if (!methodNames) {
	        methodNames = baseFunctions(source, keys(source));
	      }
	      var chain = true,
	          index = -1,
	          isFunc = isFunction(object),
	          length = methodNames.length;

	      if (options === false) {
	        chain = false;
	      } else if (isObject(options) && 'chain' in options) {
	        chain = options.chain;
	      }
	      while (++index < length) {
	        var methodName = methodNames[index],
	            func = source[methodName];

	        object[methodName] = func;
	        if (isFunc) {
	          object.prototype[methodName] = (function(func) {
	            return function() {
	              var chainAll = this.__chain__;
	              if (chain || chainAll) {
	                var result = object(this.__wrapped__),
	                    actions = result.__actions__ = arrayCopy(this.__actions__);

	                actions.push({ 'func': func, 'args': arguments, 'thisArg': object });
	                result.__chain__ = chainAll;
	                return result;
	              }
	              var args = [this.value()];
	              push.apply(args, arguments);
	              return func.apply(object, args);
	            };
	          }(func));
	        }
	      }
	      return object;
	    }

	    /**
	     * Reverts the `_` variable to its previous value and returns a reference to
	     * the `lodash` function.
	     *
	     * @static
	     * @memberOf _
	     * @category Utility
	     * @returns {Function} Returns the `lodash` function.
	     * @example
	     *
	     * var lodash = _.noConflict();
	     */
	    function noConflict() {
	      context._ = oldDash;
	      return this;
	    }

	    /**
	     * A no-operation function which returns `undefined` regardless of the
	     * arguments it receives.
	     *
	     * @static
	     * @memberOf _
	     * @category Utility
	     * @example
	     *
	     * var object = { 'user': 'fred' };
	     *
	     * _.noop(object) === undefined;
	     * // => true
	     */
	    function noop() {
	      // No operation performed.
	    }

	    /**
	     * Creates a function which returns the property value of `key` on a given object.
	     *
	     * @static
	     * @memberOf _
	     * @category Utility
	     * @param {string} key The key of the property to get.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'fred' },
	     *   { 'user': 'barney' }
	     * ];
	     *
	     * var getName = _.property('user');
	     *
	     * _.map(users, getName);
	     * // => ['fred', 'barney']
	     *
	     * _.pluck(_.sortBy(users, getName), 'user');
	     * // => ['barney', 'fred']
	     */
	    function property(key) {
	      return baseProperty(key + '');
	    }

	    /**
	     * The opposite of `_.property`; this method creates a function which returns
	     * the property value of a given key on `object`.
	     *
	     * @static
	     * @memberOf _
	     * @category Utility
	     * @param {Object} object The object to inspect.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var object = { 'a': 3, 'b': 1, 'c': 2 };
	     *
	     * _.map(['a', 'c'], _.propertyOf(object));
	     * // => [3, 2]
	     *
	     * _.sortBy(['a', 'b', 'c'], _.propertyOf(object));
	     * // => ['b', 'c', 'a']
	     */
	    function propertyOf(object) {
	      return function(key) {
	        return object == null ? undefined : object[key];
	      };
	    }

	    /**
	     * Creates an array of numbers (positive and/or negative) progressing from
	     * `start` up to, but not including, `end`. If `end` is not specified it is
	     * set to `start` with `start` then set to `0`. If `start` is less than `end`
	     * a zero-length range is created unless a negative `step` is specified.
	     *
	     * @static
	     * @memberOf _
	     * @category Utility
	     * @param {number} [start=0] The start of the range.
	     * @param {number} end The end of the range.
	     * @param {number} [step=1] The value to increment or decrement by.
	     * @returns {Array} Returns the new array of numbers.
	     * @example
	     *
	     * _.range(4);
	     * // => [0, 1, 2, 3]
	     *
	     * _.range(1, 5);
	     * // => [1, 2, 3, 4]
	     *
	     * _.range(0, 20, 5);
	     * // => [0, 5, 10, 15]
	     *
	     * _.range(0, -4, -1);
	     * // => [0, -1, -2, -3]
	     *
	     * _.range(1, 4, 0);
	     * // => [1, 1, 1]
	     *
	     * _.range(0);
	     * // => []
	     */
	    function range(start, end, step) {
	      if (step && isIterateeCall(start, end, step)) {
	        end = step = null;
	      }
	      start = +start || 0;
	      step = step == null ? 1 : (+step || 0);

	      if (end == null) {
	        end = start;
	        start = 0;
	      } else {
	        end = +end || 0;
	      }
	      // Use `Array(length)` so engines like Chakra and V8 avoid slower modes.
	      // See https://youtu.be/XAqIpGU8ZZk#t=17m25s for more details.
	      var index = -1,
	          length = nativeMax(ceil((end - start) / (step || 1)), 0),
	          result = Array(length);

	      while (++index < length) {
	        result[index] = start;
	        start += step;
	      }
	      return result;
	    }

	    /**
	     * Invokes the iteratee function `n` times, returning an array of the results
	     * of each invocation. The `iteratee` is bound to `thisArg` and invoked with
	     * one argument; (index).
	     *
	     * @static
	     * @memberOf _
	     * @category Utility
	     * @param {number} n The number of times to invoke `iteratee`.
	     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	     * @param {*} [thisArg] The `this` binding of `iteratee`.
	     * @returns {Array} Returns the array of results.
	     * @example
	     *
	     * var diceRolls = _.times(3, _.partial(_.random, 1, 6, false));
	     * // => [3, 6, 4]
	     *
	     * _.times(3, function(n) {
	     *   mage.castSpell(n);
	     * });
	     * // => invokes `mage.castSpell(n)` three times with `n` of `0`, `1`, and `2` respectively
	     *
	     * _.times(3, function(n) {
	     *   this.cast(n);
	     * }, mage);
	     * // => also invokes `mage.castSpell(n)` three times
	     */
	    function times(n, iteratee, thisArg) {
	      n = +n;

	      // Exit early to avoid a JSC JIT bug in Safari 8
	      // where `Array(0)` is treated as `Array(1)`.
	      if (n < 1 || !nativeIsFinite(n)) {
	        return [];
	      }
	      var index = -1,
	          result = Array(nativeMin(n, MAX_ARRAY_LENGTH));

	      iteratee = bindCallback(iteratee, thisArg, 1);
	      while (++index < n) {
	        if (index < MAX_ARRAY_LENGTH) {
	          result[index] = iteratee(index);
	        } else {
	          iteratee(index);
	        }
	      }
	      return result;
	    }

	    /**
	     * Generates a unique ID. If `prefix` is provided the ID is appended to it.
	     *
	     * @static
	     * @memberOf _
	     * @category Utility
	     * @param {string} [prefix] The value to prefix the ID with.
	     * @returns {string} Returns the unique ID.
	     * @example
	     *
	     * _.uniqueId('contact_');
	     * // => 'contact_104'
	     *
	     * _.uniqueId();
	     * // => '105'
	     */
	    function uniqueId(prefix) {
	      var id = ++idCounter;
	      return baseToString(prefix) + id;
	    }

	    /*------------------------------------------------------------------------*/

	    /**
	     * Adds two numbers.
	     *
	     * @static
	     * @memberOf _
	     * @category Math
	     * @param {number} augend The first number to add.
	     * @param {number} addend The second number to add.
	     * @returns {number} Returns the sum.
	     * @example
	     *
	     * _.add(6, 4);
	     * // => 10
	     */
	    function add(augend, addend) {
	      return augend + addend;
	    }

	    /**
	     * Gets the maximum value of `collection`. If `collection` is empty or falsey
	     * `-Infinity` is returned. If an iteratee function is provided it is invoked
	     * for each value in `collection` to generate the criterion by which the value
	     * is ranked. The `iteratee` is bound to `thisArg` and invoked with three
	     * arguments: (value, index, collection).
	     *
	     * If a property name is provided for `iteratee` the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If a value is also provided for `thisArg` the created `_.matchesProperty`
	     * style callback returns `true` for elements that have a matching property
	     * value, else `false`.
	     *
	     * If an object is provided for `iteratee` the created `_.matches` style
	     * callback returns `true` for elements that have the properties of the given
	     * object, else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Math
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [iteratee] The function invoked per iteration.
	     * @param {*} [thisArg] The `this` binding of `iteratee`.
	     * @returns {*} Returns the maximum value.
	     * @example
	     *
	     * _.max([4, 2, 8, 6]);
	     * // => 8
	     *
	     * _.max([]);
	     * // => -Infinity
	     *
	     * var users = [
	     *   { 'user': 'barney', 'age': 36 },
	     *   { 'user': 'fred',   'age': 40 }
	     * ];
	     *
	     * _.max(users, function(chr) {
	     *   return chr.age;
	     * });
	     * // => { 'user': 'fred', 'age': 40 }
	     *
	     * // using the `_.property` callback shorthand
	     * _.max(users, 'age');
	     * // => { 'user': 'fred', 'age': 40 }
	     */
	    var max = createExtremum(arrayMax);

	    /**
	     * Gets the minimum value of `collection`. If `collection` is empty or falsey
	     * `Infinity` is returned. If an iteratee function is provided it is invoked
	     * for each value in `collection` to generate the criterion by which the value
	     * is ranked. The `iteratee` is bound to `thisArg` and invoked with three
	     * arguments: (value, index, collection).
	     *
	     * If a property name is provided for `iteratee` the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If a value is also provided for `thisArg` the created `_.matchesProperty`
	     * style callback returns `true` for elements that have a matching property
	     * value, else `false`.
	     *
	     * If an object is provided for `iteratee` the created `_.matches` style
	     * callback returns `true` for elements that have the properties of the given
	     * object, else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Math
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [iteratee] The function invoked per iteration.
	     * @param {*} [thisArg] The `this` binding of `iteratee`.
	     * @returns {*} Returns the minimum value.
	     * @example
	     *
	     * _.min([4, 2, 8, 6]);
	     * // => 2
	     *
	     * _.min([]);
	     * // => Infinity
	     *
	     * var users = [
	     *   { 'user': 'barney', 'age': 36 },
	     *   { 'user': 'fred',   'age': 40 }
	     * ];
	     *
	     * _.min(users, function(chr) {
	     *   return chr.age;
	     * });
	     * // => { 'user': 'barney', 'age': 36 }
	     *
	     * // using the `_.property` callback shorthand
	     * _.min(users, 'age');
	     * // => { 'user': 'barney', 'age': 36 }
	     */
	    var min = createExtremum(arrayMin, true);

	    /**
	     * Gets the sum of the values in `collection`.
	     *
	     * @static
	     * @memberOf _
	     * @category Math
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [iteratee] The function invoked per iteration.
	     * @param {*} [thisArg] The `this` binding of `iteratee`.
	     * @returns {number} Returns the sum.
	     * @example
	     *
	     * _.sum([4, 6]);
	     * // => 10
	     *
	     * _.sum({ 'a': 4, 'b': 6 });
	     * // => 10
	     *
	     * var objects = [
	     *   { 'n': 4 },
	     *   { 'n': 6 }
	     * ];
	     *
	     * _.sum(objects, function(object) {
	     *   return object.n;
	     * });
	     * // => 10
	     *
	     * // using the `_.property` callback shorthand
	     * _.sum(objects, 'n');
	     * // => 10
	     */
	    function sum(collection, iteratee, thisArg) {
	      if (thisArg && isIterateeCall(collection, iteratee, thisArg)) {
	        iteratee = null;
	      }
	      var func = getCallback(),
	          noIteratee = iteratee == null;

	      if (!(func === baseCallback && noIteratee)) {
	        noIteratee = false;
	        iteratee = func(iteratee, thisArg, 3);
	      }
	      return noIteratee
	        ? arraySum(isArray(collection) ? collection : toIterable(collection))
	        : baseSum(collection, iteratee);
	    }

	    /*------------------------------------------------------------------------*/

	    // Ensure wrappers are instances of `baseLodash`.
	    lodash.prototype = baseLodash.prototype;

	    LodashWrapper.prototype = baseCreate(baseLodash.prototype);
	    LodashWrapper.prototype.constructor = LodashWrapper;

	    LazyWrapper.prototype = baseCreate(baseLodash.prototype);
	    LazyWrapper.prototype.constructor = LazyWrapper;

	    // Add functions to the `Map` cache.
	    MapCache.prototype['delete'] = mapDelete;
	    MapCache.prototype.get = mapGet;
	    MapCache.prototype.has = mapHas;
	    MapCache.prototype.set = mapSet;

	    // Add functions to the `Set` cache.
	    SetCache.prototype.push = cachePush;

	    // Assign cache to `_.memoize`.
	    memoize.Cache = MapCache;

	    // Add functions that return wrapped values when chaining.
	    lodash.after = after;
	    lodash.ary = ary;
	    lodash.assign = assign;
	    lodash.at = at;
	    lodash.before = before;
	    lodash.bind = bind;
	    lodash.bindAll = bindAll;
	    lodash.bindKey = bindKey;
	    lodash.callback = callback;
	    lodash.chain = chain;
	    lodash.chunk = chunk;
	    lodash.compact = compact;
	    lodash.constant = constant;
	    lodash.countBy = countBy;
	    lodash.create = create;
	    lodash.curry = curry;
	    lodash.curryRight = curryRight;
	    lodash.debounce = debounce;
	    lodash.defaults = defaults;
	    lodash.defer = defer;
	    lodash.delay = delay;
	    lodash.difference = difference;
	    lodash.drop = drop;
	    lodash.dropRight = dropRight;
	    lodash.dropRightWhile = dropRightWhile;
	    lodash.dropWhile = dropWhile;
	    lodash.fill = fill;
	    lodash.filter = filter;
	    lodash.flatten = flatten;
	    lodash.flattenDeep = flattenDeep;
	    lodash.flow = flow;
	    lodash.flowRight = flowRight;
	    lodash.forEach = forEach;
	    lodash.forEachRight = forEachRight;
	    lodash.forIn = forIn;
	    lodash.forInRight = forInRight;
	    lodash.forOwn = forOwn;
	    lodash.forOwnRight = forOwnRight;
	    lodash.functions = functions;
	    lodash.groupBy = groupBy;
	    lodash.indexBy = indexBy;
	    lodash.initial = initial;
	    lodash.intersection = intersection;
	    lodash.invert = invert;
	    lodash.invoke = invoke;
	    lodash.keys = keys;
	    lodash.keysIn = keysIn;
	    lodash.map = map;
	    lodash.mapValues = mapValues;
	    lodash.matches = matches;
	    lodash.matchesProperty = matchesProperty;
	    lodash.memoize = memoize;
	    lodash.merge = merge;
	    lodash.mixin = mixin;
	    lodash.negate = negate;
	    lodash.omit = omit;
	    lodash.once = once;
	    lodash.pairs = pairs;
	    lodash.partial = partial;
	    lodash.partialRight = partialRight;
	    lodash.partition = partition;
	    lodash.pick = pick;
	    lodash.pluck = pluck;
	    lodash.property = property;
	    lodash.propertyOf = propertyOf;
	    lodash.pull = pull;
	    lodash.pullAt = pullAt;
	    lodash.range = range;
	    lodash.rearg = rearg;
	    lodash.reject = reject;
	    lodash.remove = remove;
	    lodash.rest = rest;
	    lodash.restParam = restParam;
	    lodash.shuffle = shuffle;
	    lodash.slice = slice;
	    lodash.sortBy = sortBy;
	    lodash.sortByAll = sortByAll;
	    lodash.sortByOrder = sortByOrder;
	    lodash.spread = spread;
	    lodash.take = take;
	    lodash.takeRight = takeRight;
	    lodash.takeRightWhile = takeRightWhile;
	    lodash.takeWhile = takeWhile;
	    lodash.tap = tap;
	    lodash.throttle = throttle;
	    lodash.thru = thru;
	    lodash.times = times;
	    lodash.toArray = toArray;
	    lodash.toPlainObject = toPlainObject;
	    lodash.transform = transform;
	    lodash.union = union;
	    lodash.uniq = uniq;
	    lodash.unzip = unzip;
	    lodash.values = values;
	    lodash.valuesIn = valuesIn;
	    lodash.where = where;
	    lodash.without = without;
	    lodash.wrap = wrap;
	    lodash.xor = xor;
	    lodash.zip = zip;
	    lodash.zipObject = zipObject;

	    // Add aliases.
	    lodash.backflow = flowRight;
	    lodash.collect = map;
	    lodash.compose = flowRight;
	    lodash.each = forEach;
	    lodash.eachRight = forEachRight;
	    lodash.extend = assign;
	    lodash.iteratee = callback;
	    lodash.methods = functions;
	    lodash.object = zipObject;
	    lodash.select = filter;
	    lodash.tail = rest;
	    lodash.unique = uniq;

	    // Add functions to `lodash.prototype`.
	    mixin(lodash, lodash);

	    /*------------------------------------------------------------------------*/

	    // Add functions that return unwrapped values when chaining.
	    lodash.add = add;
	    lodash.attempt = attempt;
	    lodash.camelCase = camelCase;
	    lodash.capitalize = capitalize;
	    lodash.clone = clone;
	    lodash.cloneDeep = cloneDeep;
	    lodash.deburr = deburr;
	    lodash.endsWith = endsWith;
	    lodash.escape = escape;
	    lodash.escapeRegExp = escapeRegExp;
	    lodash.every = every;
	    lodash.find = find;
	    lodash.findIndex = findIndex;
	    lodash.findKey = findKey;
	    lodash.findLast = findLast;
	    lodash.findLastIndex = findLastIndex;
	    lodash.findLastKey = findLastKey;
	    lodash.findWhere = findWhere;
	    lodash.first = first;
	    lodash.has = has;
	    lodash.identity = identity;
	    lodash.includes = includes;
	    lodash.indexOf = indexOf;
	    lodash.inRange = inRange;
	    lodash.isArguments = isArguments;
	    lodash.isArray = isArray;
	    lodash.isBoolean = isBoolean;
	    lodash.isDate = isDate;
	    lodash.isElement = isElement;
	    lodash.isEmpty = isEmpty;
	    lodash.isEqual = isEqual;
	    lodash.isError = isError;
	    lodash.isFinite = isFinite;
	    lodash.isFunction = isFunction;
	    lodash.isMatch = isMatch;
	    lodash.isNaN = isNaN;
	    lodash.isNative = isNative;
	    lodash.isNull = isNull;
	    lodash.isNumber = isNumber;
	    lodash.isObject = isObject;
	    lodash.isPlainObject = isPlainObject;
	    lodash.isRegExp = isRegExp;
	    lodash.isString = isString;
	    lodash.isTypedArray = isTypedArray;
	    lodash.isUndefined = isUndefined;
	    lodash.kebabCase = kebabCase;
	    lodash.last = last;
	    lodash.lastIndexOf = lastIndexOf;
	    lodash.max = max;
	    lodash.min = min;
	    lodash.noConflict = noConflict;
	    lodash.noop = noop;
	    lodash.now = now;
	    lodash.pad = pad;
	    lodash.padLeft = padLeft;
	    lodash.padRight = padRight;
	    lodash.parseInt = parseInt;
	    lodash.random = random;
	    lodash.reduce = reduce;
	    lodash.reduceRight = reduceRight;
	    lodash.repeat = repeat;
	    lodash.result = result;
	    lodash.runInContext = runInContext;
	    lodash.size = size;
	    lodash.snakeCase = snakeCase;
	    lodash.some = some;
	    lodash.sortedIndex = sortedIndex;
	    lodash.sortedLastIndex = sortedLastIndex;
	    lodash.startCase = startCase;
	    lodash.startsWith = startsWith;
	    lodash.sum = sum;
	    lodash.template = template;
	    lodash.trim = trim;
	    lodash.trimLeft = trimLeft;
	    lodash.trimRight = trimRight;
	    lodash.trunc = trunc;
	    lodash.unescape = unescape;
	    lodash.uniqueId = uniqueId;
	    lodash.words = words;

	    // Add aliases.
	    lodash.all = every;
	    lodash.any = some;
	    lodash.contains = includes;
	    lodash.detect = find;
	    lodash.foldl = reduce;
	    lodash.foldr = reduceRight;
	    lodash.head = first;
	    lodash.include = includes;
	    lodash.inject = reduce;

	    mixin(lodash, (function() {
	      var source = {};
	      baseForOwn(lodash, function(func, methodName) {
	        if (!lodash.prototype[methodName]) {
	          source[methodName] = func;
	        }
	      });
	      return source;
	    }()), false);

	    /*------------------------------------------------------------------------*/

	    // Add functions capable of returning wrapped and unwrapped values when chaining.
	    lodash.sample = sample;

	    lodash.prototype.sample = function(n) {
	      if (!this.__chain__ && n == null) {
	        return sample(this.value());
	      }
	      return this.thru(function(value) {
	        return sample(value, n);
	      });
	    };

	    /*------------------------------------------------------------------------*/

	    /**
	     * The semantic version number.
	     *
	     * @static
	     * @memberOf _
	     * @type string
	     */
	    lodash.VERSION = VERSION;

	    // Assign default placeholders.
	    arrayEach(['bind', 'bindKey', 'curry', 'curryRight', 'partial', 'partialRight'], function(methodName) {
	      lodash[methodName].placeholder = lodash;
	    });

	    // Add `LazyWrapper` methods that accept an `iteratee` value.
	    arrayEach(['dropWhile', 'filter', 'map', 'takeWhile'], function(methodName, type) {
	      var isFilter = type != LAZY_MAP_FLAG,
	          isDropWhile = type == LAZY_DROP_WHILE_FLAG;

	      LazyWrapper.prototype[methodName] = function(iteratee, thisArg) {
	        var filtered = this.__filtered__,
	            result = (filtered && isDropWhile) ? new LazyWrapper(this) : this.clone(),
	            iteratees = result.__iteratees__ || (result.__iteratees__ = []);

	        iteratees.push({
	          'done': false,
	          'count': 0,
	          'index': 0,
	          'iteratee': getCallback(iteratee, thisArg, 1),
	          'limit': -1,
	          'type': type
	        });

	        result.__filtered__ = filtered || isFilter;
	        return result;
	      };
	    });

	    // Add `LazyWrapper` methods for `_.drop` and `_.take` variants.
	    arrayEach(['drop', 'take'], function(methodName, index) {
	      var whileName = methodName + 'While';

	      LazyWrapper.prototype[methodName] = function(n) {
	        var filtered = this.__filtered__,
	            result = (filtered && !index) ? this.dropWhile() : this.clone();

	        n = n == null ? 1 : nativeMax(floor(n) || 0, 0);
	        if (filtered) {
	          if (index) {
	            result.__takeCount__ = nativeMin(result.__takeCount__, n);
	          } else {
	            last(result.__iteratees__).limit = n;
	          }
	        } else {
	          var views = result.__views__ || (result.__views__ = []);
	          views.push({ 'size': n, 'type': methodName + (result.__dir__ < 0 ? 'Right' : '') });
	        }
	        return result;
	      };

	      LazyWrapper.prototype[methodName + 'Right'] = function(n) {
	        return this.reverse()[methodName](n).reverse();
	      };

	      LazyWrapper.prototype[methodName + 'RightWhile'] = function(predicate, thisArg) {
	        return this.reverse()[whileName](predicate, thisArg).reverse();
	      };
	    });

	    // Add `LazyWrapper` methods for `_.first` and `_.last`.
	    arrayEach(['first', 'last'], function(methodName, index) {
	      var takeName = 'take' + (index ? 'Right' : '');

	      LazyWrapper.prototype[methodName] = function() {
	        return this[takeName](1).value()[0];
	      };
	    });

	    // Add `LazyWrapper` methods for `_.initial` and `_.rest`.
	    arrayEach(['initial', 'rest'], function(methodName, index) {
	      var dropName = 'drop' + (index ? '' : 'Right');

	      LazyWrapper.prototype[methodName] = function() {
	        return this[dropName](1);
	      };
	    });

	    // Add `LazyWrapper` methods for `_.pluck` and `_.where`.
	    arrayEach(['pluck', 'where'], function(methodName, index) {
	      var operationName = index ? 'filter' : 'map',
	          createCallback = index ? baseMatches : baseProperty;

	      LazyWrapper.prototype[methodName] = function(value) {
	        return this[operationName](createCallback(value));
	      };
	    });

	    LazyWrapper.prototype.compact = function() {
	      return this.filter(identity);
	    };

	    LazyWrapper.prototype.reject = function(predicate, thisArg) {
	      predicate = getCallback(predicate, thisArg, 1);
	      return this.filter(function(value) {
	        return !predicate(value);
	      });
	    };

	    LazyWrapper.prototype.slice = function(start, end) {
	      start = start == null ? 0 : (+start || 0);
	      var result = start < 0 ? this.takeRight(-start) : this.drop(start);

	      if (typeof end != 'undefined') {
	        end = (+end || 0);
	        result = end < 0 ? result.dropRight(-end) : result.take(end - start);
	      }
	      return result;
	    };

	    LazyWrapper.prototype.toArray = function() {
	      return this.drop(0);
	    };

	    // Add `LazyWrapper` methods to `lodash.prototype`.
	    baseForOwn(LazyWrapper.prototype, function(func, methodName) {
	      var lodashFunc = lodash[methodName];
	      if (!lodashFunc) {
	        return;
	      }
	      var checkIteratee = /^(?:filter|map|reject)|While$/.test(methodName),
	          retUnwrapped = /^(?:first|last)$/.test(methodName);

	      lodash.prototype[methodName] = function() {
	        var args = arguments,
	            length = args.length,
	            chainAll = this.__chain__,
	            value = this.__wrapped__,
	            isHybrid = !!this.__actions__.length,
	            isLazy = value instanceof LazyWrapper,
	            iteratee = args[0],
	            useLazy = isLazy || isArray(value);

	        if (useLazy && checkIteratee && typeof iteratee == 'function' && iteratee.length != 1) {
	          // avoid lazy use if the iteratee has a `length` other than `1`
	          isLazy = useLazy = false;
	        }
	        var onlyLazy = isLazy && !isHybrid;
	        if (retUnwrapped && !chainAll) {
	          return onlyLazy
	            ? func.call(value)
	            : lodashFunc.call(lodash, this.value());
	        }
	        var interceptor = function(value) {
	          var otherArgs = [value];
	          push.apply(otherArgs, args);
	          return lodashFunc.apply(lodash, otherArgs);
	        };
	        if (useLazy) {
	          var wrapper = onlyLazy ? value : new LazyWrapper(this),
	              result = func.apply(wrapper, args);

	          if (!retUnwrapped && (isHybrid || result.__actions__)) {
	            var actions = result.__actions__ || (result.__actions__ = []);
	            actions.push({ 'func': thru, 'args': [interceptor], 'thisArg': lodash });
	          }
	          return new LodashWrapper(result, chainAll);
	        }
	        return this.thru(interceptor);
	      };
	    });

	    // Add `Array` and `String` methods to `lodash.prototype`.
	    arrayEach(['concat', 'join', 'pop', 'push', 'replace', 'shift', 'sort', 'splice', 'split', 'unshift'], function(methodName) {
	      var func = (/^(?:replace|split)$/.test(methodName) ? stringProto : arrayProto)[methodName],
	          chainName = /^(?:push|sort|unshift)$/.test(methodName) ? 'tap' : 'thru',
	          retUnwrapped = /^(?:join|pop|replace|shift)$/.test(methodName);

	      lodash.prototype[methodName] = function() {
	        var args = arguments;
	        if (retUnwrapped && !this.__chain__) {
	          return func.apply(this.value(), args);
	        }
	        return this[chainName](function(value) {
	          return func.apply(value, args);
	        });
	      };
	    });

	    // Map minified function names to their real names.
	    baseForOwn(LazyWrapper.prototype, function(func, methodName) {
	      var lodashFunc = lodash[methodName];
	      if (lodashFunc) {
	        var key = lodashFunc.name,
	            names = realNames[key] || (realNames[key] = []);

	        names.push({ 'name': methodName, 'func': lodashFunc });
	      }
	    });

	    realNames[createHybridWrapper(null, BIND_KEY_FLAG).name] = [{ 'name': 'wrapper', 'func': null }];

	    // Add functions to the lazy wrapper.
	    LazyWrapper.prototype.clone = lazyClone;
	    LazyWrapper.prototype.reverse = lazyReverse;
	    LazyWrapper.prototype.value = lazyValue;

	    // Add chaining functions to the `lodash` wrapper.
	    lodash.prototype.chain = wrapperChain;
	    lodash.prototype.commit = wrapperCommit;
	    lodash.prototype.plant = wrapperPlant;
	    lodash.prototype.reverse = wrapperReverse;
	    lodash.prototype.toString = wrapperToString;
	    lodash.prototype.run = lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = wrapperValue;

	    // Add function aliases to the `lodash` wrapper.
	    lodash.prototype.collect = lodash.prototype.map;
	    lodash.prototype.head = lodash.prototype.first;
	    lodash.prototype.select = lodash.prototype.filter;
	    lodash.prototype.tail = lodash.prototype.rest;

	    return lodash;
	  }

	  /*--------------------------------------------------------------------------*/

	  // Export lodash.
	  var _ = runInContext();

	  // Some AMD build optimizers like r.js check for condition patterns like the following:
	  if (true) {
	    // Expose lodash to the global object when an AMD loader is present to avoid
	    // errors in cases where lodash is loaded by a script tag and not intended
	    // as an AMD module. See http://requirejs.org/docs/errors.html#mismatch for
	    // more details.
	    root._ = _;

	    // Define as an anonymous module so, through path mapping, it can be
	    // referenced as the "underscore" module.
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	      return _;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }
	  // Check for `exports` after `define` in case a build optimizer adds an `exports` object.
	  else if (freeExports && freeModule) {
	    // Export for Node.js or RingoJS.
	    if (moduleExports) {
	      (freeModule.exports = _)._ = _;
	    }
	    // Export for Narwhal or Rhino -require.
	    else {
	      freeExports._ = _;
	    }
	  }
	  else {
	    // Export for a browser or Rhino.
	    root._ = _;
	  }
	}.call(this));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(26)(module), (function() { return this; }())))

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * An asynchronous local file system API, based on a subset
	 * of the `narwhal/fs` API and the `narwhal/promise` API,
	 * such that the method names are the same but some return
	 * values are promises instead of fully resolved values.
	 * @module
	 */

	/*whatsupdoc*/

	var FS = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())); // node
	var Q = __webpack_require__(9);
	var Reader = __webpack_require__(21);
	var Writer = __webpack_require__(22);
	var Common = __webpack_require__(23);
	var Mock = __webpack_require__(24);
	var Root = __webpack_require__(25);

	Common.update(exports, process.cwd);
	exports.Mock = Mock;
	exports.Root = Root;

	// facilitates AIMD (additive increase, multiplicative decrease) for backing off
	var backOffDelay = 0;
	var backOffFactor = 1.0001;
	function dampen(wrapped, thisp) {
	    var retry = function () {
	        var args = arguments;
	        var ready = backOffDelay ? Q.delay(backOffDelay) : Q.resolve();
	        return ready.then(function () {
	            return Q.when(wrapped.apply(thisp, args), function (stream) {
	                backOffDelay = Math.max(0, backOffDelay - 1);
	                return stream;
	            }, function (error) {
	                if (error.code === "EMFILE") {
	                    backOffDelay = (backOffDelay + 1) * backOffFactor;
	                    return retry.apply(null, args);
	                } else {
	                    throw error;
	                }
	            });
	        });
	    };
	    return retry;
	}

	/**
	 * @param {String} path
	 * @param {Object} options (flags, mode, bufferSize, charset, begin, end)
	 * @returns {Promise * Stream} a stream from the `q-io` module.
	 */
	exports.open = dampen(function (path, flags, charset, options) {
	    var self = this;
	    if (typeof flags == "object") {
	        options = flags;
	        flags = options.flags;
	        charset = options.charset;
	    }
	    options = options || {};
	    flags = flags || "r";
	    var nodeFlags = flags.replace(/b/g, "") || "r";
	    var nodeOptions = {
	        "flags": nodeFlags
	    };
	    if ("bufferSize" in options) {
	        nodeOptions.bufferSize = options.bufferSize;
	    }
	    if ("mode" in options) {
	        nodeOptions.mode = options.mode;
	    }
	    if ("begin" in options) {
	        nodeOptions.start = options.begin;
	        nodeOptions.end = options.end - 1;
	    }
	    if (flags.indexOf("b") >= 0) {
	        if (charset) {
	            throw new Error("Can't open a binary file with a charset: " + charset);
	        }
	    } else {
	        charset = charset || 'utf-8';
	    }
	    if (flags.indexOf("w") >= 0 || flags.indexOf("a") >= 0) {
	        var stream = FS.createWriteStream(String(path), nodeOptions);
	        return Writer(stream, charset);
	    } else {
	        var stream = FS.createReadStream(String(path), nodeOptions);
	        return Reader(stream, charset);
	    }
	});

	exports.remove = function (path) {
	    path = String(path);
	    var done = Q.defer();
	    FS.unlink(path, function (error) {
	        if (error) {
	            error.message = "Can't remove " + JSON.stringify(path) + ": " + error.message;
	            done.reject(error);
	        } else {
	            done.resolve();
	        }
	    });
	    return done.promise;
	};

	exports.rename = function (source, target) {
	    source = String(source);
	    target = String(target);
	    return Q.ninvoke(FS, "rename", source, target)
	    .fail(function (error) {
	        if (error.code === "EXDEV") {
	            error.message = "source and target are on different devices: " + error.message;
	            error.crossDevice = true;
	        }
	        error.message = (
	            "Can't move " + JSON.stringify(source) + " to " +
	            JSON.stringify(target) + " because " + error.message
	        );
	        throw error;
	    });
	};

	exports.makeDirectory = function (path, mode) {
	    path = String(path);
	    var done = Q.defer();
	    if (typeof mode === "string") {
	        mode = parseInt(mode, 8);
	    } else if (mode === void 0) {
	        mode = parseInt('755', 8);
	    }
	    FS.mkdir(path, mode, function (error) {
	        if (error) {
	            if (error.code === "EISDIR") {
	                error.exists = true;
	                error.isDirectory = true;
	                error.message = "directory already exists: " + error.message;
	            }
	            if (error.code === "EEXIST") {
	                error.exists = true;
	                error.message = "file exists at that path: " + error.message;
	            }
	            error.message = "Can't makeDirectory " + JSON.stringify(path) + " with mode " + mode + ": " + error.message;
	            done.reject(error);
	        } else {
	            done.resolve();
	        }
	    });
	    return done.promise;
	};

	exports.removeDirectory = function (path) {
	    path = String(path);
	    var done = Q.defer();
	    FS.rmdir(path, function (error) {
	        if (error) {
	            error.message = "Can't removeDirectory " + JSON.stringify(path) + ": " + error.message;
	            done.reject(error);
	        } else {
	            done.resolve();
	        }
	    });
	    return done.promise;
	};

	/**
	 */
	exports.list = dampen(function (path) {
	    path = String(path);
	    var result = Q.defer();
	    FS.readdir(path, function (error, list) {
	        if (error) {
	            error.message = "Can't list " + JSON.stringify(path) + ": " + error.message;
	            return result.reject(error);
	        } else {
	            result.resolve(list);
	        }
	    });
	    return result.promise;
	});

	/**
	 * @param {String} path
	 * @returns {Promise * Stat}
	 */
	exports.stat = function (path) {
	    var self = this;
	    path = String(path);
	    var done = Q.defer();
	    try {
	        FS.stat(path, function (error, stat) {
	            if (error) {
	                error.message = "Can't stat " + JSON.stringify(path) + ": " + error;
	                done.reject(error);
	            } else {
	                done.resolve(new self.Stats(stat));
	            }
	        });
	    } catch (error) {
	        done.reject(error);
	    }
	    return done.promise;
	};

	exports.statLink = function (path) {
	    path = String(path);
	    var done = Q.defer();
	    try {
	        FS.lstat(path, function (error, stat) {
	            if (error) {
	                error.message = "Can't statLink " + JSON.stringify(path) + ": " + error.message;
	                done.reject(error);
	            } else {
	                done.resolve(stat);
	            }
	        });
	    } catch (error) {
	        done.reject(error);
	    }
	    return done.promise;
	};

	exports.statFd = function (fd) {
	    fd = Number(fd);
	    var done = Q.defer();
	    try {
	        FS.fstat(fd, function (error, stat) {
	            if (error) {
	                error.message = "Can't statFd file descriptor " + JSON.stringify(fd) + ": " + error.message;
	                done.reject(error);
	            } else {
	                done.resolve(stat);
	            }
	        });
	    } catch (error) {
	        done.reject(error);
	    }
	    return done.promise;
	};

	exports.link = function (source, target) {
	    source = String(source);
	    target = String(target);
	    var done = Q.defer();
	    try {
	        FS.link(source, target, function (error) {
	            if (error) {
	                error.message = "Can't link " + JSON.stringify(source) + " to " + JSON.stringify(target) + ": " + error.message;
	                done.reject(error);
	            } else {
	                done.resolve();
	            }
	        });
	    } catch (error) {
	        done.reject(error);
	    }
	    return done.promise;
	};

	// this lookup table translates the link types that Q-IO accepts (which have
	// been normalized to full words to be consistent with the naming convention)
	var linkTypes = {
	    "file": "file",
	    "directory": "dir",
	    "junction": "junction"
	};

	exports.symbolicLink = function (target, relative, type) {
	    if (!linkTypes.hasOwnProperty(type)) {
	        console.warn(new Error("For Windows compatibility, symbolicLink must be called with a type argument \"file\", \"directory\", or \"junction\""));
	    }
	    type = linkTypes[type];
	    target = String(target);
	    relative = String(relative);
	    var done = Q.defer();
	    try {
	        FS.symlink(relative, target, type || 'file', function (error) {
	            if (error) {
	                error.message = "Can't create symbolicLink " + JSON.stringify(target) + " to relative location " + JSON.stringify(relative) + ": " + error.message;
	                done.reject(error);
	            } else {
	                done.resolve();
	            }
	        });
	    } catch (error) {
	        done.reject(error);
	    }
	    return done.promise;
	};

	exports.chown = function (path, uid, gid) {
	    path = String(path);
	    var done = Q.defer();
	    try {
	        FS.chown(path, uid, gid, function (error) {
	            if (error) {
	                error.message = "Can't chown (change owner) of " + JSON.stringify(path) + " to user " + JSON.stringify(uid) + " and group " + JSON.stringify(gid) + ": " + error.message;
	                done.reject(error);
	            } else {
	                done.resolve();
	            }
	        });
	    } catch (error) {
	        done.reject(error);
	    }
	    return done.promise;
	};

	exports.chmod = function (path, mode) {
	    path = String(path);
	    mode = String(mode);
	    var done = Q.defer();
	    try {
	        FS.chmod(path, mode, function (error) {
	            if (error) {
	                error.message = "Can't chmod (change permissions mode) of " + JSON.stringify(path) + " to (octal number) " + mode.toString(8) + ": " + error.message;
	                done.reject(error);
	            } else {
	                done.resolve();
	            }
	        });
	    } catch (error) {
	        done.reject(error);
	    }
	    return done.promise;
	};

	exports.canonical = function (path) {
	    var result = Q.defer();
	    FS.realpath(path, function (error, canonicalPath) {
	        if (error) {
	            error.message = "Can't get canonical path of " + JSON.stringify(path) + " by way of C realpath: " + error.message;
	            result.reject(error);
	        } else {
	            result.resolve(canonicalPath);
	        }
	    });
	    return result.promise;
	};

	exports.readLink = function (path) {
	    var result = Q.defer();
	    FS.readlink(path, function (error, path) {
	        if (error) {
	            error.message = "Can't get link from " + JSON.stringify(path) + " by way of C readlink: " + error.message;
	            result.reject(error);
	        } else {
	            result.resolve(path);
	        }
	    });
	    return result.promise;
	};

	exports.mock = function (path) {
	    return Mock.mock(this, path);
	};


	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, setImmediate) {// vim:ts=4:sts=4:sw=4:
	/*!
	 *
	 * Copyright 2009-2012 Kris Kowal under the terms of the MIT
	 * license found at http://github.com/kriskowal/q/raw/master/LICENSE
	 *
	 * With parts by Tyler Close
	 * Copyright 2007-2009 Tyler Close under the terms of the MIT X license found
	 * at http://www.opensource.org/licenses/mit-license.html
	 * Forked at ref_send.js version: 2009-05-11
	 *
	 * With parts by Mark Miller
	 * Copyright (C) 2011 Google Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 *
	 */

	(function (definition) {
	    "use strict";

	    // This file will function properly as a <script> tag, or a module
	    // using CommonJS and NodeJS or RequireJS module formats.  In
	    // Common/Node/RequireJS, the module exports the Q API and when
	    // executed as a simple <script>, it creates a Q global instead.

	    // Montage Require
	    if (typeof bootstrap === "function") {
	        bootstrap("promise", definition);

	    // CommonJS
	    } else if (true) {
	        module.exports = definition();

	    // RequireJS
	    } else if (typeof define === "function" && define.amd) {
	        define(definition);

	    // SES (Secure EcmaScript)
	    } else if (typeof ses !== "undefined") {
	        if (!ses.ok()) {
	            return;
	        } else {
	            ses.makeQ = definition;
	        }

	    // <script>
	    } else if (typeof self !== "undefined") {
	        self.Q = definition();

	    } else {
	        throw new Error("This environment was not anticipated by Q. Please file a bug.");
	    }

	})(function () {
	"use strict";

	var hasStacks = false;
	try {
	    throw new Error();
	} catch (e) {
	    hasStacks = !!e.stack;
	}

	// All code after this point will be filtered from stack traces reported
	// by Q.
	var qStartingLine = captureLine();
	var qFileName;

	// shims

	// used for fallback in "allResolved"
	var noop = function () {};

	// Use the fastest possible means to execute a task in a future turn
	// of the event loop.
	var nextTick =(function () {
	    // linked list of tasks (single, with head node)
	    var head = {task: void 0, next: null};
	    var tail = head;
	    var flushing = false;
	    var requestTick = void 0;
	    var isNodeJS = false;

	    function flush() {
	        /* jshint loopfunc: true */

	        while (head.next) {
	            head = head.next;
	            var task = head.task;
	            head.task = void 0;
	            var domain = head.domain;

	            if (domain) {
	                head.domain = void 0;
	                domain.enter();
	            }

	            try {
	                task();

	            } catch (e) {
	                if (isNodeJS) {
	                    // In node, uncaught exceptions are considered fatal errors.
	                    // Re-throw them synchronously to interrupt flushing!

	                    // Ensure continuation if the uncaught exception is suppressed
	                    // listening "uncaughtException" events (as domains does).
	                    // Continue in next event to avoid tick recursion.
	                    if (domain) {
	                        domain.exit();
	                    }
	                    setTimeout(flush, 0);
	                    if (domain) {
	                        domain.enter();
	                    }

	                    throw e;

	                } else {
	                    // In browsers, uncaught exceptions are not fatal.
	                    // Re-throw them asynchronously to avoid slow-downs.
	                    setTimeout(function() {
	                       throw e;
	                    }, 0);
	                }
	            }

	            if (domain) {
	                domain.exit();
	            }
	        }

	        flushing = false;
	    }

	    nextTick = function (task) {
	        tail = tail.next = {
	            task: task,
	            domain: isNodeJS && process.domain,
	            next: null
	        };

	        if (!flushing) {
	            flushing = true;
	            requestTick();
	        }
	    };

	    if (typeof process !== "undefined" && process.nextTick) {
	        // Node.js before 0.9. Note that some fake-Node environments, like the
	        // Mocha test runner, introduce a `process` global without a `nextTick`.
	        isNodeJS = true;

	        requestTick = function () {
	            process.nextTick(flush);
	        };

	    } else if (typeof setImmediate === "function") {
	        // In IE10, Node.js 0.9+, or https://github.com/NobleJS/setImmediate
	        if (typeof window !== "undefined") {
	            requestTick = setImmediate.bind(window, flush);
	        } else {
	            requestTick = function () {
	                setImmediate(flush);
	            };
	        }

	    } else if (typeof MessageChannel !== "undefined") {
	        // modern browsers
	        // http://www.nonblocking.io/2011/06/windownexttick.html
	        var channel = new MessageChannel();
	        // At least Safari Version 6.0.5 (8536.30.1) intermittently cannot create
	        // working message ports the first time a page loads.
	        channel.port1.onmessage = function () {
	            requestTick = requestPortTick;
	            channel.port1.onmessage = flush;
	            flush();
	        };
	        var requestPortTick = function () {
	            // Opera requires us to provide a message payload, regardless of
	            // whether we use it.
	            channel.port2.postMessage(0);
	        };
	        requestTick = function () {
	            setTimeout(flush, 0);
	            requestPortTick();
	        };

	    } else {
	        // old browsers
	        requestTick = function () {
	            setTimeout(flush, 0);
	        };
	    }

	    return nextTick;
	})();

	// Attempt to make generics safe in the face of downstream
	// modifications.
	// There is no situation where this is necessary.
	// If you need a security guarantee, these primordials need to be
	// deeply frozen anyway, and if you don’t need a security guarantee,
	// this is just plain paranoid.
	// However, this **might** have the nice side-effect of reducing the size of
	// the minified code by reducing x.call() to merely x()
	// See Mark Miller’s explanation of what this does.
	// http://wiki.ecmascript.org/doku.php?id=conventions:safe_meta_programming
	var call = Function.call;
	function uncurryThis(f) {
	    return function () {
	        return call.apply(f, arguments);
	    };
	}
	// This is equivalent, but slower:
	// uncurryThis = Function_bind.bind(Function_bind.call);
	// http://jsperf.com/uncurrythis

	var array_slice = uncurryThis(Array.prototype.slice);

	var array_reduce = uncurryThis(
	    Array.prototype.reduce || function (callback, basis) {
	        var index = 0,
	            length = this.length;
	        // concerning the initial value, if one is not provided
	        if (arguments.length === 1) {
	            // seek to the first value in the array, accounting
	            // for the possibility that is is a sparse array
	            do {
	                if (index in this) {
	                    basis = this[index++];
	                    break;
	                }
	                if (++index >= length) {
	                    throw new TypeError();
	                }
	            } while (1);
	        }
	        // reduce
	        for (; index < length; index++) {
	            // account for the possibility that the array is sparse
	            if (index in this) {
	                basis = callback(basis, this[index], index);
	            }
	        }
	        return basis;
	    }
	);

	var array_indexOf = uncurryThis(
	    Array.prototype.indexOf || function (value) {
	        // not a very good shim, but good enough for our one use of it
	        for (var i = 0; i < this.length; i++) {
	            if (this[i] === value) {
	                return i;
	            }
	        }
	        return -1;
	    }
	);

	var array_map = uncurryThis(
	    Array.prototype.map || function (callback, thisp) {
	        var self = this;
	        var collect = [];
	        array_reduce(self, function (undefined, value, index) {
	            collect.push(callback.call(thisp, value, index, self));
	        }, void 0);
	        return collect;
	    }
	);

	var object_create = Object.create || function (prototype) {
	    function Type() { }
	    Type.prototype = prototype;
	    return new Type();
	};

	var object_hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty);

	var object_keys = Object.keys || function (object) {
	    var keys = [];
	    for (var key in object) {
	        if (object_hasOwnProperty(object, key)) {
	            keys.push(key);
	        }
	    }
	    return keys;
	};

	var object_toString = uncurryThis(Object.prototype.toString);

	function isObject(value) {
	    return value === Object(value);
	}

	// generator related shims

	// FIXME: Remove this function once ES6 generators are in SpiderMonkey.
	function isStopIteration(exception) {
	    return (
	        object_toString(exception) === "[object StopIteration]" ||
	        exception instanceof QReturnValue
	    );
	}

	// FIXME: Remove this helper and Q.return once ES6 generators are in
	// SpiderMonkey.
	var QReturnValue;
	if (typeof ReturnValue !== "undefined") {
	    QReturnValue = ReturnValue;
	} else {
	    QReturnValue = function (value) {
	        this.value = value;
	    };
	}

	// long stack traces

	var STACK_JUMP_SEPARATOR = "From previous event:";

	function makeStackTraceLong(error, promise) {
	    // If possible, transform the error stack trace by removing Node and Q
	    // cruft, then concatenating with the stack trace of `promise`. See #57.
	    if (hasStacks &&
	        promise.stack &&
	        typeof error === "object" &&
	        error !== null &&
	        error.stack &&
	        error.stack.indexOf(STACK_JUMP_SEPARATOR) === -1
	    ) {
	        var stacks = [];
	        for (var p = promise; !!p; p = p.source) {
	            if (p.stack) {
	                stacks.unshift(p.stack);
	            }
	        }
	        stacks.unshift(error.stack);

	        var concatedStacks = stacks.join("\n" + STACK_JUMP_SEPARATOR + "\n");
	        error.stack = filterStackString(concatedStacks);
	    }
	}

	function filterStackString(stackString) {
	    var lines = stackString.split("\n");
	    var desiredLines = [];
	    for (var i = 0; i < lines.length; ++i) {
	        var line = lines[i];

	        if (!isInternalFrame(line) && !isNodeFrame(line) && line) {
	            desiredLines.push(line);
	        }
	    }
	    return desiredLines.join("\n");
	}

	function isNodeFrame(stackLine) {
	    return stackLine.indexOf("(module.js:") !== -1 ||
	           stackLine.indexOf("(node.js:") !== -1;
	}

	function getFileNameAndLineNumber(stackLine) {
	    // Named functions: "at functionName (filename:lineNumber:columnNumber)"
	    // In IE10 function name can have spaces ("Anonymous function") O_o
	    var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
	    if (attempt1) {
	        return [attempt1[1], Number(attempt1[2])];
	    }

	    // Anonymous functions: "at filename:lineNumber:columnNumber"
	    var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
	    if (attempt2) {
	        return [attempt2[1], Number(attempt2[2])];
	    }

	    // Firefox style: "function@filename:lineNumber or @filename:lineNumber"
	    var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
	    if (attempt3) {
	        return [attempt3[1], Number(attempt3[2])];
	    }
	}

	function isInternalFrame(stackLine) {
	    var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);

	    if (!fileNameAndLineNumber) {
	        return false;
	    }

	    var fileName = fileNameAndLineNumber[0];
	    var lineNumber = fileNameAndLineNumber[1];

	    return fileName === qFileName &&
	        lineNumber >= qStartingLine &&
	        lineNumber <= qEndingLine;
	}

	// discover own file name and line number range for filtering stack
	// traces
	function captureLine() {
	    if (!hasStacks) {
	        return;
	    }

	    try {
	        throw new Error();
	    } catch (e) {
	        var lines = e.stack.split("\n");
	        var firstLine = lines[0].indexOf("@") > 0 ? lines[1] : lines[2];
	        var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
	        if (!fileNameAndLineNumber) {
	            return;
	        }

	        qFileName = fileNameAndLineNumber[0];
	        return fileNameAndLineNumber[1];
	    }
	}

	function deprecate(callback, name, alternative) {
	    return function () {
	        if (typeof console !== "undefined" &&
	            typeof console.warn === "function") {
	            console.warn(name + " is deprecated, use " + alternative +
	                         " instead.", new Error("").stack);
	        }
	        return callback.apply(callback, arguments);
	    };
	}

	// end of shims
	// beginning of real work

	/**
	 * Constructs a promise for an immediate reference, passes promises through, or
	 * coerces promises from different systems.
	 * @param value immediate reference or promise
	 */
	function Q(value) {
	    // If the object is already a Promise, return it directly.  This enables
	    // the resolve function to both be used to created references from objects,
	    // but to tolerably coerce non-promises to promises.
	    if (value instanceof Promise) {
	        return value;
	    }

	    // assimilate thenables
	    if (isPromiseAlike(value)) {
	        return coerce(value);
	    } else {
	        return fulfill(value);
	    }
	}
	Q.resolve = Q;

	/**
	 * Performs a task in a future turn of the event loop.
	 * @param {Function} task
	 */
	Q.nextTick = nextTick;

	/**
	 * Controls whether or not long stack traces will be on
	 */
	Q.longStackSupport = false;

	// enable long stacks if Q_DEBUG is set
	if (typeof process === "object" && process && process.env && process.env.Q_DEBUG) {
	    Q.longStackSupport = true;
	}

	/**
	 * Constructs a {promise, resolve, reject} object.
	 *
	 * `resolve` is a callback to invoke with a more resolved value for the
	 * promise. To fulfill the promise, invoke `resolve` with any value that is
	 * not a thenable. To reject the promise, invoke `resolve` with a rejected
	 * thenable, or invoke `reject` with the reason directly. To resolve the
	 * promise to another thenable, thus putting it in the same state, invoke
	 * `resolve` with that other thenable.
	 */
	Q.defer = defer;
	function defer() {
	    // if "messages" is an "Array", that indicates that the promise has not yet
	    // been resolved.  If it is "undefined", it has been resolved.  Each
	    // element of the messages array is itself an array of complete arguments to
	    // forward to the resolved promise.  We coerce the resolution value to a
	    // promise using the `resolve` function because it handles both fully
	    // non-thenable values and other thenables gracefully.
	    var messages = [], progressListeners = [], resolvedPromise;

	    var deferred = object_create(defer.prototype);
	    var promise = object_create(Promise.prototype);

	    promise.promiseDispatch = function (resolve, op, operands) {
	        var args = array_slice(arguments);
	        if (messages) {
	            messages.push(args);
	            if (op === "when" && operands[1]) { // progress operand
	                progressListeners.push(operands[1]);
	            }
	        } else {
	            Q.nextTick(function () {
	                resolvedPromise.promiseDispatch.apply(resolvedPromise, args);
	            });
	        }
	    };

	    // XXX deprecated
	    promise.valueOf = function () {
	        if (messages) {
	            return promise;
	        }
	        var nearerValue = nearer(resolvedPromise);
	        if (isPromise(nearerValue)) {
	            resolvedPromise = nearerValue; // shorten chain
	        }
	        return nearerValue;
	    };

	    promise.inspect = function () {
	        if (!resolvedPromise) {
	            return { state: "pending" };
	        }
	        return resolvedPromise.inspect();
	    };

	    if (Q.longStackSupport && hasStacks) {
	        try {
	            throw new Error();
	        } catch (e) {
	            // NOTE: don't try to use `Error.captureStackTrace` or transfer the
	            // accessor around; that causes memory leaks as per GH-111. Just
	            // reify the stack trace as a string ASAP.
	            //
	            // At the same time, cut off the first line; it's always just
	            // "[object Promise]\n", as per the `toString`.
	            promise.stack = e.stack.substring(e.stack.indexOf("\n") + 1);
	        }
	    }

	    // NOTE: we do the checks for `resolvedPromise` in each method, instead of
	    // consolidating them into `become`, since otherwise we'd create new
	    // promises with the lines `become(whatever(value))`. See e.g. GH-252.

	    function become(newPromise) {
	        resolvedPromise = newPromise;
	        promise.source = newPromise;

	        array_reduce(messages, function (undefined, message) {
	            Q.nextTick(function () {
	                newPromise.promiseDispatch.apply(newPromise, message);
	            });
	        }, void 0);

	        messages = void 0;
	        progressListeners = void 0;
	    }

	    deferred.promise = promise;
	    deferred.resolve = function (value) {
	        if (resolvedPromise) {
	            return;
	        }

	        become(Q(value));
	    };

	    deferred.fulfill = function (value) {
	        if (resolvedPromise) {
	            return;
	        }

	        become(fulfill(value));
	    };
	    deferred.reject = function (reason) {
	        if (resolvedPromise) {
	            return;
	        }

	        become(reject(reason));
	    };
	    deferred.notify = function (progress) {
	        if (resolvedPromise) {
	            return;
	        }

	        array_reduce(progressListeners, function (undefined, progressListener) {
	            Q.nextTick(function () {
	                progressListener(progress);
	            });
	        }, void 0);
	    };

	    return deferred;
	}

	/**
	 * Creates a Node-style callback that will resolve or reject the deferred
	 * promise.
	 * @returns a nodeback
	 */
	defer.prototype.makeNodeResolver = function () {
	    var self = this;
	    return function (error, value) {
	        if (error) {
	            self.reject(error);
	        } else if (arguments.length > 2) {
	            self.resolve(array_slice(arguments, 1));
	        } else {
	            self.resolve(value);
	        }
	    };
	};

	/**
	 * @param resolver {Function} a function that returns nothing and accepts
	 * the resolve, reject, and notify functions for a deferred.
	 * @returns a promise that may be resolved with the given resolve and reject
	 * functions, or rejected by a thrown exception in resolver
	 */
	Q.Promise = promise; // ES6
	Q.promise = promise;
	function promise(resolver) {
	    if (typeof resolver !== "function") {
	        throw new TypeError("resolver must be a function.");
	    }
	    var deferred = defer();
	    try {
	        resolver(deferred.resolve, deferred.reject, deferred.notify);
	    } catch (reason) {
	        deferred.reject(reason);
	    }
	    return deferred.promise;
	}

	promise.race = race; // ES6
	promise.all = all; // ES6
	promise.reject = reject; // ES6
	promise.resolve = Q; // ES6

	// XXX experimental.  This method is a way to denote that a local value is
	// serializable and should be immediately dispatched to a remote upon request,
	// instead of passing a reference.
	Q.passByCopy = function (object) {
	    //freeze(object);
	    //passByCopies.set(object, true);
	    return object;
	};

	Promise.prototype.passByCopy = function () {
	    //freeze(object);
	    //passByCopies.set(object, true);
	    return this;
	};

	/**
	 * If two promises eventually fulfill to the same value, promises that value,
	 * but otherwise rejects.
	 * @param x {Any*}
	 * @param y {Any*}
	 * @returns {Any*} a promise for x and y if they are the same, but a rejection
	 * otherwise.
	 *
	 */
	Q.join = function (x, y) {
	    return Q(x).join(y);
	};

	Promise.prototype.join = function (that) {
	    return Q([this, that]).spread(function (x, y) {
	        if (x === y) {
	            // TODO: "===" should be Object.is or equiv
	            return x;
	        } else {
	            throw new Error("Can't join: not the same: " + x + " " + y);
	        }
	    });
	};

	/**
	 * Returns a promise for the first of an array of promises to become settled.
	 * @param answers {Array[Any*]} promises to race
	 * @returns {Any*} the first promise to be settled
	 */
	Q.race = race;
	function race(answerPs) {
	    return promise(function(resolve, reject) {
	        // Switch to this once we can assume at least ES5
	        // answerPs.forEach(function(answerP) {
	        //     Q(answerP).then(resolve, reject);
	        // });
	        // Use this in the meantime
	        for (var i = 0, len = answerPs.length; i < len; i++) {
	            Q(answerPs[i]).then(resolve, reject);
	        }
	    });
	}

	Promise.prototype.race = function () {
	    return this.then(Q.race);
	};

	/**
	 * Constructs a Promise with a promise descriptor object and optional fallback
	 * function.  The descriptor contains methods like when(rejected), get(name),
	 * set(name, value), post(name, args), and delete(name), which all
	 * return either a value, a promise for a value, or a rejection.  The fallback
	 * accepts the operation name, a resolver, and any further arguments that would
	 * have been forwarded to the appropriate method above had a method been
	 * provided with the proper name.  The API makes no guarantees about the nature
	 * of the returned object, apart from that it is usable whereever promises are
	 * bought and sold.
	 */
	Q.makePromise = Promise;
	function Promise(descriptor, fallback, inspect) {
	    if (fallback === void 0) {
	        fallback = function (op) {
	            return reject(new Error(
	                "Promise does not support operation: " + op
	            ));
	        };
	    }
	    if (inspect === void 0) {
	        inspect = function () {
	            return {state: "unknown"};
	        };
	    }

	    var promise = object_create(Promise.prototype);

	    promise.promiseDispatch = function (resolve, op, args) {
	        var result;
	        try {
	            if (descriptor[op]) {
	                result = descriptor[op].apply(promise, args);
	            } else {
	                result = fallback.call(promise, op, args);
	            }
	        } catch (exception) {
	            result = reject(exception);
	        }
	        if (resolve) {
	            resolve(result);
	        }
	    };

	    promise.inspect = inspect;

	    // XXX deprecated `valueOf` and `exception` support
	    if (inspect) {
	        var inspected = inspect();
	        if (inspected.state === "rejected") {
	            promise.exception = inspected.reason;
	        }

	        promise.valueOf = function () {
	            var inspected = inspect();
	            if (inspected.state === "pending" ||
	                inspected.state === "rejected") {
	                return promise;
	            }
	            return inspected.value;
	        };
	    }

	    return promise;
	}

	Promise.prototype.toString = function () {
	    return "[object Promise]";
	};

	Promise.prototype.then = function (fulfilled, rejected, progressed) {
	    var self = this;
	    var deferred = defer();
	    var done = false;   // ensure the untrusted promise makes at most a
	                        // single call to one of the callbacks

	    function _fulfilled(value) {
	        try {
	            return typeof fulfilled === "function" ? fulfilled(value) : value;
	        } catch (exception) {
	            return reject(exception);
	        }
	    }

	    function _rejected(exception) {
	        if (typeof rejected === "function") {
	            makeStackTraceLong(exception, self);
	            try {
	                return rejected(exception);
	            } catch (newException) {
	                return reject(newException);
	            }
	        }
	        return reject(exception);
	    }

	    function _progressed(value) {
	        return typeof progressed === "function" ? progressed(value) : value;
	    }

	    Q.nextTick(function () {
	        self.promiseDispatch(function (value) {
	            if (done) {
	                return;
	            }
	            done = true;

	            deferred.resolve(_fulfilled(value));
	        }, "when", [function (exception) {
	            if (done) {
	                return;
	            }
	            done = true;

	            deferred.resolve(_rejected(exception));
	        }]);
	    });

	    // Progress propagator need to be attached in the current tick.
	    self.promiseDispatch(void 0, "when", [void 0, function (value) {
	        var newValue;
	        var threw = false;
	        try {
	            newValue = _progressed(value);
	        } catch (e) {
	            threw = true;
	            if (Q.onerror) {
	                Q.onerror(e);
	            } else {
	                throw e;
	            }
	        }

	        if (!threw) {
	            deferred.notify(newValue);
	        }
	    }]);

	    return deferred.promise;
	};

	Q.tap = function (promise, callback) {
	    return Q(promise).tap(callback);
	};

	/**
	 * Works almost like "finally", but not called for rejections.
	 * Original resolution value is passed through callback unaffected.
	 * Callback may return a promise that will be awaited for.
	 * @param {Function} callback
	 * @returns {Q.Promise}
	 * @example
	 * doSomething()
	 *   .then(...)
	 *   .tap(console.log)
	 *   .then(...);
	 */
	Promise.prototype.tap = function (callback) {
	    callback = Q(callback);

	    return this.then(function (value) {
	        return callback.fcall(value).thenResolve(value);
	    });
	};

	/**
	 * Registers an observer on a promise.
	 *
	 * Guarantees:
	 *
	 * 1. that fulfilled and rejected will be called only once.
	 * 2. that either the fulfilled callback or the rejected callback will be
	 *    called, but not both.
	 * 3. that fulfilled and rejected will not be called in this turn.
	 *
	 * @param value      promise or immediate reference to observe
	 * @param fulfilled  function to be called with the fulfilled value
	 * @param rejected   function to be called with the rejection exception
	 * @param progressed function to be called on any progress notifications
	 * @return promise for the return value from the invoked callback
	 */
	Q.when = when;
	function when(value, fulfilled, rejected, progressed) {
	    return Q(value).then(fulfilled, rejected, progressed);
	}

	Promise.prototype.thenResolve = function (value) {
	    return this.then(function () { return value; });
	};

	Q.thenResolve = function (promise, value) {
	    return Q(promise).thenResolve(value);
	};

	Promise.prototype.thenReject = function (reason) {
	    return this.then(function () { throw reason; });
	};

	Q.thenReject = function (promise, reason) {
	    return Q(promise).thenReject(reason);
	};

	/**
	 * If an object is not a promise, it is as "near" as possible.
	 * If a promise is rejected, it is as "near" as possible too.
	 * If it’s a fulfilled promise, the fulfillment value is nearer.
	 * If it’s a deferred promise and the deferred has been resolved, the
	 * resolution is "nearer".
	 * @param object
	 * @returns most resolved (nearest) form of the object
	 */

	// XXX should we re-do this?
	Q.nearer = nearer;
	function nearer(value) {
	    if (isPromise(value)) {
	        var inspected = value.inspect();
	        if (inspected.state === "fulfilled") {
	            return inspected.value;
	        }
	    }
	    return value;
	}

	/**
	 * @returns whether the given object is a promise.
	 * Otherwise it is a fulfilled value.
	 */
	Q.isPromise = isPromise;
	function isPromise(object) {
	    return object instanceof Promise;
	}

	Q.isPromiseAlike = isPromiseAlike;
	function isPromiseAlike(object) {
	    return isObject(object) && typeof object.then === "function";
	}

	/**
	 * @returns whether the given object is a pending promise, meaning not
	 * fulfilled or rejected.
	 */
	Q.isPending = isPending;
	function isPending(object) {
	    return isPromise(object) && object.inspect().state === "pending";
	}

	Promise.prototype.isPending = function () {
	    return this.inspect().state === "pending";
	};

	/**
	 * @returns whether the given object is a value or fulfilled
	 * promise.
	 */
	Q.isFulfilled = isFulfilled;
	function isFulfilled(object) {
	    return !isPromise(object) || object.inspect().state === "fulfilled";
	}

	Promise.prototype.isFulfilled = function () {
	    return this.inspect().state === "fulfilled";
	};

	/**
	 * @returns whether the given object is a rejected promise.
	 */
	Q.isRejected = isRejected;
	function isRejected(object) {
	    return isPromise(object) && object.inspect().state === "rejected";
	}

	Promise.prototype.isRejected = function () {
	    return this.inspect().state === "rejected";
	};

	//// BEGIN UNHANDLED REJECTION TRACKING

	// This promise library consumes exceptions thrown in handlers so they can be
	// handled by a subsequent promise.  The exceptions get added to this array when
	// they are created, and removed when they are handled.  Note that in ES6 or
	// shimmed environments, this would naturally be a `Set`.
	var unhandledReasons = [];
	var unhandledRejections = [];
	var trackUnhandledRejections = true;

	function resetUnhandledRejections() {
	    unhandledReasons.length = 0;
	    unhandledRejections.length = 0;

	    if (!trackUnhandledRejections) {
	        trackUnhandledRejections = true;
	    }
	}

	function trackRejection(promise, reason) {
	    if (!trackUnhandledRejections) {
	        return;
	    }

	    unhandledRejections.push(promise);
	    if (reason && typeof reason.stack !== "undefined") {
	        unhandledReasons.push(reason.stack);
	    } else {
	        unhandledReasons.push("(no stack) " + reason);
	    }
	}

	function untrackRejection(promise) {
	    if (!trackUnhandledRejections) {
	        return;
	    }

	    var at = array_indexOf(unhandledRejections, promise);
	    if (at !== -1) {
	        unhandledRejections.splice(at, 1);
	        unhandledReasons.splice(at, 1);
	    }
	}

	Q.resetUnhandledRejections = resetUnhandledRejections;

	Q.getUnhandledReasons = function () {
	    // Make a copy so that consumers can't interfere with our internal state.
	    return unhandledReasons.slice();
	};

	Q.stopUnhandledRejectionTracking = function () {
	    resetUnhandledRejections();
	    trackUnhandledRejections = false;
	};

	resetUnhandledRejections();

	//// END UNHANDLED REJECTION TRACKING

	/**
	 * Constructs a rejected promise.
	 * @param reason value describing the failure
	 */
	Q.reject = reject;
	function reject(reason) {
	    var rejection = Promise({
	        "when": function (rejected) {
	            // note that the error has been handled
	            if (rejected) {
	                untrackRejection(this);
	            }
	            return rejected ? rejected(reason) : this;
	        }
	    }, function fallback() {
	        return this;
	    }, function inspect() {
	        return { state: "rejected", reason: reason };
	    });

	    // Note that the reason has not been handled.
	    trackRejection(rejection, reason);

	    return rejection;
	}

	/**
	 * Constructs a fulfilled promise for an immediate reference.
	 * @param value immediate reference
	 */
	Q.fulfill = fulfill;
	function fulfill(value) {
	    return Promise({
	        "when": function () {
	            return value;
	        },
	        "get": function (name) {
	            return value[name];
	        },
	        "set": function (name, rhs) {
	            value[name] = rhs;
	        },
	        "delete": function (name) {
	            delete value[name];
	        },
	        "post": function (name, args) {
	            // Mark Miller proposes that post with no name should apply a
	            // promised function.
	            if (name === null || name === void 0) {
	                return value.apply(void 0, args);
	            } else {
	                return value[name].apply(value, args);
	            }
	        },
	        "apply": function (thisp, args) {
	            return value.apply(thisp, args);
	        },
	        "keys": function () {
	            return object_keys(value);
	        }
	    }, void 0, function inspect() {
	        return { state: "fulfilled", value: value };
	    });
	}

	/**
	 * Converts thenables to Q promises.
	 * @param promise thenable promise
	 * @returns a Q promise
	 */
	function coerce(promise) {
	    var deferred = defer();
	    Q.nextTick(function () {
	        try {
	            promise.then(deferred.resolve, deferred.reject, deferred.notify);
	        } catch (exception) {
	            deferred.reject(exception);
	        }
	    });
	    return deferred.promise;
	}

	/**
	 * Annotates an object such that it will never be
	 * transferred away from this process over any promise
	 * communication channel.
	 * @param object
	 * @returns promise a wrapping of that object that
	 * additionally responds to the "isDef" message
	 * without a rejection.
	 */
	Q.master = master;
	function master(object) {
	    return Promise({
	        "isDef": function () {}
	    }, function fallback(op, args) {
	        return dispatch(object, op, args);
	    }, function () {
	        return Q(object).inspect();
	    });
	}

	/**
	 * Spreads the values of a promised array of arguments into the
	 * fulfillment callback.
	 * @param fulfilled callback that receives variadic arguments from the
	 * promised array
	 * @param rejected callback that receives the exception if the promise
	 * is rejected.
	 * @returns a promise for the return value or thrown exception of
	 * either callback.
	 */
	Q.spread = spread;
	function spread(value, fulfilled, rejected) {
	    return Q(value).spread(fulfilled, rejected);
	}

	Promise.prototype.spread = function (fulfilled, rejected) {
	    return this.all().then(function (array) {
	        return fulfilled.apply(void 0, array);
	    }, rejected);
	};

	/**
	 * The async function is a decorator for generator functions, turning
	 * them into asynchronous generators.  Although generators are only part
	 * of the newest ECMAScript 6 drafts, this code does not cause syntax
	 * errors in older engines.  This code should continue to work and will
	 * in fact improve over time as the language improves.
	 *
	 * ES6 generators are currently part of V8 version 3.19 with the
	 * --harmony-generators runtime flag enabled.  SpiderMonkey has had them
	 * for longer, but under an older Python-inspired form.  This function
	 * works on both kinds of generators.
	 *
	 * Decorates a generator function such that:
	 *  - it may yield promises
	 *  - execution will continue when that promise is fulfilled
	 *  - the value of the yield expression will be the fulfilled value
	 *  - it returns a promise for the return value (when the generator
	 *    stops iterating)
	 *  - the decorated function returns a promise for the return value
	 *    of the generator or the first rejected promise among those
	 *    yielded.
	 *  - if an error is thrown in the generator, it propagates through
	 *    every following yield until it is caught, or until it escapes
	 *    the generator function altogether, and is translated into a
	 *    rejection for the promise returned by the decorated generator.
	 */
	Q.async = async;
	function async(makeGenerator) {
	    return function () {
	        // when verb is "send", arg is a value
	        // when verb is "throw", arg is an exception
	        function continuer(verb, arg) {
	            var result;

	            // Until V8 3.19 / Chromium 29 is released, SpiderMonkey is the only
	            // engine that has a deployed base of browsers that support generators.
	            // However, SM's generators use the Python-inspired semantics of
	            // outdated ES6 drafts.  We would like to support ES6, but we'd also
	            // like to make it possible to use generators in deployed browsers, so
	            // we also support Python-style generators.  At some point we can remove
	            // this block.

	            if (typeof StopIteration === "undefined") {
	                // ES6 Generators
	                try {
	                    result = generator[verb](arg);
	                } catch (exception) {
	                    return reject(exception);
	                }
	                if (result.done) {
	                    return Q(result.value);
	                } else {
	                    return when(result.value, callback, errback);
	                }
	            } else {
	                // SpiderMonkey Generators
	                // FIXME: Remove this case when SM does ES6 generators.
	                try {
	                    result = generator[verb](arg);
	                } catch (exception) {
	                    if (isStopIteration(exception)) {
	                        return Q(exception.value);
	                    } else {
	                        return reject(exception);
	                    }
	                }
	                return when(result, callback, errback);
	            }
	        }
	        var generator = makeGenerator.apply(this, arguments);
	        var callback = continuer.bind(continuer, "next");
	        var errback = continuer.bind(continuer, "throw");
	        return callback();
	    };
	}

	/**
	 * The spawn function is a small wrapper around async that immediately
	 * calls the generator and also ends the promise chain, so that any
	 * unhandled errors are thrown instead of forwarded to the error
	 * handler. This is useful because it's extremely common to run
	 * generators at the top-level to work with libraries.
	 */
	Q.spawn = spawn;
	function spawn(makeGenerator) {
	    Q.done(Q.async(makeGenerator)());
	}

	// FIXME: Remove this interface once ES6 generators are in SpiderMonkey.
	/**
	 * Throws a ReturnValue exception to stop an asynchronous generator.
	 *
	 * This interface is a stop-gap measure to support generator return
	 * values in older Firefox/SpiderMonkey.  In browsers that support ES6
	 * generators like Chromium 29, just use "return" in your generator
	 * functions.
	 *
	 * @param value the return value for the surrounding generator
	 * @throws ReturnValue exception with the value.
	 * @example
	 * // ES6 style
	 * Q.async(function* () {
	 *      var foo = yield getFooPromise();
	 *      var bar = yield getBarPromise();
	 *      return foo + bar;
	 * })
	 * // Older SpiderMonkey style
	 * Q.async(function () {
	 *      var foo = yield getFooPromise();
	 *      var bar = yield getBarPromise();
	 *      Q.return(foo + bar);
	 * })
	 */
	Q["return"] = _return;
	function _return(value) {
	    throw new QReturnValue(value);
	}

	/**
	 * The promised function decorator ensures that any promise arguments
	 * are settled and passed as values (`this` is also settled and passed
	 * as a value).  It will also ensure that the result of a function is
	 * always a promise.
	 *
	 * @example
	 * var add = Q.promised(function (a, b) {
	 *     return a + b;
	 * });
	 * add(Q(a), Q(B));
	 *
	 * @param {function} callback The function to decorate
	 * @returns {function} a function that has been decorated.
	 */
	Q.promised = promised;
	function promised(callback) {
	    return function () {
	        return spread([this, all(arguments)], function (self, args) {
	            return callback.apply(self, args);
	        });
	    };
	}

	/**
	 * sends a message to a value in a future turn
	 * @param object* the recipient
	 * @param op the name of the message operation, e.g., "when",
	 * @param args further arguments to be forwarded to the operation
	 * @returns result {Promise} a promise for the result of the operation
	 */
	Q.dispatch = dispatch;
	function dispatch(object, op, args) {
	    return Q(object).dispatch(op, args);
	}

	Promise.prototype.dispatch = function (op, args) {
	    var self = this;
	    var deferred = defer();
	    Q.nextTick(function () {
	        self.promiseDispatch(deferred.resolve, op, args);
	    });
	    return deferred.promise;
	};

	/**
	 * Gets the value of a property in a future turn.
	 * @param object    promise or immediate reference for target object
	 * @param name      name of property to get
	 * @return promise for the property value
	 */
	Q.get = function (object, key) {
	    return Q(object).dispatch("get", [key]);
	};

	Promise.prototype.get = function (key) {
	    return this.dispatch("get", [key]);
	};

	/**
	 * Sets the value of a property in a future turn.
	 * @param object    promise or immediate reference for object object
	 * @param name      name of property to set
	 * @param value     new value of property
	 * @return promise for the return value
	 */
	Q.set = function (object, key, value) {
	    return Q(object).dispatch("set", [key, value]);
	};

	Promise.prototype.set = function (key, value) {
	    return this.dispatch("set", [key, value]);
	};

	/**
	 * Deletes a property in a future turn.
	 * @param object    promise or immediate reference for target object
	 * @param name      name of property to delete
	 * @return promise for the return value
	 */
	Q.del = // XXX legacy
	Q["delete"] = function (object, key) {
	    return Q(object).dispatch("delete", [key]);
	};

	Promise.prototype.del = // XXX legacy
	Promise.prototype["delete"] = function (key) {
	    return this.dispatch("delete", [key]);
	};

	/**
	 * Invokes a method in a future turn.
	 * @param object    promise or immediate reference for target object
	 * @param name      name of method to invoke
	 * @param value     a value to post, typically an array of
	 *                  invocation arguments for promises that
	 *                  are ultimately backed with `resolve` values,
	 *                  as opposed to those backed with URLs
	 *                  wherein the posted value can be any
	 *                  JSON serializable object.
	 * @return promise for the return value
	 */
	// bound locally because it is used by other methods
	Q.mapply = // XXX As proposed by "Redsandro"
	Q.post = function (object, name, args) {
	    return Q(object).dispatch("post", [name, args]);
	};

	Promise.prototype.mapply = // XXX As proposed by "Redsandro"
	Promise.prototype.post = function (name, args) {
	    return this.dispatch("post", [name, args]);
	};

	/**
	 * Invokes a method in a future turn.
	 * @param object    promise or immediate reference for target object
	 * @param name      name of method to invoke
	 * @param ...args   array of invocation arguments
	 * @return promise for the return value
	 */
	Q.send = // XXX Mark Miller's proposed parlance
	Q.mcall = // XXX As proposed by "Redsandro"
	Q.invoke = function (object, name /*...args*/) {
	    return Q(object).dispatch("post", [name, array_slice(arguments, 2)]);
	};

	Promise.prototype.send = // XXX Mark Miller's proposed parlance
	Promise.prototype.mcall = // XXX As proposed by "Redsandro"
	Promise.prototype.invoke = function (name /*...args*/) {
	    return this.dispatch("post", [name, array_slice(arguments, 1)]);
	};

	/**
	 * Applies the promised function in a future turn.
	 * @param object    promise or immediate reference for target function
	 * @param args      array of application arguments
	 */
	Q.fapply = function (object, args) {
	    return Q(object).dispatch("apply", [void 0, args]);
	};

	Promise.prototype.fapply = function (args) {
	    return this.dispatch("apply", [void 0, args]);
	};

	/**
	 * Calls the promised function in a future turn.
	 * @param object    promise or immediate reference for target function
	 * @param ...args   array of application arguments
	 */
	Q["try"] =
	Q.fcall = function (object /* ...args*/) {
	    return Q(object).dispatch("apply", [void 0, array_slice(arguments, 1)]);
	};

	Promise.prototype.fcall = function (/*...args*/) {
	    return this.dispatch("apply", [void 0, array_slice(arguments)]);
	};

	/**
	 * Binds the promised function, transforming return values into a fulfilled
	 * promise and thrown errors into a rejected one.
	 * @param object    promise or immediate reference for target function
	 * @param ...args   array of application arguments
	 */
	Q.fbind = function (object /*...args*/) {
	    var promise = Q(object);
	    var args = array_slice(arguments, 1);
	    return function fbound() {
	        return promise.dispatch("apply", [
	            this,
	            args.concat(array_slice(arguments))
	        ]);
	    };
	};
	Promise.prototype.fbind = function (/*...args*/) {
	    var promise = this;
	    var args = array_slice(arguments);
	    return function fbound() {
	        return promise.dispatch("apply", [
	            this,
	            args.concat(array_slice(arguments))
	        ]);
	    };
	};

	/**
	 * Requests the names of the owned properties of a promised
	 * object in a future turn.
	 * @param object    promise or immediate reference for target object
	 * @return promise for the keys of the eventually settled object
	 */
	Q.keys = function (object) {
	    return Q(object).dispatch("keys", []);
	};

	Promise.prototype.keys = function () {
	    return this.dispatch("keys", []);
	};

	/**
	 * Turns an array of promises into a promise for an array.  If any of
	 * the promises gets rejected, the whole array is rejected immediately.
	 * @param {Array*} an array (or promise for an array) of values (or
	 * promises for values)
	 * @returns a promise for an array of the corresponding values
	 */
	// By Mark Miller
	// http://wiki.ecmascript.org/doku.php?id=strawman:concurrency&rev=1308776521#allfulfilled
	Q.all = all;
	function all(promises) {
	    return when(promises, function (promises) {
	        var pendingCount = 0;
	        var deferred = defer();
	        array_reduce(promises, function (undefined, promise, index) {
	            var snapshot;
	            if (
	                isPromise(promise) &&
	                (snapshot = promise.inspect()).state === "fulfilled"
	            ) {
	                promises[index] = snapshot.value;
	            } else {
	                ++pendingCount;
	                when(
	                    promise,
	                    function (value) {
	                        promises[index] = value;
	                        if (--pendingCount === 0) {
	                            deferred.resolve(promises);
	                        }
	                    },
	                    deferred.reject,
	                    function (progress) {
	                        deferred.notify({ index: index, value: progress });
	                    }
	                );
	            }
	        }, void 0);
	        if (pendingCount === 0) {
	            deferred.resolve(promises);
	        }
	        return deferred.promise;
	    });
	}

	Promise.prototype.all = function () {
	    return all(this);
	};

	/**
	 * Returns the first resolved promise of an array. Prior rejected promises are
	 * ignored.  Rejects only if all promises are rejected.
	 * @param {Array*} an array containing values or promises for values
	 * @returns a promise fulfilled with the value of the first resolved promise,
	 * or a rejected promise if all promises are rejected.
	 */
	Q.any = any;

	function any(promises) {
	    if (promises.length === 0) {
	        return Q.resolve();
	    }

	    var deferred = Q.defer();
	    var pendingCount = 0;
	    array_reduce(promises, function(prev, current, index) {
	        var promise = promises[index];

	        pendingCount++;

	        when(promise, onFulfilled, onRejected, onProgress);
	        function onFulfilled(result) {
	            deferred.resolve(result);
	        }
	        function onRejected() {
	            pendingCount--;
	            if (pendingCount === 0) {
	                deferred.reject(new Error(
	                    "Can't get fulfillment value from any promise, all " +
	                    "promises were rejected."
	                ));
	            }
	        }
	        function onProgress(progress) {
	            deferred.notify({
	                index: index,
	                value: progress
	            });
	        }
	    }, undefined);

	    return deferred.promise;
	}

	Promise.prototype.any = function() {
	    return any(this);
	};

	/**
	 * Waits for all promises to be settled, either fulfilled or
	 * rejected.  This is distinct from `all` since that would stop
	 * waiting at the first rejection.  The promise returned by
	 * `allResolved` will never be rejected.
	 * @param promises a promise for an array (or an array) of promises
	 * (or values)
	 * @return a promise for an array of promises
	 */
	Q.allResolved = deprecate(allResolved, "allResolved", "allSettled");
	function allResolved(promises) {
	    return when(promises, function (promises) {
	        promises = array_map(promises, Q);
	        return when(all(array_map(promises, function (promise) {
	            return when(promise, noop, noop);
	        })), function () {
	            return promises;
	        });
	    });
	}

	Promise.prototype.allResolved = function () {
	    return allResolved(this);
	};

	/**
	 * @see Promise#allSettled
	 */
	Q.allSettled = allSettled;
	function allSettled(promises) {
	    return Q(promises).allSettled();
	}

	/**
	 * Turns an array of promises into a promise for an array of their states (as
	 * returned by `inspect`) when they have all settled.
	 * @param {Array[Any*]} values an array (or promise for an array) of values (or
	 * promises for values)
	 * @returns {Array[State]} an array of states for the respective values.
	 */
	Promise.prototype.allSettled = function () {
	    return this.then(function (promises) {
	        return all(array_map(promises, function (promise) {
	            promise = Q(promise);
	            function regardless() {
	                return promise.inspect();
	            }
	            return promise.then(regardless, regardless);
	        }));
	    });
	};

	/**
	 * Captures the failure of a promise, giving an oportunity to recover
	 * with a callback.  If the given promise is fulfilled, the returned
	 * promise is fulfilled.
	 * @param {Any*} promise for something
	 * @param {Function} callback to fulfill the returned promise if the
	 * given promise is rejected
	 * @returns a promise for the return value of the callback
	 */
	Q.fail = // XXX legacy
	Q["catch"] = function (object, rejected) {
	    return Q(object).then(void 0, rejected);
	};

	Promise.prototype.fail = // XXX legacy
	Promise.prototype["catch"] = function (rejected) {
	    return this.then(void 0, rejected);
	};

	/**
	 * Attaches a listener that can respond to progress notifications from a
	 * promise's originating deferred. This listener receives the exact arguments
	 * passed to ``deferred.notify``.
	 * @param {Any*} promise for something
	 * @param {Function} callback to receive any progress notifications
	 * @returns the given promise, unchanged
	 */
	Q.progress = progress;
	function progress(object, progressed) {
	    return Q(object).then(void 0, void 0, progressed);
	}

	Promise.prototype.progress = function (progressed) {
	    return this.then(void 0, void 0, progressed);
	};

	/**
	 * Provides an opportunity to observe the settling of a promise,
	 * regardless of whether the promise is fulfilled or rejected.  Forwards
	 * the resolution to the returned promise when the callback is done.
	 * The callback can return a promise to defer completion.
	 * @param {Any*} promise
	 * @param {Function} callback to observe the resolution of the given
	 * promise, takes no arguments.
	 * @returns a promise for the resolution of the given promise when
	 * ``fin`` is done.
	 */
	Q.fin = // XXX legacy
	Q["finally"] = function (object, callback) {
	    return Q(object)["finally"](callback);
	};

	Promise.prototype.fin = // XXX legacy
	Promise.prototype["finally"] = function (callback) {
	    callback = Q(callback);
	    return this.then(function (value) {
	        return callback.fcall().then(function () {
	            return value;
	        });
	    }, function (reason) {
	        // TODO attempt to recycle the rejection with "this".
	        return callback.fcall().then(function () {
	            throw reason;
	        });
	    });
	};

	/**
	 * Terminates a chain of promises, forcing rejections to be
	 * thrown as exceptions.
	 * @param {Any*} promise at the end of a chain of promises
	 * @returns nothing
	 */
	Q.done = function (object, fulfilled, rejected, progress) {
	    return Q(object).done(fulfilled, rejected, progress);
	};

	Promise.prototype.done = function (fulfilled, rejected, progress) {
	    var onUnhandledError = function (error) {
	        // forward to a future turn so that ``when``
	        // does not catch it and turn it into a rejection.
	        Q.nextTick(function () {
	            makeStackTraceLong(error, promise);
	            if (Q.onerror) {
	                Q.onerror(error);
	            } else {
	                throw error;
	            }
	        });
	    };

	    // Avoid unnecessary `nextTick`ing via an unnecessary `when`.
	    var promise = fulfilled || rejected || progress ?
	        this.then(fulfilled, rejected, progress) :
	        this;

	    if (typeof process === "object" && process && process.domain) {
	        onUnhandledError = process.domain.bind(onUnhandledError);
	    }

	    promise.then(void 0, onUnhandledError);
	};

	/**
	 * Causes a promise to be rejected if it does not get fulfilled before
	 * some milliseconds time out.
	 * @param {Any*} promise
	 * @param {Number} milliseconds timeout
	 * @param {Any*} custom error message or Error object (optional)
	 * @returns a promise for the resolution of the given promise if it is
	 * fulfilled before the timeout, otherwise rejected.
	 */
	Q.timeout = function (object, ms, error) {
	    return Q(object).timeout(ms, error);
	};

	Promise.prototype.timeout = function (ms, error) {
	    var deferred = defer();
	    var timeoutId = setTimeout(function () {
	        if (!error || "string" === typeof error) {
	            error = new Error(error || "Timed out after " + ms + " ms");
	            error.code = "ETIMEDOUT";
	        }
	        deferred.reject(error);
	    }, ms);

	    this.then(function (value) {
	        clearTimeout(timeoutId);
	        deferred.resolve(value);
	    }, function (exception) {
	        clearTimeout(timeoutId);
	        deferred.reject(exception);
	    }, deferred.notify);

	    return deferred.promise;
	};

	/**
	 * Returns a promise for the given value (or promised value), some
	 * milliseconds after it resolved. Passes rejections immediately.
	 * @param {Any*} promise
	 * @param {Number} milliseconds
	 * @returns a promise for the resolution of the given promise after milliseconds
	 * time has elapsed since the resolution of the given promise.
	 * If the given promise rejects, that is passed immediately.
	 */
	Q.delay = function (object, timeout) {
	    if (timeout === void 0) {
	        timeout = object;
	        object = void 0;
	    }
	    return Q(object).delay(timeout);
	};

	Promise.prototype.delay = function (timeout) {
	    return this.then(function (value) {
	        var deferred = defer();
	        setTimeout(function () {
	            deferred.resolve(value);
	        }, timeout);
	        return deferred.promise;
	    });
	};

	/**
	 * Passes a continuation to a Node function, which is called with the given
	 * arguments provided as an array, and returns a promise.
	 *
	 *      Q.nfapply(FS.readFile, [__filename])
	 *      .then(function (content) {
	 *      })
	 *
	 */
	Q.nfapply = function (callback, args) {
	    return Q(callback).nfapply(args);
	};

	Promise.prototype.nfapply = function (args) {
	    var deferred = defer();
	    var nodeArgs = array_slice(args);
	    nodeArgs.push(deferred.makeNodeResolver());
	    this.fapply(nodeArgs).fail(deferred.reject);
	    return deferred.promise;
	};

	/**
	 * Passes a continuation to a Node function, which is called with the given
	 * arguments provided individually, and returns a promise.
	 * @example
	 * Q.nfcall(FS.readFile, __filename)
	 * .then(function (content) {
	 * })
	 *
	 */
	Q.nfcall = function (callback /*...args*/) {
	    var args = array_slice(arguments, 1);
	    return Q(callback).nfapply(args);
	};

	Promise.prototype.nfcall = function (/*...args*/) {
	    var nodeArgs = array_slice(arguments);
	    var deferred = defer();
	    nodeArgs.push(deferred.makeNodeResolver());
	    this.fapply(nodeArgs).fail(deferred.reject);
	    return deferred.promise;
	};

	/**
	 * Wraps a NodeJS continuation passing function and returns an equivalent
	 * version that returns a promise.
	 * @example
	 * Q.nfbind(FS.readFile, __filename)("utf-8")
	 * .then(console.log)
	 * .done()
	 */
	Q.nfbind =
	Q.denodeify = function (callback /*...args*/) {
	    var baseArgs = array_slice(arguments, 1);
	    return function () {
	        var nodeArgs = baseArgs.concat(array_slice(arguments));
	        var deferred = defer();
	        nodeArgs.push(deferred.makeNodeResolver());
	        Q(callback).fapply(nodeArgs).fail(deferred.reject);
	        return deferred.promise;
	    };
	};

	Promise.prototype.nfbind =
	Promise.prototype.denodeify = function (/*...args*/) {
	    var args = array_slice(arguments);
	    args.unshift(this);
	    return Q.denodeify.apply(void 0, args);
	};

	Q.nbind = function (callback, thisp /*...args*/) {
	    var baseArgs = array_slice(arguments, 2);
	    return function () {
	        var nodeArgs = baseArgs.concat(array_slice(arguments));
	        var deferred = defer();
	        nodeArgs.push(deferred.makeNodeResolver());
	        function bound() {
	            return callback.apply(thisp, arguments);
	        }
	        Q(bound).fapply(nodeArgs).fail(deferred.reject);
	        return deferred.promise;
	    };
	};

	Promise.prototype.nbind = function (/*thisp, ...args*/) {
	    var args = array_slice(arguments, 0);
	    args.unshift(this);
	    return Q.nbind.apply(void 0, args);
	};

	/**
	 * Calls a method of a Node-style object that accepts a Node-style
	 * callback with a given array of arguments, plus a provided callback.
	 * @param object an object that has the named method
	 * @param {String} name name of the method of object
	 * @param {Array} args arguments to pass to the method; the callback
	 * will be provided by Q and appended to these arguments.
	 * @returns a promise for the value or error
	 */
	Q.nmapply = // XXX As proposed by "Redsandro"
	Q.npost = function (object, name, args) {
	    return Q(object).npost(name, args);
	};

	Promise.prototype.nmapply = // XXX As proposed by "Redsandro"
	Promise.prototype.npost = function (name, args) {
	    var nodeArgs = array_slice(args || []);
	    var deferred = defer();
	    nodeArgs.push(deferred.makeNodeResolver());
	    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
	    return deferred.promise;
	};

	/**
	 * Calls a method of a Node-style object that accepts a Node-style
	 * callback, forwarding the given variadic arguments, plus a provided
	 * callback argument.
	 * @param object an object that has the named method
	 * @param {String} name name of the method of object
	 * @param ...args arguments to pass to the method; the callback will
	 * be provided by Q and appended to these arguments.
	 * @returns a promise for the value or error
	 */
	Q.nsend = // XXX Based on Mark Miller's proposed "send"
	Q.nmcall = // XXX Based on "Redsandro's" proposal
	Q.ninvoke = function (object, name /*...args*/) {
	    var nodeArgs = array_slice(arguments, 2);
	    var deferred = defer();
	    nodeArgs.push(deferred.makeNodeResolver());
	    Q(object).dispatch("post", [name, nodeArgs]).fail(deferred.reject);
	    return deferred.promise;
	};

	Promise.prototype.nsend = // XXX Based on Mark Miller's proposed "send"
	Promise.prototype.nmcall = // XXX Based on "Redsandro's" proposal
	Promise.prototype.ninvoke = function (name /*...args*/) {
	    var nodeArgs = array_slice(arguments, 1);
	    var deferred = defer();
	    nodeArgs.push(deferred.makeNodeResolver());
	    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
	    return deferred.promise;
	};

	/**
	 * If a function would like to support both Node continuation-passing-style and
	 * promise-returning-style, it can end its internal promise chain with
	 * `nodeify(nodeback)`, forwarding the optional nodeback argument.  If the user
	 * elects to use a nodeback, the result will be sent there.  If they do not
	 * pass a nodeback, they will receive the result promise.
	 * @param object a result (or a promise for a result)
	 * @param {Function} nodeback a Node.js-style callback
	 * @returns either the promise or nothing
	 */
	Q.nodeify = nodeify;
	function nodeify(object, nodeback) {
	    return Q(object).nodeify(nodeback);
	}

	Promise.prototype.nodeify = function (nodeback) {
	    if (nodeback) {
	        this.then(function (value) {
	            Q.nextTick(function () {
	                nodeback(null, value);
	            });
	        }, function (error) {
	            Q.nextTick(function () {
	                nodeback(error);
	            });
	        });
	    } else {
	        return this;
	    }
	};

	// All code before this point will be filtered from stack traces.
	var qEndingLine = captureLine();

	return Q;

	});

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6), __webpack_require__(27).setImmediate))

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Hierarchical Settings
	 * @module util/Settings
	 */
	'use strict';
	module.exports = function registerSettings(mm) {
	  var _ = mm._;
	  var format = mm.format;

	  /**
	   * @class
	   * @summary **Create a Settings**
	   * @description
	   * A Settings is a list of key value pairs - almost like a POJO.
	   * The key differences are that settings exist in a context hierarchy
	   * to allow inherited keys, and settings can have attributes that control
	   * visibility, access, and modification.
	   *
	   * Settings are created from within a container of some sort (a workspace,
	   * user, document, etc.) The container for a settings is expected to
	   * in turn contain a _context member, and this Settings object will be
	   * added to it as its _settings member.
	   * @constructor
	   * @param {Object} container The object to which these settings apply
	   * @param {Object} attributes Attributes for available settings
	   * @returns {Settings} the new set of Settings
	   */
	  var Settings = (function settingsCtorCreator() {
	    return function Settings(container, attributes) {
	      var self = this;
	      self._container = container;
	      self._attributes = {};
	    }
	  }());

	  /**
	   * @summary **add Format an object argument (replacable)**
	   * @description Used internally when objects are passed without a format.
	   * @static
	   * @param {*} obj the object to format
	   * @returns the `util.inpect()` of the object
	   */
	  Settings.formatObject = function formatObject(obj) {
	    if (typeof obj === 'undefined') return '(undefined)';  
	    if (obj === null) return '(null)';
	    if (typeof obj === 'object') {
	      if (obj instanceof String ||
	          obj instanceof Number ||
	          obj instanceof Date) {
	        return obj.toString();
	      }
	      else {
	        return mm.util.inspect(obj);
	      }
	    }
	    else {
	      return obj.toString();
	    }
	  }

	  /**
	   * @summary **Settings string format routine**
	   * @description Exposes the format routine used by the settings.
	   * The first parameter is a `sf` compatible format, any remaning 
	   * parameters are substitued into the the format.
	   * The settings failure handler is used for bad formats.
	   * @static
	   * @param {...*} arguments the format string and its arguments
	   * @returns {string} the formatted string
	   */
	  Settings.format = function format() {
	    return Settings.formatArray(Array.prototype.slice.call(arguments));
	  }

	  /**
	   * @summary **Settings string format array of arguments**
	   * @description Exposes the format routine used by the settings.
	   * The first entry
	   * is a `sf` compatible format, any remaning parameters are substitued
	   * into the the format. The settings failure handler is used for bad
	   * formats.
	   * @static
	   * @param {Array} args the format string and its arguments
	   * @returns {string} the formatted string
	   */
	  Settings.formatArray = function formatArray(args) {
	    // If the output contains only one argument or the
	    // first argument is not a format, then produce `toString()` or
	    // `util.inspect` formatted arguments separated by spaces.
	    if (args && args.length > 1 && args[0] && args[0].indexOf('{') > -1) {
	      try {
	        return format.apply(null, args);
	      }
	      catch (e) {
	        Settings.failureHandler(e);
	        // Bad formats provide comma separated outputs, not failure.
	        return args.join(); 
	      }      
	    }
	    else {
	      var outText = '';    
	      var separator = '';
	      args.forEach(function(arg) {
	        outText += separator + Settings.formatObject(arg);
	        separator = ' ';
	      })
	      return outText;
	    }
	  }

	  Settings.prototype._resetPriority = function _resetPriority() {
	    var self = this;
	    self.messagePriority = PRIORITY.NORMAL;
	    return self;
	  }

	  /**
	   * @summary **Get origin for a message (replacable)**
	   * @description
	   * This is usually used by Destination handlers to get
	   * the origin "[settings name]" prefix to place on the message.
	   * The handlers can add additional information such as a timestamp, 
	   * or omit the origin entirely.
	   * @returns {string} '[settings name]' by default.
	   */
	  Settings.prototype.origin = function origin() {
	    var self = this;
	    return '[' + self.name + ']';
	  }

	  /**
	   * @summary **Add another destination handler to this settings**
	   * @description
	   * Destination handlers are functions which receive the text message
	   * to log, as well as the settings which produced it, and the message
	   * priority: `destFunc(message, settings, priority)`.
	   * Multiple identical destinations are ignored.
	   * @param {function} f the destination function
	   * @returns {Settings} the settings for chaining
	   */
	  Settings.prototype.addDestination = function addDestination(f)
	  { 
	    var self = this;
	    if (_.indexOf(self.destinations, f) < 0) {
	      self.destinations.push(f);
	    }
	    return self._resetPriority();
	  }

	  /**
	   * @summary **Remove a handler from this settings**
	   * @description
	   * Removes a single destination handler, or clears them all with '*'.
	   * @param {function} the destination handler function or '*'.
	   * @returns {Settings} the settings for chaining
	   */
	  Settings.prototype.removeDestination = function removeDestination(handler)
	  { 
	    var self = this;
	    if (handler === '*') {
	      self.destinations = [];
	    }
	    else if (_.indexOf(self.destinations, handler) >= 0) {
	      self.destinations = _.without(self.destinations, handler);
	    }
	    return self._resetPriority();
	  }
	  
	  /**
	   * @summary **Log a message**
	   * @description
	   * This is often a `format` followed by objects, but can be a simple
	   * text string, or a list of objects.  The message will be converted
	   * into a text string and output to all of the destinations of this
	   * settings and its parents, unless the message is rejected by a
	   * filter, or the settings is disabled.
	   * @param {...*} arguments zero or more objects, often with a leading format string.
	   * @returns {Settings} the settings for chaining
	   */
	  Settings.prototype.log = function log() {
	    var self = this;
	    if (self.enabled) {
	      var args = Array.prototype.slice.call(arguments);
	      return self.logArray(args);
	    }
	    return self._resetPriority();
	  }

	  /**
	   * @summary **Select the lowest priority to log**
	   * @description
	   * Modifies the minimumPriority to filter the logging of messages.
	   * @param {number} v The minimum priority to log
	   * @returns {Settings} the settings for chaining
	   * @example
	   *    settings.allowPrioriy(Settings.PRIORITY.LOW);
	   */
	  Settings.prototype.allowPrioriy = function allowPrioriy(v) {
	    var self = this;
	    self.minimumPriority = v;
	    return self;
	  }

	  /**
	   * @summary **Select priority for the next message sent**
	   * @description
	   * Once the message has been dispatched, the next message will
	   * be at PRIORITY.NORMAL (1).
	   * @param {number} v The priority to use
	   * @returns {Settings} the settings for chaining
	   * @example
	   *    settings.prioriy(5).log("And now a message from our sponsors");
	   */
	  Settings.prototype.priority = function priority(v) {
	    var self = this;
	    self.messagePriority = self.enabled ? v : PRIORITY.NORMAL;
	    return self;
	  }

	  /**
	   * @summary **Select HIGH priority for the next message sent**
	   * @returns {Settings} the settings for chaining
	   */
	  Settings.prototype.high = function high () {
	    return this.priority(PRIORITY.HIGH);
	  }

	  /**
	   * @summary **Select LOW priority for the next message sent**
	   * @returns {Settings} the settings for chaining
	   */
	  Settings.prototype.low = function low () {
	    return this.priority(PRIORITY.LOW);
	  }

	  /**
	   * @summary **Select NORMAL priority for the next message sent**
	   * @description
	   * This is usually a no-op, but is sometimes useful as a placeholder
	   * for substitution with high or low in the source.
	   * @returns {Settings} the settings for chaining
	   */
	  Settings.prototype.norm = function norm () {
	    return this.priority(PRIORITY.NORMAL);
	  }

	  /**
	   * @summary **Enable the settings**
	   * @description
	   * When a settings is enabled then any messages with a priority greater
	   * than or equal to the `minimumPriority` (as set by {@link allowPrioriy})
	   * will be logged to all of the destination handlers of this settings and
	   * its parent handlers (unless it is disabled).
	   * @param {boolean} value optional state to set the settings to
	   * @returns {Settings} the settings for chaining
	   */
	  Settings.prototype.enable = function enable(value) {
	    var self = this;
	    self.enabled = (arguments.length === 0 || value);
	    return self;
	  }

	  /**
	   * @summary **Disable this settings**
	   * @description
	   * When a settings is disabled then any messages sent to this settings are
	   * discarded. This encludes messages sent from child settingss to this one.
	   * By extension, this means that the parent to this settings will receive
	   * no messages from this settings or its children.
	   * @returns {Settings} the settings for chaining
	   */
	  Settings.prototype.disable = function disable() {
	    return this.enable(false);
	  }

	  /**
	   * @summary **Log an array of objects as a message**
	   * @description
	   * The first object can be a format.
	   * @param {Array} args zero or more objects in an array.S
	   * @returns {Settings} the settings for chaining
	   */
	  Settings.prototype.logArray = function logArray(args) {
	    var self = this;
	    var outText = '';    
	    if (self.enabled) {
	      outText = Settings.formatArray(args);
	    }
	    return self.logString(outText);
	  }

	  /**
	   * @summary **Log a single string message to the settings's destinations**
	   * @param {string} text the message to log.
	   * @returns {Settings} the settings for chaining
	   */
	  Settings.prototype.logString = function logString(text) {
	    var self = this;
	    if (self.enabled) {    
	      var messagePriority = self.messagePriority;
	      var settings = self;
	      var originSettings = self;
	      while (settings) {
	        if (settings.enabled) {
	          _logString(text, originSettings, settings, messagePriority);
	          settings = settings.parent;
	        }
	        else {
	          settings = null;
	        }
	      }
	    }
	    return self._resetPriority();
	  }

	  return Settings;
	}


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * @file Utility functions for UIntArrays.
	 * @module util/uIntArray
	 */
	module.exports = function registerUIntArrayUtils(util) {

	  /**
	   * Convert a `UInt8Array` into a string of hex digits.
	   * @param {UInt8Array} ua the array to convert to text
	   * @returns {string} the string of hex characters
	   * @alias module:utils/uIntArray.ua2hex
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
	   * @alias module:utils/uIntArray.text2ua
	   */
	  util.text2ua = function text2ua(s) {
	      var ua = new Uint8Array(s.length);
	      for (var i = 0; i < s.length; i++) {
	          ua[i] = s.charCodeAt(i);
	      }
	      return ua;
	  }
	}


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	module.exports = function registerSimpleEnum() {
	  // The world's simples Enum mechanism.
	  function Enum(values) {
	    var self = this;
	    values.split('|').forEach(function(arg) { self[arg] = arg });
	  }

	  return Enum;
	}

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Logger static methods and constructor.
	 * @module util/Logger
	 */ 
	'use strict';
	module.exports = function registerLoggers(mm) {
	  var _ = mm._;
	  var format = mm.format;
	  
	  /**
	   * @namespace PRIORITY
	   * @property {object}  PRIORITY - Logger.PRIORITY enum for logged messages.
	   * @property {number}  PRIORITY.LOW    - The lowest priority (these messages
	   *   are not output unless `{@link acceptPriority}(PRIORITY.LOW)` lowers 
	   *   the threshold)
	   * @property {number}  PRIORITY.NORMAL - The default priority   
	   * @property {number}  PRIORITY.HIGH   - High priority
	   */    
	  var PRIORITY = {
	    LOW: 0,
	    NORMAL: 1,
	    HIGH: 2
	  };

	  /**
	   * @summary **Create a Logger**
	   * @description
	   * A Logger receives text messages from various parts of the program
	   * via calls to the `log` method, and dispatches them to zero or more
	   * destination handlers. The messages may be filtered (i.e. not output)
	   * by various mechanisms. Normally one or more destination functions
	   * handle output.  A Logger initialized with no destination handlers,
	   * although it is enabled, for all the good that will do you.
	   *
	   * Arranging loggers in a hierarchy is useful since it provides
	   * flexibility in dispatching. For example, status messages can go
	   * to both a display area, to some log file, and to a server,
	   * while internal warnings may just be dispatched to the server.
	   * @constructor
	   * @param {string} name the name of the logger (origin)
	   * @param {Logger} parent an optional parent logger
	   * @returns {Logger} the new logger
	   */
	  var Logger = (function loggerCtorCreator() {
	    return function Logger(name, parent) {
	      var self = this;
	      self.name = name;
	      self.enabled = true;
	      self.parent = parent ? parent : null;

	      /**
	       * The `PRIORITY` of the next message logged. 
	       * This is automatically reset to `PRIORITY.NORMAL` after any log.
	       * @name messagePriority
	       * @type {number}
	       * @memberOf module:util/Logger~Logger#
	       */       
	      self.messagePriority = PRIORITY.NORMAL;

	      /**
	       * The minimum `PRIORITY` of messages that will be
	       * output to the destinations of this logger. This is set by
	       * the `allowPriority` method.
	       * @name minimumPriority
	       * @type {number}
	       * @memberOf module:util/Logger~Logger#
	       */       
	      self.minimumPriority = PRIORITY.NORMAL;

	      /** @member {Array} destinations 
	       *  @memberOf! module:utisl/log
	       *  @description The array of destination functions
	       */
	      self.destinations = [];
	    }
	  }());

	  /**
	   * @summary Enum for log message priority values.
	   * @readonly
	   * @enum {number}
	   * @default
	   */  
	  Logger.PRIORITY = PRIORITY;

	  /**
	   * @summary **Bind log and a few functions as properties to a new member**
	   * @description This is a convenient way to get a shortcut to the `log` method of a
	   * logger so it can be used as a standalone function. This also binds
	   * the convenience properties: `high`, `low`, `norm`, `enable`, and
	   * `disable`.  These must be used immediately before the call to `log`.
	   * @static
	   * @param {Logger} bindLog the logger to fetch the `log` method from
	   * @returns {function} the rebound `log` method wrapper
	   * @example
	   *    var status = Logger.bindLog(allMyLoggers.statusLogger);
	   *    ...
	   *    status.high.log("Whoop whoop! Everyone to get off from street.");
	   */
	  Logger.bindLog = function bindLog (rootLogger) {
	    var log = _.bind(rootLogger.log, rootLogger);
	    // Bind convenience functions to the wrapper function.
	    _bindFuncAsProp(log, 'low', rootLogger.low, rootLogger);
	    _bindFuncAsProp(log, 'high', rootLogger.high, rootLogger);
	    _bindFuncAsProp(log, 'norm', rootLogger.norm, rootLogger);
	    _bindFuncAsProp(log, 'enable', rootLogger.enable, rootLogger);
	    _bindFuncAsProp(log, 'disable', rootLogger.disable, rootLogger);
	    return log;
	  }
	  
	  function _bindFuncAsProp(obj, name, f, root) {
	    Object.defineProperty(obj, name, {
	      get: function() { return f.call(root); }
	    });
	  }

	  /**
	   * @summary **Exception handler for logger failures (replacable)**
	   * @description Loggers should not fail, but when they do someting bad has
	   * happened. This is a replaceble function that logs the stack trace
	   * by default.
	   * @static
	   * @param {Error} bindLog the exception that faulted the logger
	   */
	  /* istanbul ignore next */     
	  Logger.failureHandler = function failureHandler(e) {
	    console.log('***** Logger Failure *****:', e.stack);
	  }

	  /**
	   * @summary **Format an object argument (replacable)**
	   * @description Used internally when objects are passed without a format.
	   * @static
	   * @param {*} obj the object to format
	   * @returns the `util.inpect()` of the object
	   */
	  Logger.formatObject = function formatObject(obj) {
	    if (typeof obj === 'undefined') return '(undefined)';  
	    if (obj === null) return '(null)';
	    if (typeof obj === 'object') {
	      if (obj instanceof String ||
	          obj instanceof Number ||
	          obj instanceof Date) {
	        return obj.toString();
	      }
	      else {
	        return mm.util.inspect(obj);
	      }
	    }
	    else {
	      return obj.toString();
	    }
	  }

	  /**
	   * @summary **Logger string format routine**
	   * @description Exposes the format routine used by the logger.
	   * The first parameter is a `sf` compatible format, any remaning 
	   * parameters are substitued into the the format.
	   * The logger failure handler is used for bad formats.
	   * @static
	   * @param {...*} arguments the format string and its arguments
	   * @returns {string} the formatted string
	   */
	  Logger.format = function format() {
	    return Logger.formatArray(Array.prototype.slice.call(arguments));
	  }

	  /**
	   * @summary **Logger string format array of arguments**
	   * @description Exposes the format routine used by the logger.
	   * The first entry
	   * is a `sf` compatible format, any remaning parameters are substitued
	   * into the the format. The logger failure handler is used for bad
	   * formats.
	   * @static
	   * @param {Array} args the format string and its arguments
	   * @returns {string} the formatted string
	   */
	  Logger.formatArray = function formatArray(args) {
	    // If the output contains only one argument or the
	    // first argument is not a format, then produce `toString()` or
	    // `util.inspect` formatted arguments separated by spaces.
	    if (args && args.length > 1 && args[0] && args[0].indexOf('{') > -1) {
	      try {
	        return format.apply(null, args);
	      }
	      catch (e) {
	        Logger.failureHandler(e);
	        // Bad formats provide comma separated outputs, not failure.
	        return args.join(); 
	      }      
	    }
	    else {
	      var outText = '';    
	      var separator = '';
	      args.forEach(function(arg) {
	        outText += separator + Logger.formatObject(arg);
	        separator = ' ';
	      })
	      return outText;
	    }
	  }

	  function _resetPriority(self) {
	    self.messagePriority = PRIORITY.NORMAL;
	    return self;
	  }

	  /**
	   * @summary **Get origin for a message (replacable)**
	   * @description
	   * This is usually used by Destination handlers to get
	   * the origin "[logger name]" prefix to place on the message.
	   * The handlers can add additional information such as a timestamp, 
	   * or omit the origin entirely.
	   * @returns {string} '[logger name]' by default.
	   */
	  Logger.prototype.origin = function origin() {
	    var self = this;
	    return '[' + self.name + ']';
	  }

	  /**
	   * @summary **Add another destination handler to this logger**
	   * @description
	   * Destination handlers are functions which receive the text message
	   * to log, as well as the logger which produced it, and the message
	   * priority: `destFunc(message, logger, priority)`.
	   * Multiple identical destinations are ignored.
	   * @param {function(message, Logger, priority)} handler 
	   *    the destination function
	   * @returns {Logger} the logger for chaining
	   */
	  Logger.prototype.addDestination = function addDestination(handler)
	  { 
	    var self = this;
	    if (_.indexOf(self.destinations, handler) < 0) {
	      self.destinations.push(handler);
	    }
	    return _resetPriority(self);
	  }

	  /**
	   * @summary **Remove a handler from this logger**
	   * @description
	   * Removes a single destination handler, or clears them all with '*'.
	   * @param {function(message, Logger, priority)|*} handler the
	   *    destination handler function or '*'.
	   * @returns {Logger} the logger for chaining
	   */
	  Logger.prototype.removeDestination = function removeDestination(handler)
	  { 
	    var self = this;
	    if (handler === '*') {
	      self.destinations = [];
	    }
	    else if (_.indexOf(self.destinations, handler) >= 0) {
	      self.destinations = _.without(self.destinations, handler);
	    }
	    return _resetPriority(self);
	  }
	  
	  /**
	   * @summary **Log a message**
	   * @description
	   * This is often a `format` followed by objects, but can be a simple
	   * text string, or a list of objects.  The message will be converted
	   * into a text string and output to all of the destinations of this
	   * logger and its parents, unless the message is rejected by a
	   * filter, or the logger is disabled.
	   * @param {...*} arguments zero or more objects, often with a leading format string.
	   * @returns {Logger} the logger for chaining
	   */
	  Logger.prototype.log = function log() {
	    var self = this;
	    if (self.enabled) {
	      var args = Array.prototype.slice.call(arguments);
	      return self.logArray(args);
	    }
	    return _resetPriority(self);
	  }

	  /**
	   * @summary **Select the lowest priority to log**
	   * @description
	   * Modifies the minimumPriority to filter the logging of messages.
	   * @param {number} v The minimum priority to log
	   * @returns {Logger} the logger for chaining
	   * @example
	   *    logger.allowPriority(Logger.PRIORITY.LOW);
	   */
	  Logger.prototype.allowPriority = function allowPriority(v) {
	    var self = this;
	    self.minimumPriority = v;
	    return self;
	  }

	  /**
	   * @summary **Select priority for the next message sent**
	   * @description
	   * Once the message has been dispatched, the next message will
	   * be at PRIORITY.NORMAL (1).
	   * @param {number} v The priority to use
	   * @returns {Logger} the logger for chaining
	   * @example
	   *    logger.prioriy(5).log("And now a message from our sponsors");
	   */
	  Logger.prototype.priority = function priority(v) {
	    var self = this;
	    self.messagePriority = self.enabled ? v : PRIORITY.NORMAL;
	    return self;
	  }

	  /**
	   * @summary **Select HIGH priority for the next message sent**
	   * @returns {Logger} the logger for chaining
	   */
	  Logger.prototype.high = function high () {
	    return this.priority(PRIORITY.HIGH);
	  }

	  /**
	   * @summary **Select LOW priority for the next message sent**
	   * @returns {Logger} the logger for chaining
	   */
	  Logger.prototype.low = function low () {
	    return this.priority(PRIORITY.LOW);
	  }

	  /**
	   * @summary **Select NORMAL priority for the next message sent**
	   * @description
	   * This is usually a no-op, but is sometimes useful as a placeholder
	   * for substitution with high or low in the source.
	   * @returns {Logger} the logger for chaining
	   */
	  Logger.prototype.norm = function norm () {
	    return this.priority(PRIORITY.NORMAL);
	  }

	  /**
	   * @summary **Enable the logger**
	   * @description
	   * When a logger is enabled then any messages with a priority greater
	   * than or equal to the `minimumPriority` (as set by {@link allowPriority})
	   * will be logged to all of the destination handlers of this logger andt
	   * its parent handlers (unless it is disabled).
	   * @param {boolean} value optional state to set the logger to
	   * @returns {Logger} the logger for chaining
	   */
	  Logger.prototype.enable = function enable(value) {
	    var self = this;
	    self.enabled = (arguments.length === 0 || value);
	    return self;
	  }

	  /**
	   * @summary **Disable this logger**
	   * @description
	   * When a logger is disabled then any messages sent to this logger are
	   * discarded. This encludes messages sent from child loggers to this one.
	   * By extension, this means that the parent to this logger will receive
	   * no messages from this logger or its children.
	   * @returns {Logger} the logger for chaining
	   */
	  Logger.prototype.disable = function disable() {
	    return this.enable(false);
	  }

	  /**
	   * @summary **Log an array of objects as a message**
	   * @description
	   * The first object can be a format.
	   * @param {Array} args zero or more objects in an array.S
	   * @returns {Logger} the logger for chaining
	   */
	  Logger.prototype.logArray = function logArray(args) {
	    var self = this;
	    var outText = '';    
	    if (self.enabled) {
	      outText = Logger.formatArray(args);
	    }
	    return self.logString(outText);
	  }

	  /**
	   * @summary **Log a single string message to the logger's destinations**
	   * @param {string} text the message to log.
	   * @returns {Logger} the logger for chaining
	   */
	  Logger.prototype.logString = function logString(text) {
	    var self = this;
	    if (self.enabled) {    
	      var messagePriority = self.messagePriority;
	      var logger = self;
	      var originLogger = self;
	      while (logger) {
	        if (logger.enabled) {
	          _logString(text, originLogger, logger, messagePriority);
	          logger = logger.parent;
	        }
	        else {
	          logger = null;
	        }
	      }
	    }
	    return _resetPriority(self);
	  }

	  function _logString(text, originLogger, logger, messagePriority) {
	    if (messagePriority >= logger.minimumPriority) {
	      logger.destinations.forEach(function (handler) {
	        _logStringToDestination(handler, text, originLogger, messagePriority);
	      })
	    }
	  }

	  function _logStringToDestination(handler, text, logger, messagePriority) {
	    try {
	      handler(text, logger, messagePriority);
	    }
		  catch (e) {
		      // Loggers should hide the problems caused by badly
		      // behaving destination handlers and just eat the bad
		      // messages, or whatever else is causing the trouble.
		      // This keeps the logger from being part of the problem
		      // thats causing whatever nightmare is in progress.
	        /* istanbul ignore next */
	        Logger.failureHandler(e);
		    }
	    }

	  return Logger;
	}


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use srict';
	/**
	 * @fileOverview The Loggers used by mMeddleSequencedObject static methods 
	 *       and constructor.
	 * @module util/log
	 */ 
	module.exports = function registerLoggers(mm) {
	  var Logger = mm.Logger;
	  
	  // The rootLogger provides a common logger to catch
	  // all log messages. By default it has no destinations.
	  var rootLogger    = new Logger('log');
	  var debugLogger   = new Logger('debug',   rootLogger);
	  var infoLogger    = new Logger('info',    rootLogger);
	  var statusLogger  = new Logger('status',  rootLogger);
	  var warningLogger = new Logger('warning', rootLogger);
	  var errorLogger   = new Logger('error',   rootLogger);

	  /**
	   * @namespace
	   * @property {object}  loggers - The set of available loggers
	   * @property {Logger}  loggers.rootLogger - the common logger
	   *   used to contain any destination handlers that aggregate output
	   *   from all other loggers. The `log` method of this logger is
	   *   not normally used.
	   * @property {Logger}  loggers.debugLogger - output from the program
	   *   that is not intended for users, only developers of this code.
	   *   Shortcut access: **mm.log.debug()**
	   * @property {Logger}  loggers.infoLogger - general info about the
	   *   execution of the program that should be saved persistently.
	   *   Shortcut access: **mm.log()** as well as **mm.log.info()**
	   * @property {Logger}  loggers.statusLogger - progress information
	   *   that is normally displayed on the user interface.
	   *   Shortcut access: **mm.log.status()**  
	   * @property {Logger}  loggers.warningLogger - execution warnings
	   *   not usually viewed by the user, but logged persistently.
	   *   Shortcut access: **mm.log.warn()*  
	   * @property {Logger}  loggers.errorLogger - execution errors that the
	   *   Shortcut access: **mm.log.error()**     
	   *   user needs to see
	   */   
	  mm.loggers = {
	    rootLogger: rootLogger, 
	    debugLogger: debugLogger,
	    infoLogger: infoLogger,    
	    statusLogger: statusLogger,
	    warningLogger: warningLogger,
	    errorLogger: errorLogger
	  }

	  var log    = Logger.bindLog(infoLogger);
	  log.debug  = Logger.bindLog(debugLogger);  
	  log.info   = Logger.bindLog(infoLogger);
	  log.status = Logger.bindLog(statusLogger);
	  log.warn   = Logger.bindLog(warningLogger);
	  log.error  = Logger.bindLog(errorLogger);

	  /**
	   * @summary **Logger destination for console logging**
	   * @description
	   * The console log is used for info, and status messages, as well as
	   * when other console log types are unavailable for a given environment.
	   * @param {string} message the text of the message
	   * @param {Logger} logger the logger which originate this message
	   * @param {number} priority the `Logger.PRIORITY` of the message
	   * @alias module:utils/log.consoleLogHandler
	   */
	  function consoleLogHandler(message, logger, priority) {
	    defaultLogHandler(console.log, message, logger, priority);
	  }

	  /**
	   * @summary **Logger destination handler for debug logging**
	   * @description   
	   * This is added to the {@link debugLogger} to handle `log.debg` messages.
	   * @param {string} message the text of the message
	   * @param {Logger} logger the logger which originate this message
	   * @param {number} priority the `Logger.PRIORITY` of the message
	   * @alias module:utils/log.debugLogHandler
	   */
	  /* istanbul ignore next */
	  function debugLogHandler(message, logger, priority) {
	    // Node has no console.debug  
	    if (!console.debug) return consoleLogHandler(message, logger, priority);
	    defaultLogHandler(console.debug, message, logger, priority);
	  }
	  
	  /**
	   * @summary **Logger destination handler for error logging**
	   * @description
	   * This is added to the {@link errorLogger} to handle `log.error` messages.
	   * On `Node.js` this is to **stdio.err**. On browsers these are treated
	   * as `warn` messages since error logging is an ugly stack trace.
	   * @param {string} message the text of the message
	   * @param {Logger} logger the logger which originate this message
	   * @param {number} priority the `Logger.PRIORITY` of the message
	   * @alias module:utils/log.errorLogHandler
	   */
	  /* istanbul ignore next */   
	  function errorLogHandler(message, logger, priority) {
	    // Use the warning log by default in a browser, since the error log
	    // ends up with an annoying stack trace of the logger itself. Not useful.
	    if (mm.inBrowser) return warningLogHandler(message, logger, priority);  
	    if (!console.error) return consoleLogHandler(message, logger, priority);
	    // In node, console.error outputs to stdio.err
	    defaultLogHandler(console.error, message, logger, priority);
	 }

	  /**
	   * @summary **Logger destination handler for warning logging**
	   * @description
	   * This is added to the {@link Logger} to handle `log.warn` messages.
	   * On browsers such as *FireFox*, warninge messages are output in yellow
	   * with a nice tag in the console window of the debugging tools.
	   * @param {string} message the text of the message
	   * @param {Logger} logger the logger which originate this message
	   * @param {number} priority the `Logger.PRIORITY` of the message
	   * @alias module:utils/log.warningLogHandler
	   */
	   /* istanbul ignore next */
	   function warningLogHandler(message, logger, priority) {
	    if (!console.warn) return consoleLogHandler(message, logger, priority);
	    // In node, console.warn outputs to stdio.err
	    defaultLogHandler(console.warn, message, logger, priority);
	  }

	  /**
	   * @summary **Logger destination handler common function**
	   * @description
	   * This does the actual formatting of messages for the text line oriented
	   * log messages.
	   * @param {function} func the actual message output function
	   * @param {string} message the text of the message
	   * @param {Logger} logger the logger which originate this message
	   * @param {number} priority the `Logger.PRIORITY` of the message
	   * @alias module:utils/log.defaultLogHandler
	   */
	  function defaultLogHandler(func, message, logger, priority) {
	    var ptext = '';
	    /* istanbul ignore next */
	    ptext = priority > 1 ? '(!)' : ptext;
	    var prefix = logger.origin() + ptext + ':';
	    var text = prefix + message;
	    // For the PhantomJS headless browser, log.debug is a native
	    // function that doesn't like being passed around.
	    /* istanbul ignore if */
	    if (mm.inPhantom) {
	      console.log(text);
	    }
	    else {
	      func(text);
	    }
	  }

	  infoLogger.addDestination(consoleLogHandler);  
	  statusLogger.addDestination(consoleLogHandler);
	  debugLogger.addDestination(debugLogHandler);
	  warningLogger.addDestination(warningLogHandler);
	  errorLogger.addDestination(errorLogHandler);

	  return log;
	}


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview SequencedObject static methods and constructor.
	 * @module util/SequencedObject
	 */
	'use strict';
	module.exports = function registerSequencedObject(mm) {
	  var qq = mm.Q,
	      debug = mm.log.debug;
	   var CoreObject = mm.obj.CoreObject;

	  /**
	   * @class
	   * @summary Create a SequencedObject.
	   * @description
	   * An object which has an internal `q` promise that is used to sequence
	   * some or all of the methods called on the object. Methods that need to
	   * be sequenced (i.e. deferred or promise based) use either the
	   * `sequencedFunc` or `deferredFunc` internally.
	   * @constructor
	   * @returns {SequencedObject} the new `SequencedObject`.
	   */
	  var SequencedObject = function SequencedObject() {
	    var self = this;

	    /**
	     * The `Q` promise used to sequence operations on this object.
	     * @type {Promise}
	     * @name q
	     * @memberOf module:util/SequencedObject~SequencedObject#
	     */          
	    self.q = qq(true);

	    /**
	     * The number of sequenced operations performed on this object.
	     * @type {number}
	     * @name sequencedOperationsCount
	     * @memberOf module:util/SequencedObject~SequencedObject#
	     */
	    self.sequencedOperationsCount = 0;  
	  }
	  
	  SequencedObject.prototype = Object.create(CoreObject.prototype);

	  /**
	   * @summary **Schedules a deferred function on the `q` promise**
	   * @description
	   * Calls from a function in your `SequencedObject` which will resolve 
	   * or fail by calling `deferred.reject(err)` or
	   * `deferred.resolve(returnValue)` from within a callback or event
	   * handler routine. 
	   * 
	   * The function will not be called until all other currently scheduled
	   * routines on the object have resolved. If any of the currently scheduled
	   * routines break the promise this this routine will not be called.
	   *    
	   * @param {function} f A function that takes (`deferred` as its first
	   *    argument. The remaining arguments will be the ones that were passed
	   *    to your function.
	   * @returns {Promise} a Promise to whatever the function returns.
	   * @example
	   * var YourSeqObj = function() { // Constructor for your object.
	   *   var self = this;
	   *   SequencedObject.call(self); // populate parent instance fields.
	   *   self.xxxx // your objects members;
	   *   ..
	   * }
	   * YourSeqObj.prototype = Object.create(SequencedObject.prototype);
	   * 
	   * YourSeqObj.prototype.yourFunc = function yourFunc(a1, a2, a3) {
	   *   var self = this;
	   *   return self.deferredFunc(a1, a2, a3, function(deferred, a1, a2, a3) {
	   *     ... the meat of your routine to be executed in sequence ...
	   *     ... then somewhere in a callback or event handler routine use:
	   *       deferred.resolve(yourReturnValue); // call on success.
	   *     or if something goes wrong:
	   *       deferred.reject(new Error('your failure message'));  
	   *     ...
	   *   })
	   * };   
	   */
	  SequencedObject.prototype.deferredFunc = function deferredFunc() {
	    var self = this;
	    var deferred = qq.defer();
	    var func = arguments[arguments.length - 1];
	    var fargs = Array.prototype.slice.call(arguments, 0, -1);
	    var q = self.q;
	    //debug('++ Sequence for "' + func.name + '" on ', q);
	    var promise = deferred.promise;
	    fargs.unshift(deferred);
	    // Subsequent callers will follow this sequenced operation.
	    self.q = promise;    
	    q.then(function sequenced() {
	      //debug('++++ THEN resolved Sequence for "' + func.name + '" using ', q);
	      // The func must resolve the deferred which is passed as
	      // the first argument to the function.
	      try {
	        func.apply(self, fargs); // Do the deferred operation function.
	        self.sequencedOperationsCount++;
	      }
	      catch(err) {
	        debug('**** EXCEPTION "' + func.name + '" using ', q, err);
	        deferred.reject(err);
	      }
	      //debug('++++ Applied "' + func.name + '" using ', q);
	    }, function(err) {
	      debug('**** FAILED "' + func.name + '" using ', q, err);
	      // trigger any error handling for users of this operation.
	      deferred.reject(err);
	    });

	    // The callers .then will resolve only when this operation in
	    // the sequence is completed - regardless of whether there have
	    // been other operations scheduled on the object later.
	    //debug('++ Sequence for "' + func.name + '" RETURNED ', promise);    
	    return promise;
	  }

	  /**
	   * @summary **Clears a broken `q` promise**
	   * @description
	   * Once a function in your `SequencedObject` has broken a promise
	   * (or called `deferred.reject`) then all subsequent operations will
	   * immediately fail, returning the same broken promise.
	   * 
	   * If a failure has (or may have) happened on your object, then call
	   * `clearFailure()` first. 
	   * @example
	   * yourObj.doSomethingThatMayFail()
	   * .then{function(success) {
	   *   ... handle the success ...
	   * }, function(fail) {
	   *   ... handle the failure ...  
	   *   yourObj.clearFailure(); // Without this, thingToDoNow will fail.
	   *   yourObj.thingToDoNow();
	   * });
	   */
	  SequencedObject.prototype.clearFailure = function clearFailure() {
	    var self = this;
	    self.q = qq(true);
	  };

	  /**
	   * @summary **Schedule operations on the object**
	   * @description
	   * Places a one or more functions on the queue of this sequenced object.
	   * @example
	   *   yourObj.next(successFunc, failFunc, progressFunc) ...
	   *   // note this is identical to:
	   *   yourObj.q.then(successFunc, failFunc, progressFunc) ...
	   */
	  SequencedObject.prototype.next = function () {
	    // Don't define a .then function or Q will try to do odd things
	    // with it.  This is fancy enough for now.
	    var self = this;
	    return self.q.then.apply(self.q, arguments);
	  };  

	  return SequencedObject;
	}

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * @fileOverview Storage abstractions
	 * @module sal/storage
	 */ 
	 module.exports = function(mm) {
	  var qq = mm.Q,
	      debug = mm.log.debug;
	  
	//  var SequencedObject = mm.obj.SequencedObject;
	 
	  var storage = {};
	  //var users = mm.users;

	  storage.space = {};
	/**
	 * Write a value into storage.
	 *
	 * @memberOf storage
	 * @param {string} the username for the collection.
	 * @param {string} the collection name.
	 * @param {string} the item name.
	 * @param {string} the value of the item to store.
	 * @returns {Promise} resolves when item is being stored.
	 * @example
	 *
	 * var animals = [
	 *   { cat: 'edmund' },
	 *   { cat: 'rosie' },
	 *   { dog: 'silly' }
	 *  ];
	 *  
	 * var promise = storage.store('john', 'allAnimals', 'myAnimals', animals);
	 * promise.then(function(r) { console.log('- Stored: ', r )});
	 * // => true
	 */
	  storage.store = function (userName, collectionName, itemName, value) {
	    debug('- Item:', value);  
	    return qq.fcall(function() {
	      debug('-- Item:', value);
	      return JSON.stringify(value);
	    })
	    .delay(400)
	    .then(function(s) {
	      var location = {
	        user: userName,
	        collection: collectionName,
	        item: itemName
	      };

	      debug('- Stored: "{user}/{collection}/{item}" as "{1}"', location, s);
	      debug('- Stored: "{0:inspect}"', location);
	      debug('- Stored: "{0:json}"', location);
	    })
	  }

	  storage.remove = function (userName, collectionName, item) {
	    return storage;
	  }

	  storage.readFile = function (filename, dataHandler) {
	    return storage;
	  }
	  
	  return storage;
	}

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * @fileOverview The Loggers used by mMeddleSequencedObject static methods 
	 *       and constructor.
	 * @module sal/users
	 */ 
	module.exports = function registerSalUsers(mm) {
	  var text2ua = mm.util.text2ua,
	      ua2hex = mm.util.ua2hex,
	      debug = mm.log.debug;
	  
	  var SequencedObject = mm.obj.SequencedObject,
	      Enum = mm.obj.Enum;
	      
	  var sha256 = __webpack_require__(31);

	  var T = 10;
	  
	  // The cache of users and user management methods.  
	  var users = {};
	  users.inMemoryUserCache = {};
	  
	  /**
	   * @summary **Create a PersistentUser**
	   * @description
	   * A PersistentUser contains the information about a user that is
	   * persistently stored in files, or a database.
	   * @constructor
	   * @param {User} u the User used to create this one.
	   * @returns {PersistentUser} the new persistent user.
	   */  
	  var PersistentUser = (function persistentUserCtorCreator() {
	    var ctor = function PersistentUser(u) {
	      var self = this;
	      self.name = u.name;
	      self.privatePassword = u.privatePassword;
	      self.creationDate = u.creationDate;
	      self.pbkdf2Salt = u.pbkdf2Salt;
	    };

	    return ctor;
	  }());

	  /**
	   * @summary **Create a User**
	   * @description
	   * A User holds information about a person or authority that has
	   * access rights to some part of a workspace and its storage.
	   * Users are SequencedObjects since most of the activites on a given
	   * user must occur in specific orders.
	   * @constructor
	   * @param {string} userName the name of the user's alias.
	   * @returns {User} the new user
	   */  
	  var User = (function userCtorCreator() {
	    // static initialization here.
	    var STATUS = new Enum('unknown|loaded|saved|pending|created|active|failed');

	    var ctor = function User(userName) {
	      var self = this;

	      SequencedObject.call(self); // populate parent instance fields.
	      self.privatePassword = '';
	      self.name = userName;
	      self.STATUS = STATUS;
	      self.status = self.STATUS.unknown;
	      
	      function setPassword(pwd) { 
	        self.privatePassword = pwd; 
	      }

	      function getPassword() { 
	        return self.privatePassword; 
	      }

	      function passwordMatches(testPassword) {
	        return self.privatePassword === testPassword;
	      }

	      self.setPassword = setPassword;
	      self.passwordMatches = passwordMatches;
	      self.getPassword = getPassword;

	      self.lock = function lockUser() { 
	        self.getPassword = function userIsLocked() { return ''; }
	      }
	    }
	    return ctor;
	  }());

	  User.prototype = Object.create(SequencedObject.prototype);
	  User.prototype.PBKDF2_ROUNDS = 1000; // A reasonable number of rounds.
	  User.prototype.PBKDF2_DKLEN = 16; // 16 byte derived key.

	  /**
	   * @summary Loads a User from persistent storage
	   * @description
	   * The PersistentUser in storage is looked up by the name alias
	   * loaded into this User object. All existing fields in the user are
	   * replaced by those from storage.
	   * @returns {Promise} a promise to the User
	   */
	  User.prototype.load = function loadUser () {
	    var self = this;
	    return self.deferredFunc(function loadSequenced(deferred) {
	      //var statusMessage = 'loading user: ' + self.name;
	      setTimeout(function() {
	          var u = users.inMemoryUserCache[self.name];
	          if (u) {
	            self.name = u.name;
	            self.privatePassword = u.privatePassword;
	            self.creationDate = u.creationDate;
	            self.pbkdf2Salt = u.pbkdf2Salt;
	            self.status = self.STATUS.loaded;
	            var finishedMessage = 'loaded "' + self.name + '"';
	            debug(finishedMessage, self.sequencedOperationsCount);
	            deferred.resolve(self);
	          }
	          else {
	            var notLoadedMessage = 'not loaded "' + self.name + '"';
	            debug(notLoadedMessage, self.sequencedOperationsCount);
	            self.status = self.STATUS.failed;            
	            deferred.reject(new Error(notLoadedMessage));
	          }
	      }, T);
	    })
	  };

	  /**
	   * @summary Save a User into persistent storage
	   * @description
	   * The PersistentUser in storage is replaced by information from this
	   * one, or a new user is created in storage.
	   * @returns {Promise} a promise to the User
	   */
	  User.prototype.save = function saveUser () {
	    var self = this;
	    return self.deferredFunc(function saveSequenced(deferred) {
	      var statusMessage = 'saving user: "' + self.name + '"';
	      debug(statusMessage);
	      setTimeout(function() {
	          var u = users.inMemoryUserCache[self.name];
	          if (u) {
	            if (self.privatePassword === u.privatePassword) {
	              self.status = self.STATUS.loaded;
	              var finishedMessage = 'already saved "' + self.name + '"';
	              debug(finishedMessage, self.sequencedOperationsCount);
	              deferred.resolve(self);
	            }
	            else {
	              var failedMessage = '*save failed for "' + self.name + '"';
	              debug(failedMessage);
	              deferred.reject(new Error(failedMessage));
	            }
	          }
	          else {
	            u = new PersistentUser(self);
	            self.status = self.STATUS.saved;
	            users.inMemoryUserCache[u.name] = u;
	            var savedMessage = 'saved "' + self.name + '"';
	            debug(savedMessage, self.sequencedOperationsCount);
	            deferred.resolve(self);
	          }
	      }, T);
	    })
	  };
	  
	  /**
	   * @summary Create a password for a User
	   * @description
	   * The User is given a password. Persistent storage is not accessed.
	   * The plain text password is immediately encoded as a PBKDF2 hash.
	   * @param {string} password the plain text of a password.
	   * @returns {Promise} a promise to the User
	   */
	  User.prototype.create = function createUser(password) {
	    var self = this;
	    return self.deferredFunc(password,
	      function createSequenced(deferred, password) {
	      self.creationDate = new Date();
	      self.status = self.STATUS.pending;
	      if (password) {
	        //statusMessage = 'computing ' + self.name;
	        // The PBKDF2 salt is per user and is based on the sub millisecond
	        // datetime for when the user was created. Its a small comfort.
	        self.pbkdf2Salt = ua2hex(text2ua(self.creationDate.toISOString()));
	        var uIntArrayPassword = sha256.pbkdf2(
	            text2ua(password), 
	            self.pbkdf2Salt,
	            self.PBKDF2_ROUNDS,
	            self.PBKDF2_DKLEN);
	        self.setPassword(ua2hex(uIntArrayPassword));
	        self.status = self.STATUS.created;
	      }

	      setTimeout(function() {
	          var createdMessage = 'created user"' + self.name + '"';
	          debug(createdMessage);
	          deferred.resolve(self);
	      }, T);
	    })
	  };

	  /**
	   * @summary Login the User
	   * @description
	   * The plain text password is checked against the User to determine
	   * if there is a match. If there is a match then private information
	   * about this user will be loaded from storage.
	   * @param {string} password the plain text of a password to check.
	   * @returns {Promise} a promise to the User
	   */
	  User.prototype.login = function loginUser(password) {
	    var self = this;
	    return self.deferredFunc(password,
	      function loginSequenced(deferred, password) {
	      var testPassword = ua2hex(sha256.pbkdf2(
	          text2ua(password), 
	          self.pbkdf2Salt,
	          self.PBKDF2_ROUNDS,
	          self.PBKDF2_DKLEN));
	      debug('-- login test pwd:', '[' + testPassword + ']');
	      debug('-- login user pwd:', '[' + self.getPassword() + ']');
	      setTimeout(function() {
	        if (self.passwordMatches(testPassword)) {
	          self.status = self.STATUS.active;
	          var activatedMessage = 'logged in ' + self.name;
	          debug(activatedMessage);
	          deferred.resolve(self);
	        }
	        else {
	          self.status = self.STATUS.failed;
	          var failedMessage = '*login failed for ' + self.name;
	          debug(failedMessage);
	          deferred.reject(new Error(failedMessage));
	          //debug('=== Deferred:', deferred);
	        }
	      }, T);
	    })
	  };

	  /**
	   * @summary Remove the User
	   * @description
	   * The user is removed from storage.
	   * @returns {Promise} a promise to the User
	   */
	  User.prototype.remove = function removeUser() {
	    var self = this;
	    return self.deferredFunc(function deleteSequenced(deferred) {
	      setTimeout(function() {
	          var finishedMessage = 'deleted ' + self.name;
	          debug(finishedMessage);
	          deferred.resolve(self);
	      }, T); 
	    })
	  };

	  users.User = User;
	  return users;
	}

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	module.exports = function registerSalUserStorage(mm) {
	//var SequencedObject = mm.obj.SequencedObject;

	  var us = {};
	  
	  
	  
	/*  
	  
	  // The cache of users and user management methods.  
	  var users = {};
	  users.inMemoryUserCache = {};
	  
	  var PersistentUser = (function persistentUserCtorCreator() {
	    var ctor = function PersistentUser(u) {
	      var self = this;
	      self.name = u.name;
	      self.privatePassword = u.privatePassword;
	      self.creationDate = u.creationDate;
	      self.pbkdf2Salt = u.pbkdf2Salt;
	    };

	    return ctor;
	  }());

	  var User = (function userCtorCreator() {
	    // static initialization here.
	    var STATUS = new Enum('unknown|loaded|saved|pending|created|active|failed');

	    var ctor = function User(userName) {
	      var self = this;

	      SequencedObject.call(self); // populate parent instance fields.
	      self.privatePassword = '';
	      self.name = userName;
	      self.STATUS = STATUS;
	      self.status = self.STATUS.unknown;
	      
	      function setPassword(pwd) { 
	        self.privatePassword = pwd; 
	      }

	      function getPassword() { 
	        return self.privatePassword; 
	      }

	      function passwordMatches(testPassword) {
	        return self.privatePassword === testPassword;
	      }

	      self.setPassword = setPassword;
	      self.passwordMatches = passwordMatches;
	      self.getPassword = getPassword;

	      self.lock = function lockUser() { 
	        self.getPassword = function userIsLocked() { return ''; }
	      }
	    }
	    return ctor;
	  }());

	  User.prototype = Object.create(SequencedObject.prototype);
	  User.prototype.PBKDF2_ROUNDS = 1000; // A reasonable number of rounds.
	  User.prototype.PBKDF2_DKLEN = 16; // 16 byte derived key.

	  User.prototype.load = function loadUser () {
	    var self = this;
	    return self.sequencedFunc(function loadSequenced(deferred) {
	      //var statusMessage = 'loading user: ' + self.name;
	      setTimeout(function() {
	          var u = users.inMemoryUserCache[self.name];
	          if (u) {
	            self.name = u.name;
	            self.privatePassword = u.privatePassword;
	            self.creationDate = u.creationDate;
	            self.pbkdf2Salt = u.pbkdf2Salt;
	            self.status = self.STATUS.loaded;
	            var finishedMessage = 'loaded "' + self.name + '"';
	            debug(finishedMessage, self.sequencedOperationsCount);
	            deferred.resolve(self);
	          }
	          else {
	            var notLoadedMessage = 'not loaded "' + self.name + '"';
	            debug(notLoadedMessage, self.sequencedOperationsCount);
	            self.status = self.STATUS.failed;            
	          }
	      }, T);
	    })
	  };

	  User.prototype.save = function saveUser () {
	    var self = this;
	    return self.sequencedFunc(function saveSequenced(deferred) {
	      var statusMessage = 'saving user: "' + self.name + '"';
	      debug(statusMessage);
	      setTimeout(function() {
	          var u = users.inMemoryUserCache[self.name];
	          if (u) {
	            if (self.privatePassword === u.privatePassword) {
	              self.status = self.STATUS.loaded;
	              var finishedMessage = 'already saved "' + self.name + '"';
	              debug(finishedMessage, self.sequencedOperationsCount);
	              deferred.resolve(self);
	            }
	            else {
	              var failedMessage = '*save failed for "' + self.name + '"';
	              debug(failedMessage);
	              deferred.reject(new Error(failedMessage));
	            }
	          }
	          else {
	            u = new PersistentUser(self);
	            self.status = self.STATUS.saved;
	            users.inMemoryUserCache[u.name] = u;
	            var savedMessage = 'saved "' + self.name + '"';
	            debug(savedMessage, self.sequencedOperationsCount);
	            deferred.resolve(self);
	          }
	      }, T);
	    })
	  };
	  
	  User.prototype.create = function createUser(password) {
	    var self = this;
	    return self.sequencedFunc(password,
	      function createSequenced(deferred, password) {
	      self.creationDate = new Date();
	      self.status = self.STATUS.pending;
	      if (password) {
	        //statusMessage = 'computing ' + self.name;
	        // The PBKDF2 salt is per user and is based on the sub millisecond
	        // datetime for when the user was created. Its a small comfort.
	        self.pbkdf2Salt = ua2hex(text2ua(self.creationDate.toISOString()));
	        var uIntArrayPassword = sha256.pbkdf2(
	            text2ua(password), 
	            self.pbkdf2Salt,
	            self.PBKDF2_ROUNDS,
	            self.PBKDF2_DKLEN);
	        self.setPassword(ua2hex(uIntArrayPassword));
	        self.status = self.STATUS.created;
	      }

	      setTimeout(function() {
	          var createdMessage = 'created user"' + self.name + '"';
	          debug(createdMessage);
	          deferred.resolve(self);
	      }, T);
	    })
	  };

	  User.prototype.login = function loginUser(password) {
	    var self = this;
	    return self.sequencedFunc(password,
	      function loginSequenced(deferred, password) {
	      var testPassword = ua2hex(sha256.pbkdf2(
	          text2ua(password), 
	          self.pbkdf2Salt,
	          self.PBKDF2_ROUNDS,
	          self.PBKDF2_DKLEN));
	      debug('-- login test pwd:', '[' + testPassword + ']');
	      debug('-- login user pwd:', '[' + self.getPassword() + ']');
	      setTimeout(function() {
	        if (self.passwordMatches(testPassword)) {
	          self.status = self.STATUS.active;
	          var activatedMessage = 'logged in ' + self.name;
	          debug(activatedMessage);
	          deferred.resolve(self);
	        }
	        else {
	          self.status = self.STATUS.failed;
	          var failedMessage = '*login failed for ' + self.name;
	          debug(failedMessage);
	          deferred.reject(new Error(failedMessage));
	          //debug('=== Deferred:', deferred);
	        }
	      }, T);
	    })
	  };

	  User.prototype.remove = function removeUser() {
	    var self = this;
	    return self.sequencedFunc(function deleteSequenced(deferred) {
	      setTimeout(function() {
	          var finishedMessage = 'deleted ' + self.name;
	          debug(finishedMessage);
	          deferred.resolve(self);
	      }, T); 
	    })
	  };
	*/

	  return us;
	}

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	var formatRegExp = /%[sdj%]/g;
	exports.format = function(f) {
	  if (!isString(f)) {
	    var objects = [];
	    for (var i = 0; i < arguments.length; i++) {
	      objects.push(inspect(arguments[i]));
	    }
	    return objects.join(' ');
	  }

	  var i = 1;
	  var args = arguments;
	  var len = args.length;
	  var str = String(f).replace(formatRegExp, function(x) {
	    if (x === '%%') return '%';
	    if (i >= len) return x;
	    switch (x) {
	      case '%s': return String(args[i++]);
	      case '%d': return Number(args[i++]);
	      case '%j':
	        try {
	          return JSON.stringify(args[i++]);
	        } catch (_) {
	          return '[Circular]';
	        }
	      default:
	        return x;
	    }
	  });
	  for (var x = args[i]; i < len; x = args[++i]) {
	    if (isNull(x) || !isObject(x)) {
	      str += ' ' + x;
	    } else {
	      str += ' ' + inspect(x);
	    }
	  }
	  return str;
	};


	// Mark that a method should not be used.
	// Returns a modified function which warns once by default.
	// If --no-deprecation is set, then it is a no-op.
	exports.deprecate = function(fn, msg) {
	  // Allow for deprecating things in the process of starting up.
	  if (isUndefined(global.process)) {
	    return function() {
	      return exports.deprecate(fn, msg).apply(this, arguments);
	    };
	  }

	  if (process.noDeprecation === true) {
	    return fn;
	  }

	  var warned = false;
	  function deprecated() {
	    if (!warned) {
	      if (process.throwDeprecation) {
	        throw new Error(msg);
	      } else if (process.traceDeprecation) {
	        console.trace(msg);
	      } else {
	        console.error(msg);
	      }
	      warned = true;
	    }
	    return fn.apply(this, arguments);
	  }

	  return deprecated;
	};


	var debugs = {};
	var debugEnviron;
	exports.debuglog = function(set) {
	  if (isUndefined(debugEnviron))
	    debugEnviron = process.env.NODE_DEBUG || '';
	  set = set.toUpperCase();
	  if (!debugs[set]) {
	    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
	      var pid = process.pid;
	      debugs[set] = function() {
	        var msg = exports.format.apply(exports, arguments);
	        console.error('%s %d: %s', set, pid, msg);
	      };
	    } else {
	      debugs[set] = function() {};
	    }
	  }
	  return debugs[set];
	};


	/**
	 * Echos the value of a value. Trys to print the value out
	 * in the best way possible given the different types.
	 *
	 * @param {Object} obj The object to print out.
	 * @param {Object} opts Optional options object that alters the output.
	 */
	/* legacy: obj, showHidden, depth, colors*/
	function inspect(obj, opts) {
	  // default options
	  var ctx = {
	    seen: [],
	    stylize: stylizeNoColor
	  };
	  // legacy...
	  if (arguments.length >= 3) ctx.depth = arguments[2];
	  if (arguments.length >= 4) ctx.colors = arguments[3];
	  if (isBoolean(opts)) {
	    // legacy...
	    ctx.showHidden = opts;
	  } else if (opts) {
	    // got an "options" object
	    exports._extend(ctx, opts);
	  }
	  // set default options
	  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
	  if (isUndefined(ctx.depth)) ctx.depth = 2;
	  if (isUndefined(ctx.colors)) ctx.colors = false;
	  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
	  if (ctx.colors) ctx.stylize = stylizeWithColor;
	  return formatValue(ctx, obj, ctx.depth);
	}
	exports.inspect = inspect;


	// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
	inspect.colors = {
	  'bold' : [1, 22],
	  'italic' : [3, 23],
	  'underline' : [4, 24],
	  'inverse' : [7, 27],
	  'white' : [37, 39],
	  'grey' : [90, 39],
	  'black' : [30, 39],
	  'blue' : [34, 39],
	  'cyan' : [36, 39],
	  'green' : [32, 39],
	  'magenta' : [35, 39],
	  'red' : [31, 39],
	  'yellow' : [33, 39]
	};

	// Don't use 'blue' not visible on cmd.exe
	inspect.styles = {
	  'special': 'cyan',
	  'number': 'yellow',
	  'boolean': 'yellow',
	  'undefined': 'grey',
	  'null': 'bold',
	  'string': 'green',
	  'date': 'magenta',
	  // "name": intentionally not styling
	  'regexp': 'red'
	};


	function stylizeWithColor(str, styleType) {
	  var style = inspect.styles[styleType];

	  if (style) {
	    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
	           '\u001b[' + inspect.colors[style][1] + 'm';
	  } else {
	    return str;
	  }
	}


	function stylizeNoColor(str, styleType) {
	  return str;
	}


	function arrayToHash(array) {
	  var hash = {};

	  array.forEach(function(val, idx) {
	    hash[val] = true;
	  });

	  return hash;
	}


	function formatValue(ctx, value, recurseTimes) {
	  // Provide a hook for user-specified inspect functions.
	  // Check that value is an object with an inspect function on it
	  if (ctx.customInspect &&
	      value &&
	      isFunction(value.inspect) &&
	      // Filter out the util module, it's inspect function is special
	      value.inspect !== exports.inspect &&
	      // Also filter out any prototype objects using the circular check.
	      !(value.constructor && value.constructor.prototype === value)) {
	    var ret = value.inspect(recurseTimes, ctx);
	    if (!isString(ret)) {
	      ret = formatValue(ctx, ret, recurseTimes);
	    }
	    return ret;
	  }

	  // Primitive types cannot have properties
	  var primitive = formatPrimitive(ctx, value);
	  if (primitive) {
	    return primitive;
	  }

	  // Look up the keys of the object.
	  var keys = Object.keys(value);
	  var visibleKeys = arrayToHash(keys);

	  if (ctx.showHidden) {
	    keys = Object.getOwnPropertyNames(value);
	  }

	  // IE doesn't make error fields non-enumerable
	  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
	  if (isError(value)
	      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
	    return formatError(value);
	  }

	  // Some type of object without properties can be shortcutted.
	  if (keys.length === 0) {
	    if (isFunction(value)) {
	      var name = value.name ? ': ' + value.name : '';
	      return ctx.stylize('[Function' + name + ']', 'special');
	    }
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    }
	    if (isDate(value)) {
	      return ctx.stylize(Date.prototype.toString.call(value), 'date');
	    }
	    if (isError(value)) {
	      return formatError(value);
	    }
	  }

	  var base = '', array = false, braces = ['{', '}'];

	  // Make Array say that they are Array
	  if (isArray(value)) {
	    array = true;
	    braces = ['[', ']'];
	  }

	  // Make functions say that they are functions
	  if (isFunction(value)) {
	    var n = value.name ? ': ' + value.name : '';
	    base = ' [Function' + n + ']';
	  }

	  // Make RegExps say that they are RegExps
	  if (isRegExp(value)) {
	    base = ' ' + RegExp.prototype.toString.call(value);
	  }

	  // Make dates with properties first say the date
	  if (isDate(value)) {
	    base = ' ' + Date.prototype.toUTCString.call(value);
	  }

	  // Make error with message first say the error
	  if (isError(value)) {
	    base = ' ' + formatError(value);
	  }

	  if (keys.length === 0 && (!array || value.length == 0)) {
	    return braces[0] + base + braces[1];
	  }

	  if (recurseTimes < 0) {
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    } else {
	      return ctx.stylize('[Object]', 'special');
	    }
	  }

	  ctx.seen.push(value);

	  var output;
	  if (array) {
	    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
	  } else {
	    output = keys.map(function(key) {
	      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
	    });
	  }

	  ctx.seen.pop();

	  return reduceToSingleString(output, base, braces);
	}


	function formatPrimitive(ctx, value) {
	  if (isUndefined(value))
	    return ctx.stylize('undefined', 'undefined');
	  if (isString(value)) {
	    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
	                                             .replace(/'/g, "\\'")
	                                             .replace(/\\"/g, '"') + '\'';
	    return ctx.stylize(simple, 'string');
	  }
	  if (isNumber(value))
	    return ctx.stylize('' + value, 'number');
	  if (isBoolean(value))
	    return ctx.stylize('' + value, 'boolean');
	  // For some reason typeof null is "object", so special case here.
	  if (isNull(value))
	    return ctx.stylize('null', 'null');
	}


	function formatError(value) {
	  return '[' + Error.prototype.toString.call(value) + ']';
	}


	function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
	  var output = [];
	  for (var i = 0, l = value.length; i < l; ++i) {
	    if (hasOwnProperty(value, String(i))) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          String(i), true));
	    } else {
	      output.push('');
	    }
	  }
	  keys.forEach(function(key) {
	    if (!key.match(/^\d+$/)) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          key, true));
	    }
	  });
	  return output;
	}


	function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
	  var name, str, desc;
	  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
	  if (desc.get) {
	    if (desc.set) {
	      str = ctx.stylize('[Getter/Setter]', 'special');
	    } else {
	      str = ctx.stylize('[Getter]', 'special');
	    }
	  } else {
	    if (desc.set) {
	      str = ctx.stylize('[Setter]', 'special');
	    }
	  }
	  if (!hasOwnProperty(visibleKeys, key)) {
	    name = '[' + key + ']';
	  }
	  if (!str) {
	    if (ctx.seen.indexOf(desc.value) < 0) {
	      if (isNull(recurseTimes)) {
	        str = formatValue(ctx, desc.value, null);
	      } else {
	        str = formatValue(ctx, desc.value, recurseTimes - 1);
	      }
	      if (str.indexOf('\n') > -1) {
	        if (array) {
	          str = str.split('\n').map(function(line) {
	            return '  ' + line;
	          }).join('\n').substr(2);
	        } else {
	          str = '\n' + str.split('\n').map(function(line) {
	            return '   ' + line;
	          }).join('\n');
	        }
	      }
	    } else {
	      str = ctx.stylize('[Circular]', 'special');
	    }
	  }
	  if (isUndefined(name)) {
	    if (array && key.match(/^\d+$/)) {
	      return str;
	    }
	    name = JSON.stringify('' + key);
	    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	      name = name.substr(1, name.length - 2);
	      name = ctx.stylize(name, 'name');
	    } else {
	      name = name.replace(/'/g, "\\'")
	                 .replace(/\\"/g, '"')
	                 .replace(/(^"|"$)/g, "'");
	      name = ctx.stylize(name, 'string');
	    }
	  }

	  return name + ': ' + str;
	}


	function reduceToSingleString(output, base, braces) {
	  var numLinesEst = 0;
	  var length = output.reduce(function(prev, cur) {
	    numLinesEst++;
	    if (cur.indexOf('\n') >= 0) numLinesEst++;
	    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
	  }, 0);

	  if (length > 60) {
	    return braces[0] +
	           (base === '' ? '' : base + '\n ') +
	           ' ' +
	           output.join(',\n  ') +
	           ' ' +
	           braces[1];
	  }

	  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	}


	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.
	function isArray(ar) {
	  return Array.isArray(ar);
	}
	exports.isArray = isArray;

	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}
	exports.isBoolean = isBoolean;

	function isNull(arg) {
	  return arg === null;
	}
	exports.isNull = isNull;

	function isNullOrUndefined(arg) {
	  return arg == null;
	}
	exports.isNullOrUndefined = isNullOrUndefined;

	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	exports.isNumber = isNumber;

	function isString(arg) {
	  return typeof arg === 'string';
	}
	exports.isString = isString;

	function isSymbol(arg) {
	  return typeof arg === 'symbol';
	}
	exports.isSymbol = isSymbol;

	function isUndefined(arg) {
	  return arg === void 0;
	}
	exports.isUndefined = isUndefined;

	function isRegExp(re) {
	  return isObject(re) && objectToString(re) === '[object RegExp]';
	}
	exports.isRegExp = isRegExp;

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	exports.isObject = isObject;

	function isDate(d) {
	  return isObject(d) && objectToString(d) === '[object Date]';
	}
	exports.isDate = isDate;

	function isError(e) {
	  return isObject(e) &&
	      (objectToString(e) === '[object Error]' || e instanceof Error);
	}
	exports.isError = isError;

	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	exports.isFunction = isFunction;

	function isPrimitive(arg) {
	  return arg === null ||
	         typeof arg === 'boolean' ||
	         typeof arg === 'number' ||
	         typeof arg === 'string' ||
	         typeof arg === 'symbol' ||  // ES6 symbol
	         typeof arg === 'undefined';
	}
	exports.isPrimitive = isPrimitive;

	exports.isBuffer = __webpack_require__(30);

	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}


	function pad(n) {
	  return n < 10 ? '0' + n.toString(10) : n.toString(10);
	}


	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
	              'Oct', 'Nov', 'Dec'];

	// 26 Feb 16:19:34
	function timestamp() {
	  var d = new Date();
	  var time = [pad(d.getHours()),
	              pad(d.getMinutes()),
	              pad(d.getSeconds())].join(':');
	  return [d.getDate(), months[d.getMonth()], time].join(' ');
	}


	// log is just a thin wrapper to console.log that prepends a timestamp
	exports.log = function() {
	  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
	};


	/**
	 * Inherit the prototype methods from one constructor into another.
	 *
	 * The Function.prototype.inherits from lang.js rewritten as a standalone
	 * function (not on Function.prototype). NOTE: If this file is to be loaded
	 * during bootstrapping this function needs to be rewritten using some native
	 * functions as prototype setup using normal JavaScript does not work as
	 * expected during bootstrapping (see mirror.js in r114903).
	 *
	 * @param {function} ctor Constructor function which needs to inherit the
	 *     prototype.
	 * @param {function} superCtor Constructor function to inherit prototype from.
	 */
	exports.inherits = __webpack_require__(35);

	exports._extend = function(origin, add) {
	  // Don't do anything if add isn't an object
	  if (!add || !isObject(add)) return origin;

	  var keys = Object.keys(add);
	  var i = keys.length;
	  while (i--) {
	    origin[keys[i]] = add[keys[i]];
	  }
	  return origin;
	};

	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(6)))

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */

	var base64 = __webpack_require__(36)
	var ieee754 = __webpack_require__(32)
	var isArray = __webpack_require__(33)

	exports.Buffer = Buffer
	exports.SlowBuffer = SlowBuffer
	exports.INSPECT_MAX_BYTES = 50
	Buffer.poolSize = 8192 // not used by this implementation

	var kMaxLength = 0x3fffffff
	var rootParent = {}

	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Note:
	 *
	 * - Implementation must support adding new properties to `Uint8Array` instances.
	 *   Firefox 4-29 lacked support, fixed in Firefox 30+.
	 *   See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *  - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *  - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *    incorrect length in some situations.
	 *
	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they will
	 * get the Object implementation, which is slower but will work correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = (function () {
	  try {
	    var buf = new ArrayBuffer(0)
	    var arr = new Uint8Array(buf)
	    arr.foo = function () { return 42 }
	    return arr.foo() === 42 && // typed array instances can be augmented
	        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
	        new Uint8Array(1).subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
	  } catch (e) {
	    return false
	  }
	})()

	/**
	 * Class: Buffer
	 * =============
	 *
	 * The Buffer constructor returns instances of `Uint8Array` that are augmented
	 * with function properties for all the node `Buffer` API functions. We use
	 * `Uint8Array` so that square bracket notation works as expected -- it returns
	 * a single octet.
	 *
	 * By augmenting the instances, we can avoid modifying the `Uint8Array`
	 * prototype.
	 */
	function Buffer (subject, encoding) {
	  var self = this
	  if (!(self instanceof Buffer)) return new Buffer(subject, encoding)

	  var type = typeof subject
	  var length

	  if (type === 'number') {
	    length = +subject
	  } else if (type === 'string') {
	    length = Buffer.byteLength(subject, encoding)
	  } else if (type === 'object' && subject !== null) {
	    // assume object is array-like
	    if (subject.type === 'Buffer' && isArray(subject.data)) subject = subject.data
	    length = +subject.length
	  } else {
	    throw new TypeError('must start with number, buffer, array or string')
	  }

	  if (length > kMaxLength) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum size: 0x' +
	      kMaxLength.toString(16) + ' bytes')
	  }

	  if (length < 0) length = 0
	  else length >>>= 0 // coerce to uint32

	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Preferred: Return an augmented `Uint8Array` instance for best performance
	    self = Buffer._augment(new Uint8Array(length)) // eslint-disable-line consistent-this
	  } else {
	    // Fallback: Return THIS instance of Buffer (created by `new`)
	    self.length = length
	    self._isBuffer = true
	  }

	  var i
	  if (Buffer.TYPED_ARRAY_SUPPORT && typeof subject.byteLength === 'number') {
	    // Speed optimization -- use set if we're copying from a typed array
	    self._set(subject)
	  } else if (isArrayish(subject)) {
	    // Treat array-ish objects as a byte array
	    if (Buffer.isBuffer(subject)) {
	      for (i = 0; i < length; i++) {
	        self[i] = subject.readUInt8(i)
	      }
	    } else {
	      for (i = 0; i < length; i++) {
	        self[i] = ((subject[i] % 256) + 256) % 256
	      }
	    }
	  } else if (type === 'string') {
	    self.write(subject, 0, encoding)
	  } else if (type === 'number' && !Buffer.TYPED_ARRAY_SUPPORT) {
	    for (i = 0; i < length; i++) {
	      self[i] = 0
	    }
	  }

	  if (length > 0 && length <= Buffer.poolSize) self.parent = rootParent

	  return self
	}

	function SlowBuffer (subject, encoding) {
	  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)

	  var buf = new Buffer(subject, encoding)
	  delete buf.parent
	  return buf
	}

	Buffer.isBuffer = function isBuffer (b) {
	  return !!(b != null && b._isBuffer)
	}

	Buffer.compare = function compare (a, b) {
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers')
	  }

	  if (a === b) return 0

	  var x = a.length
	  var y = b.length
	  for (var i = 0, len = Math.min(x, y); i < len && a[i] === b[i]; i++) {}
	  if (i !== len) {
	    x = a[i]
	    y = b[i]
	  }
	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}

	Buffer.isEncoding = function isEncoding (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'binary':
	    case 'base64':
	    case 'raw':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	}

	Buffer.concat = function concat (list, totalLength) {
	  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')

	  if (list.length === 0) {
	    return new Buffer(0)
	  } else if (list.length === 1) {
	    return list[0]
	  }

	  var i
	  if (totalLength === undefined) {
	    totalLength = 0
	    for (i = 0; i < list.length; i++) {
	      totalLength += list[i].length
	    }
	  }

	  var buf = new Buffer(totalLength)
	  var pos = 0
	  for (i = 0; i < list.length; i++) {
	    var item = list[i]
	    item.copy(buf, pos)
	    pos += item.length
	  }
	  return buf
	}

	Buffer.byteLength = function byteLength (str, encoding) {
	  var ret
	  str = str + ''
	  switch (encoding || 'utf8') {
	    case 'ascii':
	    case 'binary':
	    case 'raw':
	      ret = str.length
	      break
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      ret = str.length * 2
	      break
	    case 'hex':
	      ret = str.length >>> 1
	      break
	    case 'utf8':
	    case 'utf-8':
	      ret = utf8ToBytes(str).length
	      break
	    case 'base64':
	      ret = base64ToBytes(str).length
	      break
	    default:
	      ret = str.length
	  }
	  return ret
	}

	// pre-set for values that may exist in the future
	Buffer.prototype.length = undefined
	Buffer.prototype.parent = undefined

	// toString(encoding, start=0, end=buffer.length)
	Buffer.prototype.toString = function toString (encoding, start, end) {
	  var loweredCase = false

	  start = start >>> 0
	  end = end === undefined || end === Infinity ? this.length : end >>> 0

	  if (!encoding) encoding = 'utf8'
	  if (start < 0) start = 0
	  if (end > this.length) end = this.length
	  if (end <= start) return ''

	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)

	      case 'ascii':
	        return asciiSlice(this, start, end)

	      case 'binary':
	        return binarySlice(this, start, end)

	      case 'base64':
	        return base64Slice(this, start, end)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase()
	        loweredCase = true
	    }
	  }
	}

	Buffer.prototype.equals = function equals (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return true
	  return Buffer.compare(this, b) === 0
	}

	Buffer.prototype.inspect = function inspect () {
	  var str = ''
	  var max = exports.INSPECT_MAX_BYTES
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
	    if (this.length > max) str += ' ... '
	  }
	  return '<Buffer ' + str + '>'
	}

	Buffer.prototype.compare = function compare (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return 0
	  return Buffer.compare(this, b)
	}

	Buffer.prototype.indexOf = function indexOf (val, byteOffset) {
	  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
	  else if (byteOffset < -0x80000000) byteOffset = -0x80000000
	  byteOffset >>= 0

	  if (this.length === 0) return -1
	  if (byteOffset >= this.length) return -1

	  // Negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

	  if (typeof val === 'string') {
	    if (val.length === 0) return -1 // special case: looking for empty string always fails
	    return String.prototype.indexOf.call(this, val, byteOffset)
	  }
	  if (Buffer.isBuffer(val)) {
	    return arrayIndexOf(this, val, byteOffset)
	  }
	  if (typeof val === 'number') {
	    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
	      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
	    }
	    return arrayIndexOf(this, [ val ], byteOffset)
	  }

	  function arrayIndexOf (arr, val, byteOffset) {
	    var foundIndex = -1
	    for (var i = 0; byteOffset + i < arr.length; i++) {
	      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
	        if (foundIndex === -1) foundIndex = i
	        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
	      } else {
	        foundIndex = -1
	      }
	    }
	    return -1
	  }

	  throw new TypeError('val must be string, number or Buffer')
	}

	// `get` will be removed in Node 0.13+
	Buffer.prototype.get = function get (offset) {
	  console.log('.get() is deprecated. Access using array indexes instead.')
	  return this.readUInt8(offset)
	}

	// `set` will be removed in Node 0.13+
	Buffer.prototype.set = function set (v, offset) {
	  console.log('.set() is deprecated. Access using array indexes instead.')
	  return this.writeUInt8(v, offset)
	}

	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0
	  var remaining = buf.length - offset
	  if (!length) {
	    length = remaining
	  } else {
	    length = Number(length)
	    if (length > remaining) {
	      length = remaining
	    }
	  }

	  // must be an even number of digits
	  var strLen = string.length
	  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

	  if (length > strLen / 2) {
	    length = strLen / 2
	  }
	  for (var i = 0; i < length; i++) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16)
	    if (isNaN(parsed)) throw new Error('Invalid hex string')
	    buf[offset + i] = parsed
	  }
	  return i
	}

	function utf8Write (buf, string, offset, length) {
	  var charsWritten = blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	  return charsWritten
	}

	function asciiWrite (buf, string, offset, length) {
	  var charsWritten = blitBuffer(asciiToBytes(string), buf, offset, length)
	  return charsWritten
	}

	function binaryWrite (buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length)
	}

	function base64Write (buf, string, offset, length) {
	  var charsWritten = blitBuffer(base64ToBytes(string), buf, offset, length)
	  return charsWritten
	}

	function utf16leWrite (buf, string, offset, length) {
	  var charsWritten = blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	  return charsWritten
	}

	Buffer.prototype.write = function write (string, offset, length, encoding) {
	  // Support both (string, offset, length, encoding)
	  // and the legacy (string, encoding, offset, length)
	  if (isFinite(offset)) {
	    if (!isFinite(length)) {
	      encoding = length
	      length = undefined
	    }
	  } else {  // legacy
	    var swap = encoding
	    encoding = offset
	    offset = length
	    length = swap
	  }

	  offset = Number(offset) || 0

	  if (length < 0 || offset < 0 || offset > this.length) {
	    throw new RangeError('attempt to write outside buffer bounds')
	  }

	  var remaining = this.length - offset
	  if (!length) {
	    length = remaining
	  } else {
	    length = Number(length)
	    if (length > remaining) {
	      length = remaining
	    }
	  }
	  encoding = String(encoding || 'utf8').toLowerCase()

	  var ret
	  switch (encoding) {
	    case 'hex':
	      ret = hexWrite(this, string, offset, length)
	      break
	    case 'utf8':
	    case 'utf-8':
	      ret = utf8Write(this, string, offset, length)
	      break
	    case 'ascii':
	      ret = asciiWrite(this, string, offset, length)
	      break
	    case 'binary':
	      ret = binaryWrite(this, string, offset, length)
	      break
	    case 'base64':
	      ret = base64Write(this, string, offset, length)
	      break
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      ret = utf16leWrite(this, string, offset, length)
	      break
	    default:
	      throw new TypeError('Unknown encoding: ' + encoding)
	  }
	  return ret
	}

	Buffer.prototype.toJSON = function toJSON () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	}

	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf)
	  } else {
	    return base64.fromByteArray(buf.slice(start, end))
	  }
	}

	function utf8Slice (buf, start, end) {
	  var res = ''
	  var tmp = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; i++) {
	    if (buf[i] <= 0x7F) {
	      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
	      tmp = ''
	    } else {
	      tmp += '%' + buf[i].toString(16)
	    }
	  }

	  return res + decodeUtf8Char(tmp)
	}

	function asciiSlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i] & 0x7F)
	  }
	  return ret
	}

	function binarySlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i])
	  }
	  return ret
	}

	function hexSlice (buf, start, end) {
	  var len = buf.length

	  if (!start || start < 0) start = 0
	  if (!end || end < 0 || end > len) end = len

	  var out = ''
	  for (var i = start; i < end; i++) {
	    out += toHex(buf[i])
	  }
	  return out
	}

	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end)
	  var res = ''
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
	  }
	  return res
	}

	Buffer.prototype.slice = function slice (start, end) {
	  var len = this.length
	  start = ~~start
	  end = end === undefined ? len : ~~end

	  if (start < 0) {
	    start += len
	    if (start < 0) start = 0
	  } else if (start > len) {
	    start = len
	  }

	  if (end < 0) {
	    end += len
	    if (end < 0) end = 0
	  } else if (end > len) {
	    end = len
	  }

	  if (end < start) end = start

	  var newBuf
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = Buffer._augment(this.subarray(start, end))
	  } else {
	    var sliceLen = end - start
	    newBuf = new Buffer(sliceLen, undefined)
	    for (var i = 0; i < sliceLen; i++) {
	      newBuf[i] = this[i + start]
	    }
	  }

	  if (newBuf.length) newBuf.parent = this.parent || this

	  return newBuf
	}

	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}

	Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	  offset = offset >>> 0
	  byteLength = byteLength >>> 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }

	  return val
	}

	Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	  offset = offset >>> 0
	  byteLength = byteLength >>> 0
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length)
	  }

	  var val = this[offset + --byteLength]
	  var mul = 1
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul
	  }

	  return val
	}

	Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  return this[offset]
	}

	Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return this[offset] | (this[offset + 1] << 8)
	}

	Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return (this[offset] << 8) | this[offset + 1]
	}

	Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	}

	Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset] * 0x1000000) +
	    ((this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    this[offset + 3])
	}

	Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	  offset = offset >>> 0
	  byteLength = byteLength >>> 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	  mul *= 0x80

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

	  return val
	}

	Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	  offset = offset >>> 0
	  byteLength = byteLength >>> 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var i = byteLength
	  var mul = 1
	  var val = this[offset + --i]
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul
	  }
	  mul *= 0x80

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

	  return val
	}

	Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  if (!(this[offset] & 0x80)) return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	}

	Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset] | (this[offset + 1] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset + 1] | (this[offset] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset]) |
	    (this[offset + 1] << 8) |
	    (this[offset + 2] << 16) |
	    (this[offset + 3] << 24)
	}

	Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset] << 24) |
	    (this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    (this[offset + 3])
	}

	Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, true, 23, 4)
	}

	Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, false, 23, 4)
	}

	Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, true, 52, 8)
	}

	Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, false, 52, 8)
	}

	function checkInt (buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
	  if (value > max || value < min) throw new RangeError('value is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('index out of range')
	}

	Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  byteLength = byteLength >>> 0
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

	  var mul = 1
	  var i = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) >>> 0 & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  byteLength = byteLength >>> 0
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

	  var i = byteLength - 1
	  var mul = 1
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) >>> 0 & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  this[offset] = value
	  return offset + 1
	}

	function objectWriteUInt16 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
	    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	      (littleEndian ? i : 1 - i) * 8
	  }
	}

	Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = value
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}

	function objectWriteUInt32 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
	    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
	  }
	}

	Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = (value >>> 24)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 1] = (value >>> 8)
	    this[offset] = value
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = value
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert) {
	    checkInt(
	      this, value, offset, byteLength,
	      Math.pow(2, 8 * byteLength - 1) - 1,
	      -Math.pow(2, 8 * byteLength - 1)
	    )
	  }

	  var i = 0
	  var mul = 1
	  var sub = value < 0 ? 1 : 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert) {
	    checkInt(
	      this, value, offset, byteLength,
	      Math.pow(2, 8 * byteLength - 1) - 1,
	      -Math.pow(2, 8 * byteLength - 1)
	    )
	  }

	  var i = byteLength - 1
	  var mul = 1
	  var sub = value < 0 ? 1 : 0
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  if (value < 0) value = 0xff + value + 1
	  this[offset] = value
	  return offset + 1
	}

	Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = value
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value
	    this[offset + 1] = (value >>> 8)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 3] = (value >>> 24)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (value < 0) value = 0xffffffff + value + 1
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = value
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}

	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (value > max || value < min) throw new RangeError('value is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('index out of range')
	  if (offset < 0) throw new RangeError('index out of range')
	}

	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 23, 4)
	  return offset + 4
	}

	Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	}

	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 52, 8)
	  return offset + 8
	}

	Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	}

	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy (target, target_start, start, end) {
	  if (!start) start = 0
	  if (!end && end !== 0) end = this.length
	  if (target_start >= target.length) target_start = target.length
	  if (!target_start) target_start = 0
	  if (end > 0 && end < start) end = start

	  // Copy 0 bytes; we're done
	  if (end === start) return 0
	  if (target.length === 0 || this.length === 0) return 0

	  // Fatal error conditions
	  if (target_start < 0) {
	    throw new RangeError('targetStart out of bounds')
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
	  if (end < 0) throw new RangeError('sourceEnd out of bounds')

	  // Are we oob?
	  if (end > this.length) end = this.length
	  if (target.length - target_start < end - start) {
	    end = target.length - target_start + start
	  }

	  var len = end - start

	  if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < len; i++) {
	      target[i + target_start] = this[i + start]
	    }
	  } else {
	    target._set(this.subarray(start, start + len), target_start)
	  }

	  return len
	}

	// fill(value, start=0, end=buffer.length)
	Buffer.prototype.fill = function fill (value, start, end) {
	  if (!value) value = 0
	  if (!start) start = 0
	  if (!end) end = this.length

	  if (end < start) throw new RangeError('end < start')

	  // Fill 0 bytes; we're done
	  if (end === start) return
	  if (this.length === 0) return

	  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
	  if (end < 0 || end > this.length) throw new RangeError('end out of bounds')

	  var i
	  if (typeof value === 'number') {
	    for (i = start; i < end; i++) {
	      this[i] = value
	    }
	  } else {
	    var bytes = utf8ToBytes(value.toString())
	    var len = bytes.length
	    for (i = start; i < end; i++) {
	      this[i] = bytes[i % len]
	    }
	  }

	  return this
	}

	/**
	 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
	 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
	 */
	Buffer.prototype.toArrayBuffer = function toArrayBuffer () {
	  if (typeof Uint8Array !== 'undefined') {
	    if (Buffer.TYPED_ARRAY_SUPPORT) {
	      return (new Buffer(this)).buffer
	    } else {
	      var buf = new Uint8Array(this.length)
	      for (var i = 0, len = buf.length; i < len; i += 1) {
	        buf[i] = this[i]
	      }
	      return buf.buffer
	    }
	  } else {
	    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
	  }
	}

	// HELPER FUNCTIONS
	// ================

	var BP = Buffer.prototype

	/**
	 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
	 */
	Buffer._augment = function _augment (arr) {
	  arr.constructor = Buffer
	  arr._isBuffer = true

	  // save reference to original Uint8Array set method before overwriting
	  arr._set = arr.set

	  // deprecated, will be removed in node 0.13+
	  arr.get = BP.get
	  arr.set = BP.set

	  arr.write = BP.write
	  arr.toString = BP.toString
	  arr.toLocaleString = BP.toString
	  arr.toJSON = BP.toJSON
	  arr.equals = BP.equals
	  arr.compare = BP.compare
	  arr.indexOf = BP.indexOf
	  arr.copy = BP.copy
	  arr.slice = BP.slice
	  arr.readUIntLE = BP.readUIntLE
	  arr.readUIntBE = BP.readUIntBE
	  arr.readUInt8 = BP.readUInt8
	  arr.readUInt16LE = BP.readUInt16LE
	  arr.readUInt16BE = BP.readUInt16BE
	  arr.readUInt32LE = BP.readUInt32LE
	  arr.readUInt32BE = BP.readUInt32BE
	  arr.readIntLE = BP.readIntLE
	  arr.readIntBE = BP.readIntBE
	  arr.readInt8 = BP.readInt8
	  arr.readInt16LE = BP.readInt16LE
	  arr.readInt16BE = BP.readInt16BE
	  arr.readInt32LE = BP.readInt32LE
	  arr.readInt32BE = BP.readInt32BE
	  arr.readFloatLE = BP.readFloatLE
	  arr.readFloatBE = BP.readFloatBE
	  arr.readDoubleLE = BP.readDoubleLE
	  arr.readDoubleBE = BP.readDoubleBE
	  arr.writeUInt8 = BP.writeUInt8
	  arr.writeUIntLE = BP.writeUIntLE
	  arr.writeUIntBE = BP.writeUIntBE
	  arr.writeUInt16LE = BP.writeUInt16LE
	  arr.writeUInt16BE = BP.writeUInt16BE
	  arr.writeUInt32LE = BP.writeUInt32LE
	  arr.writeUInt32BE = BP.writeUInt32BE
	  arr.writeIntLE = BP.writeIntLE
	  arr.writeIntBE = BP.writeIntBE
	  arr.writeInt8 = BP.writeInt8
	  arr.writeInt16LE = BP.writeInt16LE
	  arr.writeInt16BE = BP.writeInt16BE
	  arr.writeInt32LE = BP.writeInt32LE
	  arr.writeInt32BE = BP.writeInt32BE
	  arr.writeFloatLE = BP.writeFloatLE
	  arr.writeFloatBE = BP.writeFloatBE
	  arr.writeDoubleLE = BP.writeDoubleLE
	  arr.writeDoubleBE = BP.writeDoubleBE
	  arr.fill = BP.fill
	  arr.inspect = BP.inspect
	  arr.toArrayBuffer = BP.toArrayBuffer

	  return arr
	}

	var INVALID_BASE64_RE = /[^+\/0-9A-z\-]/g

	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return ''
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '='
	  }
	  return str
	}

	function stringtrim (str) {
	  if (str.trim) return str.trim()
	  return str.replace(/^\s+|\s+$/g, '')
	}

	function isArrayish (subject) {
	  return isArray(subject) || Buffer.isBuffer(subject) ||
	      subject && typeof subject === 'object' &&
	      typeof subject.length === 'number'
	}

	function toHex (n) {
	  if (n < 16) return '0' + n.toString(16)
	  return n.toString(16)
	}

	function utf8ToBytes (string, units) {
	  units = units || Infinity
	  var codePoint
	  var length = string.length
	  var leadSurrogate = null
	  var bytes = []
	  var i = 0

	  for (; i < length; i++) {
	    codePoint = string.charCodeAt(i)

	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (leadSurrogate) {
	        // 2 leads in a row
	        if (codePoint < 0xDC00) {
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          leadSurrogate = codePoint
	          continue
	        } else {
	          // valid surrogate pair
	          codePoint = leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00 | 0x10000
	          leadSurrogate = null
	        }
	      } else {
	        // no lead yet

	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        } else {
	          // valid lead
	          leadSurrogate = codePoint
	          continue
	        }
	      }
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	      leadSurrogate = null
	    }

	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break
	      bytes.push(codePoint)
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break
	      bytes.push(
	        codePoint >> 0x6 | 0xC0,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break
	      bytes.push(
	        codePoint >> 0xC | 0xE0,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x200000) {
	      if ((units -= 4) < 0) break
	      bytes.push(
	        codePoint >> 0x12 | 0xF0,
	        codePoint >> 0xC & 0x3F | 0x80,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else {
	      throw new Error('Invalid code point')
	    }
	  }

	  return bytes
	}

	function asciiToBytes (str) {
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF)
	  }
	  return byteArray
	}

	function utf16leToBytes (str, units) {
	  var c, hi, lo
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    if ((units -= 2) < 0) break

	    c = str.charCodeAt(i)
	    hi = c >> 8
	    lo = c % 256
	    byteArray.push(lo)
	    byteArray.push(hi)
	  }

	  return byteArray
	}

	function base64ToBytes (str) {
	  return base64.toByteArray(base64clean(str))
	}

	function blitBuffer (src, dst, offset, length) {
	  for (var i = 0; i < length; i++) {
	    if ((i + offset >= dst.length) || (i >= src.length)) break
	    dst[i + offset] = src[i]
	  }
	  return i
	}

	function decodeUtf8Char (str) {
	  try {
	    return decodeURIComponent(str)
	  } catch (err) {
	    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(20).Buffer))

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {
	var Q = __webpack_require__(9);

	/**
	 * Wraps a Node readable stream, providing an API similar
	 * to a Narwhal synchronous `io` stream except returning
	 * Q promises for long latency operations.
	 * @param stream any Node readable stream
	 * @returns {Promise * Reader} a promise for
	 * the text stream reader.
	 * @constructor
	 */
	module.exports = Reader;
	function Reader(_stream, charset) {
	    var self = Object.create(Reader.prototype);

	    if (charset && _stream.setEncoding) // TODO complain about inconsistency
	        _stream.setEncoding(charset);

	    var begin = Q.defer();
	    var end = Q.defer();

	    _stream.on("error", function (reason) {
	        begin.reject(reason);
	    });

	    var chunks = [];
	    var receiver;

	    _stream.on("end", function () {
	        begin.resolve(self);
	        end.resolve()
	    });

	    _stream.on("data", function (chunk) {
	        begin.resolve(self);
	        if (receiver) {
	            receiver(chunk);
	        } else {
	            chunks.push(chunk);
	        }
	    });

	    function slurp() {
	        var result;
	        if (charset) {
	            result = chunks.join("");
	        } else {
	            result = self.constructor.join(chunks);
	        }
	        chunks.splice(0, chunks.length);
	        return result;
	    }

	    /***
	     * Reads all of the remaining data from the stream.
	     * @returns {Promise * String} a promise for a String
	     * containing the entirety the remaining stream.
	     */
	    self.read = function () {
	        receiver = undefined;
	        var deferred = Q.defer();
	        Q.done(end.promise, function () {
	            deferred.resolve(slurp());
	        });
	        return deferred.promise;
	    };

	    /***
	     * Reads and writes all of the remaining data from the
	     * stream in chunks.
	     * @param {Function(Promise * String)} write a function
	     * to be called on each chunk of input from this stream.
	     * @returns {Promise * Undefined} a promise that will
	     * be resolved when the input is depleted.
	     */
	    self.forEach = function (write) {
	        if (chunks && chunks.length)
	            write(slurp());
	        receiver = write;
	        return Q.when(end.promise, function () {
	            receiver = undefined;
	        });
	    };

	    self.close = function () {
	        _stream.destroy();
	    };

	    self.node = _stream;

	    return begin.promise;
	}

	/*
	    Reads an entire forEachable stream of buffers and returns a single buffer.
	*/
	Reader.read = read;
	function read(stream, charset) {
	    var chunks = [];
	    stream.forEach(function (chunk) {
	        chunks.push(chunk);
	    });
	    if (charset) {
	        return chunks.join("");
	    } else {
	        return join(chunks);
	    }
	}

	Reader.join = join;
	function join(buffers) {
	    var length = 0;
	    var at;
	    var i;
	    var ii = buffers.length;
	    var buffer;
	    var result;
	    for (i = 0; i < ii; i++) {
	        buffer = buffers[i];
	        length += buffer.length;
	    }
	    result = new Buffer(length);
	    at = 0;
	    for (i = 0; i < ii; i++) {
	        buffer = buffers[i];
	        buffer.copy(result, at, 0);
	        at += buffer.length;
	    }
	    buffers.splice(0, ii, result);
	    return result;
	}


	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(20).Buffer))

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, Buffer) {
	var Q = __webpack_require__(9);

	/**
	 * Wraps a Node writable stream, providing an API similar to
	 * Narwhal's synchronous `io` streams, except returning and
	 * accepting promises for long-latency operations.
	 *
	 * @param stream any Node writable stream
	 * @returns {Promise * Writer} a promise for the
	 * text writer.
	 */
	module.exports = Writer;

	var version = process.versions.node.split('.');
	var supportsFinish = version[0] >= 0 && version[1] >= 10;

	function Writer(_stream, charset) {
	    var self = Object.create(Writer.prototype);

	    if (charset && _stream.setEncoding) // TODO complain about inconsistency
	        _stream.setEncoding(charset);

	    var drained = Q.defer();

	    _stream.on("error", function (reason) {
	        drained.reject(reason);
	        drained = Q.defer();
	    });

	    _stream.on("drain", function () {
	        drained.resolve();
	        drained = Q.defer();
	    });

	    /***
	     * Writes content to the stream.
	     * @param {String} content
	     * @returns {Promise * Undefined} a promise that will
	     * be resolved when the buffer is empty, meaning
	     * that all of the content has been sent.
	     */
	    self.write = function (content) {
	        if (!_stream.writeable && !_stream.writable)
	            return Q.reject(new Error("Can't write to non-writable (possibly closed) stream"));
	        if (typeof content !== "string") {
	            content = new Buffer(content);
	        }
	        if (!_stream.write(content)) {
	            return drained.promise;
	        } else {
	            return Q.resolve();
	        }
	    };

	    /***
	     * Waits for all data to flush on the stream.
	     *
	     * @returns {Promise * Undefined} a promise that will
	     * be resolved when the buffer is empty
	     */
	    self.flush = function () {
	        return drained.promise;
	    };

	    /***
	     * Closes the stream, waiting for the internal buffer
	     * to flush.
	     *
	     * @returns {Promise * Undefined} a promise that will
	     * be resolved when the stream has finished writing,
	     * flushing, and closed.
	     */
	    self.close = function () {
	        var finished;

	        if (supportsFinish) { // new Streams, listen for `finish` event
	            finished = Q.defer();
	            _stream.on("finish", function () {
	                finished.resolve();
	            });
	            _stream.on("error", function (reason) {
	                finished.reject(reason);
	            });
	        }

	        _stream.end();
	        drained.resolve(); // we will get no further drain events
	        if (finished) { // closing not explicitly observable
	            return finished.promise;
	        } else {
	            return Q(); // just resolve for old Streams
	        }
	    };

	    /***
	     * Terminates writing on a stream, closing before
	     * the internal buffer drains.
	     *
	     * @returns {Promise * Undefined} a promise that will
	     * be resolved when the stream has finished closing.
	     */
	    self.destroy = function () {
	        _stream.destroy();
	        drained.resolve(); // we will get no further drain events
	        return Q.resolve(); // destruction not explicitly observable
	    };

	    self.node = _stream;

	    return Q(self); // todo returns the begin.promise
	}


	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6), __webpack_require__(20).Buffer))

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {var Q = __webpack_require__(9);
	var Boot = __webpack_require__(28);
	var RootFs = __webpack_require__(25);
	var MockFs = __webpack_require__(24);

	// TODO patternToRegExp
	// TODO glob
	// TODO match

	var concat = function (arrays) {
	    return Array.prototype.concat.apply([], arrays);
	};

	exports.update = function (exports, workingDirectory) {

	    for (var name in Boot) {
	        exports[name] = Boot[name];
	    }

	    /**
	     * Read a complete file.
	     * @param {String} path    Path to the file.
	     * @param {String} [options.flags]  The mode to open the file with.
	     * @param {String} [options.charset]  The charset to open the file with.
	     * @param {Object} [options]   An object with options.
	     * second argument.
	     * @returns {Promise * (String || Buffer)}
	     */
	    exports.read = function (path, flags, charset, options) {
	        if (typeof flags === "object") {
	            options = flags;
	        } else if (typeof charset === "object") {
	            options = charset;
	            options.flags = flags;
	        } else {
	            options = options || {};
	            options.flags = flags;
	            options.charset = charset;
	        }
	        options.flags = options.flags || "r";
	        return Q.when(this.open(path, options), function (stream) {
	            return stream.read();
	        }, function (error) {
	            error.message = "Can't read " + path + " because " + error.message;
	            error.path = path;
	            error.flags = flags;
	            error.charset = charset;
	            throw error;
	        });
	    };

	    /**
	     * Write content to a file, overwriting the existing content.
	     * @param {String} path    Path to the file.
	     * @param {String || Buffer} content
	     * @param {String} [options.flags]  The mode to open the file with.
	     * @param {String} [options.charset]  The charset to open the file with.
	     * @param {Object} [options]   An object with options.
	     * @returns {Promise * Undefined} a promise that resolves
	     * when the writing is complete.
	     */
	    exports.write = function (path, content, flags, charset, options) {
	        var self = this;
	        if (typeof flags === "object") {
	            options = flags;
	        } else if (typeof charset === "object") {
	            options = charset;
	            options.flags = flags;
	        } else {
	            options = options || {};
	            options.flags = flags;
	            options.charset = charset;
	        }
	        flags = options.flags || "w";
	        if (flags.indexOf("b") !== -1) {
	            if (!(content instanceof Buffer)) {
	                content = new Buffer(content);
	            }
	        } else if (content instanceof Buffer) {
	            flags += "b";
	        }
	        options.flags = flags;
	        return Q.when(self.open(path, options), function (stream) {
	            return Q.when(stream.write(content), function () {
	                return stream.close();
	            });
	        });
	    };

	    /**
	     * Append content to the end of a file.
	     * @param {String} path    Path to the file.
	     * @param {String || Buffer} content
	     * @param {String} [options.flags]  The mode to open the file with.
	     * @param {String} [options.charset]  The charset to open the file with.
	     * @param {Object} [options]   An object with options.
	     * @returns {Promise * Undefined} a promise that resolves
	     * when the writing is complete.
	     */
	    exports.append = function (path, content, flags, charset, options) {
	        var self = this;
	        if (typeof flags === "object") {
	            options = flags;
	        } else if (typeof charset === "object") {
	            options = charset;
	            options.flags = flags;
	        } else {
	            options = options || {};
	            options.flags = flags;
	            options.charset = charset;
	        }
	        flags = options.flags || "a";
	        if (content instanceof Buffer) {
	            flags += "b";
	        }
	        options.flags = flags;
	        return Q.when(self.open(path, options), function (stream) {
	            return Q.when(stream.write(content), function () {
	                return stream.close();
	            });
	        });
	    };

	    exports.move = function (source, target) {
	        var self = this;
	        return this.rename(source, target)
	        .catch(function (error) {
	            if (error.crossDevice) {
	                return self.copyTree(source, target)
	                .then(function () {
	                    return self.removeTree(source);
	                });
	            } else {
	                throw error;
	            }
	        });
	    };

	    exports.copy = function (source, target) {
	        var self = this;
	        return Q.when(self.stat(source), function (stat) {
	            var mode = stat.node.mode;
	            return Q.all([
	                self.open(source, {flags: "rb"}),
	                self.open(target, {flags: "wb", mode: mode})
	            ]);
	        })
	        .spread(function (reader, writer) {
	            return Q.when(reader.forEach(function (block) {
	                return writer.write(block);
	            }), function () {
	                return Q.all([
	                    reader.close(),
	                    writer.close()
	                ]);
	            });
	        });
	    };

	    exports.copyTree = function (source, target) {
	        var self = this;
	        return Q.when(self.stat(source), function (stat) {
	            if (stat.isFile()) {
	                return self.copy(source, target);
	            } else if (stat.isDirectory()) {
	                return self.exists(target).then(function (targetExists) {
	                    function copySubTree() {
	                        return Q.when(self.list(source), function (list) {
	                            return Q.all(list.map(function (child) {
	                                return self.copyTree(
	                                    self.join(source, child),
	                                    self.join(target, child)
	                                );
	                            }));
	                        });
	                    }
	                    if (targetExists) {
	                        return copySubTree();
	                    } else {
	                        return Q.when(self.makeDirectory(target, stat.node.mode), copySubTree);
	                    }
	                });
	            } else if (stat.isSymbolicLink()) {
	                // TODO copy the link and type with readPath (but what about
	                // Windows junction type?)
	                return self.symbolicCopy(source, target);
	            }
	        });
	    };

	    exports.listTree = function (basePath, guard) {
	        var self = this;
	        basePath = String(basePath || '');
	        if (!basePath)
	            basePath = ".";
	        guard = guard || function () {
	            return true;
	        };
	        var stat = self.stat(basePath);
	        return Q.when(stat, function (stat) {
	            var paths = [];
	            var mode; // true:include, false:exclude, null:no-recur
	            try {
	                var include = guard(basePath, stat);
	            } catch (exception) {
	                return Q.reject(exception);
	            }
	            return Q.when(include, function (include) {
	                if (include) {
	                    paths.push([basePath]);
	                }
	                if (include !== null && stat.isDirectory()) {
	                    return Q.when(self.list(basePath), function (children) {
	                        paths.push.apply(paths, children.map(function (child) {
	                            var path = self.join(basePath, child);
	                            return self.listTree(path, guard);
	                        }));
	                        return paths;
	                    });
	                } else {
	                    return paths;
	                }
	            });
	        }, function noSuchFile(reason) {
	            return [];
	        }).then(Q.all).then(concat);
	    };

	    exports.listDirectoryTree = function (path) {
	        return this.listTree(path, function (path, stat) {
	            return stat.isDirectory();
	        });
	    };

	    exports.makeTree = function (path, mode) {
	        path = String(path);
	        var self = this;
	        var parts = self.split(path);
	        var at = [];
	        if (self.isAbsolute(path)) {
	            // On Windows use the root drive (e.g. "C:"), on *nix the first
	            // part is the falsey "", and so use the ROOT ("/")
	            at.push(parts.shift() || self.ROOT);
	        }
	        return parts.reduce(function (parent, part) {
	            return Q.when(parent, function () {
	                at.push(part);
	                var parts = self.join(at) || ".";
	                var made = self.makeDirectory(parts, mode);
	                return Q.when(made, null, function rejected(error) {
	                    // throw away errors for already made directories
	                    if (error.exists) {
	                        return;
	                    } else {
	                        throw error;
	                    }
	                });
	            });
	        }, undefined);
	    };

	    exports.removeTree = function (path) {
	        var self = this;
	        return Q.when(self.statLink(path), function (stat) {
	            if (stat.isSymbolicLink()) {
	                return self.remove(path);
	            } else if (stat.isDirectory()) {
	                return self.list(path)
	                .then(function (list) {
	                    // asynchronously remove every subtree
	                    return Q.all(list.map(function (name) {
	                        return self.removeTree(self.join(path, name));
	                    }))
	                    .then(function () {
	                        return self.removeDirectory(path);
	                    });
	                });
	            } else {
	                return self.remove(path);
	            }
	        });
	    };

	    exports.symbolicCopy = function (source, target, type) {
	        var self = this;
	        return Q.when(self.relative(target, source), function (relative) {
	            return self.symbolicLink(target, relative, type || "file");
	        });
	    };

	    exports.exists = function (path) {
	        return Q.when(this.stat(path), function () {
	            return true;
	        }, function () {
	            return false;
	        });
	    };

	    exports.isFile = function (path) {
	        return Q.when(this.stat(path), function (stat) {
	            return stat.isFile();
	        }, function (reason) {
	            return false;
	        });
	    };

	    exports.isDirectory = function (path) {
	        return Q.when(this.stat(path), function (stat) {
	            return stat.isDirectory();
	        }, function (reason) {
	            return false;
	        });
	    };

	    exports.isSymbolicLink = function (path) {
	        return Q.when(this.statLink(path), function (stat) {
	            return stat.isSymbolicLink();
	        }, function (reason) {
	            return false;
	        });
	    };

	    exports.lastModified = function (path) {
	        var self = this;
	        return self.stat(path).invoke('lastModified');
	    };

	    exports.lastAccessed = function (path) {
	        var self = this;
	        return self.stat(path).invoke('lastAccessed');
	    };

	    exports.absolute = function (path) {
	        if (this.isAbsolute(path))
	            return this.normal(path);
	        return this.join(workingDirectory(), path);
	    };

	    exports.relative = function (source, target) {
	        var self = this;
	        return Q.when(this.isDirectory(source), function (isDirectory) {
	            if (isDirectory) {
	                return self.relativeFromDirectory(source, target);
	            } else {
	                return self.relativeFromFile(source, target);
	            }
	        });
	    };

	    exports.relativeFromFile = function (source, target) {
	        var self = this;
	        source = self.absolute(source);
	        target = self.absolute(target);
	        source = source.split(self.SEPARATORS_RE());
	        target = target.split(self.SEPARATORS_RE());
	        source.pop();
	        while (
	            source.length &&
	            target.length &&
	            target[0] == source[0]
	        ) {
	            source.shift();
	            target.shift();
	        }
	        while (source.length) {
	            source.shift();
	            target.unshift("..");
	        }
	        return target.join(self.SEPARATOR);
	    };

	    exports.relativeFromDirectory = function (source, target) {
	        if (!target) {
	            target = source;
	            source = workingDirectory();
	        }
	        source = this.absolute(source);
	        target = this.absolute(target);
	        source = source.split(this.SEPARATORS_RE());
	        target = target.split(this.SEPARATORS_RE());
	        if (source.length === 2 && source[1] === "")
	            source.pop();
	        while (
	            source.length &&
	            target.length &&
	            target[0] == source[0]
	        ) {
	            source.shift();
	            target.shift();
	        }
	        while (source.length) {
	            source.shift();
	            target.unshift("..");
	        }
	        return target.join(this.SEPARATOR);
	    };

	    exports.contains = function (parent, child) {
	        var i, ii;
	        parent = this.absolute(parent);
	        child = this.absolute(child);
	        parent = parent.split(this.SEPARATORS_RE());
	        child = child.split(this.SEPARATORS_RE());
	        if (parent.length === 2 && parent[1] === "")
	            parent.pop();
	        if (parent.length > child.length)
	            return false;
	        for (i = 0, ii = parent.length; i < ii; i++) {
	            if (parent[i] !== child[i])
	                break;
	        }
	        return i == ii;
	    };

	    exports.reroot = reroot;
	    function reroot(path) {
	        var self = this;
	        path = path || this.ROOT;
	        return RootFs(self, path);
	    }

	    exports.toObject = function (path) {
	        var self = this;
	        var list = self.listTree(path || "", function (path, stat) {
	            return stat.isFile();
	        });
	        return Q.when(list, function (list) {
	            var tree = {};
	            return Q.all(list.map(function (path) {
	                return Q.when(self.read(path, "rb"), function (content) {
	                    tree[path] = content;
	                });
	            })).then(function () {
	                return tree;
	            });
	        });
	    };

	    exports.merge = function (fss) {
	        var tree = {};
	        var done;
	        fss.forEach(function (fs) {
	            done = Q.when(done, function () {
	                return fs.listTree("", function (path, stat) {
	                    return stat.isFile();
	                })
	                .then(function (list) {
	                    return Q.all(list.map(function (path) {
	                        return Q.when(fs.read(path, "rb"), function (content) {
	                            tree[path] = content;
	                        });
	                    }));
	                });
	            });
	        })
	        return Q.when(done, function () {
	            return MockFs(tree);
	        });
	    };

	    exports.Stats = Stats;
	    function Stats(nodeStat) {
	        this.node = nodeStat;
	        this.size = nodeStat.size;
	    }

	    var stats = [
	        "isDirectory",
	        "isFile",
	        "isBlockDevice",
	        "isCharacterDevice",
	        "isSymbolicLink",
	        "isFIFO",
	        "isSocket"
	    ];

	    stats.forEach(function (name) {
	        Stats.prototype[name] = function () {
	            return this.node[name]();
	        };
	    });

	    Stats.prototype.lastModified = function () {
	        return new Date(this.node.mtime);
	    };

	    Stats.prototype.lastAccessed = function () {
	        return new Date(this.node.atime);
	    };

	}


	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(20).Buffer))

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {
	var Q = __webpack_require__(9);
	var Boot = __webpack_require__(28);
	var Common = __webpack_require__(23);
	var BufferStream = __webpack_require__(29);
	var Reader = __webpack_require__(21);
	var Set = __webpack_require__(34);

	module.exports = MockFs;

	function MockFs(files, workingDirectory) {
	    if (!(this instanceof MockFs)) {
	        return new MockFs(files, workingDirectory);
	    }
	    this._root = new DirectoryNode(this, "/");

	    function init() {
	        // construct a file tree
	    }

	    Common.update(this, function () {
	        return workingDirectory;
	    });

	    workingDirectory = workingDirectory || this.ROOT;
	    if (files) {
	        this._init(files);
	    }
	}

	MockFs.prototype = Object.create(Boot);

	MockFs.prototype._init = function (files, tree) {
	    tree = tree || this.ROOT;
	    Object.keys(files).forEach(function (path) {
	        var content = files[path];
	        path = this.join(tree, path);
	        var directory = this.directory(path);
	        var base = this.base(path);
	        var directoryNode = this._root._walk(directory, true);
	        var fileNode = new FileNode(this);
	        if (!(content instanceof Buffer)) {
	            if (typeof content === "object") {
	                // make directory
	                this._root._walk(path, true);
	                // make content
	                this._init(content, path);
	                return;
	            } else {
	                content = new Buffer(String(content), "utf-8");
	            }
	        }
	        directoryNode._entries[base] = fileNode;
	        fileNode._chunks = [content];
	    }, this);
	};

	MockFs.prototype.list = function (path) {
	    var self = this;
	    return Q.fcall(function () {
	        path = self.absolute(path);
	        var node = self._root._walk(path)._follow(path);
	        if (!node.isDirectory()) {
	            new Error("Can't list non-directory: " + JSON.stringify(path));
	        }
	        return Object.keys(node._entries).sort();
	    });
	};

	MockFs.prototype.open = function (path, flags, charset, options) {
	    var self = this;
	    return Q.fcall(function () {
	        path = self.absolute(path);
	        var directory = self.directory(path);
	        var base = self.base(path);
	        var node = self._root._walk(directory);
	        if (!node.isDirectory()) {
	            throw new Error("Can't find " + path + " because " + directory + " is not a directory");
	        }
	        if (typeof flags == "object") {
	            options = flags;
	            flags = options.flags;
	            charset = options.charset;
	        } else {
	            options = options || {};
	        }
	        flags = flags || "r";
	        var binary = flags.indexOf("b") >= 0;
	        var write = flags.indexOf("w") >= 0;
	        var append = flags.indexOf("a") >= 0;
	        if (!binary) {
	            charset = charset || "utf-8";
	        }
	        if (write || append) {
	            if (!node._entries[base]) {
	                node._entries[base] = new FileNode(this);
	                if ("mode" in options) {
	                    node._entries[base].mode = options.mode;
	                }
	            }
	            var fileNode = node._entries[base]._follow(path);
	            if (!fileNode.isFile()) {
	                throw new Error("Can't write non-file " + path);
	            }
	            fileNode.mtime = Date.now();
	            fileNode.atime = Date.now();
	            if (!append) {
	                fileNode._chunks.length = 0;
	            }
	            return new BufferStream(fileNode._chunks, charset);
	        } else { // read
	            if (!node._entries[base]) {
	                throw new Error("Can't read non-existant " + path);
	            }
	            var fileNode = node._entries[base]._follow(path);
	            if (!fileNode.isFile()) {
	                throw new Error("Can't read non-file " + path);
	            }
	            fileNode.atime = Date.now();
	            if ("begin" in options && "end" in options) {
	                return new BufferStream(
	                    [
	                        Reader.join(fileNode._chunks)
	                        .slice(options.begin, options.end)
	                    ],
	                    charset
	                );
	            } else {
	                return new BufferStream(fileNode._chunks, charset);
	            }
	        }
	    });
	};

	MockFs.prototype.remove = function (path) {
	    var self = this;
	    return Q.fcall(function () {
	        path = self.absolute(path);
	        var directory = self.directory(path);
	        var name = self.base(path);
	        var node = self._root._walk(directory);
	        if (!node.isDirectory()) {
	            throw new Error("Can't remove file from non-directory: " + path);
	        }
	        if (!node._entries[name]) {
	            throw new Error("Can't remove non-existant file: " + path);
	        }
	        if (node._entries[name].isDirectory()) {
	            throw new Error("Can't remove directory. Use removeDirectory: " + path);
	        }
	        delete node._entries[name];
	    });
	};

	MockFs.prototype.makeDirectory = function (path, mode) {
	    var self = this;
	    return Q.fcall(function () {
	        path = self.absolute(path);
	        var directory = self.directory(path);
	        var name = self.base(path);
	        var node = self._root._walk(directory);
	        if (!node.isDirectory()) {
	            var error =  new Error("Can't make directory in non-directory: " + path);
	            error.code = "EEXISTS";
	            error.exists = true;
	            throw error;
	        }
	        if (node._entries[name]) {
	            var error = new Error("Can't make directory. Entry exists: " + path);
	            error.code = "EISDIR";
	            error.exists = true;
	            error.isDirectory = true;
	            throw error;
	        }
	        node._entries[name] = new DirectoryNode(self);
	        if (mode) {
	            node._entries[name].mode = mode;
	        }
	    });
	};

	MockFs.prototype.removeDirectory = function (path) {
	    var self = this;
	    return Q.fcall(function () {
	        path = self.absolute(path);
	        var directory = self.directory(path);
	        var name = self.base(path);
	        var node = self._root._walk(directory);
	        if (!node.isDirectory()) {
	            throw new Error("Can't remove directory from non-directory: " + path);
	        }
	        if (!node._entries[name]) {
	            throw new Error("Can't remove non-existant directory: " + path);
	        }
	        if (!node._entries[name].isDirectory()) {
	            throw new Error("Can't remove non-directory: " + path);
	        }
	        delete node._entries[name];
	    });
	};

	MockFs.prototype.stat = function (path) {
	    var self = this;
	    return Q.fcall(function () {
	        path = self.absolute(path);
	        return new self.Stats(self._root._walk(path)._follow(path));
	    });
	};

	MockFs.prototype.statLink = function (path) {
	    var self = this;
	    return Q.fcall(function () {
	        path = self.absolute(path);
	        return new self.Stats(self._root._walk(path));
	    });
	};

	MockFs.prototype.link = function (source, target) {
	    var self = this;
	    return Q.fcall(function () {
	        source = self.absolute(source);
	        target = self.absolute(target);
	        var sourceNode = self._root._walk(source)._follow(source);
	        if (!sourceNode.isFile()) {
	            throw new Error("Can't link non-file: " + source);
	        }
	        var directory = self.directory(target);
	        var base = self.base(target);
	        var targetNode = self._root._walk(directory)._follow(directory);
	        if (!targetNode.isDirectory()) {
	            throw new Error("Can't create link in non-directory: " + target);
	        }
	        if (targetNode._entries[base] && targetNode._entries[base].isDirectory()) {
	            throw new Error("Can't overwrite existing directory with hard link: " + target);
	        }
	        targetNode._entries[base] = sourceNode;
	    });
	};

	MockFs.prototype.symbolicLink = function (target, relative, type) {
	    var self = this;
	    return Q.fcall(function () {
	        target = self.absolute(target);
	        var directory = self.directory(target);
	        var base = self.base(target);
	        var node = self._root._walk(directory);
	        if (node._entries[base] && node._entries[base].isDirectory()) {
	            throw new Error("Can't overwrite existing directory with symbolic link: " + target);
	        }
	        node._entries[base] = new LinkNode(self, relative);
	    });
	};

	MockFs.prototype.chown = function (path, owner) {
	    var self = this;
	    return Q.fcall(function () {
	        path = self.absolute(path);
	        self._root._walk(path)._follow(path)._owner = owner;
	    });
	};

	MockFs.prototype.chmod = function (path, mode) {
	    var self = this;
	    return Q.fcall(function () {
	        path = self.absolute(path);
	        self._root._walk(path)._follow(path).mode = mode;
	    });
	};

	MockFs.prototype.rename = function (source, target) {
	    var self = this;
	    return Q.fcall(function () {
	        source = self.absolute(source);
	        target = self.absolute(target);

	        var sourceDirectory = self.directory(source);
	        var sourceDirectoryNode = self._root._walk(sourceDirectory)._follow(sourceDirectory);
	        var sourceName = self.base(source);
	        var sourceNode = sourceDirectoryNode._entries[sourceName];

	        if (!sourceNode) {
	            var error = new Error("Can't copy non-existent file: " + source);
	            error.code = "ENOENT";
	            throw error;
	        }

	        sourceNode = sourceNode._follow(source);

	        // check again after following symbolic links
	        if (!sourceNode) {
	            var error = new Error("Can't copy non-existent file: " + source);
	            error.code = "ENOENT";
	            throw error;
	        }

	        var targetDirectory = self.directory(target);
	        var targetDirectoryNode = self._root._walk(targetDirectory)._follow(targetDirectory);
	        var targetName = self.base(target);
	        var targetNode = targetDirectoryNode._entries[targetName]; // might not exist, not followed

	        if (targetNode) {
	            targetNode = targetNode._follow(target);
	        }

	        if (targetNode && targetNode.isDirectory()) {
	            var error = new Error("Can't copy over existing directory: " + target);
	            error.code = "EISDIR";
	            throw error;
	        }

	        // do not copy over self, even with symbolic links to confuse the issue
	        if (targetNode === sourceNode) {
	            return;
	        }

	        targetDirectoryNode._entries[targetName] = sourceNode;
	        delete sourceDirectoryNode._entries[sourceName];
	    });
	};

	MockFs.prototype.readLink = function (path) {
	    var self = this;
	    return Q.fcall(function () {
	        path = self.absolute(path);
	        var node = self._root._walk(path);
	        if (!self.isSymbolicLink()) {
	            throw new Error("Can't read non-symbolic link: " + path);
	        }
	        return node._link;
	    });
	};

	MockFs.prototype.canonical = function (path) {
	    var self = this;
	    return Q.fcall(function () {
	        path = self.absolute(path);
	        return self._root._canonical(path);
	    });
	};

	MockFs.mock = mock;
	function mock(fs, root) {
	    return Q.when(fs.listTree(root), function (list) {
	        var tree = {};
	        return Q.all(list.map(function (path) {
	            var actual = fs.join(root, path);
	            var relative = fs.relativeFromDirectory(root, actual);
	            return Q.when(fs.stat(actual), function (stat) {
	                if (stat.isFile()) {
	                    return Q.when(fs.read(path, "rb"), function (content) {
	                        tree[relative] = content;
	                    });
	                }
	            });
	        })).then(function () {
	            return MockFs(tree);
	        });
	    });
	}

	function Node(fs) {
	    if (!fs)
	        throw new Error("FS required argument");
	    this._fs = fs;
	    this.atime = this.mtime = Date.now();
	    this.mode = parseInt("0644", 8);
	    this._owner = null;
	}

	Node.prototype._walk = function (path, make, via) {
	    var parts = this._fs.split(path);
	    if (this._fs.isAbsolute(path)) {
	        parts.shift();
	        return this._fs._root._walkParts(parts, make, this._fs.ROOT);
	    } else {
	        return this._walkParts(parts, make, via || this._fs.ROOT);
	    }
	};

	Node.prototype._walkParts = function (parts, make, via) {
	    if (parts.length === 0) {
	        return this;
	    } else {
	        var part = parts.shift();
	        if (part === "") {
	            return this._walkParts(parts, make, this._fs.join(via, part));
	        } else {
	            var error = new Error("Can't find " + JSON.stringify(this._fs.resolve(part, this._fs.join(parts))) + " via " + JSON.stringify(via));
	            error.code = "ENOENT";
	            throw error;
	        }
	    }
	};

	Node.prototype._canonical = function (path) {
	    if (!this._fs.isAbsolute(path)) {
	        throw new Error("Path must be absolute for _canonical: " + path);
	    }
	    var parts = this._fs.split(path);
	    parts.shift();
	    var via = this._fs.ROOT;
	    return via + this._fs._root._canonicalParts(parts, via);
	};

	Node.prototype._canonicalParts = function (parts, via) {
	    if (parts.length === 0) {
	        return via;
	    }
	    return this._fs.join(via, this._fs.join(parts));
	};

	Node.prototype._follow = function () {
	    return this;
	};

	Node.prototype._touch = function () {
	    this.mtime = Date.now();
	};

	var stats = [
	    "isDirectory",
	    "isFile",
	    "isBlockDevice",
	    "isCharacterDevice",
	    "isSymbolicLink",
	    "isFIFO",
	    "isSocket"
	];

	stats.forEach(function (name) {
	    Node.prototype[name] = function () {
	        return false;
	    };
	});

	Node.prototype.lastAccessed = function () {
	    return this.atime;
	};

	Node.prototype.lastModified = function () {
	    return this.mtime;
	};

	function FileNode(fs) {
	    Node.call(this, fs);
	    this._chunks = [];
	}

	FileNode.prototype = Object.create(Node.prototype);

	FileNode.prototype.isFile = function () {
	    return true;
	};

	Object.defineProperty(FileNode.prototype, "size", {
	    configurable: true,
	    enumerable: true,
	    get: function () {
	        return this._chunks.reduce(function (size, chunk) {
	            return size += chunk.length;
	        }, 0);
	    }
	});

	function DirectoryNode(fs) {
	    Node.call(this, fs);
	    this._entries = Object.create(null);
	    this.mode = parseInt("0755", 8);
	}

	DirectoryNode.prototype = Object.create(Node.prototype);

	DirectoryNode.prototype.isDirectory = function () {
	    return true;
	};

	DirectoryNode.prototype._walkParts = function (parts, make, via) {
	    via = via || this._fs.ROOT;
	    if (parts.length === 0) {
	        return this;
	    }
	    var part = parts.shift();
	    if (part === "") {
	        return this._walkParts(parts, make, this._fs.join(via, part));
	    }
	    if (!this._entries[part]) {
	        if (make) {
	            this._entries[part] = new DirectoryNode(this._fs);
	        } else {
	            var error = new Error("Can't find " + JSON.stringify(this._fs.join(parts)) + " via " + JSON.stringify(via));
	            error.code = "ENOENT";
	            throw error;

	        }
	    }
	    return this._entries[part]._walkParts(parts, make, this._fs.join(via, part));
	};

	DirectoryNode.prototype._canonicalParts = function (parts, via) {
	    if (parts.length === 0) {
	        return via;
	    }
	    var part = parts.shift();
	    if (part === "") {
	        return via;
	    }
	    if (via === this._fs.ROOT) {
	        via = "";
	    }
	    if (!this._entries[part]) {
	        return this._fs.join(via, part, this._fs.join(parts));
	    }
	    return this._entries[part]._canonicalParts(
	        parts,
	        this._fs.join(via, part)
	    );
	};

	function LinkNode(fs, link) {
	    Node.call(this, fs);
	    this._link = link;
	}

	LinkNode.prototype = Object.create(Node.prototype);

	LinkNode.prototype.isSymbolicLink = function () {
	    return true;
	};

	LinkNode.prototype._follow = function (via, memo) {
	    memo = memo || Set();
	    if (memo.has(this)) {
	        var error = new Error("Can't follow symbolic link cycle at " + JSON.stringify(via));
	        error.code = "ELOOP";
	        throw error;
	    }
	    memo.add(this);
	    var link = this._fs.join(via, "..", this._link);
	    return this._walk(link, null, "<link>")._follow(link, memo);
	};

	LinkNode.prototype._canonicalParts = function (parts, via) {
	    return this._fs.relativeFromDirectory(this._fs.ROOT,
	        this._fs._root._canonical(
	            this._fs.absolute(this._fs.join(via, "..", this._link))
	        )
	    );
	};

	// cycle breaking
	var FS = __webpack_require__(8);


	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(20).Buffer))

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	
	var Q = __webpack_require__(9);
	var BOOT = __webpack_require__(28);
	var COMMON = __webpack_require__(23);

	module.exports = RootFs;

	function RootFs(outer, root) {
	    var inner = Object.create(BOOT);

	    function attenuate(path) {

	        // the machinations of projecting a path inside a
	        // subroot
	        var actual;
	        // if it's absolute, we want the path relative to
	        // the root of the inner file system
	        if (outer.isAbsolute(path)) {
	            actual = outer.relativeFromDirectory(outer.ROOT, path);
	        } else {
	            actual = path;
	        }
	        // we join the path onto the root of the inner file
	        // system so that parent references from the root
	        // return to the root, emulating standard unix
	        // behavior
	        actual = outer.join(outer.ROOT, actual);
	        // then we reconstruct the path relative to the
	        // inner root
	        actual = outer.relativeFromDirectory(outer.ROOT, actual);
	        // and rejoin it on the outer root
	        actual = outer.join(root, actual);
	        // and find the corresponding real path
	        return outer.canonical(actual)
	        .then(function (actual) {
	            return actual;
	        }, function () {
	            return actual;
	        }).then(function (actual) {
	            // and verify that the outer canonical path is
	            // actually inside the inner canonical path, to
	            // prevent break-outs
	            if (outer.contains(root, actual)) {
	                return {
	                    "inner": outer.join(outer.ROOT, outer.relativeFromDirectory(root, actual)),
	                    "outer": actual
	                };
	            } else {
	                return Q.reject("Can't find: " + JSON.stringify(path));
	            }
	        });
	    }

	    function workingDirectory() {
	        return outer.ROOT;
	    }

	    COMMON.update(inner, workingDirectory);

	    inner.list = function (path) {
	        return attenuate(path).then(function (path) {
	            return outer.list(path.outer);
	        }).then(null, function (reason) {
	            return Q.reject("Can't list " + JSON.stringify(path));
	        });
	    };

	    inner.open = function (path, flags, charset) {
	        return attenuate(path).then(function (path) {
	            return outer.open(path.outer, flags, charset);
	        }).then(null, function (reason) {
	            return Q.reject("Can't open " + JSON.stringify(path));
	        });
	    };

	    inner.stat = function (path) {
	        return attenuate(path).then(function (path) {
	            return outer.stat(path.outer);
	        }).then(null, function (reason) {
	            return Q.reject("Can't stat " + JSON.stringify(path));
	        });
	    };

	    inner.statLink = function (path) {
	        return attenuate(path).then(function (path) {
	            return outer.statLink(path.outer);
	        }).then(null, function (reason) {
	            return Q.reject("Can't statLink " + JSON.stringify(path));
	        });
	    };

	    inner.canonical = function (path) {
	        return attenuate(path).then(function (path) {
	            return path.inner;
	        }).then(null, function (reason) {
	            return Q.reject("Can't find canonical of " + JSON.stringify(path));
	        });
	    };

	    inner.makeDirectory = function (path) {
	        return attenuate(path).then(function (path) {
	            return outer.makeDirectory(path.outer);
	        }).catch(function (error) {
	            throw new Error("Can't make directory " + JSON.stringify(path));
	        });
	    };

	    inner.removeDirectory = function (path) {
	        return attenuate(path).then(function (path) {
	            return outer.removeDirectory(path.outer);
	        }).catch(function (error) {
	            throw new Error("Can't remove directory " + JSON.stringify(path));
	        });
	    };

	    inner.remove = function (path) {
	        return attenuate(path).then(function (path) {
	            return outer.remove(path.outer);
	        }).catch(function (error) {
	            throw new Error("Can't remove " + JSON.stringify(path));
	        });
	    };

	    inner.makeTree = function (path) {
	        return attenuate(path).then(function (path) {
	            return outer.makeTree(path.outer);
	        }).catch(function (error) {
	            throw new Error("Can't make tree " + JSON.stringify(path));
	        });
	    };

	    inner.removeTree = function (path) {
	        return attenuate(path).then(function (path) {
	            return outer.removeTree(path.outer);
	        }).catch(function (error) {
	            throw new Error("Can't remove tree " + JSON.stringify(path));
	        });
	    };

	    return Q.when(outer.canonical(root), function (_root) {
	        root = _root;
	        return inner;
	    });
	}



/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate, clearImmediate) {var nextTick = __webpack_require__(6).nextTick;
	var apply = Function.prototype.apply;
	var slice = Array.prototype.slice;
	var immediateIds = {};
	var nextImmediateId = 0;

	// DOM APIs, for completeness

	exports.setTimeout = function() {
	  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
	};
	exports.setInterval = function() {
	  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
	};
	exports.clearTimeout =
	exports.clearInterval = function(timeout) { timeout.close(); };

	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function() {};
	Timeout.prototype.close = function() {
	  this._clearFn.call(window, this._id);
	};

	// Does not start the time, just sets up the members needed.
	exports.enroll = function(item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};

	exports.unenroll = function(item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};

	exports._unrefActive = exports.active = function(item) {
	  clearTimeout(item._idleTimeoutId);

	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout)
	        item._onTimeout();
	    }, msecs);
	  }
	};

	// That's not how node.js implements it but the exposed api is the same.
	exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
	  var id = nextImmediateId++;
	  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

	  immediateIds[id] = true;

	  nextTick(function onNextTick() {
	    if (immediateIds[id]) {
	      // fn.call() is faster so we optimize for the common use-case
	      // @see http://jsperf.com/call-apply-segu
	      if (args) {
	        fn.apply(null, args);
	      } else {
	        fn.call(null);
	      }
	      // Prevent ids from leaking
	      exports.clearImmediate(id);
	    }
	  });

	  return id;
	};

	exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
	  delete immediateIds[id];
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(27).setImmediate, __webpack_require__(27).clearImmediate))

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {(function (exports) {

	// -- kriskowal Kris Kowal Copyright (C) 2009-2010 MIT License
	// -- tlrobinson Tom Robinson TODO

	/**
	 * Pure JavaScript implementations of file system path
	 * manipulation.
	 */

	// NOTE: this file may be used is the engine bootstrapping
	// process, so any "requires" must be accounted for in
	// narwhal.js

	/*whatsupdoc*/
	/*markup markdown*/

	var regExpEscape = function (str) {
	    return str.replace(/[-[\]{}()*+?.\\^$|,#\s]/g, "\\$&");
	};

	var path = __webpack_require__(37);

	/**
	 * @name ROOT
	 * * `/` on Unix
	 * * `\` on Windows
	 */

	/**
	 * @name SEPARATOR
	 * * `/` on Unix
	 * * `\` on Windows
	 */

	/**
	 * @name ALT_SEPARATOR
	 * * undefined on Unix
	 * * `/` on Windows
	 */

	exports.ROOT = exports.SEPARATOR = path.sep || (process.platform === "win32" ? "\\": "/");
	if (path.sep === "\\") {
	    exports.ALT_SEPARATOR = "/";
	} else {
	    exports.ALT_SEPARATOR = undefined;
	}

	// we need to make sure the separator regex is always in sync with the separators.
	// this caches the generated regex and rebuild if either separator changes.
	var separatorCached, altSeparatorCached, separatorReCached;
	/**
	 * @function
	 */
	exports.SEPARATORS_RE = function () {
	    if (
	        separatorCached !== exports.SEPARATOR ||
	        altSeparatorCached !== exports.ALT_SEPARATOR
	    ) {
	        separatorCached = exports.SEPARATOR;
	        altSeparatorCached = exports.ALT_SEPARATOR;
	        separatorReCached = new RegExp("[" +
	            (separatorCached || "").replace(/[-[\]{}()*+?.\\^$|,#\s]/g, "\\$&") +
	            (altSeparatorCached || "").replace(/[-[\]{}()*+?.\\^$|,#\s]/g, "\\$&") +
	        "]", "g");
	    }
	    return separatorReCached;
	}

	/**
	 * separates a path into components.  If the path is
	 * absolute, the first path component is the root of the
	 * file system, indicated by an empty string on Unix, and a
	 * drive letter followed by a colon on Windows.
	 * @returns {Array * String}
	 */
	exports.split = function (path) {
	    var parts;
	    try {
	        parts = String(path).split(exports.SEPARATORS_RE());
	    } catch (exception) {
	        throw new Error("Cannot split " + (typeof path) + ", " + JSON.stringify(path));
	    }
	    // this special case helps isAbsolute
	    // distinguish an empty path from an absolute path
	    // "" -> [] NOT [""]
	    if (parts.length === 1 && parts[0] === "")
	        return [];
	    // "a" -> ["a"]
	    // "/a" -> ["", "a"]
	    return parts;
	};

	/**
	 * Takes file system paths as variadic arguments and treats
	 * each as a file or directory path and returns the path
	 * arrived by traversing into the those paths.  All
	 * arguments except for the last must be paths to
	 * directories for the result to be meaningful.
	 * @returns {String} path
	 */
	exports.join = function () {
	    if (arguments.length === 1 && Array.isArray(arguments[0]))
	        return exports.normal.apply(exports, arguments[0]);
	    return exports.normal.apply(exports, arguments);
	};

	/**
	 * Takes file system paths as variadic arguments and treats
	 * each path as a location, in the URL sense, resolving each
	 * new location based on the previous.  For example, if the
	 * first argument is the absolute path of a JSON file, and
	 * the second argument is a path mentioned in that JSON
	 * file, `resolve` returns the absolute path of the
	 * mentioned file.
	 * @returns {String} path
	 */
	exports.resolve = function () {
	    var root = "";
	    var parents = [];
	    var children = [];
	    var leaf = "";
	    for (var i = 0; i < arguments.length; i++) {
	        var path = String(arguments[i]);
	        if (path == "")
	            continue;
	        var parts = path.split(exports.SEPARATORS_RE());
	        if (exports.isAbsolute(path)) {
	            root = parts.shift() + exports.SEPARATOR;
	            parents = [];
	            children = [];
	        }
	        leaf = parts.pop();
	        if (leaf == "." || leaf == "..") {
	            parts.push(leaf);
	            leaf = "";
	        }
	        for (var j = 0; j < parts.length; j++) {
	            var part = parts[j];
	            if (part == "." || part == "") {
	            } else if (part == "..") {
	                if (children.length) {
	                    children.pop();
	                } else {
	                    if (root) {
	                    } else {
	                        parents.push("..");
	                    }
	                }
	            } else {
	                children.push(part);
	            }
	        };
	    }
	    path = parents.concat(children).join(exports.SEPARATOR);
	    if (path) leaf = exports.SEPARATOR + leaf;
	    return root + path + leaf;
	};

	/**
	 * Takes paths as any number of arguments and reduces them
	 * into a single path in normal form, removing all "." path
	 * components, and reducing ".." path components by removing
	 * the previous path component if possible.
	 * @returns {String} path
	 */
	exports.normal = function () {
	    var root = "";
	    var parents = [];
	    var children = [];
	    for (var i = 0, ii = arguments.length; i < ii; i++) {
	        var path = String(arguments[i]);
	        // empty paths have no affect
	        if (path === "")
	            continue;
	        var parts = path.split(exports.SEPARATORS_RE());
	        if (exports.isAbsolute(path)) {
	            root = parts.shift() + exports.SEPARATOR;
	            parents = [];
	            children = [];
	        }
	        for (var j = 0, jj = parts.length; j < jj; j++) {
	            var part = parts[j];
	            if (part === "." || part === "") {
	            } else if (part == "..") {
	                if (children.length) {
	                    children.pop();
	                } else {
	                    if (root) {
	                    } else {
	                        parents.push("..");
	                    }
	                }
	            } else {
	                children.push(part);
	            }
	        }
	    }
	    path = parents.concat(children).join(exports.SEPARATOR);
	    return root + path;
	};

	/***
	 * @returns {Boolean} whether the given path begins at the
	 * root of the file system or a drive letter.
	 */
	exports.isAbsolute = function (path) {
	    // for absolute paths on any operating system,
	    // the first path component always determines
	    // whether it is relative or absolute.  On Unix,
	    // it is empty, so ["", "foo"].join("/") == "/foo",
	    // "/foo".split("/") == ["", "foo"].
	    var parts = exports.split(path);
	    // split("") == [].  "" is not absolute.
	    // split("/") == ["", ""] is absolute.
	    // split(?) == [""] does not occur.
	    if (parts.length == 0)
	        return false;
	    return exports.isRoot(parts[0]);
	};

	/**
	 * @returns {Boolean} whether the given path does not begin
	 * at the root of the file system or a drive letter.
	 */
	exports.isRelative = function (path) {
	    return !exports.isAbsolute(path);
	};

	/**
	 * @returns {Boolean} whether the given path component
	 * corresponds to the root of the file system or a drive
	 * letter, as applicable.
	 */
	exports.isRoot = function (first) {
	    if (exports.SEPARATOR === "\\") {
	        return /[a-zA-Z]:$/.test(first);
	    } else {
	        return first == "";
	    }
	};

	/**
	 * @returns {String} the Unix root path or corresponding
	 * Windows drive for a given path.
	 */
	exports.root = function (path) {
	    if (!exports.isAbsolute(path))
	        path = __webpack_require__(8).absolute(path);
	    var parts = exports.split(path);
	    return exports.join(parts[0], "");
	};

	/**
	 * @returns {String} the parent directory of the given path.
	 */
	exports.directory = function (path) {
	    path = exports.normal(path);
	    var absolute = exports.isAbsolute(path);
	    var parts = exports.split(path);
	    // XXX needs to be sensitive to the root for
	    // Windows compatibility
	    if (parts.length) {
	        if (parts[parts.length - 1] == "..") {
	            parts.push("..");
	        } else {
	            parts.pop();
	        }
	    } else {
	        parts.unshift("..");
	    }
	    return parts.join(exports.SEPARATOR) || (
	        exports.isRelative(path) ?
	        "" : exports.ROOT
	    );
	};

	/**
	 * @returns {String} the last component of a path, without
	 * the given extension if the extension is provided and
	 * matches the given file.
	 * @param {String} path
	 * @param {String} extention an optional extention to detect
	 * and remove if it exists.
	 */
	exports.base = function (path, extension) {
	    var base = path.split(exports.SEPARATORS_RE()).pop();
	    if (extension)
	        base = base.replace(
	            new RegExp(regExpEscape(extension) + "$"),
	            ""
	        );
	    return base;
	};

	/**
	 * @returns {String} the extension (e.g., `txt`) of the file
	 * at the given path.
	 */
	exports.extension = function (path) {
	    path = exports.base(path);
	    path = path.replace(/^\.*/, "");
	    var index = path.lastIndexOf(".");
	    return index <= 0 ? "" : path.substring(index);
	};

	})(true ? exports : FS_BOOT = {});

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {
	var Q = __webpack_require__(9);
	var Reader = __webpack_require__(21);

	module.exports = BufferStream;
	function BufferStream(chunks, charset) {
	    if (!(this instanceof BufferStream)) {
	        return new BufferStream(chunks, charset);
	    }
	    if (!chunks) {
	        chunks = [];
	    } else if (!Array.isArray(chunks)) {
	        chunks = [chunks];
	    }
	    this._charset = charset;
	    this._chunks = chunks;
	    this._close = Q.defer();
	    this.closed = this._close.promise;
	}

	BufferStream.prototype.forEach = function (write, thisp) {
	    var self = this;
	    var chunks = self._chunks;
	    return Q.fcall(function () {
	        chunks.splice(0, chunks.length).forEach(write, thisp);
	    });
	};

	BufferStream.prototype.read = function () {
	    var result;
	    result = Reader.join(this._chunks);
	    if (this._charset) {
	        result = result.toString(this._charset);
	    }
	    return Q.resolve(result);
	};

	BufferStream.prototype.write = function (chunk) {
	    if (this._charset) {
	        chunk = new Buffer(String(chunk), this._charset);
	    } else {
	        if (!(chunk instanceof Buffer)) {
	            throw new Error("Can't write strings to buffer stream without a charset: " + chunk);
	        }
	    }
	    this._chunks.push(chunk);
	    return Q.resolve();
	};

	BufferStream.prototype.close = function () {
	    this._close.resolve();
	    return Q.resolve();
	};

	BufferStream.prototype.destroy = function () {
	    this._close.resolve();
	    return Q.resolve();
	};


	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(20).Buffer))

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function isBuffer(arg) {
	  return arg && typeof arg === 'object'
	    && typeof arg.copy === 'function'
	    && typeof arg.fill === 'function'
	    && typeof arg.readUInt8 === 'function';
	}

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * SHA-256 (+ HMAC and PBKDF2) in JavaScript.
	 * Written in 2014 by Dmitry Chestnykh.
	 * Public domain, no warranty.
	 *
	 * Functions (accept and return Uint8Arrays):
	 *
	 *   sha256(message) -> hash
	 *   sha256.hmac(key, message) -> mac
	 *   sha256.pbkdf2(password, salt, rounds, dkLen) -> dk
	 *
	 */
	(function(root, f) {
	  if (typeof module !== 'undefined' && module.exports) module.exports = f();
	  else root.sha256 = f();
	})(this, function() {
	  'use strict';

	  var K = new Uint32Array([
	    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b,
	    0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01,
	    0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7,
	    0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
	    0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152,
	    0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
	    0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc,
	    0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
	    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819,
	    0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08,
	    0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f,
	    0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
	    0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
	  ]);

	  function blocks(w, v, p, pos, len) {
	    var a, b, c, d, e, f, g, h, u, i, j, t1, t2;
	    while (len >= 64) {
	      a = v[0];
	      b = v[1];
	      c = v[2];
	      d = v[3];
	      e = v[4];
	      f = v[5];
	      g = v[6];
	      h = v[7];

	      for (i = 0; i < 16; i++) {
	        j = pos + i*4;
	        w[i] = (((p[j  ] & 0xff) << 24) | ((p[j+1] & 0xff)<<16) |
	                ((p[j+2] & 0xff) <<  8) | ( p[j+3] & 0xff));
	      }

	      for (i = 16; i < 64; i++) {
	        u = w[i-2];
	        t1 = (u>>>17 | u<<(32-17)) ^ (u>>>19 | u<<(32-19)) ^ (u>>>10);

	        u = w[i-15];
	        t2 = (u>>>7 | u<<(32-7)) ^ (u>>>18 | u<<(32-18)) ^ (u>>>3);

	        w[i] = (t1 + w[i-7] | 0) + (t2 + w[i-16] | 0);
	      }

	      for (i = 0; i < 64; i++) {
	        t1 = (((((e>>>6 | e<<(32-6)) ^ (e>>>11 | e<<(32-11)) ^
	                 (e>>>25 | e<<(32-25))) + ((e & f) ^ (~e & g))) | 0) +
	                   ((h + ((K[i] + w[i]) | 0)) | 0)) | 0;

	        t2 = (((a>>>2 | a<<(32-2)) ^ (a>>>13 | a<<(32-13)) ^
	              (a>>>22 | a<<(32-22))) + ((a & b) ^ (a & c) ^ (b & c))) | 0;

	        h = g;
	        g = f;
	        f = e;
	        e = (d + t1) | 0;
	        d = c;
	        c = b;
	        b = a;
	        a = (t1 + t2) | 0;
	      }

	      v[0] += a;
	      v[1] += b;
	      v[2] += c;
	      v[3] += d;
	      v[4] += e;
	      v[5] += f;
	      v[6] += g;
	      v[7] += h;

	      pos += 64;
	      len -= 64;
	    }
	    return pos;
	  }

	  function SHA256() {
	    this.v = new Uint32Array(8);
	    this.w = new Int32Array(64);
	    this.buf = new Uint8Array(128);
	    this.buflen = 0;
	    this.len = 0;
	    this.reset();
	  }

	  SHA256.prototype.reset = function() {
	    this.v[0] = 0x6a09e667;
	    this.v[1] = 0xbb67ae85;
	    this.v[2] = 0x3c6ef372;
	    this.v[3] = 0xa54ff53a;
	    this.v[4] = 0x510e527f;
	    this.v[5] = 0x9b05688c;
	    this.v[6] = 0x1f83d9ab;
	    this.v[7] = 0x5be0cd19;
	    this.buflen = 0;
	    this.len = 0;
	  };

	  SHA256.prototype.clean = function() {
	    var i;
	    for (i = 0; i < this.buf.length; i++) this.buf[i] = 0;
	    for (i = 0; i < this.w.length; i++) this.w[i] = 0;
	    this.reset();
	  };

	  SHA256.prototype.update = function(m, len) {
	    var mpos = 0, mlen = (typeof len !== 'undefined') ? len : m.length;
	    this.len += mlen;
	    if (this.buflen > 0) {
	      while (this.buflen < 64 && mlen > 0) {
	        this.buf[this.buflen++] = m[mpos++];
	        mlen--;
	      }
	      if (this.buflen === 64) {
	        blocks(this.w, this.v, this.buf, 0, 64);
	        this.buflen = 0;
	      }
	    }
	    if (mlen >= 64) {
	      mpos = blocks(this.w, this.v, m, mpos, mlen);
	      mlen %= 64;
	    }
	    while (mlen > 0) {
	      this.buf[this.buflen++] = m[mpos++];
	      mlen--;
	    }
	    return this;
	  };

	  SHA256.prototype.finish = function(h) {
	    var mlen = this.len,
	        left = this.buflen,
	        bhi = (mlen / 0x20000000) | 0,
	        blo = mlen << 3,
	        padlen = (mlen % 64 < 56) ? 64 : 128,
	        i;

	    this.buf[left] = 0x80;
	    for (i = left + 1; i < padlen - 8; i++) this.buf[i] = 0;
	    this.buf[padlen-8] = (bhi >>> 24) & 0xff;
	    this.buf[padlen-7] = (bhi >>> 16) & 0xff;
	    this.buf[padlen-6] = (bhi >>>  8) & 0xff;
	    this.buf[padlen-5] = (bhi >>>  0) & 0xff;
	    this.buf[padlen-4] = (blo >>> 24) & 0xff;
	    this.buf[padlen-3] = (blo >>> 16) & 0xff;
	    this.buf[padlen-2] = (blo >>>  8) & 0xff;
	    this.buf[padlen-1] = (blo >>>  0) & 0xff;

	    blocks(this.w, this.v, this.buf, 0, padlen);

	    for (i = 0; i < 8; i++) {
	      h[i*4+0] = (this.v[i] >>> 24) & 0xff;
	      h[i*4+1] = (this.v[i] >>> 16) & 0xff;
	      h[i*4+2] = (this.v[i] >>>  8) & 0xff;
	      h[i*4+3] = (this.v[i] >>>  0) & 0xff;
	    }
	    return this;
	  };

	  function HMAC(k) {
	    var i, pad = new Uint8Array(64);
	    if (k.length > 64)
	      (new SHA256()).update(k).finish(pad);
	    else
	      for (i = 0; i < k.length; i++) pad[i] = k[i];
	    this.inner = new SHA256();
	    this.outer = new SHA256();
	    for (i = 0; i < 64; i++) pad[i] ^= 0x36;
	    this.inner.update(pad);
	    for (i = 0; i < 64; i++) pad[i] ^= 0x36 ^ 0x5c;
	    this.outer.update(pad);
	    this.istate = new Uint32Array(8);
	    this.ostate = new Uint32Array(8);
	    for (i = 0; i < 8; i++) {
	      this.istate[i] = this.inner.v[i];
	      this.ostate[i] = this.outer.v[i];
	    }
	    for (i = 0; i < pad.length; i++) pad[i] = 0;
	  }

	  HMAC.prototype.reset = function() {
	    for (var i = 0; i < 8; i++) {
	      this.inner.v[i] = this.istate[i];
	      this.outer.v[i] = this.ostate[i];
	    }
	    this.inner.len = this.outer.len = 64;
	    this.inner.buflen = this.outer.buflen = 0;
	  };

	  HMAC.prototype.clean = function() {
	    for (var i = 0; i < 8; i++) this.ostate[i] = this.istate[i] = 0;
	    this.inner.clean();
	    this.outer.clean();
	  };

	  HMAC.prototype.update = function(m) {
	    this.inner.update(m);
	    return this;
	  };

	  HMAC.prototype.finish = function(h) {
	    this.inner.finish(h);
	    this.outer.update(h, 32).finish(h);
	    return this;
	  };

	  var sha256 = function(m) {
	    var h = new Uint8Array(32);
	    (new SHA256()).update(m).finish(h).clean();
	    return h;
	  };

	  sha256.hmac = function(k, m) {
	    var h = new Uint8Array(32);
	    (new HMAC(k)).update(m).finish(h).clean();
	    return h;
	  };

	  sha256.pbkdf2 = function(password, salt, rounds, dkLen) {
	    var i, j, k,
	        ctr = new Uint8Array(4),
	        t = new Uint8Array(32),
	        u = new Uint8Array(32),
	        dk = new Uint8Array(dkLen),
	        prf = new HMAC(password);

	    for (i = 0; i * 32 < dkLen; i++) {
	      k = i + 1;
	      ctr[0] = (k >>> 24) & 0xff;
	      ctr[1] = (k >>> 16) & 0xff;
	      ctr[2] = (k >>> 8)  & 0xff;
	      ctr[3] = (k >>> 0)  & 0xff;
	      prf.reset();
	      prf.update(salt);
	      prf.update(ctr);
	      prf.finish(u);
	      for (j = 0; j < 32; j++) t[j] = u[j];
	      for (j = 2; j <= rounds; j++) {
	        prf.reset();
	        prf.update(u).finish(u);
	        for (k = 0; k < 32; k++) t[k] ^= u[k];
	      }
	      for (j = 0; j < 32 && i*32 + j < dkLen; j++) dk[i*32 + j] = t[j];
	    }
	    for (i = 0; i < 32; i++) t[i] = u[i] = 0;
	    for (i = 0; i < 4; i++) ctr[i] = 0;
	    prf.clean();
	    return dk;
	  };

	  return sha256;
	});


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	exports.read = function(buffer, offset, isLE, mLen, nBytes) {
	  var e, m,
	      eLen = nBytes * 8 - mLen - 1,
	      eMax = (1 << eLen) - 1,
	      eBias = eMax >> 1,
	      nBits = -7,
	      i = isLE ? (nBytes - 1) : 0,
	      d = isLE ? -1 : 1,
	      s = buffer[offset + i];

	  i += d;

	  e = s & ((1 << (-nBits)) - 1);
	  s >>= (-nBits);
	  nBits += eLen;
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

	  m = e & ((1 << (-nBits)) - 1);
	  e >>= (-nBits);
	  nBits += mLen;
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

	  if (e === 0) {
	    e = 1 - eBias;
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity);
	  } else {
	    m = m + Math.pow(2, mLen);
	    e = e - eBias;
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
	};

	exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c,
	      eLen = nBytes * 8 - mLen - 1,
	      eMax = (1 << eLen) - 1,
	      eBias = eMax >> 1,
	      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
	      i = isLE ? 0 : (nBytes - 1),
	      d = isLE ? 1 : -1,
	      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

	  value = Math.abs(value);

	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0;
	    e = eMax;
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2);
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--;
	      c *= 2;
	    }
	    if (e + eBias >= 1) {
	      value += rt / c;
	    } else {
	      value += rt * Math.pow(2, 1 - eBias);
	    }
	    if (value * c >= 2) {
	      e++;
	      c /= 2;
	    }

	    if (e + eBias >= eMax) {
	      m = 0;
	      e = eMax;
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen);
	      e = e + eBias;
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
	      e = 0;
	    }
	  }

	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

	  e = (e << mLen) | m;
	  eLen += mLen;
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

	  buffer[offset + i - d] |= s * 128;
	};


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * isArray
	 */

	var isArray = Array.isArray;

	/**
	 * toString
	 */

	var str = Object.prototype.toString;

	/**
	 * Whether or not the given `val`
	 * is an array.
	 *
	 * example:
	 *
	 *        isArray([]);
	 *        // > true
	 *        isArray(arguments);
	 *        // > false
	 *        isArray('');
	 *        // > false
	 *
	 * @param {mixed} val
	 * @return {bool}
	 */

	module.exports = isArray || function (val) {
	  return !! val && '[object Array]' == str.call(val);
	};


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Shim = __webpack_require__(38);
	var List = __webpack_require__(39);
	var FastSet = __webpack_require__(40);
	var GenericCollection = __webpack_require__(41);
	var GenericSet = __webpack_require__(42);
	var PropertyChanges = __webpack_require__(43);
	var RangeChanges = __webpack_require__(44);

	module.exports = Set;

	function Set(values, equals, hash, getDefault) {
	    if (!(this instanceof Set)) {
	        return new Set(values, equals, hash, getDefault);
	    }
	    equals = equals || Object.equals;
	    hash = hash || Object.hash;
	    getDefault = getDefault || Function.noop;
	    this.contentEquals = equals;
	    this.contentHash = hash;
	    this.getDefault = getDefault;
	    // a list of values in insertion order, used for all operations that depend
	    // on iterating in insertion order
	    this.order = new this.Order(undefined, equals);
	    // a set of nodes from the order list, indexed by the corresponding value,
	    // used for all operations that need to quickly seek  value in the list
	    this.store = new this.Store(
	        undefined,
	        function (a, b) {
	            return equals(a.value, b.value);
	        },
	        function (node) {
	            return hash(node.value);
	        }
	    );
	    this.length = 0;
	    this.addEach(values);
	}

	Set.Set = Set; // hack so require("set").Set will work in MontageJS

	Object.addEach(Set.prototype, GenericCollection.prototype);
	Object.addEach(Set.prototype, GenericSet.prototype);
	Object.addEach(Set.prototype, PropertyChanges.prototype);
	Object.addEach(Set.prototype, RangeChanges.prototype);

	Set.prototype.Order = List;
	Set.prototype.Store = FastSet;

	Set.prototype.constructClone = function (values) {
	    return new this.constructor(values, this.contentEquals, this.contentHash, this.getDefault);
	};

	Set.prototype.has = function (value) {
	    var node = new this.order.Node(value);
	    return this.store.has(node);
	};

	Set.prototype.get = function (value) {
	    var node = new this.order.Node(value);
	    node = this.store.get(node);
	    if (node) {
	        return node.value;
	    } else {
	        return this.getDefault(value);
	    }
	};

	Set.prototype.add = function (value) {
	    var node = new this.order.Node(value);
	    if (!this.store.has(node)) {
	        var index = this.length;
	        if (this.dispatchesRangeChanges) {
	            this.dispatchBeforeRangeChange([value], [], index);
	        }
	        this.order.add(value);
	        node = this.order.head.prev;
	        this.store.add(node);
	        this.length++;
	        if (this.dispatchesRangeChanges) {
	            this.dispatchRangeChange([value], [], index);
	        }
	        return true;
	    }
	    return false;
	};

	Set.prototype["delete"] = function (value) {
	    var node = new this.order.Node(value);
	    if (this.store.has(node)) {
	        var node = this.store.get(node);
	        if (this.dispatchesRangeChanges) {
	            this.dispatchBeforeRangeChange([], [value], node.index);
	        }
	        this.store["delete"](node); // removes from the set
	        this.order.splice(node, 1); // removes the node from the list
	        this.length--;
	        if (this.dispatchesRangeChanges) {
	            this.dispatchRangeChange([], [value], node.index);
	        }
	        return true;
	    }
	    return false;
	};

	Set.prototype.pop = function () {
	    if (this.length) {
	        var result = this.order.head.prev.value;
	        this["delete"](result);
	        return result;
	    }
	};

	Set.prototype.shift = function () {
	    if (this.length) {
	        var result = this.order.head.next.value;
	        this["delete"](result);
	        return result;
	    }
	};

	Set.prototype.one = function () {
	    if (this.length > 0) {
	        return this.store.one().value;
	    }
	};

	Set.prototype.clear = function () {
	    var clearing;
	    if (this.dispatchesRangeChanges) {
	        clearing = this.toArray();
	        this.dispatchBeforeRangeChange([], clearing, 0);
	    }
	    this.store.clear();
	    this.order.clear();
	    this.length = 0;
	    if (this.dispatchesRangeChanges) {
	        this.dispatchRangeChange([], clearing, 0);
	    }
	};

	Set.prototype.reduce = function (callback, basis /*, thisp*/) {
	    var thisp = arguments[2];
	    var list = this.order;
	    var index = 0;
	    return list.reduce(function (basis, value) {
	        return callback.call(thisp, basis, value, index++, this);
	    }, basis, this);
	};

	Set.prototype.reduceRight = function (callback, basis /*, thisp*/) {
	    var thisp = arguments[2];
	    var list = this.order;
	    var index = this.length - 1;
	    return list.reduceRight(function (basis, value) {
	        return callback.call(thisp, basis, value, index--, this);
	    }, basis, this);
	};

	Set.prototype.iterate = function () {
	    return this.order.iterate();
	};

	Set.prototype.log = function () {
	    var set = this.store;
	    return set.log.apply(set, arguments);
	};

	Set.prototype.makeObservable = function () {
	    this.order.makeObservable();
	};



/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	;(function (exports) {
		'use strict';

	  var Arr = (typeof Uint8Array !== 'undefined')
	    ? Uint8Array
	    : Array

		var PLUS   = '+'.charCodeAt(0)
		var SLASH  = '/'.charCodeAt(0)
		var NUMBER = '0'.charCodeAt(0)
		var LOWER  = 'a'.charCodeAt(0)
		var UPPER  = 'A'.charCodeAt(0)
		var PLUS_URL_SAFE = '-'.charCodeAt(0)
		var SLASH_URL_SAFE = '_'.charCodeAt(0)

		function decode (elt) {
			var code = elt.charCodeAt(0)
			if (code === PLUS ||
			    code === PLUS_URL_SAFE)
				return 62 // '+'
			if (code === SLASH ||
			    code === SLASH_URL_SAFE)
				return 63 // '/'
			if (code < NUMBER)
				return -1 //no match
			if (code < NUMBER + 10)
				return code - NUMBER + 26 + 26
			if (code < UPPER + 26)
				return code - UPPER
			if (code < LOWER + 26)
				return code - LOWER + 26
		}

		function b64ToByteArray (b64) {
			var i, j, l, tmp, placeHolders, arr

			if (b64.length % 4 > 0) {
				throw new Error('Invalid string. Length must be a multiple of 4')
			}

			// the number of equal signs (place holders)
			// if there are two placeholders, than the two characters before it
			// represent one byte
			// if there is only one, then the three characters before it represent 2 bytes
			// this is just a cheap hack to not do indexOf twice
			var len = b64.length
			placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

			// base64 is 4/3 + up to two characters of the original data
			arr = new Arr(b64.length * 3 / 4 - placeHolders)

			// if there are placeholders, only get up to the last complete 4 chars
			l = placeHolders > 0 ? b64.length - 4 : b64.length

			var L = 0

			function push (v) {
				arr[L++] = v
			}

			for (i = 0, j = 0; i < l; i += 4, j += 3) {
				tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
				push((tmp & 0xFF0000) >> 16)
				push((tmp & 0xFF00) >> 8)
				push(tmp & 0xFF)
			}

			if (placeHolders === 2) {
				tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
				push(tmp & 0xFF)
			} else if (placeHolders === 1) {
				tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
				push((tmp >> 8) & 0xFF)
				push(tmp & 0xFF)
			}

			return arr
		}

		function uint8ToBase64 (uint8) {
			var i,
				extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
				output = "",
				temp, length

			function encode (num) {
				return lookup.charAt(num)
			}

			function tripletToBase64 (num) {
				return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
			}

			// go through the array every three bytes, we'll deal with trailing stuff later
			for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
				temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
				output += tripletToBase64(temp)
			}

			// pad the end with zeros, but make sure to not forget the extra bytes
			switch (extraBytes) {
				case 1:
					temp = uint8[uint8.length - 1]
					output += encode(temp >> 2)
					output += encode((temp << 4) & 0x3F)
					output += '=='
					break
				case 2:
					temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
					output += encode(temp >> 10)
					output += encode((temp >> 4) & 0x3F)
					output += encode((temp << 2) & 0x3F)
					output += '='
					break
			}

			return output
		}

		exports.toByteArray = b64ToByteArray
		exports.fromByteArray = uint8ToBase64
	}(false ? (this.base64js = {}) : exports))


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// resolves . and .. elements in a path array with directory names there
	// must be no slashes, empty elements, or device names (c:\) in the array
	// (so also no leading and trailing slashes - it does not distinguish
	// relative and absolute paths)
	function normalizeArray(parts, allowAboveRoot) {
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = parts.length - 1; i >= 0; i--) {
	    var last = parts[i];
	    if (last === '.') {
	      parts.splice(i, 1);
	    } else if (last === '..') {
	      parts.splice(i, 1);
	      up++;
	    } else if (up) {
	      parts.splice(i, 1);
	      up--;
	    }
	  }

	  // if the path is allowed to go above the root, restore leading ..s
	  if (allowAboveRoot) {
	    for (; up--; up) {
	      parts.unshift('..');
	    }
	  }

	  return parts;
	}

	// Split a filename into [root, dir, basename, ext], unix version
	// 'root' is just a slash, or nothing.
	var splitPathRe =
	    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
	var splitPath = function(filename) {
	  return splitPathRe.exec(filename).slice(1);
	};

	// path.resolve([from ...], to)
	// posix version
	exports.resolve = function() {
	  var resolvedPath = '',
	      resolvedAbsolute = false;

	  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
	    var path = (i >= 0) ? arguments[i] : process.cwd();

	    // Skip empty and invalid entries
	    if (typeof path !== 'string') {
	      throw new TypeError('Arguments to path.resolve must be strings');
	    } else if (!path) {
	      continue;
	    }

	    resolvedPath = path + '/' + resolvedPath;
	    resolvedAbsolute = path.charAt(0) === '/';
	  }

	  // At this point the path should be resolved to a full absolute path, but
	  // handle relative paths to be safe (might happen when process.cwd() fails)

	  // Normalize the path
	  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
	    return !!p;
	  }), !resolvedAbsolute).join('/');

	  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
	};

	// path.normalize(path)
	// posix version
	exports.normalize = function(path) {
	  var isAbsolute = exports.isAbsolute(path),
	      trailingSlash = substr(path, -1) === '/';

	  // Normalize the path
	  path = normalizeArray(filter(path.split('/'), function(p) {
	    return !!p;
	  }), !isAbsolute).join('/');

	  if (!path && !isAbsolute) {
	    path = '.';
	  }
	  if (path && trailingSlash) {
	    path += '/';
	  }

	  return (isAbsolute ? '/' : '') + path;
	};

	// posix version
	exports.isAbsolute = function(path) {
	  return path.charAt(0) === '/';
	};

	// posix version
	exports.join = function() {
	  var paths = Array.prototype.slice.call(arguments, 0);
	  return exports.normalize(filter(paths, function(p, index) {
	    if (typeof p !== 'string') {
	      throw new TypeError('Arguments to path.join must be strings');
	    }
	    return p;
	  }).join('/'));
	};


	// path.relative(from, to)
	// posix version
	exports.relative = function(from, to) {
	  from = exports.resolve(from).substr(1);
	  to = exports.resolve(to).substr(1);

	  function trim(arr) {
	    var start = 0;
	    for (; start < arr.length; start++) {
	      if (arr[start] !== '') break;
	    }

	    var end = arr.length - 1;
	    for (; end >= 0; end--) {
	      if (arr[end] !== '') break;
	    }

	    if (start > end) return [];
	    return arr.slice(start, end - start + 1);
	  }

	  var fromParts = trim(from.split('/'));
	  var toParts = trim(to.split('/'));

	  var length = Math.min(fromParts.length, toParts.length);
	  var samePartsLength = length;
	  for (var i = 0; i < length; i++) {
	    if (fromParts[i] !== toParts[i]) {
	      samePartsLength = i;
	      break;
	    }
	  }

	  var outputParts = [];
	  for (var i = samePartsLength; i < fromParts.length; i++) {
	    outputParts.push('..');
	  }

	  outputParts = outputParts.concat(toParts.slice(samePartsLength));

	  return outputParts.join('/');
	};

	exports.sep = '/';
	exports.delimiter = ':';

	exports.dirname = function(path) {
	  var result = splitPath(path),
	      root = result[0],
	      dir = result[1];

	  if (!root && !dir) {
	    // No dirname whatsoever
	    return '.';
	  }

	  if (dir) {
	    // It has a dirname, strip trailing slash
	    dir = dir.substr(0, dir.length - 1);
	  }

	  return root + dir;
	};


	exports.basename = function(path, ext) {
	  var f = splitPath(path)[2];
	  // TODO: make this comparison case-insensitive on windows?
	  if (ext && f.substr(-1 * ext.length) === ext) {
	    f = f.substr(0, f.length - ext.length);
	  }
	  return f;
	};


	exports.extname = function(path) {
	  return splitPath(path)[3];
	};

	function filter (xs, f) {
	    if (xs.filter) return xs.filter(f);
	    var res = [];
	    for (var i = 0; i < xs.length; i++) {
	        if (f(xs[i], i, xs)) res.push(xs[i]);
	    }
	    return res;
	}

	// String.prototype.substr - negative index don't work in IE8
	var substr = 'ab'.substr(-1) === 'b'
	    ? function (str, start, len) { return str.substr(start, len) }
	    : function (str, start, len) {
	        if (start < 0) start = str.length + start;
	        return str.substr(start, len);
	    }
	;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	
	var Array = __webpack_require__(45);
	var Object = __webpack_require__(46);
	var Function = __webpack_require__(47);
	var RegExp = __webpack_require__(48);



/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = List;

	var Shim = __webpack_require__(38);
	var GenericCollection = __webpack_require__(41);
	var GenericOrder = __webpack_require__(49);
	var PropertyChanges = __webpack_require__(43);
	var RangeChanges = __webpack_require__(44);

	function List(values, equals, getDefault) {
	    if (!(this instanceof List)) {
	        return new List(values, equals, getDefault);
	    }
	    var head = this.head = new this.Node();
	    head.next = head;
	    head.prev = head;
	    this.contentEquals = equals || Object.equals;
	    this.getDefault = getDefault || Function.noop;
	    this.length = 0;
	    this.addEach(values);
	}

	List.List = List; // hack so require("list").List will work in MontageJS

	Object.addEach(List.prototype, GenericCollection.prototype);
	Object.addEach(List.prototype, GenericOrder.prototype);
	Object.addEach(List.prototype, PropertyChanges.prototype);
	Object.addEach(List.prototype, RangeChanges.prototype);

	List.prototype.constructClone = function (values) {
	    return new this.constructor(values, this.contentEquals, this.getDefault);
	};

	List.prototype.find = function (value, equals) {
	    equals = equals || this.contentEquals;
	    var head = this.head;
	    var at = head.next;
	    while (at !== head) {
	        if (equals(at.value, value)) {
	            return at;
	        }
	        at = at.next;
	    }
	};

	List.prototype.findLast = function (value, equals) {
	    equals = equals || this.contentEquals;
	    var head = this.head;
	    var at = head.prev;
	    while (at !== head) {
	        if (equals(at.value, value)) {
	            return at;
	        }
	        at = at.prev;
	    }
	};

	List.prototype.has = function (value, equals) {
	    return !!this.find(value, equals);
	};

	List.prototype.get = function (value, equals) {
	    var found = this.find(value, equals);
	    if (found) {
	        return found.value;
	    }
	    return this.getDefault(value);
	};

	// LIFO (delete removes the most recently added equivalent value)
	List.prototype['delete'] = function (value, equals) {
	    var found = this.findLast(value, equals);
	    if (found) {
	        if (this.dispatchesRangeChanges) {
	            var plus = [];
	            var minus = [value];
	            this.dispatchBeforeRangeChange(plus, minus, found.index);
	        }
	        found['delete']();
	        this.length--;
	        if (this.dispatchesRangeChanges) {
	            this.updateIndexes(found.next, found.index);
	            this.dispatchRangeChange(plus, minus, found.index);
	        }
	        return true;
	    }
	    return false;
	};

	List.prototype.clear = function () {
	    var plus, minus;
	    if (this.dispatchesRangeChanges) {
	        minus = this.toArray();
	        plus = [];
	        this.dispatchBeforeRangeChange(plus, minus, 0);
	    }
	    this.head.next = this.head.prev = this.head;
	    this.length = 0;
	    if (this.dispatchesRangeChanges) {
	        this.dispatchRangeChange(plus, minus, 0);
	    }
	};

	List.prototype.add = function (value) {
	    var node = new this.Node(value)
	    if (this.dispatchesRangeChanges) {
	        node.index = this.length;
	        this.dispatchBeforeRangeChange([value], [], node.index);
	    }
	    this.head.addBefore(node);
	    this.length++;
	    if (this.dispatchesRangeChanges) {
	        this.dispatchRangeChange([value], [], node.index);
	    }
	    return true;
	};

	List.prototype.push = function () {
	    var head = this.head;
	    if (this.dispatchesRangeChanges) {
	        var plus = Array.prototype.slice.call(arguments);
	        var minus = []
	        var index = this.length;
	        this.dispatchBeforeRangeChange(plus, minus, index);
	        var start = this.head.prev;
	    }
	    for (var i = 0; i < arguments.length; i++) {
	        var value = arguments[i];
	        var node = new this.Node(value);
	        head.addBefore(node);
	    }
	    this.length += arguments.length;
	    if (this.dispatchesRangeChanges) {
	        this.updateIndexes(start.next, start.index === undefined ? 0 : start.index + 1);
	        this.dispatchRangeChange(plus, minus, index);
	    }
	};

	List.prototype.unshift = function () {
	    if (this.dispatchesRangeChanges) {
	        var plus = Array.prototype.slice.call(arguments);
	        var minus = [];
	        this.dispatchBeforeRangeChange(plus, minus, 0);
	    }
	    var at = this.head;
	    for (var i = 0; i < arguments.length; i++) {
	        var value = arguments[i];
	        var node = new this.Node(value);
	        at.addAfter(node);
	        at = node;
	    }
	    this.length += arguments.length;
	    if (this.dispatchesRangeChanges) {
	        this.updateIndexes(this.head.next, 0);
	        this.dispatchRangeChange(plus, minus, 0);
	    }
	};

	List.prototype.pop = function () {
	    var value;
	    var head = this.head;
	    if (head.prev !== head) {
	        value = head.prev.value;
	        if (this.dispatchesRangeChanges) {
	            var plus = [];
	            var minus = [value];
	            var index = this.length - 1;
	            this.dispatchBeforeRangeChange(plus, minus, index);
	        }
	        head.prev['delete']();
	        this.length--;
	        if (this.dispatchesRangeChanges) {
	            this.dispatchRangeChange(plus, minus, index);
	        }
	    }
	    return value;
	};

	List.prototype.shift = function () {
	    var value;
	    var head = this.head;
	    if (head.prev !== head) {
	        value = head.next.value;
	        if (this.dispatchesRangeChanges) {
	            var plus = [];
	            var minus = [value];
	            this.dispatchBeforeRangeChange(plus, minus, 0);
	        }
	        head.next['delete']();
	        this.length--;
	        if (this.dispatchesRangeChanges) {
	            this.updateIndexes(this.head.next, 0);
	            this.dispatchRangeChange(plus, minus, 0);
	        }
	    }
	    return value;
	};

	List.prototype.peek = function () {
	    if (this.head !== this.head.next) {
	        return this.head.next.value;
	    }
	};

	List.prototype.poke = function (value) {
	    if (this.head !== this.head.next) {
	        this.head.next.value = value;
	    } else {
	        this.push(value);
	    }
	};

	List.prototype.one = function () {
	    return this.peek();
	};

	// an internal utility for coercing index offsets to nodes
	List.prototype.scan = function (at, fallback) {
	    var head = this.head;
	    if (typeof at === "number") {
	        var count = at;
	        if (count >= 0) {
	            at = head.next;
	            while (count) {
	                count--;
	                at = at.next;
	                if (at == head) {
	                    break;
	                }
	            }
	        } else {
	            at = head;
	            while (count < 0) {
	                count++;
	                at = at.prev;
	                if (at == head) {
	                    break;
	                }
	            }
	        }
	        return at;
	    } else {
	        return at || fallback;
	    }
	};

	// at and end may both be positive or negative numbers (in which cases they
	// correspond to numeric indicies, or nodes)
	List.prototype.slice = function (at, end) {
	    var sliced = [];
	    var head = this.head;
	    at = this.scan(at, head.next);
	    end = this.scan(end, head);

	    while (at !== end && at !== head) {
	        sliced.push(at.value);
	        at = at.next;
	    }

	    return sliced;
	};

	List.prototype.splice = function (at, length /*...plus*/) {
	    return this.swap(at, length, Array.prototype.slice.call(arguments, 2));
	};

	List.prototype.swap = function (start, length, plus) {
	    var initial = start;
	    // start will be head if start is null or -1 (meaning from the end), but
	    // will be head.next if start is 0 (meaning from the beginning)
	    start = this.scan(start, this.head);
	    if (length == null) {
	        length = Infinity;
	    }
	    plus = Array.from(plus);

	    // collect the minus array
	    var minus = [];
	    var at = start;
	    while (length-- && length >= 0 && at !== this.head) {
	        minus.push(at.value);
	        at = at.next;
	    }

	    // before range change
	    var index, startNode;
	    if (this.dispatchesRangeChanges) {
	        if (start === this.head) {
	            index = this.length;
	        } else if (start.prev === this.head) {
	            index = 0;
	        } else {
	            index = start.index;
	        }
	        startNode = start.prev;
	        this.dispatchBeforeRangeChange(plus, minus, index);
	    }

	    // delete minus
	    var at = start;
	    for (var i = 0, at = start; i < minus.length; i++, at = at.next) {
	        at["delete"]();
	    }
	    // add plus
	    if (initial == null && at === this.head) {
	        at = this.head.next;
	    }
	    for (var i = 0; i < plus.length; i++) {
	        var node = new this.Node(plus[i]);
	        at.addBefore(node);
	    }
	    // adjust length
	    this.length += plus.length - minus.length;

	    // after range change
	    if (this.dispatchesRangeChanges) {
	        if (start === this.head) {
	            this.updateIndexes(this.head.next, 0);
	        } else {
	            this.updateIndexes(startNode.next, startNode.index + 1);
	        }
	        this.dispatchRangeChange(plus, minus, index);
	    }

	    return minus;
	};

	List.prototype.reverse = function () {
	    if (this.dispatchesRangeChanges) {
	        var minus = this.toArray();
	        var plus = minus.reversed();
	        this.dispatchBeforeRangeChange(plus, minus, 0);
	    }
	    var at = this.head;
	    do {
	        var temp = at.next;
	        at.next = at.prev;
	        at.prev = temp;
	        at = at.next;
	    } while (at !== this.head);
	    if (this.dispatchesRangeChanges) {
	        this.dispatchRangeChange(plus, minus, 0);
	    }
	    return this;
	};

	List.prototype.sort = function () {
	    this.swap(0, this.length, this.sorted());
	};

	// TODO account for missing basis argument
	List.prototype.reduce = function (callback, basis /*, thisp*/) {
	    var thisp = arguments[2];
	    var head = this.head;
	    var at = head.next;
	    while (at !== head) {
	        basis = callback.call(thisp, basis, at.value, at, this);
	        at = at.next;
	    }
	    return basis;
	};

	List.prototype.reduceRight = function (callback, basis /*, thisp*/) {
	    var thisp = arguments[2];
	    var head = this.head;
	    var at = head.prev;
	    while (at !== head) {
	        basis = callback.call(thisp, basis, at.value, at, this);
	        at = at.prev;
	    }
	    return basis;
	};

	List.prototype.updateIndexes = function (node, index) {
	    while (node !== this.head) {
	        node.index = index++;
	        node = node.next;
	    }
	};

	List.prototype.makeObservable = function () {
	    this.head.index = -1;
	    this.updateIndexes(this.head.next, 0);
	    this.dispatchesRangeChanges = true;
	};

	List.prototype.iterate = function () {
	    return new ListIterator(this.head);
	};

	function ListIterator(head) {
	    this.head = head;
	    this.at = head.next;
	};

	ListIterator.prototype.next = function () {
	    if (this.at === this.head) {
	        throw StopIteration;
	    } else {
	        var value = this.at.value;
	        this.at = this.at.next;
	        return value;
	    }
	};

	List.prototype.Node = Node;

	function Node(value) {
	    this.value = value;
	    this.prev = null;
	    this.next = null;
	};

	Node.prototype['delete'] = function () {
	    this.prev.next = this.next;
	    this.next.prev = this.prev;
	};

	Node.prototype.addBefore = function (node) {
	    var prev = this.prev;
	    this.prev = node;
	    node.prev = prev;
	    prev.next = node;
	    node.next = this;
	};

	Node.prototype.addAfter = function (node) {
	    var next = this.next;
	    this.next = node;
	    node.next = next;
	    next.prev = node;
	    node.prev = this;
	};



/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Shim = __webpack_require__(38);
	var Dict = __webpack_require__(50);
	var List = __webpack_require__(39);
	var GenericCollection = __webpack_require__(41);
	var GenericSet = __webpack_require__(42);
	var TreeLog = __webpack_require__(51);
	var PropertyChanges = __webpack_require__(43);

	var object_has = Object.prototype.hasOwnProperty;

	module.exports = FastSet;

	function FastSet(values, equals, hash, getDefault) {
	    if (!(this instanceof FastSet)) {
	        return new FastSet(values, equals, hash, getDefault);
	    }
	    equals = equals || Object.equals;
	    hash = hash || Object.hash;
	    getDefault = getDefault || Function.noop;
	    this.contentEquals = equals;
	    this.contentHash = hash;
	    this.getDefault = getDefault;
	    this.buckets = new this.Buckets(null, this.Bucket);
	    this.length = 0;
	    this.addEach(values);
	}

	FastSet.FastSet = FastSet; // hack so require("fast-set").FastSet will work in MontageJS

	Object.addEach(FastSet.prototype, GenericCollection.prototype);
	Object.addEach(FastSet.prototype, GenericSet.prototype);
	Object.addEach(FastSet.prototype, PropertyChanges.prototype);

	FastSet.prototype.Buckets = Dict;
	FastSet.prototype.Bucket = List;

	FastSet.prototype.constructClone = function (values) {
	    return new this.constructor(
	        values,
	        this.contentEquals,
	        this.contentHash,
	        this.getDefault
	    );
	};

	FastSet.prototype.has = function (value) {
	    var hash = this.contentHash(value);
	    return this.buckets.get(hash).has(value);
	};

	FastSet.prototype.get = function (value) {
	    var hash = this.contentHash(value);
	    var buckets = this.buckets;
	    if (buckets.has(hash)) {
	        return buckets.get(hash).get(value);
	    } else {
	        return this.getDefault(value);
	    }
	};

	FastSet.prototype['delete'] = function (value) {
	    var hash = this.contentHash(value);
	    var buckets = this.buckets;
	    if (buckets.has(hash)) {
	        var bucket = buckets.get(hash);
	        if (bucket["delete"](value)) {
	            this.length--;
	            if (bucket.length === 0) {
	                buckets["delete"](hash);
	            }
	            return true;
	        }
	    }
	    return false;
	};

	FastSet.prototype.clear = function () {
	    this.buckets.clear();
	    this.length = 0;
	};

	FastSet.prototype.add = function (value) {
	    var hash = this.contentHash(value);
	    var buckets = this.buckets;
	    if (!buckets.has(hash)) {
	        buckets.set(hash, new this.Bucket(null, this.contentEquals));
	    }
	    if (!buckets.get(hash).has(value)) {
	        buckets.get(hash).add(value);
	        this.length++;
	        return true;
	    }
	    return false;
	};

	FastSet.prototype.reduce = function (callback, basis /*, thisp*/) {
	    var thisp = arguments[2];
	    var buckets = this.buckets;
	    var index = 0;
	    return buckets.reduce(function (basis, bucket) {
	        return bucket.reduce(function (basis, value) {
	            return callback.call(thisp, basis, value, index++, this);
	        }, basis, this);
	    }, basis, this);
	};

	FastSet.prototype.one = function () {
	    if (this.length > 0) {
	        return this.buckets.one().one();
	    }
	};

	FastSet.prototype.iterate = function () {
	    return this.buckets.values().flatten().iterate();
	};

	FastSet.prototype.log = function (charmap, logNode, callback, thisp) {
	    charmap = charmap || TreeLog.unicodeSharp;
	    logNode = logNode || this.logNode;
	    if (!callback) {
	        callback = console.log;
	        thisp = console;
	    }
	    callback = callback.bind(thisp);

	    var buckets = this.buckets;
	    var hashes = buckets.keys();
	    hashes.forEach(function (hash, index) {
	        var branch;
	        var leader;
	        if (index === hashes.length - 1) {
	            branch = charmap.fromAbove;
	            leader = ' ';
	        } else if (index === 0) {
	            branch = charmap.branchDown;
	            leader = charmap.strafe;
	        } else {
	            branch = charmap.fromBoth;
	            leader = charmap.strafe;
	        }
	        var bucket = buckets.get(hash);
	        callback.call(thisp, branch + charmap.through + charmap.branchDown + ' ' + hash);
	        bucket.forEach(function (value, node) {
	            var branch, below;
	            if (node === bucket.head.prev) {
	                branch = charmap.fromAbove;
	                below = ' ';
	            } else {
	                branch = charmap.fromBoth;
	                below = charmap.strafe;
	            }
	            var written;
	            logNode(
	                node,
	                function (line) {
	                    if (!written) {
	                        callback.call(thisp, leader + ' ' + branch + charmap.through + charmap.through + line);
	                        written = true;
	                    } else {
	                        callback.call(thisp, leader + ' ' + below + '  ' + line);
	                    }
	                },
	                function (line) {
	                    callback.call(thisp, leader + ' ' + charmap.strafe + '  ' + line);
	                }
	            );
	        });
	    });
	};

	FastSet.prototype.logNode = function (node, write) {
	    var value = node.value;
	    if (Object(value) === value) {
	        JSON.stringify(value, null, 4).split("\n").forEach(function (line) {
	            write(" " + line);
	        });
	    } else {
	        write(" " + value);
	    }
	};



/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = GenericCollection;
	function GenericCollection() {
	    throw new Error("Can't construct. GenericCollection is a mixin.");
	}

	GenericCollection.prototype.addEach = function (values) {
	    if (values && Object(values) === values) {
	        if (typeof values.forEach === "function") {
	            values.forEach(this.add, this);
	        } else if (typeof values.length === "number") {
	            // Array-like objects that do not implement forEach, ergo,
	            // Arguments
	            for (var i = 0; i < values.length; i++) {
	                this.add(values[i], i);
	            }
	        } else {
	            Object.keys(values).forEach(function (key) {
	                this.add(values[key], key);
	            }, this);
	        }
	    }
	    return this;
	};

	// This is sufficiently generic for Map (since the value may be a key)
	// and ordered collections (since it forwards the equals argument)
	GenericCollection.prototype.deleteEach = function (values, equals) {
	    values.forEach(function (value) {
	        this["delete"](value, equals);
	    }, this);
	    return this;
	};

	// all of the following functions are implemented in terms of "reduce".
	// some need "constructClone".

	GenericCollection.prototype.forEach = function (callback /*, thisp*/) {
	    var thisp = arguments[1];
	    return this.reduce(function (undefined, value, key, object, depth) {
	        callback.call(thisp, value, key, object, depth);
	    }, undefined);
	};

	GenericCollection.prototype.map = function (callback /*, thisp*/) {
	    var thisp = arguments[1];
	    var result = [];
	    this.reduce(function (undefined, value, key, object, depth) {
	        result.push(callback.call(thisp, value, key, object, depth));
	    }, undefined);
	    return result;
	};

	GenericCollection.prototype.enumerate = function (start) {
	    if (start == null) {
	        start = 0;
	    }
	    var result = [];
	    this.reduce(function (undefined, value) {
	        result.push([start++, value]);
	    }, undefined);
	    return result;
	};

	GenericCollection.prototype.group = function (callback, thisp, equals) {
	    equals = equals || Object.equals;
	    var groups = [];
	    var keys = [];
	    this.forEach(function (value, key, object) {
	        var key = callback.call(thisp, value, key, object);
	        var index = keys.indexOf(key, equals);
	        var group;
	        if (index === -1) {
	            group = [];
	            groups.push([key, group]);
	            keys.push(key);
	        } else {
	            group = groups[index][1];
	        }
	        group.push(value);
	    });
	    return groups;
	};

	GenericCollection.prototype.toArray = function () {
	    return this.map(Function.identity);
	};

	// this depends on stringable keys, which apply to Array and Iterator
	// because they have numeric keys and all Maps since they may use
	// strings as keys.  List, Set, and SortedSet have nodes for keys, so
	// toObject would not be meaningful.
	GenericCollection.prototype.toObject = function () {
	    var object = {};
	    this.reduce(function (undefined, value, key) {
	        object[key] = value;
	    }, undefined);
	    return object;
	};

	GenericCollection.prototype.filter = function (callback /*, thisp*/) {
	    var thisp = arguments[1];
	    var result = this.constructClone();
	    this.reduce(function (undefined, value, key, object, depth) {
	        if (callback.call(thisp, value, key, object, depth)) {
	            result.add(value);
	        }
	    }, undefined);
	    return result;
	};

	GenericCollection.prototype.every = function (callback /*, thisp*/) {
	    var thisp = arguments[1];
	    return this.reduce(function (result, value, key, object, depth) {
	        return result && callback.call(thisp, value, key, object, depth);
	    }, true);
	};

	GenericCollection.prototype.some = function (callback /*, thisp*/) {
	    var thisp = arguments[1];
	    return this.reduce(function (result, value, key, object, depth) {
	        return result || callback.call(thisp, value, key, object, depth);
	    }, false);
	};

	GenericCollection.prototype.all = function () {
	    return this.every(Boolean);
	};

	GenericCollection.prototype.any = function () {
	    return this.some(Boolean);
	};

	GenericCollection.prototype.min = function (compare) {
	    compare = compare || this.contentCompare || Object.compare;
	    var first = true;
	    return this.reduce(function (result, value) {
	        if (first) {
	            first = false;
	            return value;
	        } else {
	            return compare(value, result) < 0 ? value : result;
	        }
	    }, undefined);
	};

	GenericCollection.prototype.max = function (compare) {
	    compare = compare || this.contentCompare || Object.compare;
	    var first = true;
	    return this.reduce(function (result, value) {
	        if (first) {
	            first = false;
	            return value;
	        } else {
	            return compare(value, result) > 0 ? value : result;
	        }
	    }, undefined);
	};

	GenericCollection.prototype.sum = function (zero) {
	    zero = zero === undefined ? 0 : zero;
	    return this.reduce(function (a, b) {
	        return a + b;
	    }, zero);
	};

	GenericCollection.prototype.average = function (zero) {
	    var sum = zero === undefined ? 0 : zero;
	    var count = zero === undefined ? 0 : zero;
	    this.reduce(function (undefined, value) {
	        sum += value;
	        count += 1;
	    }, undefined);
	    return sum / count;
	};

	GenericCollection.prototype.concat = function () {
	    var result = this.constructClone(this);
	    for (var i = 0; i < arguments.length; i++) {
	        result.addEach(arguments[i]);
	    }
	    return result;
	};

	GenericCollection.prototype.flatten = function () {
	    var self = this;
	    return this.reduce(function (result, array) {
	        array.forEach(function (value) {
	            this.push(value);
	        }, result, self);
	        return result;
	    }, []);
	};

	GenericCollection.prototype.zip = function () {
	    var table = Array.prototype.slice.call(arguments);
	    table.unshift(this);
	    return Array.unzip(table);
	}

	GenericCollection.prototype.join = function (delimiter) {
	    return this.reduce(function (result, string) {
	        return result + delimiter + string;
	    });
	};

	GenericCollection.prototype.sorted = function (compare, by, order) {
	    compare = compare || this.contentCompare || Object.compare;
	    // account for comparators generated by Function.by
	    if (compare.by) {
	        by = compare.by;
	        compare = compare.compare || this.contentCompare || Object.compare;
	    } else {
	        by = by || Function.identity;
	    }
	    if (order === undefined)
	        order = 1;
	    return this.map(function (item) {
	        return {
	            by: by(item),
	            value: item
	        };
	    })
	    .sort(function (a, b) {
	        return compare(a.by, b.by) * order;
	    })
	    .map(function (pair) {
	        return pair.value;
	    });
	};

	GenericCollection.prototype.reversed = function () {
	    return this.constructClone(this).reverse();
	};

	GenericCollection.prototype.clone = function (depth, memo) {
	    if (depth === undefined) {
	        depth = Infinity;
	    } else if (depth === 0) {
	        return this;
	    }
	    var clone = this.constructClone();
	    this.forEach(function (value, key) {
	        clone.add(Object.clone(value, depth - 1, memo), key);
	    }, this);
	    return clone;
	};

	GenericCollection.prototype.only = function () {
	    if (this.length === 1) {
	        return this.one();
	    }
	};

	GenericCollection.prototype.iterator = function () {
	    return this.iterate.apply(this, arguments);
	};

	__webpack_require__(45);



/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	
	module.exports = GenericSet;
	function GenericSet() {
	    throw new Error("Can't construct. GenericSet is a mixin.");
	}

	GenericSet.prototype.union = function (that) {
	    var union =  this.constructClone(this);
	    union.addEach(that);
	    return union;
	};

	GenericSet.prototype.intersection = function (that) {
	    return this.constructClone(this.filter(function (value) {
	        return that.has(value);
	    }));
	};

	GenericSet.prototype.difference = function (that) {
	    var union =  this.constructClone(this);
	    union.deleteEach(that);
	    return union;
	};

	GenericSet.prototype.symmetricDifference = function (that) {
	    var union = this.union(that);
	    var intersection = this.intersection(that);
	    return union.difference(intersection);
	};

	GenericSet.prototype.equals = function (that, equals) {
	    var self = this;
	    return (
	        Object.can(that, "reduce") &&
	        this.length === that.length &&
	        that.reduce(function (equal, value) {
	            return equal && self.has(value, equals);
	        }, true)
	    );
	};

	// W3C DOMTokenList API overlap (does not handle variadic arguments)

	GenericSet.prototype.contains = function (value) {
	    return this.has(value);
	};

	GenericSet.prototype.remove = function (value) {
	    return this["delete"](value);
	};

	GenericSet.prototype.toggle = function (value) {
	    if (this.has(value)) {
	        this["delete"](value);
	    } else {
	        this.add(value);
	    }
	};



/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    Based in part on observable arrays from Motorola Mobility’s Montage
	    Copyright (c) 2012, Motorola Mobility LLC. All Rights Reserved.
	    3-Clause BSD License
	    https://github.com/motorola-mobility/montage/blob/master/LICENSE.md
	*/

	/*
	    This module is responsible for observing changes to owned properties of
	    objects and changes to the content of arrays caused by method calls.
	    The interface for observing array content changes establishes the methods
	    necessary for any collection with observable content.
	*/

	__webpack_require__(38);
	var WeakMap = __webpack_require__(53);

	var object_owns = Object.prototype.hasOwnProperty;

	/*
	    Object property descriptors carry information necessary for adding,
	    removing, dispatching, and shorting events to listeners for property changes
	    for a particular key on a particular object.  These descriptors are used
	    here for shallow property changes.

	    {
	        willChangeListeners:Array(Function)
	        changeListeners:Array(Function)
	    }
	*/
	var propertyChangeDescriptors = new WeakMap();

	// Maybe remove entries from this table if the corresponding object no longer
	// has any property change listeners for any key.  However, the cost of
	// book-keeping is probably not warranted since it would be rare for an
	// observed object to no longer be observed unless it was about to be disposed
	// of or reused as an observable.  The only benefit would be in avoiding bulk
	// calls to dispatchOwnPropertyChange events on objects that have no listeners.

	/*
	    To observe shallow property changes for a particular key of a particular
	    object, we install a property descriptor on the object that overrides the previous
	    descriptor.  The overridden descriptors are stored in this weak map.  The
	    weak map associates an object with another object that maps property names
	    to property descriptors.

	    overriddenObjectDescriptors.get(object)[key]

	    We retain the old descriptor for various purposes.  For one, if the property
	    is no longer being observed by anyone, we revert the property descriptor to
	    the original.  For "value" descriptors, we store the actual value of the
	    descriptor on the overridden descriptor, so when the property is reverted, it
	    retains the most recently set value.  For "get" and "set" descriptors,
	    we observe then forward "get" and "set" operations to the original descriptor.
	*/
	var overriddenObjectDescriptors = new WeakMap();

	module.exports = PropertyChanges;

	function PropertyChanges() {
	    throw new Error("This is an abstract interface. Mix it. Don't construct it");
	}

	PropertyChanges.debug = true;

	PropertyChanges.prototype.getOwnPropertyChangeDescriptor = function (key) {
	    if (!propertyChangeDescriptors.has(this)) {
	        propertyChangeDescriptors.set(this, {});
	    }
	    var objectPropertyChangeDescriptors = propertyChangeDescriptors.get(this);
	    if (!object_owns.call(objectPropertyChangeDescriptors, key)) {
	        objectPropertyChangeDescriptors[key] = {
	            willChangeListeners: [],
	            changeListeners: []
	        };
	    }
	    return objectPropertyChangeDescriptors[key];
	};

	PropertyChanges.prototype.hasOwnPropertyChangeDescriptor = function (key) {
	    if (!propertyChangeDescriptors.has(this)) {
	        return false;
	    }
	    if (!key) {
	        return true;
	    }
	    var objectPropertyChangeDescriptors = propertyChangeDescriptors.get(this);
	    if (!object_owns.call(objectPropertyChangeDescriptors, key)) {
	        return false;
	    }
	    return true;
	};

	PropertyChanges.prototype.addOwnPropertyChangeListener = function (key, listener, beforeChange) {
	    if (this.makeObservable && !this.isObservable) {
	        this.makeObservable(); // particularly for observable arrays, for
	        // their length property
	    }
	    var descriptor = PropertyChanges.getOwnPropertyChangeDescriptor(this, key);
	    var listeners;
	    if (beforeChange) {
	        listeners = descriptor.willChangeListeners;
	    } else {
	        listeners = descriptor.changeListeners;
	    }
	    PropertyChanges.makePropertyObservable(this, key);
	    listeners.push(listener);

	    var self = this;
	    return function cancelOwnPropertyChangeListener() {
	        PropertyChanges.removeOwnPropertyChangeListener(self, key, listeners, beforeChange);
	        self = null;
	    };
	};

	PropertyChanges.prototype.addBeforeOwnPropertyChangeListener = function (key, listener) {
	    return PropertyChanges.addOwnPropertyChangeListener(this, key, listener, true);
	};

	PropertyChanges.prototype.removeOwnPropertyChangeListener = function (key, listener, beforeChange) {
	    var descriptor = PropertyChanges.getOwnPropertyChangeDescriptor(this, key);

	    var listeners;
	    if (beforeChange) {
	        listeners = descriptor.willChangeListeners;
	    } else {
	        listeners = descriptor.changeListeners;
	    }

	    var index = listeners.lastIndexOf(listener);
	    if (index === -1) {
	        throw new Error("Can't remove listener: does not exist.");
	    }
	    listeners.splice(index, 1);

	    if (descriptor.changeListeners.length + descriptor.willChangeListeners.length === 0) {
	        PropertyChanges.makePropertyUnobservable(this, key);
	    }
	};

	PropertyChanges.prototype.removeBeforeOwnPropertyChangeListener = function (key, listener) {
	    return PropertyChanges.removeOwnPropertyChangeListener(this, key, listener, true);
	};

	PropertyChanges.prototype.dispatchOwnPropertyChange = function (key, value, beforeChange) {
	    var descriptor = PropertyChanges.getOwnPropertyChangeDescriptor(this, key);

	    if (descriptor.isActive) {
	        return;
	    }
	    descriptor.isActive = true;

	    var listeners;
	    if (beforeChange) {
	        listeners = descriptor.willChangeListeners;
	    } else {
	        listeners = descriptor.changeListeners;
	    }

	    var changeName = (beforeChange ? "Will" : "") + "Change";
	    var genericHandlerName = "handleProperty" + changeName;
	    var propertyName = String(key);
	    propertyName = propertyName && propertyName[0].toUpperCase() + propertyName.slice(1);
	    var specificHandlerName = "handle" + propertyName + changeName;

	    try {
	        // dispatch to each listener
	        listeners.forEach(function (listener) {
	            var thisp = listener;
	            listener = (
	                listener[specificHandlerName] ||
	                listener[genericHandlerName] ||
	                listener
	            );
	            if (!listener.call) {
	                throw new Error("No event listener for " + specificHandlerName + " or " + genericHandlerName + " or call on " + listener);
	            }
	            listener.call(thisp, value, key, this);
	        }, this);
	    } finally {
	        descriptor.isActive = false;
	    }
	};

	PropertyChanges.prototype.dispatchBeforeOwnPropertyChange = function (key, listener) {
	    return PropertyChanges.dispatchOwnPropertyChange(this, key, listener, true);
	};

	PropertyChanges.prototype.makePropertyObservable = function (key) {
	    // arrays are special.  we do not support direct setting of properties
	    // on an array.  instead, call .set(index, value).  this is observable.
	    // 'length' property is observable for all mutating methods because
	    // our overrides explicitly dispatch that change.
	    if (Array.isArray(this)) {
	        return;
	    }

	    if (!Object.isExtensible(this, key)) {
	        throw new Error("Can't make property " + JSON.stringify(key) + " observable on " + this + " because object is not extensible");
	    }

	    var state;
	    if (typeof this.__state__ === "object") {
	        state = this.__state__;
	    } else {
	        state = {};
	        if (Object.isExtensible(this, "__state__")) {
	            Object.defineProperty(this, "__state__", {
	                value: state,
	                writable: true,
	                enumerable: false
	            });
	        }
	    }
	    state[key] = this[key];

	    // memoize overridden property descriptor table
	    if (!overriddenObjectDescriptors.has(this)) {
	        overriddenPropertyDescriptors = {};
	        overriddenObjectDescriptors.set(this, overriddenPropertyDescriptors);
	    }
	    var overriddenPropertyDescriptors = overriddenObjectDescriptors.get(this);

	    if (object_owns.call(overriddenPropertyDescriptors, key)) {
	        // if we have already recorded an overridden property descriptor,
	        // we have already installed the observer, so short-here
	        return;
	    }

	    // walk up the prototype chain to find a property descriptor for
	    // the property name
	    var overriddenDescriptor;
	    var attached = this;
	    var formerDescriptor = Object.getOwnPropertyDescriptor(attached, key);
	    do {
	        overriddenDescriptor = Object.getOwnPropertyDescriptor(attached, key);
	        if (overriddenDescriptor) {
	            break;
	        }
	        attached = Object.getPrototypeOf(attached);
	    } while (attached);
	    // or default to an undefined value
	    overriddenDescriptor = overriddenDescriptor || {
	        value: undefined,
	        enumerable: true,
	        writable: true,
	        configurable: true
	    };

	    if (!overriddenDescriptor.configurable) {
	        throw new Error("Can't observe non-configurable properties");
	    }

	    // memoize the descriptor so we know not to install another layer,
	    // and so we can reuse the overridden descriptor when uninstalling
	    overriddenPropertyDescriptors[key] = overriddenDescriptor;

	    // give up *after* storing the overridden property descriptor so it
	    // can be restored by uninstall.  Unwritable properties are
	    // silently not overriden.  Since success is indistinguishable from
	    // failure, we let it pass but don't waste time on intercepting
	    // get/set.
	    if (!overriddenDescriptor.writable && !overriddenDescriptor.set) {
	        return;
	    }

	    // TODO reflect current value on a displayed property

	    var propertyListener;
	    // in both of these new descriptor variants, we reuse the overridden
	    // descriptor to either store the current value or apply getters
	    // and setters.  this is handy since we can reuse the overridden
	    // descriptor if we uninstall the observer.  We even preserve the
	    // assignment semantics, where we get the value from up the
	    // prototype chain, and set as an owned property.
	    if ('value' in overriddenDescriptor) {
	        propertyListener = {
	            get: function () {
	                return overriddenDescriptor.value
	            },
	            set: function (value) {
	                if (value === overriddenDescriptor.value) {
	                    return value;
	                }
	                PropertyChanges.dispatchBeforeOwnPropertyChange(this, key, overriddenDescriptor.value);
	                overriddenDescriptor.value = value;
	                state[key] = value;
	                PropertyChanges.dispatchOwnPropertyChange(this, key, value);
	                return value;
	            },
	            enumerable: overriddenDescriptor.enumerable,
	            configurable: true
	        };
	    } else { // 'get' or 'set', but not necessarily both
	        propertyListener = {
	            get: function () {
	                if (overriddenDescriptor.get) {
	                    return overriddenDescriptor.get.apply(this, arguments);
	                }
	            },
	            set: function (value) {
	                var formerValue;

	                // get the actual former value if possible
	                if (overriddenDescriptor.get) {
	                    formerValue = overriddenDescriptor.get.apply(this, arguments);
	                }
	                // call through to actual setter
	                if (overriddenDescriptor.set) {
	                    overriddenDescriptor.set.apply(this, arguments)
	                }
	                // use getter, if possible, to discover whether the set
	                // was successful
	                if (overriddenDescriptor.get) {
	                    value = overriddenDescriptor.get.apply(this, arguments);
	                    state[key] = value;
	                }
	                // if it has not changed, suppress a notification
	                if (value === formerValue) {
	                    return value;
	                }
	                PropertyChanges.dispatchBeforeOwnPropertyChange(this, key, formerValue);

	                // dispatch the new value: the given value if there is
	                // no getter, or the actual value if there is one
	                PropertyChanges.dispatchOwnPropertyChange(this, key, value);
	                return value;
	            },
	            enumerable: overriddenDescriptor.enumerable,
	            configurable: true
	        };
	    }

	    Object.defineProperty(this, key, propertyListener);
	};

	PropertyChanges.prototype.makePropertyUnobservable = function (key) {
	    // arrays are special.  we do not support direct setting of properties
	    // on an array.  instead, call .set(index, value).  this is observable.
	    // 'length' property is observable for all mutating methods because
	    // our overrides explicitly dispatch that change.
	    if (Array.isArray(this)) {
	        return;
	    }

	    if (!overriddenObjectDescriptors.has(this)) {
	        throw new Error("Can't uninstall observer on property");
	    }
	    var overriddenPropertyDescriptors = overriddenObjectDescriptors.get(this);

	    if (!overriddenPropertyDescriptors[key]) {
	        throw new Error("Can't uninstall observer on property");
	    }

	    var overriddenDescriptor = overriddenPropertyDescriptors[key];
	    delete overriddenPropertyDescriptors[key];

	    var state;
	    if (typeof this.__state__ === "object") {
	        state = this.__state__;
	    } else {
	        state = {};
	        if (Object.isExtensible(this, "__state__")) {
	            Object.defineProperty(this, "__state__", {
	                value: state,
	                writable: true,
	                enumerable: false
	            });
	        }
	    }
	    delete state[key];

	    Object.defineProperty(this, key, overriddenDescriptor);
	};

	// constructor functions

	PropertyChanges.getOwnPropertyChangeDescriptor = function (object, key) {
	    if (object.getOwnPropertyChangeDescriptor) {
	        return object.getOwnPropertyChangeDescriptor(key);
	    } else {
	        return PropertyChanges.prototype.getOwnPropertyChangeDescriptor.call(object, key);
	    }
	};

	PropertyChanges.hasOwnPropertyChangeDescriptor = function (object, key) {
	    if (object.hasOwnPropertyChangeDescriptor) {
	        return object.hasOwnPropertyChangeDescriptor(key);
	    } else {
	        return PropertyChanges.prototype.hasOwnPropertyChangeDescriptor.call(object, key);
	    }
	};

	PropertyChanges.addOwnPropertyChangeListener = function (object, key, listener, beforeChange) {
	    if (!Object.isObject(object)) {
	    } else if (object.addOwnPropertyChangeListener) {
	        return object.addOwnPropertyChangeListener(key, listener, beforeChange);
	    } else {
	        return PropertyChanges.prototype.addOwnPropertyChangeListener.call(object, key, listener, beforeChange);
	    }
	};

	PropertyChanges.removeOwnPropertyChangeListener = function (object, key, listener, beforeChange) {
	    if (!Object.isObject(object)) {
	    } else if (object.removeOwnPropertyChangeListener) {
	        return object.removeOwnPropertyChangeListener(key, listener, beforeChange);
	    } else {
	        return PropertyChanges.prototype.removeOwnPropertyChangeListener.call(object, key, listener, beforeChange);
	    }
	};

	PropertyChanges.dispatchOwnPropertyChange = function (object, key, value, beforeChange) {
	    if (!Object.isObject(object)) {
	    } else if (object.dispatchOwnPropertyChange) {
	        return object.dispatchOwnPropertyChange(key, value, beforeChange);
	    } else {
	        return PropertyChanges.prototype.dispatchOwnPropertyChange.call(object, key, value, beforeChange);
	    }
	};

	PropertyChanges.addBeforeOwnPropertyChangeListener = function (object, key, listener) {
	    return PropertyChanges.addOwnPropertyChangeListener(object, key, listener, true);
	};

	PropertyChanges.removeBeforeOwnPropertyChangeListener = function (object, key, listener) {
	    return PropertyChanges.removeOwnPropertyChangeListener(object, key, listener, true);
	};

	PropertyChanges.dispatchBeforeOwnPropertyChange = function (object, key, value) {
	    return PropertyChanges.dispatchOwnPropertyChange(object, key, value, true);
	};

	PropertyChanges.makePropertyObservable = function (object, key) {
	    if (object.makePropertyObservable) {
	        return object.makePropertyObservable(key);
	    } else {
	        return PropertyChanges.prototype.makePropertyObservable.call(object, key);
	    }
	};

	PropertyChanges.makePropertyUnobservable = function (object, key) {
	    if (object.makePropertyUnobservable) {
	        return object.makePropertyUnobservable(key);
	    } else {
	        return PropertyChanges.prototype.makePropertyUnobservable.call(object, key);
	    }
	};



/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var WeakMap = __webpack_require__(53);
	var Dict = __webpack_require__(50);

	var rangeChangeDescriptors = new WeakMap(); // {isActive, willChangeListeners, changeListeners}

	module.exports = RangeChanges;
	function RangeChanges() {
	    throw new Error("Can't construct. RangeChanges is a mixin.");
	}

	RangeChanges.prototype.getAllRangeChangeDescriptors = function () {
	    if (!rangeChangeDescriptors.has(this)) {
	        rangeChangeDescriptors.set(this, Dict());
	    }
	    return rangeChangeDescriptors.get(this);
	};

	RangeChanges.prototype.getRangeChangeDescriptor = function (token) {
	    var tokenChangeDescriptors = this.getAllRangeChangeDescriptors();
	    token = token || "";
	    if (!tokenChangeDescriptors.has(token)) {
	        tokenChangeDescriptors.set(token, {
	            isActive: false,
	            changeListeners: [],
	            willChangeListeners: []
	        });
	    }
	    return tokenChangeDescriptors.get(token);
	};

	RangeChanges.prototype.addRangeChangeListener = function (listener, token, beforeChange) {
	    // a concession for objects like Array that are not inherently observable
	    if (!this.isObservable && this.makeObservable) {
	        this.makeObservable();
	    }

	    var descriptor = this.getRangeChangeDescriptor(token);

	    var listeners;
	    if (beforeChange) {
	        listeners = descriptor.willChangeListeners;
	    } else {
	        listeners = descriptor.changeListeners;
	    }

	    // even if already registered
	    listeners.push(listener);
	    Object.defineProperty(this, "dispatchesRangeChanges", {
	        value: true,
	        writable: true,
	        configurable: true,
	        enumerable: false
	    });

	    var self = this;
	    return function cancelRangeChangeListener() {
	        if (!self) {
	            // TODO throw new Error("Range change listener " + JSON.stringify(token) + " has already been canceled");
	            return;
	        }
	        self.removeRangeChangeListener(listener, token, beforeChange);
	        self = null;
	    };
	};

	RangeChanges.prototype.removeRangeChangeListener = function (listener, token, beforeChange) {
	    var descriptor = this.getRangeChangeDescriptor(token);

	    var listeners;
	    if (beforeChange) {
	        listeners = descriptor.willChangeListeners;
	    } else {
	        listeners = descriptor.changeListeners;
	    }

	    var index = listeners.lastIndexOf(listener);
	    if (index === -1) {
	        throw new Error("Can't remove listener: does not exist.");
	    }
	    listeners.splice(index, 1);
	};

	RangeChanges.prototype.dispatchRangeChange = function (plus, minus, index, beforeChange) {
	    var descriptors = this.getAllRangeChangeDescriptors();
	    var changeName = "Range" + (beforeChange ? "WillChange" : "Change");
	    descriptors.forEach(function (descriptor, token) {

	        if (descriptor.isActive) {
	            return;
	        } else {
	            descriptor.isActive = true;
	        }

	        // before or after
	        var listeners;
	        if (beforeChange) {
	            listeners = descriptor.willChangeListeners;
	        } else {
	            listeners = descriptor.changeListeners;
	        }

	        var tokenName = "handle" + (
	            token.slice(0, 1).toUpperCase() +
	            token.slice(1)
	        ) + changeName;
	        // notably, defaults to "handleRangeChange" or "handleRangeWillChange"
	        // if token is "" (the default)

	        // dispatch each listener
	        try {
	            listeners.forEach(function (listener) {
	                if (listener[tokenName]) {
	                    listener[tokenName](plus, minus, index, this, beforeChange);
	                } else if (listener.call) {
	                    listener.call(this, plus, minus, index, this, beforeChange);
	                } else {
	                    throw new Error("Handler " + listener + " has no method " + tokenName + " and is not callable");
	                }
	            }, this);
	        } finally {
	            descriptor.isActive = false;
	        }
	    }, this);
	};

	RangeChanges.prototype.addBeforeRangeChangeListener = function (listener, token) {
	    return this.addRangeChangeListener(listener, token, true);
	};

	RangeChanges.prototype.removeBeforeRangeChangeListener = function (listener, token) {
	    return this.removeRangeChangeListener(listener, token, true);
	};

	RangeChanges.prototype.dispatchBeforeRangeChange = function (plus, minus, index) {
	    return this.dispatchRangeChange(plus, minus, index, true);
	};



/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/*
	    Based in part on extras from Motorola Mobility’s Montage
	    Copyright (c) 2012, Motorola Mobility LLC. All Rights Reserved.
	    3-Clause BSD License
	    https://github.com/motorola-mobility/montage/blob/master/LICENSE.md
	*/

	var Function = __webpack_require__(47);
	var GenericCollection = __webpack_require__(41);
	var GenericOrder = __webpack_require__(49);
	var WeakMap = __webpack_require__(53);

	module.exports = Array;

	Array.empty = [];

	if (Object.freeze) {
	    Object.freeze(Array.empty);
	}

	Array.from = function (values) {
	    var array = [];
	    array.addEach(values);
	    return array;
	};

	Array.unzip = function (table) {
	    var transpose = [];
	    var length = Infinity;
	    // compute shortest row
	    for (var i = 0; i < table.length; i++) {
	        var row = table[i];
	        table[i] = row.toArray();
	        if (row.length < length) {
	            length = row.length;
	        }
	    }
	    for (var i = 0; i < table.length; i++) {
	        var row = table[i];
	        for (var j = 0; j < row.length; j++) {
	            if (j < length && j in row) {
	                transpose[j] = transpose[j] || [];
	                transpose[j][i] = row[j];
	            }
	        }
	    }
	    return transpose;
	};

	function define(key, value) {
	    Object.defineProperty(Array.prototype, key, {
	        value: value,
	        writable: true,
	        configurable: true,
	        enumerable: false
	    });
	}

	define("addEach", GenericCollection.prototype.addEach);
	define("deleteEach", GenericCollection.prototype.deleteEach);
	define("toArray", GenericCollection.prototype.toArray);
	define("toObject", GenericCollection.prototype.toObject);
	define("all", GenericCollection.prototype.all);
	define("any", GenericCollection.prototype.any);
	define("min", GenericCollection.prototype.min);
	define("max", GenericCollection.prototype.max);
	define("sum", GenericCollection.prototype.sum);
	define("average", GenericCollection.prototype.average);
	define("only", GenericCollection.prototype.only);
	define("flatten", GenericCollection.prototype.flatten);
	define("zip", GenericCollection.prototype.zip);
	define("enumerate", GenericCollection.prototype.enumerate);
	define("group", GenericCollection.prototype.group);
	define("sorted", GenericCollection.prototype.sorted);
	define("reversed", GenericCollection.prototype.reversed);

	define("constructClone", function (values) {
	    var clone = new this.constructor();
	    clone.addEach(values);
	    return clone;
	});

	define("has", function (value, equals) {
	    return this.find(value, equals) !== -1;
	});

	define("get", function (index, defaultValue) {
	    if (+index !== index)
	        throw new Error("Indicies must be numbers");
	    if (!index in this) {
	        return defaultValue;
	    } else {
	        return this[index];
	    }
	});

	define("set", function (index, value) {
	    this.splice(index, 1, value);
	    return true;
	});

	define("add", function (value) {
	    this.push(value);
	    return true;
	});

	define("delete", function (value, equals) {
	    var index = this.find(value, equals);
	    if (index !== -1) {
	        this.splice(index, 1);
	        return true;
	    }
	    return false;
	});

	define("find", function (value, equals) {
	    equals = equals || this.contentEquals || Object.equals;
	    for (var index = 0; index < this.length; index++) {
	        if (index in this && equals(this[index], value)) {
	            return index;
	        }
	    }
	    return -1;
	});

	define("findLast", function (value, equals) {
	    equals = equals || this.contentEquals || Object.equals;
	    var index = this.length;
	    do {
	        index--;
	        if (index in this && equals(this[index], value)) {
	            return index;
	        }
	    } while (index > 0);
	    return -1;
	});

	define("swap", function (index, length, plus) {
	    var args = Array.prototype.slice.call(arguments, 0, 2);
	    if (plus) {
	        if (!Array.isArray(plus)) {
	            plus = Array.prototype.slice.call(plus);
	        }
	        args.push.apply(args, plus);
	    }
	    return this.splice.apply(this, args);
	});

	define("one", function () {
	    for (var i in this) {
	        if (Object.owns(this, i)) {
	            return this[i];
	        }
	    }
	});

	define("clear", function () {
	    this.length = 0;
	    return this;
	});

	define("compare", function (that, compare) {
	    compare = compare || Object.compare;
	    var i;
	    var length;
	    var lhs;
	    var rhs;
	    var relative;

	    if (this === that) {
	        return 0;
	    }

	    if (!that || !Array.isArray(that)) {
	        return GenericOrder.prototype.compare.call(this, that, compare);
	    }

	    length = Math.min(this.length, that.length);

	    for (i = 0; i < length; i++) {
	        if (i in this) {
	            if (!(i in that)) {
	                return -1;
	            } else {
	                lhs = this[i];
	                rhs = that[i];
	                relative = compare(lhs, rhs);
	                if (relative) {
	                    return relative;
	                }
	            }
	        } else if (i in that) {
	            return 1;
	        }
	    }

	    return this.length - that.length;
	});

	define("equals", function (that, equals) {
	    equals = equals || Object.equals;
	    var i = 0;
	    var length = this.length;
	    var left;
	    var right;

	    if (this === that) {
	        return true;
	    }
	    if (!that || !Array.isArray(that)) {
	        return GenericOrder.prototype.equals.call(this, that);
	    }

	    if (length !== that.length) {
	        return false;
	    } else {
	        for (; i < length; ++i) {
	            if (i in this) {
	                if (!(i in that)) {
	                    return false;
	                }
	                left = this[i];
	                right = that[i];
	                if (!equals(left, right)) {
	                    return false;
	                }
	            } else {
	                if (i in that) {
	                    return false;
	                }
	            }
	        }
	    }
	    return true;
	});

	define("clone", function (depth, memo) {
	    if (depth === undefined) {
	        depth = Infinity;
	    } else if (depth === 0) {
	        return this;
	    }
	    memo = memo || new WeakMap();
	    var clone = [];
	    for (var i in this) {
	        if (Object.owns(this, i)) {
	            clone[i] = Object.clone(this[i], depth - 1, memo);
	        }
	    };
	    return clone;
	});

	define("iterate", function (start, end) {
	    return new ArrayIterator(this, start, end);
	});

	define("Iterator", ArrayIterator);

	function ArrayIterator(array, start, end) {
	    this.array = array;
	    this.start = start == null ? 0 : start;
	    this.end = end;
	};

	ArrayIterator.prototype.next = function () {
	    if (this.start === (this.end == null ? this.array.length : this.end)) {
	        throw StopIteration;
	    } else {
	        return this.array[this.start++];
	    }
	};



/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var WeakMap = __webpack_require__(53);

	module.exports = Object;

	/*
	    Based in part on extras from Motorola Mobility’s Montage
	    Copyright (c) 2012, Motorola Mobility LLC. All Rights Reserved.
	    3-Clause BSD License
	    https://github.com/motorola-mobility/montage/blob/master/LICENSE.md
	*/

	/**
	    Defines extensions to intrinsic <code>Object</code>.
	    @see [Object class]{@link external:Object}
	*/

	/**
	    A utility object to avoid unnecessary allocations of an empty object
	    <code>{}</code>.  This object is frozen so it is safe to share.

	    @object external:Object.empty
	*/
	Object.empty = Object.freeze(Object.create(null));

	/**
	    Returns whether the given value is an object, as opposed to a value.
	    Unboxed numbers, strings, true, false, undefined, and null are not
	    objects.  Arrays are objects.

	    @function external:Object.isObject
	    @param {Any} value
	    @returns {Boolean} whether the given value is an object
	*/
	Object.isObject = function (object) {
	    return Object(object) === object;
	};

	/**
	    Returns the value of an any value, particularly objects that
	    implement <code>valueOf</code>.

	    <p>Note that, unlike the precedent of methods like
	    <code>Object.equals</code> and <code>Object.compare</code> would suggest,
	    this method is named <code>Object.getValueOf</code> instead of
	    <code>valueOf</code>.  This is a delicate issue, but the basis of this
	    decision is that the JavaScript runtime would be far more likely to
	    accidentally call this method with no arguments, assuming that it would
	    return the value of <code>Object</code> itself in various situations,
	    whereas <code>Object.equals(Object, null)</code> protects against this case
	    by noting that <code>Object</code> owns the <code>equals</code> property
	    and therefore does not delegate to it.

	    @function external:Object.getValueOf
	    @param {Any} value a value or object wrapping a value
	    @returns {Any} the primitive value of that object, if one exists, or passes
	    the value through
	*/
	Object.getValueOf = function (value) {
	    if (Object.can(value, "valueOf")) {
	        value = value.valueOf();
	    }
	    return value;
	};

	var hashMap = new WeakMap();
	Object.hash = function (object) {
	    if (Object.can(object, "hash")) {
	        return "" + object.hash();
	    } else if (Object(object) === object) {
	        if (!hashMap.has(object)) {
	            hashMap.set(object, Math.random().toString(36).slice(2));
	        }
	        return hashMap.get(object);
	    } else {
	        return "" + object;
	    }
	};

	/**
	    A shorthand for <code>Object.prototype.hasOwnProperty.call(object,
	    key)</code>.  Returns whether the object owns a property for the given key.
	    It does not consult the prototype chain and works for any string (including
	    "hasOwnProperty") except "__proto__".

	    @function external:Object.owns
	    @param {Object} object
	    @param {String} key
	    @returns {Boolean} whether the object owns a property wfor the given key.
	*/
	var owns = Object.prototype.hasOwnProperty;
	Object.owns = function (object, key) {
	    return owns.call(object, key);
	};

	/**
	    Returns whether a value implements a particular duck-type method.

	    <p>To qualify as a duck-type method, the value in question must have a
	    method by the given name on the prototype chain.  To distinguish it from
	    a property of an object literal, the property must not be owned by the
	    object directly.

	    <p>A value that implements a method is not necessarily an object, for
	    example, numbers implement <code>valueOf</code>, so this is function
	    does not imply <code>Object.isObject</code> of the same value.

	    @function external:Object.can
	    @param {Any} value a value
	    @param {String} name a method name
	    @returns {Boolean} whether the given value implements the given method

	*/
	Object.can = function (object, name) {
	    return (
	        object != null && // false only for null *and* undefined
	        typeof object[name] === "function" &&
	        !owns.call(object, name)
	    );
	};

	/**
	    A utility that is like Object.owns but is also useful for finding
	    properties on the prototype chain, provided that they do not refer to
	    methods on the Object prototype.  Works for all strings except "__proto__".

	    <p>Alternately, you could use the "in" operator as long as the object
	    descends from "null" instead of the Object.prototype, as with
	    <code>Object.create(null)</code>.  However,
	    <code>Object.create(null)</code> only works in fully compliant EcmaScript 5
	    JavaScript engines and cannot be faithfully shimmed.

	    <p>If the given object is an instance of a type that implements a method
	    named "has", this function defers to the collection, so this method can be
	    used to generically handle objects, arrays, or other collections.  In that
	    case, the domain of the key depends on the instance.

	    @param {Object} object
	    @param {String} key
	    @returns {Boolean} whether the object, or any of its prototypes except
	    <code>Object.prototype</code>
	    @function external:Object.has
	*/
	Object.has = function (object, key) {
	    if (typeof object !== "object") {
	        throw new Error("Object.has can't accept non-object: " + typeof object);
	    }
	    // forward to mapped collections that implement "has"
	    if (Object.can(object, "has")) {
	        return object.has(key);
	    // otherwise report whether the key is on the prototype chain,
	    // as long as it is not one of the methods on object.prototype
	    } else if (typeof key === "string") {
	        return key in object && object[key] !== Object.prototype[key];
	    } else {
	        throw new Error("Key must be a string for Object.has on plain objects");
	    }
	};

	/**
	    Gets the value for a corresponding key from an object.

	    <p>Uses Object.has to determine whether there is a corresponding value for
	    the given key.  As such, <code>Object.get</code> is capable of retriving
	    values from the prototype chain as long as they are not from the
	    <code>Object.prototype</code>.

	    <p>If there is no corresponding value, returns the given default, which may
	    be <code>undefined</code>.

	    <p>If the given object is an instance of a type that implements a method
	    named "get", this function defers to the collection, so this method can be
	    used to generically handle objects, arrays, or other collections.  In that
	    case, the domain of the key depends on the implementation.  For a `Map`,
	    for example, the key might be any object.

	    @param {Object} object
	    @param {String} key
	    @param {Any} value a default to return, <code>undefined</code> if omitted
	    @returns {Any} value for key, or default value
	    @function external:Object.get
	*/
	Object.get = function (object, key, value) {
	    if (typeof object !== "object") {
	        throw new Error("Object.get can't accept non-object: " + typeof object);
	    }
	    // forward to mapped collections that implement "get"
	    if (Object.can(object, "get")) {
	        return object.get(key, value);
	    } else if (Object.has(object, key)) {
	        return object[key];
	    } else {
	        return value;
	    }
	};

	/**
	    Sets the value for a given key on an object.

	    <p>If the given object is an instance of a type that implements a method
	    named "set", this function defers to the collection, so this method can be
	    used to generically handle objects, arrays, or other collections.  As such,
	    the key domain varies by the object type.

	    @param {Object} object
	    @param {String} key
	    @param {Any} value
	    @returns <code>undefined</code>
	    @function external:Object.set
	*/
	Object.set = function (object, key, value) {
	    if (Object.can(object, "set")) {
	        object.set(key, value);
	    } else {
	        object[key] = value;
	    }
	};

	Object.addEach = function (target, source) {
	    if (!source) {
	    } else if (Object.can(source, "forEach")) {
	        // copy map-alikes
	        if (typeof source.keys === "function") {
	            source.forEach(function (value, key) {
	                target[key] = value;
	            });
	        // iterate key value pairs of other iterables
	        } else {
	            source.forEach(function (pair) {
	                target[pair[0]] = pair[1];
	            });
	        }
	    } else {
	        // copy other objects as map-alikes
	        Object.keys(source).forEach(function (key) {
	            target[key] = source[key];
	        });
	    }
	    return target;
	};

	/**
	    Iterates over the owned properties of an object.

	    @function external:Object.forEach
	    @param {Object} object an object to iterate.
	    @param {Function} callback a function to call for every key and value
	    pair in the object.  Receives <code>value</code>, <code>key</code>,
	    and <code>object</code> as arguments.
	    @param {Object} thisp the <code>this</code> to pass through to the
	    callback
	*/
	Object.forEach = function (object, callback, thisp) {
	    Object.keys(object).forEach(function (key) {
	        callback.call(thisp, object[key], key, object);
	    });
	};

	/**
	    Iterates over the owned properties of a map, constructing a new array of
	    mapped values.

	    @function external:Object.map
	    @param {Object} object an object to iterate.
	    @param {Function} callback a function to call for every key and value
	    pair in the object.  Receives <code>value</code>, <code>key</code>,
	    and <code>object</code> as arguments.
	    @param {Object} thisp the <code>this</code> to pass through to the
	    callback
	    @returns {Array} the respective values returned by the callback for each
	    item in the object.
	*/
	Object.map = function (object, callback, thisp) {
	    return Object.keys(object).map(function (key) {
	        return callback.call(thisp, object[key], key, object);
	    });
	};

	/**
	    Returns the values for owned properties of an object.

	    @function external:Object.map
	    @param {Object} object
	    @returns {Array} the respective value for each owned property of the
	    object.
	*/
	Object.values = function (object) {
	    return Object.map(object, Function.identity);
	};

	// TODO inline document concat
	Object.concat = function () {
	    var object = {};
	    for (var i = 0; i < arguments.length; i++) {
	        Object.addEach(object, arguments[i]);
	    }
	    return object;
	};

	Object.from = Object.concat;

	/**
	    Returns whether two values are identical.  Any value is identical to itself
	    and only itself.  This is much more restictive than equivalence and subtly
	    different than strict equality, <code>===</code> because of edge cases
	    including negative zero and <code>NaN</code>.  Identity is useful for
	    resolving collisions among keys in a mapping where the domain is any value.
	    This method does not delgate to any method on an object and cannot be
	    overridden.
	    @see http://wiki.ecmascript.org/doku.php?id=harmony:egal
	    @param {Any} this
	    @param {Any} that
	    @returns {Boolean} whether this and that are identical
	    @function external:Object.is
	*/
	Object.is = function (x, y) {
	    if (x === y) {
	        // 0 === -0, but they are not identical
	        return x !== 0 || 1 / x === 1 / y;
	    }
	    // NaN !== NaN, but they are identical.
	    // NaNs are the only non-reflexive value, i.e., if x !== x,
	    // then x is a NaN.
	    // isNaN is broken: it converts its argument to number, so
	    // isNaN("foo") => true
	    return x !== x && y !== y;
	};

	/**
	    Performs a polymorphic, type-sensitive deep equivalence comparison of any
	    two values.

	    <p>As a basic principle, any value is equivalent to itself (as in
	    identity), any boxed version of itself (as a <code>new Number(10)</code> is
	    to 10), and any deep clone of itself.

	    <p>Equivalence has the following properties:

	    <ul>
	        <li><strong>polymorphic:</strong>
	            If the given object is an instance of a type that implements a
	            methods named "equals", this function defers to the method.  So,
	            this function can safely compare any values regardless of type,
	            including undefined, null, numbers, strings, any pair of objects
	            where either implements "equals", or object literals that may even
	            contain an "equals" key.
	        <li><strong>type-sensitive:</strong>
	            Incomparable types are not equal.  No object is equivalent to any
	            array.  No string is equal to any other number.
	        <li><strong>deep:</strong>
	            Collections with equivalent content are equivalent, recursively.
	        <li><strong>equivalence:</strong>
	            Identical values and objects are equivalent, but so are collections
	            that contain equivalent content.  Whether order is important varies
	            by type.  For Arrays and lists, order is important.  For Objects,
	            maps, and sets, order is not important.  Boxed objects are mutally
	            equivalent with their unboxed values, by virtue of the standard
	            <code>valueOf</code> method.
	    </ul>
	    @param this
	    @param that
	    @returns {Boolean} whether the values are deeply equivalent
	    @function external:Object.equals
	*/
	Object.equals = function (a, b, equals) {
	    equals = equals || Object.equals;
	    // unbox objects, but do not confuse object literals
	    a = Object.getValueOf(a);
	    b = Object.getValueOf(b);
	    if (a === b)
	        // 0 === -0, but they are not equal
	        return a !== 0 || 1 / a === 1 / b;
	    if (a === null || b === null)
	        return a === b;
	    if (Object.can(a, "equals"))
	        return a.equals(b, equals);
	    // commutative
	    if (Object.can(b, "equals"))
	        return b.equals(a, equals);
	    if (typeof a === "object" && typeof b === "object") {
	        var aPrototype = Object.getPrototypeOf(a);
	        var bPrototype = Object.getPrototypeOf(b);
	        if (
	            aPrototype === bPrototype && (
	                aPrototype === Object.prototype ||
	                aPrototype === null
	            )
	        ) {
	            for (var key in a) {
	                if (!equals(a[key], b[key])) {
	                    return false;
	                }
	            }
	            for (var key in b) {
	                if (!equals(a[key], b[key])) {
	                    return false;
	                }
	            }
	            return true;
	        }
	    }
	    // NaN !== NaN, but they are equal.
	    // NaNs are the only non-reflexive value, i.e., if x !== x,
	    // then x is a NaN.
	    // isNaN is broken: it converts its argument to number, so
	    // isNaN("foo") => true
	    return a !== a && b !== b;
	};

	// Because a return value of 0 from a `compare` function  may mean either
	// "equals" or "is incomparable", `equals` cannot be defined in terms of
	// `compare`.  However, `compare` *can* be defined in terms of `equals` and
	// `lessThan`.  Again however, more often it would be desirable to implement
	// all of the comparison functions in terms of compare rather than the other
	// way around.

	/**
	    Determines the order in which any two objects should be sorted by returning
	    a number that has an analogous relationship to zero as the left value to
	    the right.  That is, if the left is "less than" the right, the returned
	    value will be "less than" zero, where "less than" may be any other
	    transitive relationship.

	    <p>Arrays are compared by the first diverging values, or by length.

	    <p>Any two values that are incomparable return zero.  As such,
	    <code>equals</code> should not be implemented with <code>compare</code>
	    since incomparability is indistinguishable from equality.

	    <p>Sorts strings lexicographically.  This is not suitable for any
	    particular international setting.  Different locales sort their phone books
	    in very different ways, particularly regarding diacritics and ligatures.

	    <p>If the given object is an instance of a type that implements a method
	    named "compare", this function defers to the instance.  The method does not
	    need to be an owned property to distinguish it from an object literal since
	    object literals are incomparable.  Unlike <code>Object</code> however,
	    <code>Array</code> implements <code>compare</code>.

	    @param {Any} left
	    @param {Any} right
	    @returns {Number} a value having the same transitive relationship to zero
	    as the left and right values.
	    @function external:Object.compare
	*/
	Object.compare = function (a, b) {
	    // unbox objects, but do not confuse object literals
	    // mercifully handles the Date case
	    a = Object.getValueOf(a);
	    b = Object.getValueOf(b);
	    var aType = typeof a;
	    var bType = typeof b;
	    if (a === b)
	        return 0;
	    if (aType !== bType)
	        return 0;
	    if (aType === "number")
	        return a - b;
	    if (aType === "string")
	        return a < b ? -1 : 1;
	        // the possibility of equality elimiated above
	    if (Object.can(a, "compare"))
	        return a.compare(b);
	    // not commutative, the relationship is reversed
	    if (Object.can(b, "compare"))
	        return -b.compare(a);
	    return 0;
	};

	/**
	    Creates a deep copy of any value.  Values, being immutable, are
	    returned without alternation.  Forwards to <code>clone</code> on
	    objects and arrays.

	    @function external:Object.clone
	    @param {Any} value a value to clone
	    @param {Number} depth an optional traversal depth, defaults to infinity.
	    A value of <code>0</code> means to make no clone and return the value
	    directly.
	    @param {Map} memo an optional memo of already visited objects to preserve
	    reference cycles.  The cloned object will have the exact same shape as the
	    original, but no identical objects.  Te map may be later used to associate
	    all objects in the original object graph with their corresponding member of
	    the cloned graph.
	    @returns a copy of the value
	*/
	Object.clone = function (value, depth, memo) {
	    value = Object.getValueOf(value);
	    memo = memo || new WeakMap();
	    if (depth === undefined) {
	        depth = Infinity;
	    } else if (depth === 0) {
	        return value;
	    }
	    if (Object.isObject(value)) {
	        if (!memo.has(value)) {
	            if (Object.can(value, "clone")) {
	                memo.set(value, value.clone(depth, memo));
	            } else {
	                var prototype = Object.getPrototypeOf(value);
	                if (prototype === null || prototype === Object.prototype) {
	                    var clone = Object.create(prototype);
	                    memo.set(value, clone);
	                    for (var key in value) {
	                        clone[key] = Object.clone(value[key], depth - 1, memo);
	                    }
	                } else {
	                    throw new Error("Can't clone " + value);
	                }
	            }
	        }
	        return memo.get(value);
	    }
	    return value;
	};

	/**
	    Removes all properties owned by this object making the object suitable for
	    reuse.

	    @function external:Object.clear
	    @returns this
	*/
	Object.clear = function (object) {
	    if (Object.can(object, "clear")) {
	        object.clear();
	    } else {
	        var keys = Object.keys(object),
	            i = keys.length;
	        while (i) {
	            i--;
	            delete object[keys[i]];
	        }
	    }
	    return object;
	};



/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	
	module.exports = Function;

	/**
	    A utility to reduce unnecessary allocations of <code>function () {}</code>
	    in its many colorful variations.  It does nothing and returns
	    <code>undefined</code> thus makes a suitable default in some circumstances.

	    @function external:Function.noop
	*/
	Function.noop = function () {
	};

	/**
	    A utility to reduce unnecessary allocations of <code>function (x) {return
	    x}</code> in its many colorful but ultimately wasteful parameter name
	    variations.

	    @function external:Function.identity
	    @param {Any} any value
	    @returns {Any} that value
	*/
	Function.identity = function (value) {
	    return value;
	};

	/**
	    A utility for creating a comparator function for a particular aspect of a
	    figurative class of objects.

	    @function external:Function.by
	    @param {Function} relation A function that accepts a value and returns a
	    corresponding value to use as a representative when sorting that object.
	    @param {Function} compare an alternate comparator for comparing the
	    represented values.  The default is <code>Object.compare</code>, which
	    does a deep, type-sensitive, polymorphic comparison.
	    @returns {Function} a comparator that has been annotated with
	    <code>by</code> and <code>compare</code> properties so
	    <code>sorted</code> can perform a transform that reduces the need to call
	    <code>by</code> on each sorted object to just once.
	 */
	Function.by = function (by , compare) {
	    compare = compare || Object.compare;
	    by = by || Function.identity;
	    var compareBy = function (a, b) {
	        return compare(by(a), by(b));
	    };
	    compareBy.compare = compare;
	    compareBy.by = by;
	    return compareBy;
	};

	// TODO document
	Function.get = function (key) {
	    return function (object) {
	        return Object.get(object, key);
	    };
	};



/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	    accepts a string; returns the string with regex metacharacters escaped.
	    the returned string can safely be used within a regex to match a literal
	    string. escaped characters are [, ], {, }, (, ), -, *, +, ?, ., \, ^, $,
	    |, #, [comma], and whitespace.
	*/
	if (!RegExp.escape) {
	    var special = /[-[\]{}()*+?.\\^$|,#\s]/g;
	    RegExp.escape = function (string) {
	        return string.replace(special, "\\$&");
	    };
	}



/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	
	var Object = __webpack_require__(46);

	module.exports = GenericOrder;
	function GenericOrder() {
	    throw new Error("Can't construct. GenericOrder is a mixin.");
	}

	GenericOrder.prototype.equals = function (that, equals) {
	    equals = equals || this.contentEquals || Object.equals;

	    if (this === that) {
	        return true;
	    }
	    if (!that) {
	        return false;
	    }

	    var self = this;
	    return (
	        this.length === that.length &&
	        this.zip(that).every(function (pair) {
	            return equals(pair[0], pair[1]);
	        })
	    );
	};

	GenericOrder.prototype.compare = function (that, compare) {
	    compare = compare || this.contentCompare || Object.compare;

	    if (this === that) {
	        return 0;
	    }
	    if (!that) {
	        return 1;
	    }

	    var length = Math.min(this.length, that.length);
	    var comparison = this.zip(that).reduce(function (comparison, pair, index) {
	        if (comparison === 0) {
	            if (index >= length) {
	                return comparison;
	            } else {
	                return compare(pair[0], pair[1]);
	            }
	        } else {
	            return comparison;
	        }
	    }, 0);
	    if (comparison === 0) {
	        return this.length - that.length;
	    }
	    return comparison;
	};



/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Shim = __webpack_require__(38);
	var GenericCollection = __webpack_require__(41);
	var GenericMap = __webpack_require__(52);
	var PropertyChanges = __webpack_require__(43);

	// Burgled from https://github.com/domenic/dict

	module.exports = Dict;
	function Dict(values, getDefault) {
	    if (!(this instanceof Dict)) {
	        return new Dict(values, getDefault);
	    }
	    getDefault = getDefault || Function.noop;
	    this.getDefault = getDefault;
	    this.store = {};
	    this.length = 0;
	    this.addEach(values);
	}

	Dict.Dict = Dict; // hack so require("dict").Dict will work in MontageJS.

	function mangle(key) {
	    return "~" + key;
	}

	function unmangle(mangled) {
	    return mangled.slice(1);
	}

	Object.addEach(Dict.prototype, GenericCollection.prototype);
	Object.addEach(Dict.prototype, GenericMap.prototype);
	Object.addEach(Dict.prototype, PropertyChanges.prototype);

	Dict.prototype.constructClone = function (values) {
	    return new this.constructor(values, this.mangle, this.getDefault);
	};

	Dict.prototype.assertString = function (key) {
	    if (typeof key !== "string") {
	        throw new TypeError("key must be a string but Got " + key);
	    }
	}

	Dict.prototype.get = function (key, defaultValue) {
	    this.assertString(key);
	    var mangled = mangle(key);
	    if (mangled in this.store) {
	        return this.store[mangled];
	    } else if (arguments.length > 1) {
	        return defaultValue;
	    } else {
	        return this.getDefault(key);
	    }
	};

	Dict.prototype.set = function (key, value) {
	    this.assertString(key);
	    var mangled = mangle(key);
	    if (mangled in this.store) { // update
	        if (this.dispatchesBeforeMapChanges) {
	            this.dispatchBeforeMapChange(key, this.store[mangled]);
	        }
	        this.store[mangled] = value;
	        if (this.dispatchesMapChanges) {
	            this.dispatchMapChange(key, value);
	        }
	        return false;
	    } else { // create
	        if (this.dispatchesMapChanges) {
	            this.dispatchBeforeMapChange(key, undefined);
	        }
	        this.length++;
	        this.store[mangled] = value;
	        if (this.dispatchesMapChanges) {
	            this.dispatchMapChange(key, value);
	        }
	        return true;
	    }
	};

	Dict.prototype.has = function (key) {
	    this.assertString(key);
	    var mangled = mangle(key);
	    return mangled in this.store;
	};

	Dict.prototype["delete"] = function (key) {
	    this.assertString(key);
	    var mangled = mangle(key);
	    if (mangled in this.store) {
	        if (this.dispatchesMapChanges) {
	            this.dispatchBeforeMapChange(key, this.store[mangled]);
	        }
	        delete this.store[mangle(key)];
	        this.length--;
	        if (this.dispatchesMapChanges) {
	            this.dispatchMapChange(key, undefined);
	        }
	        return true;
	    }
	    return false;
	};

	Dict.prototype.clear = function () {
	    var key, mangled;
	    for (mangled in this.store) {
	        key = unmangle(mangled);
	        if (this.dispatchesMapChanges) {
	            this.dispatchBeforeMapChange(key, this.store[mangled]);
	        }
	        delete this.store[mangled];
	        if (this.dispatchesMapChanges) {
	            this.dispatchMapChange(key, undefined);
	        }
	    }
	    this.length = 0;
	};

	Dict.prototype.reduce = function (callback, basis, thisp) {
	    for (var mangled in this.store) {
	        basis = callback.call(thisp, basis, this.store[mangled], unmangle(mangled), this);
	    }
	    return basis;
	};

	Dict.prototype.reduceRight = function (callback, basis, thisp) {
	    var self = this;
	    var store = this.store;
	    return Object.keys(this.store).reduceRight(function (basis, mangled) {
	        return callback.call(thisp, basis, store[mangled], unmangle(mangled), self);
	    }, basis);
	};

	Dict.prototype.one = function () {
	    var key;
	    for (key in this.store) {
	        return this.store[key];
	    }
	};



/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = TreeLog;

	function TreeLog() {
	}

	TreeLog.ascii = {
	    intersection: "+",
	    through: "-",
	    branchUp: "+",
	    branchDown: "+",
	    fromBelow: ".",
	    fromAbove: "'",
	    fromBoth: "+",
	    strafe: "|"
	};

	TreeLog.unicodeRound = {
	    intersection: "\u254b",
	    through: "\u2501",
	    branchUp: "\u253b",
	    branchDown: "\u2533",
	    fromBelow: "\u256d", // round corner
	    fromAbove: "\u2570", // round corner
	    fromBoth: "\u2523",
	    strafe: "\u2503"
	};

	TreeLog.unicodeSharp = {
	    intersection: "\u254b",
	    through: "\u2501",
	    branchUp: "\u253b",
	    branchDown: "\u2533",
	    fromBelow: "\u250f", // sharp corner
	    fromAbove: "\u2517", // sharp corner
	    fromBoth: "\u2523",
	    strafe: "\u2503"
	};



/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Object = __webpack_require__(46);
	var MapChanges = __webpack_require__(54);
	var PropertyChanges = __webpack_require__(43);

	module.exports = GenericMap;
	function GenericMap() {
	    throw new Error("Can't construct. GenericMap is a mixin.");
	}

	Object.addEach(GenericMap.prototype, MapChanges.prototype);
	Object.addEach(GenericMap.prototype, PropertyChanges.prototype);

	// all of these methods depend on the constructor providing a `store` set

	GenericMap.prototype.isMap = true;

	GenericMap.prototype.addEach = function (values) {
	    if (values && Object(values) === values) {
	        if (typeof values.forEach === "function") {
	            // copy map-alikes
	            if (values.isMap === true) {
	                values.forEach(function (value, key) {
	                    this.set(key, value);
	                }, this);
	            // iterate key value pairs of other iterables
	            } else {
	                values.forEach(function (pair) {
	                    this.set(pair[0], pair[1]);
	                }, this);
	            }
	        } else {
	            // copy other objects as map-alikes
	            Object.keys(values).forEach(function (key) {
	                this.set(key, values[key]);
	            }, this);
	        }
	    }
	    return this;
	}

	GenericMap.prototype.get = function (key, defaultValue) {
	    var item = this.store.get(new this.Item(key));
	    if (item) {
	        return item.value;
	    } else if (arguments.length > 1) {
	        return defaultValue;
	    } else {
	        return this.getDefault(key);
	    }
	};

	GenericMap.prototype.set = function (key, value) {
	    var item = new this.Item(key, value);
	    var found = this.store.get(item);
	    var grew = false;
	    if (found) { // update
	        if (this.dispatchesMapChanges) {
	            this.dispatchBeforeMapChange(key, found.value);
	        }
	        found.value = value;
	        if (this.dispatchesMapChanges) {
	            this.dispatchMapChange(key, value);
	        }
	    } else { // create
	        if (this.dispatchesMapChanges) {
	            this.dispatchBeforeMapChange(key, undefined);
	        }
	        if (this.store.add(item)) {
	            this.length++;
	            grew = true;
	        }
	        if (this.dispatchesMapChanges) {
	            this.dispatchMapChange(key, value);
	        }
	    }
	    return grew;
	};

	GenericMap.prototype.add = function (value, key) {
	    return this.set(key, value);
	};

	GenericMap.prototype.has = function (key) {
	    return this.store.has(new this.Item(key));
	};

	GenericMap.prototype['delete'] = function (key) {
	    var item = new this.Item(key);
	    if (this.store.has(item)) {
	        var from = this.store.get(item).value;
	        if (this.dispatchesMapChanges) {
	            this.dispatchBeforeMapChange(key, from);
	        }
	        this.store["delete"](item);
	        this.length--;
	        if (this.dispatchesMapChanges) {
	            this.dispatchMapChange(key, undefined);
	        }
	        return true;
	    }
	    return false;
	};

	GenericMap.prototype.clear = function () {
	    var keys;
	    if (this.dispatchesMapChanges) {
	        this.forEach(function (value, key) {
	            this.dispatchBeforeMapChange(key, value);
	        }, this);
	        keys = this.keys();
	    }
	    this.store.clear();
	    this.length = 0;
	    if (this.dispatchesMapChanges) {
	        keys.forEach(function (key) {
	            this.dispatchMapChange(key);
	        }, this);
	    }
	};

	GenericMap.prototype.reduce = function (callback, basis, thisp) {
	    return this.store.reduce(function (basis, item) {
	        return callback.call(thisp, basis, item.value, item.key, this);
	    }, basis, this);
	};

	GenericMap.prototype.reduceRight = function (callback, basis, thisp) {
	    return this.store.reduceRight(function (basis, item) {
	        return callback.call(thisp, basis, item.value, item.key, this);
	    }, basis, this);
	};

	GenericMap.prototype.keys = function () {
	    return this.map(function (value, key) {
	        return key;
	    });
	};

	GenericMap.prototype.values = function () {
	    return this.map(Function.identity);
	};

	GenericMap.prototype.entries = function () {
	    return this.map(function (value, key) {
	        return [key, value];
	    });
	};

	// XXX deprecated
	GenericMap.prototype.items = function () {
	    return this.entries();
	};

	GenericMap.prototype.equals = function (that, equals) {
	    equals = equals || Object.equals;
	    if (this === that) {
	        return true;
	    } else if (Object.can(that, "every")) {
	        return that.length === this.length && that.every(function (value, key) {
	            return equals(this.get(key), value);
	        }, this);
	    } else {
	        var keys = Object.keys(that);
	        return keys.length === this.length && Object.keys(that).every(function (key) {
	            return equals(this.get(key), that[key]);
	        }, this);
	    }
	};

	GenericMap.prototype.Item = Item;

	function Item(key, value) {
	    this.key = key;
	    this.value = value;
	}

	Item.prototype.equals = function (that) {
	    return Object.equals(this.key, that.key) && Object.equals(this.value, that.value);
	};

	Item.prototype.compare = function (that) {
	    return Object.compare(this.key, that.key);
	};



/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright (C) 2011 Google Inc.
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	// http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.

	/**
	 * @fileoverview Install a leaky WeakMap emulation on platforms that
	 * don't provide a built-in one.
	 *
	 * <p>Assumes that an ES5 platform where, if {@code WeakMap} is
	 * already present, then it conforms to the anticipated ES6
	 * specification. To run this file on an ES5 or almost ES5
	 * implementation where the {@code WeakMap} specification does not
	 * quite conform, run <code>repairES5.js</code> first.
	 *
	 * <p> Even though WeakMapModule is not global, the linter thinks it
	 * is, which is why it is in the overrides list below.
	 *
	 * @author Mark S. Miller
	 * @requires crypto, ArrayBuffer, Uint8Array, navigator
	 * @overrides WeakMap, ses, Proxy
	 * @overrides WeakMapModule
	 */

	/**
	 * This {@code WeakMap} emulation is observably equivalent to the
	 * ES-Harmony WeakMap, but with leakier garbage collection properties.
	 *
	 * <p>As with true WeakMaps, in this emulation, a key does not
	 * retain maps indexed by that key and (crucially) a map does not
	 * retain the keys it indexes. A map by itself also does not retain
	 * the values associated with that map.
	 *
	 * <p>However, the values associated with a key in some map are
	 * retained so long as that key is retained and those associations are
	 * not overridden. For example, when used to support membranes, all
	 * values exported from a given membrane will live for the lifetime
	 * they would have had in the absence of an interposed membrane. Even
	 * when the membrane is revoked, all objects that would have been
	 * reachable in the absence of revocation will still be reachable, as
	 * far as the GC can tell, even though they will no longer be relevant
	 * to ongoing computation.
	 *
	 * <p>The API implemented here is approximately the API as implemented
	 * in FF6.0a1 and agreed to by MarkM, Andreas Gal, and Dave Herman,
	 * rather than the offially approved proposal page. TODO(erights):
	 * upgrade the ecmascript WeakMap proposal page to explain this API
	 * change and present to EcmaScript committee for their approval.
	 *
	 * <p>The first difference between the emulation here and that in
	 * FF6.0a1 is the presence of non enumerable {@code get___, has___,
	 * set___, and delete___} methods on WeakMap instances to represent
	 * what would be the hidden internal properties of a primitive
	 * implementation. Whereas the FF6.0a1 WeakMap.prototype methods
	 * require their {@code this} to be a genuine WeakMap instance (i.e.,
	 * an object of {@code [[Class]]} "WeakMap}), since there is nothing
	 * unforgeable about the pseudo-internal method names used here,
	 * nothing prevents these emulated prototype methods from being
	 * applied to non-WeakMaps with pseudo-internal methods of the same
	 * names.
	 *
	 * <p>Another difference is that our emulated {@code
	 * WeakMap.prototype} is not itself a WeakMap. A problem with the
	 * current FF6.0a1 API is that WeakMap.prototype is itself a WeakMap
	 * providing ambient mutability and an ambient communications
	 * channel. Thus, if a WeakMap is already present and has this
	 * problem, repairES5.js wraps it in a safe wrappper in order to
	 * prevent access to this channel. (See
	 * PATCH_MUTABLE_FROZEN_WEAKMAP_PROTO in repairES5.js).
	 */

	/**
	 * If this is a full <a href=
	 * "http://code.google.com/p/es-lab/wiki/SecureableES5"
	 * >secureable ES5</a> platform and the ES-Harmony {@code WeakMap} is
	 * absent, install an approximate emulation.
	 *
	 * <p>If WeakMap is present but cannot store some objects, use our approximate
	 * emulation as a wrapper.
	 *
	 * <p>If this is almost a secureable ES5 platform, then WeakMap.js
	 * should be run after repairES5.js.
	 *
	 * <p>See {@code WeakMap} for documentation of the garbage collection
	 * properties of this WeakMap emulation.
	 */
	(function WeakMapModule() {
	  "use strict";

	  if (typeof ses !== 'undefined' && ses.ok && !ses.ok()) {
	    // already too broken, so give up
	    return;
	  }

	  /**
	   * In some cases (current Firefox), we must make a choice betweeen a
	   * WeakMap which is capable of using all varieties of host objects as
	   * keys and one which is capable of safely using proxies as keys. See
	   * comments below about HostWeakMap and DoubleWeakMap for details.
	   *
	   * This function (which is a global, not exposed to guests) marks a
	   * WeakMap as permitted to do what is necessary to index all host
	   * objects, at the cost of making it unsafe for proxies.
	   *
	   * Do not apply this function to anything which is not a genuine
	   * fresh WeakMap.
	   */
	  function weakMapPermitHostObjects(map) {
	    // identity of function used as a secret -- good enough and cheap
	    if (map.permitHostObjects___) {
	      map.permitHostObjects___(weakMapPermitHostObjects);
	    }
	  }
	  if (typeof ses !== 'undefined') {
	    ses.weakMapPermitHostObjects = weakMapPermitHostObjects;
	  }

	  // Check if there is already a good-enough WeakMap implementation, and if so
	  // exit without replacing it.
	  if (typeof WeakMap === 'function') {
	    var HostWeakMap = WeakMap;
	    // There is a WeakMap -- is it good enough?
	    if (typeof navigator !== 'undefined' &&
	        /Firefox/.test(navigator.userAgent)) {
	      // We're now *assuming not*, because as of this writing (2013-05-06)
	      // Firefox's WeakMaps have a miscellany of objects they won't accept, and
	      // we don't want to make an exhaustive list, and testing for just one
	      // will be a problem if that one is fixed alone (as they did for Event).

	      // If there is a platform that we *can* reliably test on, here's how to
	      // do it:
	      //  var problematic = ... ;
	      //  var testHostMap = new HostWeakMap();
	      //  try {
	      //    testHostMap.set(problematic, 1);  // Firefox 20 will throw here
	      //    if (testHostMap.get(problematic) === 1) {
	      //      return;
	      //    }
	      //  } catch (e) {}

	      // Fall through to installing our WeakMap.
	    } else {
	      module.exports = WeakMap;
	      return;
	    }
	  }

	  var hop = Object.prototype.hasOwnProperty;
	  var gopn = Object.getOwnPropertyNames;
	  var defProp = Object.defineProperty;
	  var isExtensible = Object.isExtensible;

	  /**
	   * Security depends on HIDDEN_NAME being both <i>unguessable</i> and
	   * <i>undiscoverable</i> by untrusted code.
	   *
	   * <p>Given the known weaknesses of Math.random() on existing
	   * browsers, it does not generate unguessability we can be confident
	   * of.
	   *
	   * <p>It is the monkey patching logic in this file that is intended
	   * to ensure undiscoverability. The basic idea is that there are
	   * three fundamental means of discovering properties of an object:
	   * The for/in loop, Object.keys(), and Object.getOwnPropertyNames(),
	   * as well as some proposed ES6 extensions that appear on our
	   * whitelist. The first two only discover enumerable properties, and
	   * we only use HIDDEN_NAME to name a non-enumerable property, so the
	   * only remaining threat should be getOwnPropertyNames and some
	   * proposed ES6 extensions that appear on our whitelist. We monkey
	   * patch them to remove HIDDEN_NAME from the list of properties they
	   * returns.
	   *
	   * <p>TODO(erights): On a platform with built-in Proxies, proxies
	   * could be used to trap and thereby discover the HIDDEN_NAME, so we
	   * need to monkey patch Proxy.create, Proxy.createFunction, etc, in
	   * order to wrap the provided handler with the real handler which
	   * filters out all traps using HIDDEN_NAME.
	   *
	   * <p>TODO(erights): Revisit Mike Stay's suggestion that we use an
	   * encapsulated function at a not-necessarily-secret name, which
	   * uses the Stiegler shared-state rights amplification pattern to
	   * reveal the associated value only to the WeakMap in which this key
	   * is associated with that value. Since only the key retains the
	   * function, the function can also remember the key without causing
	   * leakage of the key, so this doesn't violate our general gc
	   * goals. In addition, because the name need not be a guarded
	   * secret, we could efficiently handle cross-frame frozen keys.
	   */
	  var HIDDEN_NAME_PREFIX = 'weakmap:';
	  var HIDDEN_NAME = HIDDEN_NAME_PREFIX + 'ident:' + Math.random() + '___';

	  if (typeof crypto !== 'undefined' &&
	      typeof crypto.getRandomValues === 'function' &&
	      typeof ArrayBuffer === 'function' &&
	      typeof Uint8Array === 'function') {
	    var ab = new ArrayBuffer(25);
	    var u8s = new Uint8Array(ab);
	    crypto.getRandomValues(u8s);
	    HIDDEN_NAME = HIDDEN_NAME_PREFIX + 'rand:' +
	      Array.prototype.map.call(u8s, function(u8) {
	        return (u8 % 36).toString(36);
	      }).join('') + '___';
	  }

	  function isNotHiddenName(name) {
	    return !(
	        name.substr(0, HIDDEN_NAME_PREFIX.length) == HIDDEN_NAME_PREFIX &&
	        name.substr(name.length - 3) === '___');
	  }

	  /**
	   * Monkey patch getOwnPropertyNames to avoid revealing the
	   * HIDDEN_NAME.
	   *
	   * <p>The ES5.1 spec requires each name to appear only once, but as
	   * of this writing, this requirement is controversial for ES6, so we
	   * made this code robust against this case. If the resulting extra
	   * search turns out to be expensive, we can probably relax this once
	   * ES6 is adequately supported on all major browsers, iff no browser
	   * versions we support at that time have relaxed this constraint
	   * without providing built-in ES6 WeakMaps.
	   */
	  defProp(Object, 'getOwnPropertyNames', {
	    value: function fakeGetOwnPropertyNames(obj) {
	      return gopn(obj).filter(isNotHiddenName);
	    }
	  });

	  /**
	   * getPropertyNames is not in ES5 but it is proposed for ES6 and
	   * does appear in our whitelist, so we need to clean it too.
	   */
	  if ('getPropertyNames' in Object) {
	    var originalGetPropertyNames = Object.getPropertyNames;
	    defProp(Object, 'getPropertyNames', {
	      value: function fakeGetPropertyNames(obj) {
	        return originalGetPropertyNames(obj).filter(isNotHiddenName);
	      }
	    });
	  }

	  /**
	   * <p>To treat objects as identity-keys with reasonable efficiency
	   * on ES5 by itself (i.e., without any object-keyed collections), we
	   * need to add a hidden property to such key objects when we
	   * can. This raises several issues:
	   * <ul>
	   * <li>Arranging to add this property to objects before we lose the
	   *     chance, and
	   * <li>Hiding the existence of this new property from most
	   *     JavaScript code.
	   * <li>Preventing <i>certification theft</i>, where one object is
	   *     created falsely claiming to be the key of an association
	   *     actually keyed by another object.
	   * <li>Preventing <i>value theft</i>, where untrusted code with
	   *     access to a key object but not a weak map nevertheless
	   *     obtains access to the value associated with that key in that
	   *     weak map.
	   * </ul>
	   * We do so by
	   * <ul>
	   * <li>Making the name of the hidden property unguessable, so "[]"
	   *     indexing, which we cannot intercept, cannot be used to access
	   *     a property without knowing the name.
	   * <li>Making the hidden property non-enumerable, so we need not
	   *     worry about for-in loops or {@code Object.keys},
	   * <li>monkey patching those reflective methods that would
	   *     prevent extensions, to add this hidden property first,
	   * <li>monkey patching those methods that would reveal this
	   *     hidden property.
	   * </ul>
	   * Unfortunately, because of same-origin iframes, we cannot reliably
	   * add this hidden property before an object becomes
	   * non-extensible. Instead, if we encounter a non-extensible object
	   * without a hidden record that we can detect (whether or not it has
	   * a hidden record stored under a name secret to us), then we just
	   * use the key object itself to represent its identity in a brute
	   * force leaky map stored in the weak map, losing all the advantages
	   * of weakness for these.
	   */
	  function getHiddenRecord(key) {
	    if (key !== Object(key)) {
	      throw new TypeError('Not an object: ' + key);
	    }
	    var hiddenRecord = key[HIDDEN_NAME];
	    if (hiddenRecord && hiddenRecord.key === key) { return hiddenRecord; }
	    if (!isExtensible(key)) {
	      // Weak map must brute force, as explained in doc-comment above.
	      return void 0;
	    }
	    var gets = [];
	    var vals = [];
	    hiddenRecord = {
	      key: key,   // self pointer for quick own check above.
	      gets: gets, // get___ methods identifying weak maps
	      vals: vals  // values associated with this key in each
	                  // corresponding weak map.
	    };
	    defProp(key, HIDDEN_NAME, {
	      value: hiddenRecord,
	      writable: false,
	      enumerable: false,
	      configurable: false
	    });
	    return hiddenRecord;
	  }


	  /**
	   * Monkey patch operations that would make their argument
	   * non-extensible.
	   *
	   * <p>The monkey patched versions throw a TypeError if their
	   * argument is not an object, so it should only be done to functions
	   * that should throw a TypeError anyway if their argument is not an
	   * object.
	   */
	  (function(){
	    var oldFreeze = Object.freeze;
	    defProp(Object, 'freeze', {
	      value: function identifyingFreeze(obj) {
	        getHiddenRecord(obj);
	        return oldFreeze(obj);
	      }
	    });
	    var oldSeal = Object.seal;
	    defProp(Object, 'seal', {
	      value: function identifyingSeal(obj) {
	        getHiddenRecord(obj);
	        return oldSeal(obj);
	      }
	    });
	    var oldPreventExtensions = Object.preventExtensions;
	    defProp(Object, 'preventExtensions', {
	      value: function identifyingPreventExtensions(obj) {
	        getHiddenRecord(obj);
	        return oldPreventExtensions(obj);
	      }
	    });
	  })();


	  function constFunc(func) {
	    func.prototype = null;
	    return Object.freeze(func);
	  }

	  // Right now (12/25/2012) the histogram supports the current
	  // representation. We should check this occasionally, as a true
	  // constant time representation is easy.
	  // var histogram = [];

	  var OurWeakMap = function() {
	    // We are currently (12/25/2012) never encountering any prematurely
	    // non-extensible keys.
	    var keys = []; // brute force for prematurely non-extensible keys.
	    var vals = []; // brute force for corresponding values.

	    function get___(key, opt_default) {
	      var hr = getHiddenRecord(key);
	      var i, vs;
	      if (hr) {
	        i = hr.gets.indexOf(get___);
	        vs = hr.vals;
	      } else {
	        i = keys.indexOf(key);
	        vs = vals;
	      }
	      return (i >= 0) ? vs[i] : opt_default;
	    }

	    function has___(key) {
	      var hr = getHiddenRecord(key);
	      var i;
	      if (hr) {
	        i = hr.gets.indexOf(get___);
	      } else {
	        i = keys.indexOf(key);
	      }
	      return i >= 0;
	    }

	    function set___(key, value) {
	      var hr = getHiddenRecord(key);
	      var i;
	      if (hr) {
	        i = hr.gets.indexOf(get___);
	        if (i >= 0) {
	          hr.vals[i] = value;
	        } else {
	//          i = hr.gets.length;
	//          histogram[i] = (histogram[i] || 0) + 1;
	          hr.gets.push(get___);
	          hr.vals.push(value);
	        }
	      } else {
	        i = keys.indexOf(key);
	        if (i >= 0) {
	          vals[i] = value;
	        } else {
	          keys.push(key);
	          vals.push(value);
	        }
	      }
	    }

	    function delete___(key) {
	      var hr = getHiddenRecord(key);
	      var i;
	      if (hr) {
	        i = hr.gets.indexOf(get___);
	        if (i >= 0) {
	          hr.gets.splice(i, 1);
	          hr.vals.splice(i, 1);
	        }
	      } else {
	        i = keys.indexOf(key);
	        if (i >= 0) {
	          keys.splice(i, 1);
	          vals.splice(i, 1);
	        }
	      }
	      return true;
	    }

	    return Object.create(OurWeakMap.prototype, {
	      get___:    { value: constFunc(get___) },
	      has___:    { value: constFunc(has___) },
	      set___:    { value: constFunc(set___) },
	      delete___: { value: constFunc(delete___) }
	    });
	  };
	  OurWeakMap.prototype = Object.create(Object.prototype, {
	    get: {
	      /**
	       * Return the value most recently associated with key, or
	       * opt_default if none.
	       */
	      value: function get(key, opt_default) {
	        return this.get___(key, opt_default);
	      },
	      writable: true,
	      configurable: true
	    },

	    has: {
	      /**
	       * Is there a value associated with key in this WeakMap?
	       */
	      value: function has(key) {
	        return this.has___(key);
	      },
	      writable: true,
	      configurable: true
	    },

	    set: {
	      /**
	       * Associate value with key in this WeakMap, overwriting any
	       * previous association if present.
	       */
	      value: function set(key, value) {
	        this.set___(key, value);
	      },
	      writable: true,
	      configurable: true
	    },

	    'delete': {
	      /**
	       * Remove any association for key in this WeakMap, returning
	       * whether there was one.
	       *
	       * <p>Note that the boolean return here does not work like the
	       * {@code delete} operator. The {@code delete} operator returns
	       * whether the deletion succeeds at bringing about a state in
	       * which the deleted property is absent. The {@code delete}
	       * operator therefore returns true if the property was already
	       * absent, whereas this {@code delete} method returns false if
	       * the association was already absent.
	       */
	      value: function remove(key) {
	        return this.delete___(key);
	      },
	      writable: true,
	      configurable: true
	    }
	  });

	  if (typeof HostWeakMap === 'function') {
	    (function() {
	      // If we got here, then the platform has a WeakMap but we are concerned
	      // that it may refuse to store some key types. Therefore, make a map
	      // implementation which makes use of both as possible.

	      function DoubleWeakMap() {
	        // Preferable, truly weak map.
	        var hmap = new HostWeakMap();

	        // Our hidden-property-based pseudo-weak-map. Lazily initialized in the
	        // 'set' implementation; thus we can avoid performing extra lookups if
	        // we know all entries actually stored are entered in 'hmap'.
	        var omap = undefined;

	        // Hidden-property maps are not compatible with proxies because proxies
	        // can observe the hidden name and either accidentally expose it or fail
	        // to allow the hidden property to be set. Therefore, we do not allow
	        // arbitrary WeakMaps to switch to using hidden properties, but only
	        // those which need the ability, and unprivileged code is not allowed
	        // to set the flag.
	        var enableSwitching = false;

	        function dget(key, opt_default) {
	          if (omap) {
	            return hmap.has(key) ? hmap.get(key)
	                : omap.get___(key, opt_default);
	          } else {
	            return hmap.get(key, opt_default);
	          }
	        }

	        function dhas(key) {
	          return hmap.has(key) || (omap ? omap.has___(key) : false);
	        }

	        function dset(key, value) {
	          if (enableSwitching) {
	            try {
	              hmap.set(key, value);
	            } catch (e) {
	              if (!omap) { omap = new OurWeakMap(); }
	              omap.set___(key, value);
	            }
	          } else {
	            hmap.set(key, value);
	          }
	        }

	        function ddelete(key) {
	          hmap['delete'](key);
	          if (omap) { omap.delete___(key); }
	        }

	        return Object.create(OurWeakMap.prototype, {
	          get___:    { value: constFunc(dget) },
	          has___:    { value: constFunc(dhas) },
	          set___:    { value: constFunc(dset) },
	          delete___: { value: constFunc(ddelete) },
	          permitHostObjects___: { value: constFunc(function(token) {
	            if (token === weakMapPermitHostObjects) {
	              enableSwitching = true;
	            } else {
	              throw new Error('bogus call to permitHostObjects___');
	            }
	          })}
	        });
	      }
	      DoubleWeakMap.prototype = OurWeakMap.prototype;
	      module.exports = DoubleWeakMap;

	      // define .constructor to hide OurWeakMap ctor
	      Object.defineProperty(WeakMap.prototype, 'constructor', {
	        value: WeakMap,
	        enumerable: false,  // as default .constructor is
	        configurable: true,
	        writable: true
	      });
	    })();
	  } else {
	    // There is no host WeakMap, so we must use the emulation.

	    // Emulated WeakMaps are incompatible with native proxies (because proxies
	    // can observe the hidden name), so we must disable Proxy usage (in
	    // ArrayLike and Domado, currently).
	    if (typeof Proxy !== 'undefined') {
	      Proxy = undefined;
	    }

	    module.exports = OurWeakMap;
	  }
	})();


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var WeakMap = __webpack_require__(53);
	var List = __webpack_require__(39);

	module.exports = MapChanges;
	function MapChanges() {
	    throw new Error("Can't construct. MapChanges is a mixin.");
	}

	var object_owns = Object.prototype.hasOwnProperty;

	/*
	    Object map change descriptors carry information necessary for adding,
	    removing, dispatching, and shorting events to listeners for map changes
	    for a particular key on a particular object.  These descriptors are used
	    here for shallow map changes.

	    {
	        willChangeListeners:Array(Function)
	        changeListeners:Array(Function)
	    }
	*/

	var mapChangeDescriptors = new WeakMap();

	MapChanges.prototype.getAllMapChangeDescriptors = function () {
	    var Dict = __webpack_require__(50);
	    if (!mapChangeDescriptors.has(this)) {
	        mapChangeDescriptors.set(this, Dict());
	    }
	    return mapChangeDescriptors.get(this);
	};

	MapChanges.prototype.getMapChangeDescriptor = function (token) {
	    var tokenChangeDescriptors = this.getAllMapChangeDescriptors();
	    token = token || "";
	    if (!tokenChangeDescriptors.has(token)) {
	        tokenChangeDescriptors.set(token, {
	            willChangeListeners: new List(),
	            changeListeners: new List()
	        });
	    }
	    return tokenChangeDescriptors.get(token);
	};

	MapChanges.prototype.addMapChangeListener = function (listener, token, beforeChange) {
	    if (!this.isObservable && this.makeObservable) {
	        // for Array
	        this.makeObservable();
	    }
	    var descriptor = this.getMapChangeDescriptor(token);
	    var listeners;
	    if (beforeChange) {
	        listeners = descriptor.willChangeListeners;
	    } else {
	        listeners = descriptor.changeListeners;
	    }
	    listeners.push(listener);
	    Object.defineProperty(this, "dispatchesMapChanges", {
	        value: true,
	        writable: true,
	        configurable: true,
	        enumerable: false
	    });

	    var self = this;
	    return function cancelMapChangeListener() {
	        if (!self) {
	            // TODO throw new Error("Can't remove map change listener again");
	            return;
	        }
	        self.removeMapChangeListener(listener, token, beforeChange);
	        self = null;
	    };
	};

	MapChanges.prototype.removeMapChangeListener = function (listener, token, beforeChange) {
	    var descriptor = this.getMapChangeDescriptor(token);

	    var listeners;
	    if (beforeChange) {
	        listeners = descriptor.willChangeListeners;
	    } else {
	        listeners = descriptor.changeListeners;
	    }

	    var node = listeners.findLast(listener);
	    if (!node) {
	        throw new Error("Can't remove listener: does not exist.");
	    }
	    node["delete"]();
	};

	MapChanges.prototype.dispatchMapChange = function (key, value, beforeChange) {
	    var descriptors = this.getAllMapChangeDescriptors();
	    var changeName = "Map" + (beforeChange ? "WillChange" : "Change");
	    descriptors.forEach(function (descriptor, token) {

	        if (descriptor.isActive) {
	            return;
	        } else {
	            descriptor.isActive = true;
	        }

	        var listeners;
	        if (beforeChange) {
	            listeners = descriptor.willChangeListeners;
	        } else {
	            listeners = descriptor.changeListeners;
	        }

	        var tokenName = "handle" + (
	            token.slice(0, 1).toUpperCase() +
	            token.slice(1)
	        ) + changeName;

	        try {
	            // dispatch to each listener
	            listeners.forEach(function (listener) {
	                if (listener[tokenName]) {
	                    listener[tokenName](value, key, this);
	                } else if (listener.call) {
	                    listener.call(listener, value, key, this);
	                } else {
	                    throw new Error("Handler " + listener + " has no method " + tokenName + " and is not callable");
	                }
	            }, this);
	        } finally {
	            descriptor.isActive = false;
	        }

	    }, this);
	};

	MapChanges.prototype.addBeforeMapChangeListener = function (listener, token) {
	    return this.addMapChangeListener(listener, token, true);
	};

	MapChanges.prototype.removeBeforeMapChangeListener = function (listener, token) {
	    return this.removeMapChangeListener(listener, token, true);
	};

	MapChanges.prototype.dispatchBeforeMapChange = function (key, value) {
	    return this.dispatchMapChange(key, value, true);
	};



/***/ }
/******/ ])
});
;