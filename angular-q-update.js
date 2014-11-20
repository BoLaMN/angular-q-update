'use strict';
angular.module('angular-q-update', []).config(function($provide) {
  return $provide.decorator('$q', function($delegate) {
    var decoratePromise, _defer;
    _defer = $delegate.defer;
    decoratePromise = function(deferred) {
      var promise, _then;
      promise = deferred.promise;
      _then = promise.then;
      promise.then = function() {
        var newPromise;
        newPromise = _then.apply(promise, arguments);
        newPromise.update = promise.update;
        newPromise.mistake = promise.mistake;
        return newPromise;
      };
      promise.update = function(callback) {
        deferred._updateCallbacks.push(callback);
        return promise;
      };
      promise.mistake = function(callback) {
        deferred._mistakeCallbacks.push(callback);
        return promise;
      };
      return promise;
    };
    $delegate.defer = function() {
      var deferred, _reject, _resolve;
      deferred = _defer();
      deferred.isResolved = false;
      deferred.isRejected = false;
      deferred._updateCallbacks = [];
      deferred._mistakeCallbacks = [];
      decoratePromise(deferred);
      _resolve = deferred.resolve;
      _reject = deferred.reject;
      deferred.resolve = function() {
        var i, _results;
        if (deferred.isResolved && !deferred.isRejected) {
          _results = [];
          for (i in deferred._updateCallbacks) {
            _results.push(deferred._updateCallbacks[i].apply({}, arguments));
          }
          return _results;
        } else {
          deferred.isResolved = true;
          return _resolve.apply(deferred, arguments);
        }
      };
      deferred.reject = function() {
        var i, _results;
        if (deferred.isResolved) {
          _results = [];
          for (i in deferred._mistakeCallbacks) {
            _results.push(deferred._mistakeCallbacks[i].apply({}, arguments));
          }
          return _results;
        } else {
          deferred.isRejected = true;
          return _reject.apply(deferred, arguments);
        }
      };
      return deferred;
    };
    return $delegate;
  });
});
