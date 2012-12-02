goog.require('goog.testing.jsunit');


/////////////////////////////////////////////////////////////////////////////
// Test rep.Emitter
/////////////////////////////////////////////////////////////////////////////
goog.require('rep.Emitter');

var test_rep_Emitter__dispatchEvent = function() {
  var testType = "type_1";
  var emitter = new rep.Emitter();
  var eventsSeen = 0;
  goog.events.listen(emitter, testType, function() {eventsSeen++;});
  emitter.dispatchEvent(testType);
  assertEquals(1, eventsSeen);
};

var test_rep_Emitter__onOff = function() {
  var testType = "type_1";
  var emitter = new rep.Emitter();
  var eventsSeen = 0;
  var incrFn = function() {eventsSeen++;};
  emitter.on(testType, incrFn);
  emitter.dispatchEvent(testType);
  assertEquals(1, eventsSeen);
  // Make sure we can turn off by type and function
  emitter.off(testType, incrFn);
  emitter.dispatchEvent(testType);
  assertEquals(1, eventsSeen);

  emitter.on(testType, incrFn);
  emitter.dispatchEvent(testType);
  assertEquals(2, eventsSeen);
  // Test turning off all events of this type
  emitter.off(testType);
  emitter.dispatchEvent(testType);
  assertEquals(2, eventsSeen);
};

var test_rep_Emitter__unlistenByKey = function() {
  var testType = "type_1";
  var emitter = new rep.Emitter();
  var eventsSeen = 0;
  var incrFn = function() {eventsSeen++;};
  var key = emitter.on(testType, incrFn);
  emitter.dispatchEvent(testType);
  assertEquals(1, eventsSeen);
  assertEquals(1, emitter.listeners_.length);
  // Make sure we can turn off by key
  emitter.unlistenByKey(key);
  emitter.dispatchEvent(testType);
  assertEquals(1, eventsSeen);
  assertEquals(0, emitter.listeners_.length);
};

/** @typedef {{seen: number}} */
var Binder;

var test_rep_Emitter__offBoundObject = function() {
  var testType = "type_1";
  var emitter = new rep.Emitter();
  /** @type {Binder} */
  var binderA = {self: "A", seen: 0};
  /** @type {Binder} */
  var binderB = {self: "B", seen: 0};
  /**
   * Function listener, bound to binderA or binderB.
   * @this {Binder}
   */
  var incrFn = function() {this.seen++;};
  binderA.incr = binderB.incr = incrFn;

  // Check that both listeners fire
  emitter.on(testType, binderA.incr, binderA);
  emitter.on(testType, binderB.incr, binderB);
  assertEquals(2, emitter.listeners_.length);
  emitter.dispatchEvent(testType);
  assertEquals(1, binderA.seen);
  assertEquals(1, binderB.seen);

  // Make sure we can turn off by binder
  emitter.off(null, null, binderA);
  assertEquals(1, emitter.listeners_.length);
  emitter.dispatchEvent(testType);
  assertEquals(1, binderA.seen);
  assertEquals(2, binderB.seen);

  emitter.on(testType, binderB.incr, binderB);
  assertEquals(2, emitter.listeners_.length);
  // Note that we can only get one event of a given type for the same handler,
  //  so this will only cause one addition increment call.
  emitter.dispatchEvent(testType);
  assertEquals(3, binderB.seen);
  emitter.off();
  assertEquals(0, emitter.listeners_.length);
};

var test_rep_Emitter__multipleListeners = function() {
  var testType = "type_1";
  var emitter = new rep.Emitter();
  var eventsSeen = 0;
  var incrFn = function() {eventsSeen++;};
  var key = emitter.on(testType, incrFn);
  emitter.dispatchEvent(testType);
  assertEquals(1, eventsSeen);
  assertEquals(1, emitter.listeners_.length);
  // Make sure we can turn off by key
  emitter.unlistenByKey(key);
  emitter.dispatchEvent(testType);
  assertEquals(1, eventsSeen);
  assertEquals(0, emitter.listeners_.length);
};
