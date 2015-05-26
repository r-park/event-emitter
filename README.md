[![Build Status](https://travis-ci.org/r-park/event-emitter.svg?branch=master)](https://travis-ci.org/r-park/event-emitter)
# EventEmitter
An EventEmitter for browser environments.

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

## Examples
```javascript
var scope = {listener: function(){}};

// EventEmitter must be initialized with one or more event types
var eventTypes = ['create', 'save'];
var emitter = new EventEmitter(eventTypes);

// basic add
emitter.addListener('create', function(){});

// add for one iteration
emitter.addListenerOnce('create', function(){});

// add with scope for `this`
emitter.addListenerOnce('create', scope.listener, scope);

// attempt to add a listener to non-existent event type
emitter.addListener('foo', function(){}); //=> throws Error

// chaining
emitter
  .addListener('save', scope.listener, scope)
  .emit('save', {status: 'success'})
  .emit('create')
  .removeListener('save', scope.listener)
  .listenerCount('save'); // 0

// remove all listeners for all provided event type
emitter.removeAllListeners('save');

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

## License
EventEmitter is free to use under the [open-source MIT license](https://github.com/r-park/event-emitter/blob/master/LICENSE).
