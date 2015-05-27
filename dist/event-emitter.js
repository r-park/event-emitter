/* event-emitter v0.2.0 - 2015-05-27T04:13:48.705Z - https://github.com/r-park/event-emitter */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.EventEmitter = factory();
  }
}(this, function() {
'use strict';


/**
 * @name EventEmitter
 * @constructor
 *
 * @param {string|string[]} types
 *
 */
function EventEmitter(types) {
  var events = this._events = {};

  if (typeof types === 'string') {
    events[types] = [];
  }
  else if (Array.isArray(types) && types.length) {
    for (var i = 0, l = types.length; i < l; ++i) {
      events[types[i]] = [];
    }
  }
  else {
    throw new TypeError();
  }
}


var proto = EventEmitter.prototype;


/**
 * @param {string} type
 * @param {Function} listener
 * @param {boolean|Object} [scope]
 * @param {boolean} [once]
 * @returns {EventEmitter}
 */
proto.on =
proto.addListener = function(type, listener, scope, once) {
  if (typeof listener !== 'function') {
    throw new TypeError();
  }

  var listeners = this._getListeners(type);

  if (listeners.length && indexOf(listeners, listener) !== -1) {
    throw new Error();
  }

  if (scope === true || once === true) {
    var that = this,
        fired = false;

    listeners.push({
      fn: function wrapper(data) {
        that.removeListener(type, wrapper);
        if (!fired) {
          fired = true;
          listener.call(scope || {}, data);
        }
      },
      scope: {}
    });
  }
  else {
    listeners.push({
      fn: listener,
      scope: scope || {}
    });
  }

  return this;
};


/**
 * @param {string} type
 * @param {*} data
 * @returns {EventEmitter}
 */
proto.emit = function(type, data) {
  var listeners = this._getListeners(type);

  if (listeners.length) {
    listeners = clone(listeners);

    for (var i = 0, l = listeners.length, listener; i < l; ++i) {
      listener = listeners[i];
      listener.fn.call(listener.scope, data);
    }
  }

  return this;
};


/**
 * @param {string} type
 * @param {Function} listener
 * @returns {EventEmitter}
 */
proto.removeListener = function(type, listener) {
  var listeners = this._getListeners(type),
      index;

  if (listeners.length) {
    index = indexOf(listeners, listener);
    if (index !== -1) {
      splice(listeners, index);
    }
  }

  return this;
};


/**
 * @param {string} [type]
 * @returns {EventEmitter}
 */
proto.removeAllListeners = function(type) {
  if (type) {
    var listeners = this._getListeners(type);
    listeners.length = 0;
  }
  else {
    var events = this._events;
    for (var event in events) {
      events[event].length = 0;
    }
  }

  return this;
};


/**
 * @param {string} type
 * @returns {Array}
 */
proto.listeners = function(type) {
  var listeners = this._getListeners(type);
  return listeners.length ? clone(listeners) : [];
};


/**
 * @param {string} type
 * @returns {number}
 */
proto.listenerCount = function(type) {
  var listeners = this._getListeners(type);
  return listeners.length;
};


/**
 * @param {string} type
 * @returns {Array}
 * @throws {Error}
 */
proto._getListeners = function(type) {
  var listeners = this._events[type];
  if (!listeners) {
    throw new Error();
  }
  return listeners;
};


/**
 * @param {Array} listeners
 * @returns {Array}
 */
function clone(listeners) {
  var i = listeners.length,
      cloned = new Array(i);

  while (i--) {
    cloned[i] = listeners[i];
  }

  return cloned;
}


/**
 * @param {Array} listeners
 * @param {Object} listener
 * @returns {number}
 */
function indexOf(listeners, listener) {
  var i = listeners.length;

  while (i--) {
    if (listener === listeners[i].fn) {
      return i;
    }
  }

  return -1;
}


/**
 * @param {Array} listeners
 * @param {number} index
 */
function splice(listeners, index) {
  for (var i = index, j = i + 1, k = listeners.length; j < k; ++i, ++j) {
    listeners[i] = listeners[j];
  }

  listeners.pop();
}

return EventEmitter;
}));
