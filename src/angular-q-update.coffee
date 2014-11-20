'use strict'

angular.module 'ng-q-update', []

.config ($provide) ->

  $provide.decorator '$q', ($delegate) ->
    _defer = $delegate.defer

    decoratePromise = (deferred) ->
      promise = deferred.promise

      _then = promise.then

      promise.then = ->
        newPromise = _then.apply promise, arguments
        newPromise.update = promise.update
        newPromise.mistake = promise.mistake
        newPromise

      promise.update = (callback) ->
        deferred._updateCallbacks.push callback
        promise

      promise.mistake = (callback) ->
        deferred._mistakeCallbacks.push callback
        promise

      promise

    $delegate.defer = ->
      deferred = _defer()

      deferred.isResolved = false
      deferred.isRejected = false

      deferred._updateCallbacks = []
      deferred._mistakeCallbacks = []

      decoratePromise deferred

      _resolve = deferred.resolve
      _reject = deferred.reject

      deferred.resolve = ->
        if deferred.isResolved and not deferred.isRejected
          for i of deferred._updateCallbacks
            deferred._updateCallbacks[i].apply {}, arguments
        else
          deferred.isResolved = true
          _resolve.apply deferred, arguments

      deferred.reject = ->
        if deferred.isResolved
          for i of deferred._mistakeCallbacks
            deferred._mistakeCallbacks[i].apply {}, arguments
        else
          deferred.isRejected = true
          _reject.apply deferred, arguments

      deferred

    $delegate