[![Build Status](https://travis-ci.org/r-park/event-emitter.svg?branch=master)](https://travis-ci.org/r-park/event-emitter)
[![Coverage Status](https://coveralls.io/repos/r-park/event-emitter/badge.svg)](https://coveralls.io/r/r-park/event-emitter)
# EventEmitter
An EventEmitter for browser environments.

## Using EventEmitter
```javascript
var scope = {listener: function(){}};

// EventEmitter must be initialized with one or more event types
var eventTypes = ['create', 'update', 'complete'];
var emitter = new EventEmitter(eventTypes);

// add a listener
emitter.addListener('create', function(){});

// add a listener with alias `on`
emitter.on('create', function(){});

// add a listener for one iteration by passing `true` as last param
emitter.addListener('create', function(){}, true);

// add a listener with scope for `this`
emitter.addListenerOnce('create', scope.listener, scope);

// add a listener with scope, for one iteration
emitter.addListenerOnce('create', scope.listener, scope, true);

// attempting to add a listener to non-existent event type
emitter.addListener('foo', function(){}); //=> throws Error

// chaining
emitter
  .addListener('update', scope.listener, scope)
  .emit('update', {status: 'success'})
  .emit('complete')
  .removeListener('update', scope.listener)
  .listenerCount('update');

// remove all listeners for provided event type
emitter.removeAllListeners('create');

// remove all listeners for all event types
emitter.removeAllListeners();
```

## Develop
Lint:
```
gulp lint
```
Execute test suites:
```
gulp test
```
With coverage:
```
gulp test --coverage
```
Build:
```
gulp build
```

## Browser Support
- Chrome 
- Firefox 
- IE 9+ 
- IE 8 with [es5-shim](https://github.com/es-shims/es5-shim)
- Safari

## Module Support
- AMD
- CommonJS
- Browser global

## License
EventEmitter is free to use under the [open-source MIT license](https://github.com/r-park/event-emitter/blob/master/LICENSE).
