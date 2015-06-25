[![Build Status](https://travis-ci.org/r-park/event-emitter.svg?branch=master)](https://travis-ci.org/r-park/event-emitter)
[![Coverage Status](https://coveralls.io/repos/r-park/event-emitter/badge.svg?branch=master)](https://coveralls.io/r/r-park/event-emitter?branch=master)

# EventEmitter
An EventEmitter for browser environments.

## Using EventEmitter
### Standalone
```javascript
var scope = {listener: function(){}};

// EventEmitter must be initialized with one or more event types
var eventTypes = ['create', 'update', 'complete'];
var emitter = eventEmitter(eventTypes);

emitter
  .addListener('update', scope.listener, scope)
  .emit('update', {status: 'success'})
  .emit('complete')
  .removeListener('update', scope.listener);
```

### Extending
```javascript
var scope = {listener: function(){}};
var myObj = {};

// EventEmitter must be initialized with one or more event types
var eventTypes = ['create', 'update', 'complete'];

// Call `eventEmitter`, passing in the object to be extended
eventEmitter(eventTypes, myObj);

myObj
  .addListener('update', scope.listener, scope)
  .emit('update', {status: 'success'})
  .emit('complete')
  .removeListener('update', scope.listener);
```

## EventEmitter(events)
EventEmitter must be instantiated with one or more event types. Event types cannot be added to the EventEmitter after it has been instantiated.

Param          | Type                 |Description
---------------|----------------------|---------------------------------------------------
events         | Array<br>String      | The event types that will be supported by this EventEmitter instance

```javascript
var emitter1 = eventEmitter(['create', 'update']);
var emitter2 = eventEmitter('save');
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
```

## emit(type, data)
Emit the event `type` to all listeners. Optionally pass `data` to listeners. 

Returns the EventEmitter instance.

Param          | Type          | Description
---------------|---------------|---------------------------------------------------
type           | String        | The event type to emit
data           |    *          | Optional data to be passed to listeners
```javascript
emitter.emit();

// examples of passing optional data
emitter.emit({status: 'success'});
emitter.emit('foo');
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
