/* event-emitter v0.5.1 - 2015-06-29T05:55:39.015Z - https://github.com/r-park/event-emitter */
;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Emitter = factory();
  }
}(this, function() {
'use strict';


var emitter = {

  /**
   * @param {string} type
   * @param {Function} listener
   * @param {boolean|Object} [scope]
   * @param {boolean} [once]
   * @returns emitter
   */
  addListener : function(type, listener, scope, once) {
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
        fn: function wrapper() {
          that.removeListener(type, wrapper);
          if (!fired) {
            fired = true;
            listener.apply(scope || {}, arguments);
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
  },


  /**
   * @param {string} type
   * @returns emitter
   */
  emit : function(type) {
    var listeners = this._getListeners(type),
        params;

    if (listeners.length) {
      params = toParam(arguments);
      listeners = clone(listeners);

      for (var i = 0, l = listeners.length, listener; i < l; ++i) {
        listener = listeners[i];
        listener.fn.apply(listener.scope, params);
      }
    }

    return this;
  },


  /**
   * @param {string} type
   * @param {Function} listener
   * @returns emitter
   */
  removeListener : function(type, listener) {
    var listeners = this._getListeners(type),
        index;

    if (listeners.length) {
      index = indexOf(listeners, listener);
      if (index !== -1) {
        splice(listeners, index);
      }
    }

    return this;
  },


  /**
   * @param {string} [type]
   * @returns emitter
   */
  removeAllListeners : function(type) {
    if (typeof type === 'string') {
      var listeners = this._getListeners(type);
      listeners.length = 0;
    }
    else if (typeof type === 'undefined') {
      var events = this._events;
      for (var event in events) {
        events[event].length = 0;
      }
    }

    return this;
  },


  /**
   * @param {string} type
   * @returns {Array}
   */
  listeners : function(type) {
    var listeners = this._getListeners(type);
    return listeners.length ? clone(listeners) : [];
  },


  /**
   * @param {string} type
   * @returns {number}
   */
  listenerCount : function(type) {
    var listeners = this._getListeners(type);
    return listeners.length;
  },


  /**
   * @param {string} type
   * @returns {Array}
   * @throws {Error}
   */
  _getListeners : function(type) {
    var listeners = this._events[type];
    if (!listeners) {
      throw new Error('EventEmitter : event type `' + type + '` does not exist');
    }
    return listeners;
  },


  /**
   * @param {string|string[]} eventTypes
   * @returns {Object.<string,Array>}
   * @throws {TypeError}
   */
  _setEventTypes : function(eventTypes) {
    var events = {};

    if (typeof eventTypes === 'string') {
      events[eventTypes] = [];
    }
    else if (Array.isArray(eventTypes) && eventTypes.length) {
      for (var i = 0, l = eventTypes.length; i < l; ++i) {
        events[eventTypes[i]] = [];
      }
    }
    else {
      throw new TypeError('EventEmitter : `eventTypes` is required');
    }

    this._events = events;
  }

};


// create alias `on`
emitter.on = emitter.addListener;


/**
 * @param {string|string[]} eventTypes
 * @param {Object} [object]
 * @returns {Object}
 */
function Emitter(eventTypes, object) { // eslint-disable-line no-unused-vars
  if (object) {
    if (Object.assign) {
      Object.assign(object, emitter);
    }
    else {
      Object.keys(emitter).forEach(function(key){
        object[key] = emitter[key];
      });
    }
  }
  else {
    object = Object.create(emitter); // eslint-disable-line no-param-reassign
  }

  object._setEventTypes(eventTypes);

  return object;
}


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


/**
 * @param {*} args
 * @returns {Array}
 */
function toParam(args) {
  var i = args.length - 1,
      params = new Array(i);

  while (i--) {
    params[i] = args[i + 1];
  }

  return params;
}

return Emitter;
}));
