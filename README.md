# angular-q-update

> Adds .update and .mistake method to promises returned by Angular $q service

## Example

```js
// module('my module', ['ng-q-update'])

foo()
.then(function () {
  // foo has finished ok
}, function (msg) {
  // foo has failed.
})
.update(function () {
  // foo has updated ok
});
```

Rewritten from [DeferredWithUpdate.js](https://github.com/bennadel/DeferredWithUpdate.js), I have
rewritten to be a $decorator service to add .update and .mistake method to promises returned by the [$q](https://docs.angularjs.org/api/ng/service/$q)
service.

## Install

include the script after angular

    <script src="bower_components/angular/angular.js"></script>
    <script src="ng-q-update.js"></script>

add `ng-q-update` module as a dependency to your application

    angular.module('Example', ['ng-q-update'])

### Small print

Author: BoLaMN

Support: if you find any problems with this module, [open issue](https://github.com/bolamn/angular-q-update/issues) on Github