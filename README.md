[![Build Status](https://travis-ci.org/r-park/event-emitter.svg?branch=master)](https://travis-ci.org/r-park/event-emitter)
[![Coverage Status](https://coveralls.io/repos/r-park/event-emitter/badge.svg?branch=master)](https://coveralls.io/r/r-park/event-emitter?branch=master)

# EventEmitter
An EventEmitter for browser environments.

## Example
### Standalone
```javascript
var listener = function(){};

// EventEmitter must be initialized with one or more event types
var eventTypes = ['create', 'update', 'complete'];

// `Emitter` factory returns an EventEmitter instance
var emitter = Emitter(eventTypes);

emitter
  .addListener('update', listener)
  .emit('update', {status: 'success'})
  .removeListener('update', listener);
```

### Extending
```javascript
var listener = function(){};
var myObj = {};

// EventEmitter must be initialized with one or more event types
var eventType = 'update';

// Add emitter functions to `myObj`
Emitter(eventType, myObj);

myObj
  .addListener('update', listener)
  .emit('update', {status: 'success'})
  .removeListener('update', listener);
```

## Emitter(eventTypes, [object])
Factory method for creating EventEmitter instances. `Emitter` must be called with one or more `eventTypes` which will be registered to the instance. Attempting to add/remove/emit with an unregistered event type will throw an Error.

Param          | Type                 |Description
---------------|----------------------|---------------------------------------------------
eventTypes     | Array<br>String      | The event types that will be supported by this EventEmitter instance
object         | Object               | Optional object to be extended with emitter functions

```javascript
// creating standalone emitters
var emitter1 = Emitter(['create', 'update']);
var emitter2 = Emitter('save');

// extending an object with emitter functions
var myObj = {};
Emitter('update', myObj);
myObj.emit('update');
```

## addListener(type, listener)
Add a `listener` to the event `type`.

Returns the EventEmitter instance.

Param          | Type          |Description
---------------|---------------|---------------------------------------------------
type           | String        | The event type to listen on
listener       | Function      | The listener function
```javascript
emitter.addListener('created', function(){});

// alternatively, use alias `on`
emitter.on('create', function(){});
```

## addListener(type, listener, scope)
Add a `listener` to the event `type`, passing an optional `scope` object that will be `this` from inside the listener function. If `scope` is not provided, `listener` will be called within an anonymous {} scope.

Returns the EventEmitter instance.

Param          | Type          |Description
---------------|---------------|---------------------------------------------------
type           | String        | The event type to listen on
listener       | Function      | The listener function
scope          | Object        | Optional; the scope that will be `this` inside the listener function
```javascript
var scope = {
  listener: function(){}
};

emitter.addListener('created', scope.listener, scope);
emitter.on('created', scope.listener, scope);
```

## addListener(type, listener, once)
Add a `listener` to the event `type`. Passing an optional `true` for `once` will automatically remove the listener after one call.

Returns the EventEmitter instance.

Param          | Type          | Description
---------------|---------------|---------------------------------------------------
type           | String        | The event type to listen on
listener       | Function      | The listener function
once           | boolean       | Optional; if `true`, listener will be removed after one call
```javascript
emitter.addListener('created', function(){}, true);
emitter.on('created', function(){}, true);
```

## addListener(type, listener, scope, once)
Add a `listener` to the event `type`, passing an optional `scope` object that will be `this` from inside the listener function, and optional `true` for `once` to automatically remove the listener after one call.

Returns the EventEmitter instance.

Param          | Type          | Description
---------------|---------------|---------------------------------------------------
type           | String        | The event type to listen on
listener       | Function      | The listener function
scope          | Object        | Optional; the scope that will be `this` inside the listener function
once           | boolean       | Optional; if `true`, listener will be removed after one call
```javascript
var scope = {
  listener: function(){}
};

emitter.addListener('created', scope.listener, scope, true);
emitter.on('created', scope.listener, scope, true);
```

## emit(type [, params...])
Emit the event `type` to all listeners. Optionally pass `data` to listeners.

Returns the EventEmitter instance.

Param          | Type          | Description
---------------|---------------|---------------------------------------------------
type           | String        | The event type to emit
params         |    *          | Optional; one or more params to be passed to listeners
```javascript
emitter.emit('saved');

// examples of passing optional params
emitter.emit('saved', {status: 'success'});
emitter.emit('saved', 123, function(){});
```

## removeListener(type, listener)
Removes `listener` from event `type`.

Returns the EventEmitter instance.

Param          | Type          |Description
---------------|---------------|---------------------------------------------------
type           | String        | The event type that listener will be removed from
listener       | Function      | The listener function to be removed
```javascript
var listener = function(){};
emitter
  .addListener('created', listener);
  .removeListener('created', listener);
```

## removeAllListeners(type)
Removes all registered listeners from event `type`. If `type` is `undefined`, all listeners from all event types will be removed.

Returns the EventEmitter instance.

```javascript
// remove all listeners from event type `saved`
emitter.removeAllListeners('saved');

// remove ALL listeners from ALL event types
emitter.removeAllListeners();
```

## listeners(type)
Returns a cloned array of registered listeners for the given event `type`.
```javascript
emitter.listeners('updated');
//-> [{fn:function, scope:Object} ..., {fn:function, scope:Object}]
```

## listenerCount(type);
Returns the number of registered listeners for the given event `type`.
```javascript
emitter.listenerCount('updated')
//-> number
```

## Development
Lint:
```bash
gulp lint
```
Execute test suites:
```bash
gulp test
```
With coverage:
```bash
gulp test --coverage
```
Build:
```bash
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
