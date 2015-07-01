describe("EventEmitter: standalone", function(){

  var EVENT_1 = 'event1',
      EVENT_2 = 'event2',
      EVENT_TYPES = [EVENT_1, EVENT_2];

  var emitter,
      listener;

  var noop = function(){};


  beforeEach(function(){
    listener = noop;
    emitter = Emitter(EVENT_TYPES);
  });


  describe("Factory", function(){
    it("should create unique instances of eventEmitter", function(){
      var emitter2 = Emitter(EVENT_2);
      expect(emitter).not.toBe(emitter2);
    });


    it("should initialize the events map with provided event-type string", function(){
      expect(emitter._events).toBeDefined();
      expect(Array.isArray(emitter._events[EVENT_1])).toBe(true);
    });


    it("should initialize the events map with provided event-types string[]", function(){
      expect(emitter._events).toBeDefined();
      expect(Array.isArray(emitter._events[EVENT_1])).toBe(true);
      expect(Array.isArray(emitter._events[EVENT_2])).toBe(true);
    });


    it("should throw if event-types are not provided", function(){
      expect(function(){
        eventEmitter();
      }).toThrow();
    });


    it("should throw if provided event-types are invalid", function(){
      [null, void 0, {}, 1, true].forEach(function(value){
        expect(function(){
          eventEmitter(value);
        }).toThrow();
      });
    });


    it("should extend object if object is provided", function(){
      var object = {};

      Emitter(EVENT_1, object);

      [
        'on',
        'addListener',
        'emit',
        'removeListener',
        'removeAllListeners',
        'listeners',
        'listenerCount',
        '_getListeners'
      ].forEach(function(method){
        expect(object[method]).toBeDefined();
      });
    });
  });


  describe("Adding a listener", function(){

    it("should throw if event-type is not found", function(){
      expect(function(){
        emitter.addListener('foo', value);
      }).toThrow();
    });


    it("should throw if listener function is not provided", function(){
      [null, void 0, {}, [], 1, true].forEach(function(value){
        expect(function(){
          emitter.addListener(EVENT_1, value);
        }).toThrow();
      });
    });


    it("should throw if listener is already registered for provided event-type", function(){
      emitter.addListener(EVENT_1, noop);

      expect(function(){
        emitter.addListener(EVENT_1, noop);
      }).toThrow();

      expect(function(){
        emitter.addListener(EVENT_2, noop);
      }).not.toThrow();
    });


    it("should add a listener object to the internal events map (scenario 1)", function(){
      // Using function signature addListener(type, listener)
      emitter.addListener(EVENT_1, noop);

      var listenerObj = emitter._events[EVENT_1][0];

      expect(listenerObj).toBeDefined();
      expect(listenerObj.fn).toBe(noop);
      expect(listenerObj.scope).toEqual({});
    });


    it("should add a listener object to the internal events map (scenario 2)", function(){
      // Using function signature addListener(type, listener, scope)
      var scope = {listener: function(){}};

      emitter.addListener(EVENT_1, scope.listener, scope);

      var listenerObj = emitter._events[EVENT_1][0];

      expect(listenerObj).toBeDefined();
      expect(listenerObj.fn).toBe(scope.listener);
      expect(listenerObj.scope).toBe(scope);
    });


    it("should add a listener object to the internal events map (scenario 3)", function(){
      // Using function signature addListener(type, listener, scope, once)
      var scope = {listener: function(){}};

      emitter.addListener(EVENT_1, scope.listener, scope, true);

      var listenerObj = emitter._events[EVENT_1][0];

      expect(listenerObj).toBeDefined();
      expect(listenerObj.fn).not.toBe(scope.listener);
      expect(typeof listenerObj.fn).toBe('function');
      expect(listenerObj.scope).toEqual({});
    });


    it("should add a listener object to the internal events map (scenario 4)", function(){
      // Using function signature addListener(type, listener, once)
      var scope = {listener: function(){}};

      emitter.addListener(EVENT_1, scope.listener, true);

      var listenerObj = emitter._events[EVENT_1][0];

      expect(listenerObj).toBeDefined();
      expect(listenerObj.fn).not.toBe(scope.listener);
      expect(typeof listenerObj.fn).toBe('function');
      expect(listenerObj.scope).toEqual({});
    });


    it("should add a listener object to the internal events map (scenario 5)", function(){
      // Using function signature addListener(type, listener, null, once)
      var scope = {listener: function(){}};

      emitter.addListener(EVENT_1, scope.listener, null, true);

      var listenerObj = emitter._events[EVENT_1][0];

      expect(listenerObj).toBeDefined();
      expect(listenerObj.fn).not.toBe(scope.listener);
      expect(typeof listenerObj.fn).toBe('function');
      expect(listenerObj.scope).toEqual({});
    });


    it("should set listener object's scope to an anonymous object literal when scope is not provided", function(){
      emitter.addListener(EVENT_1, noop);

      var listenerObj = emitter._events[EVENT_1][0];

      expect(listenerObj.scope).toEqual({});
    });


    it("should set listener object's scope to provided scope object", function(){
      var scope = {};

      emitter.addListener(EVENT_1, noop, scope);

      var listenerObj = emitter._events[EVENT_1][0];

      expect(listenerObj.scope).toBe(scope);
    });


    it("should return emitter", function(){
      expect(emitter.addListener(EVENT_1, noop)).toBe(emitter);
    });
  });


  describe("Emitting an event", function(){
    it("should throw if event-type is not found", function(){
      expect(function(){
        emitter.emit();
      }).toThrow();

      expect(function(){
        emitter.emit('foo');
      }).toThrow();
    });


    it("should invoke listener within anonymous scope", function(){
      var obj = {
        listener: function(){
          this.name = 'foo';
        }
      };

      emitter.addListener(EVENT_1, obj.listener);
      emitter.emit(EVENT_1);

      expect(obj.name).toBe(undefined);
    });


    it("should invoke listener within provided scope", function(){
      var obj = {
        listener: function(){
          this.name = 'foo';
        }
      };

      emitter.addListener(EVENT_1, obj.listener, obj);
      emitter.emit(EVENT_1);

      expect(obj.name).toBe('foo');
    });


    it("should call listener with provided data", function(){
      var listener = sinon.spy();
      var data1 = {};
      var data2 = {};

      emitter.addListener(EVENT_1, listener);
      emitter.emit(EVENT_1, data1);

      expect(listener.calledWithExactly(data1)).toBe(true);

      emitter.emit(EVENT_1, data1, data2);

      expect(listener.calledWithExactly(data1, data2)).toBe(true);
    });


    it("should return emitter", function(){
      emitter.addListener(EVENT_1, noop);
      expect(emitter.emit(EVENT_1)).toBe(emitter);
    });


    it("should return emitter if no listeners are found for requested event-type", function(){
      expect(emitter.emit(EVENT_1)).toBe(emitter);
    });
  });


  describe("Emitting an event to listeners added `once`", function(){
    it("should invoke the listener once", function(){
      var listener = sinon.spy();

      emitter.addListener(EVENT_1, listener, true);
      emitter.emit(EVENT_1);

      expect(listener.callCount).toBe(1);

      emitter.emit(EVENT_1);

      expect(listener.callCount).toBe(1);
    });


    it("should remove the listener from the internal events map after one call", function(){
      emitter.addListener(EVENT_1, noop, true);

      expect(emitter._events[EVENT_1].length).toBe(1);

      emitter.emit(EVENT_1);

      expect(emitter._events[EVENT_1].length).toBe(0);
    });


    it("should invoke listener within anonymous scope", function(){
      var obj = {
        listener: function(){
          this.name = 'foo';
        }
      };

      emitter.addListener(EVENT_1, obj.listener, true);
      emitter.emit(EVENT_1);

      expect(obj.name).toBe(undefined);
    });


    it("should invoke listener within provided scope", function(){
      var obj = {
        listener: function(){
          this.name = 'foo';
        }
      };

      emitter.addListener(EVENT_1, obj.listener, obj, true);
      emitter.emit(EVENT_1);

      expect(obj.name).toBe('foo');
    });


    it("should call listener with provided data", function(){
      var listener = sinon.spy();
      var data1 = {};
      var data2 = {};

      emitter.addListener(EVENT_1, listener, true);

      emitter.emit(EVENT_1, data1, data2);

      expect(listener.calledWithExactly(data1, data2)).toBe(true);
    });
  });


  describe("Removing a listener", function(){
    it("should remove listener from event-type", function(){
      var l1 = function(){};
      var l2 = function(){};
      var l3 = function(){};

      emitter._events[EVENT_1].push({fn: l1});
      emitter._events[EVENT_1].push({fn: l2});
      emitter._events[EVENT_1].push({fn: l3});

      expect(emitter._events[EVENT_1].length).toBe(3);

      emitter.removeListener(EVENT_1, l2);

      expect(emitter._events[EVENT_1].length).toBe(2);
      expect(emitter._events[EVENT_1][0].fn).toBe(l1);
      expect(emitter._events[EVENT_1][1].fn).toBe(l3);
    });


    it("should throw if event-type is not found", function(){
      expect(function(){
        emitter.removeListener('foo', noop);
      }).toThrow();
    });


    it("should return emitter", function(){
      expect(emitter.removeListener(EVENT_1)).toBe(emitter);
    });


    it("should return emitter if provided listener is not found", function(){
      emitter._events[EVENT_1].push({fn: noop});
      expect(emitter.removeListener(EVENT_1, function(){})).toBe(emitter);
    });
  });


  describe("Removing all listeners", function(){
    it("should throw if event-type is not found", function(){
      expect(function(){
        emitter.removeAllListeners('foo');
      }).toThrow();
    });


    it("should remove all listeners from provided event-type", function(){
      emitter._events[EVENT_1].push({});
      emitter._events[EVENT_1].push({});

      expect(emitter._events[EVENT_1].length).toBe(2);

      emitter.removeAllListeners(EVENT_1);

      expect(emitter._events[EVENT_1].length).toBe(0);
    });


    it("should remove all listeners from all event-types", function(){
      emitter._events[EVENT_1].push({});
      emitter._events[EVENT_1].push({});

      emitter._events[EVENT_2].push({});
      emitter._events[EVENT_2].push({});

      expect(emitter._events[EVENT_1].length).toBe(2);
      expect(emitter._events[EVENT_2].length).toBe(2);

      emitter.removeAllListeners();

      expect(emitter._events[EVENT_1].length).toBe(0);
      expect(emitter._events[EVENT_2].length).toBe(0);
    });


    it("should return emitter", function(){
      expect(emitter.removeAllListeners(EVENT_1)).toBe(emitter);
    });
  });


  describe("Retrieving listeners", function(){
    it("should throw if event-type is not found", function(){
      expect(function(){
        emitter.listeners('foo');
      }).toThrow();
    });


    it("should return a cloned copy of the listeners array for the requested event-type", function(){
      emitter._events[EVENT_1].push({});
      var listeners = emitter.listeners(EVENT_1);
      listeners.push({});

      expect(emitter._events[EVENT_1].length).toBe(1);
      expect(listeners.length).toBe(2);
    });


    it("should return an empty array if there are no listeners for requested event-type", function(){
      expect(emitter.listeners(EVENT_1).length).toBe(0);
    });
  });


  describe("Retrieving the number of listeners", function(){
    it("should throw if event-type is not found", function(){
      expect(function(){
        emitter.listenerCount('foo');
      }).toThrow();
    });


    it("should return the number of listeners for the requested event-type", function(){
      emitter._events[EVENT_1].push({});
      emitter._events[EVENT_1].push({});

      expect(emitter.listenerCount(EVENT_1)).toBe(2);

      emitter._events[EVENT_1].pop();

      expect(emitter.listenerCount(EVENT_1)).toBe(1);
    });
  });

});
