/**
 * @fileOverview mmath math function evaluator.
 * @module mMath/MMath
 * @description
 * mmath wrappers the mathjs package to provide mmeddle specific
 *  typing, to return symbolic expressions whenever an function is not yet
 *  resolved to a constant value and to perform unit conversions.
 * @credits
 * mmath makes extensive use of the truly excellent mathjs package by 
 *   Jos de Jong <wjosdejong@gmail.com> (https://github.com/josdejong) for 
 *   numerical evaluation, and significant code and ideas from mathjs have
 *    been hacked into mmeddle.
 */ 
'use strict';
module.exports = function registerMmath(mm) {
  var math = require('mathjs');
  var BigNumber = math.bignumber;
  var LOW = mm.check(mm.Logger.Priority.LOW);  

  math.config({
    number: 'bignumber', // Default type of number: 'number' (default) or 'bignumber'
    precision: 64        // Number of significant digits for BigNumbers
  });  

  var MMath = (function mMathCtorCtor() {
    // Any static data for all mMath goes here.
  
    var MMath = function mMathCtor() {
      var mmath = this;
      mmath.E       = { constant: Math.E, 
              desc: 'The mathematical constant e. This is Euler\'s number,' +
                    'the base of natural logarithms.' };
      mmath.LN2     = { constant: Math.LN2, 
              desc: 'The natural logarithm of 2' };
      mmath.LN10    = { constant: Math.LN10, 
              desc: 'The natural logarithm of 10' };
      mmath.LOG2E   = { constant: Math.LOG2E, 
              desc: 'The base-2 logarithm of e' };
      mmath.LOG10E  = { constant: Math.LOG10E, 
              desc: 'The base-10 logarithm of e' };
      mmath.PI      = { constant: Math.PI, 
              desc: 'Pi. This is the ratio of the circumference of a circle ' + 
                    'to its diameter' };
      mmath.SQRT1_2 = { constant: Math.SQRT1_2, 
              desc: 'The square root of 0.5, or, equivalently, one divided by ' +
                    'the square root of 2' };
      mmath.SQRT2   = { constant: Math.SQRT2, 
              desc: 'The square root of 2' };
      mmath.abs     = { func: Math.abs, 
              desc: 'Returns the absolute value of a number.' };
      mmath.acos    = { func: Math.acos, 
              desc: 'Returns the arccosine of a number.' };
      mmath.asin    = { func: Math.asin, 
              desc: 'Returns the arcsine of a number.' };
      mmath.atan    = { func: Math.atan, 
              desc: 'Returns the arctangent of a number.' };
      mmath.atan2   = { func: Math.atan2, 
              desc: 'Returns the angle (in radians) from the X axis to a point ' +
                    'represented by the supplied y and x coordinates.' }; 
      mmath.ceil    = { func: Math.ceil, 
              desc: 'Returns the smallest integer that ' +
                    'is greater than or equal to the supplied numeric expression.' };
      mmath.cos     = { func: Math.cos, 
              desc: 'Returns the cosine of a number.' };
      mmath.exp     = { func: Math.exp, 
              desc: 'Returns e (the base of natural logarithms) raised to a power.' };
      mmath.floor   = { func: Math.floor, 
              desc: 'Returns the greatest integer that is less than or equal to ' +
                    'the supplied numeric expression.' };
      mmath.log     = { func: Math.log, 
              desc: 'Returns the natural logarithm of a number.' };
      mmath.max     = { func: Math.max, 
              desc: 'Returns the greater of two supplied numeric expressions.' };
      mmath.min     = { func: Math.min, 
              desc: 'Returns the lesser of two supplied numbers.' };
      mmath.pow     = { func: Math.pow, 
              desc: 'Returns the value of a base expression raised to a ' + 
                    'specified power.' };
      mmath.random  = { func: Math.random, 
              desc: 'Returns a pseudorandom number between 0 and 1.' };
      mmath.round   = { func: Math.round, 
              desc: 'Returns a specified numeric expression rounded to ' + 
                    'the nearest integer.' };
      mmath.sin     = { func: Math.sin,
              desc: 'Returns the sine of a number.' };
      mmath.sqrt    = { func: Math.sqrt, 
              desc: 'Returns the square root of a number.' };
      mmath.tan     = { func: Math.tan, 
              desc: 'Returns the tangent of a number.' };

      // Dangerous simple truncation of input. Will fail miserably
      // when exponents are in the mix.
      var newBigNumberUnsafe = function (xin) {
        return new BigNumber(xin.toString().substring(0, 15));
      }

      // Memoized big number factorial.
      var factorial = (function factorialCtor() {
        var f = [1, 1];
        var i = 2;
        return function _factorial (n) {
          if (f[n] > 0) return f[n];
          var result = f[i-1]; // get the highest memoized result.
          for (; i <= n; i++) f[i] = result = result * i;
          return result;
        }
      }())

      // Memoized simple number factorial.
      var bnFactorial = (function bnFactorialCtor() {
        var f = [new BigNumber('1'), new BigNumber('1')];
        var i = 2;
        return function bn_factorial(n)
        {
          if (typeof f[n] !== 'undefined') return f[n];
          var result = f[i-1];
          for (; i <= n; i++) f[i] = result = math.multiply(result, i);
          return result;
        }
      }())
      
      // Takes about 8 iterations to converge on the same result as Math.sin
      // with a typical delta under 3E-16.  Note this is a direct implementation
      // of the taylor series without optimization.  An intelligent version
      // would take advantage of the work done in the prior iteration. Even
      // the factorial can be avoided that way.
      // sin(x) = x - x^3/3! + x^5/5! - x^7/7! + x^9/9! - ...
      mmath.sin.real = function sin(x) {
        mm.log.debug('- Taylor series version of sine function for (', x, ')', LOW);
        function nodd(n) { return (n % 2 === 0) ? 1 : -1 }
        function t(x, n) { return Math.pow(x, n) / factorial(n) }
        function s(n) { return nodd((n - 1) / 2) }
        var result = x;
        var lastResult = x;
        var n = 1;
        var i = 0;
        var unchanged = false;
        do {
          lastResult = result;
          n += 2;
          i++;
          var tn = t(x, n);
          result += s(n) * tn;
          mm.log.debug('--- sin(', x, ') i=', i, 'tn=', tn,
              'lastr=', lastResult, 'r=', result, LOW);
          unchanged = result === lastResult;
        } while (!unchanged);
        var msin = Math.sin(x);
        mm.log.debug('- real.sin(', result, ') Math.sin=', msin,
            'delta=', Math.abs(result - msin), LOW);
        return result;    
      }
      
      // Takes about 23 iterations to converge on the same result as Math.sin.
      // Since decimal inputs are limited to 15 significant digits, the delta
      // is less than 10e-14.
      // Note this is a direct implementation of the taylor series without
      //  optimization.  An intelligent version would take advantage of the 
      // work done in the prior iteration. Even the factorial can be avoided.  
      // sin(x) = x - x^3/3! + x^5/5! - x^7/7! + x^9/9! - ...
      mmath.sin.big = function bn_sin(xin) {
        var x = new BigNumber(xin.toString().substring(0, 15));
        mm.log.debug(
            '- Taylor series version of BigNumber sine function for ({0})',
            x, LOW);
        function nodd(n) { return (n % 2 === 0) ? 1 : -1 }
        function s(n) { return nodd((n - 1) / 2) }
        function t(x, n) { 
          return math.divide(math.pow(x, n), bnFactorial(n));
        }
        
        var result = x;
        var lastResult;
        var n = 1;
        var i = 0;
        var unchanged = false;
        do {
          n += 2;
          i++;
          lastResult = result;    
          var tn = t(x, n);
          mm.log.debug('--- sin({0}) i={1} tn={2} lastr={3} r={4}',
              x, i, tn, lastResult, result, LOW);
          if (s(n) < 0) result = math.subtract(result, tn)
                   else result = math.add(result, tn);
          unchanged = result.equals(lastResult);        
        } while (!unchanged);
        var msin = newBigNumberUnsafe(Math.sin(xin));
        mm.log.debug('- big.sin({0}) Math.sin={1} delta={2}', 
           result, msin, math.abs(math.subtract(result, msin)),
           LOW);
        return result;    
      }
      
      mmath.sin.f = mmath.sin.real; // default implementation for real values.

    } // End of constructor for access to constructor closure.

    return MMath;
  }()); // Run constructor initializer for static creations.

  return MMath;
}  
