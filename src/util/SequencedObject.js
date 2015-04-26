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