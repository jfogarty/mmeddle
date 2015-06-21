'use strict';
/**
 * @file General utility functions for Date and Time
 * @module util/utility
 */
module.exports = function registerDateTimeUtilities(util, mm) {
  
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
    if (mm._.isNumber(date) || mm._.isString(date)) date = new Date(date);
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
    if (mm._.isNumber(date) || mm._.isString(date)) date = new Date(date);    
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
    if (mm._.isNumber(date) || mm._.isString(date)) date = new Date(date);    
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
   * @returns {string} yymmdd|hh:mm:dd formated date time stamp.
   * @alias module:utils/utility.timestamp
   */
  mm.util.timestamp = function(date) {
    return mm.util.yymmdd(date) + '|' + mm.util.hhmmss(date)
  }
  
  /**
   * @summary **Get a month as a text name**
   * @description
   * If no month name list is supplied, the english full month names are used.
   * @param {Date} date a date or valid date constructor argument.
   * @param {array} monthList an optional array of month names.
   * @returns {string} the month found in the date as a name.
   * @alias module:utils/utility.monthName
   */
  mm.util.monthName = function monthName(date, monthList) {
    var monthNames = monthList ? monthList : 
        ['January',   'February', 'March',    'April',
         'May',       'June',     'July',     'August', 
         'September', 'October',  'November', 'December'];
    var thisDate = new Date(date);
    return monthNames[thisDate.getMonth()];
  }

  /**
   * @summary **Get a month as a 3 character text name**
   * @param {Date} date a date or valid date constructor argument.
   * @returns {string} the month found in the date (i.e. 'Feb').
   * @alias module:utils/utility.monthName3
   */
  mm.util.monthName3 = function monthName3(date, monthList) {
    var monthNames = monthList ? monthList : 
        ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return mm.util.monthName(date, monthNames);
  }

  /**
   * @summary **Get a weekday as a text name**
   * @description
   * The optional day of month will be replaced in the date, to determine
   * the actual day of the week. If no day name list is supplied, the 
   * english full weekday names are used.
   * @param {Date} date a date or valid date constructor argument.
   * @param {number} dayOfMonth an optional day of month.
   * @param {array} dayList an optional array of day names.
   * @returns {string} the weekday of the date (i.e. 'Tue').
   * @alias module:utils/utility.weekday
   */
  mm.util.weekday = function weekday(date, dayOfMonth, dayList) {
    var dayNames = dayList ? dayList : ['Sunday', 'Monday', 'Tuesday',
        'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var thisDate = new Date(date);
    if (dayOfMonth) thisDate.setDate(dayOfMonth);
    return dayNames[thisDate.getDay()];
  }

  /**
   * @summary **Get a weekday as a 3 character text name**
   * @description
   * The optional day of month will be replaced in the date, to determine
   * the actual day of the week.
   * @param {Date} date a date or valid date constructor argument.
   * @param {number} dayOfMonth an optional day of month (overrides in date).
   * @returns {string} the weekday of the date (i.e. 'Tue').
   * @alias module:utils/utility.weekday3
   */
  mm.util.weekday3 = function weekday3(date, dayOfMonth) {
    var weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return mm.util.weekday(date, dayOfMonth, weekDays);
  }
  
}
