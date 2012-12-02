goog.provide('rep.Emitter');
goog.require('goog.events.EventTarget');

/**
 * Represents a listener that has been added to this Emitter.
 * <br><br>
 * Associates a listener key with all the metadata used to create it,
 *  used during deletion.
 * <br><br>
 * TODO(gregp): optional object properties in compiler would be nice
 *
 * @typedef {{
 *            key: number,
 *            type: string,
 *            fn: Function,
 *            binder: ?Object
 *          }}
 */
rep.EmitterListener;

/**
 * The Emitter class is a wrapper for the {@link goog.events.EventTarget}
 *  class that provides an enhanced selective removal of event handlers.
 * <br><br>
 * It is intended to provide an analog for the (post-0.9.2) backbone.js
 *  off() behavior.
 *
 * @constructor
 * @extends {goog.events.EventTarget}
 */
rep.Emitter = function() {
  goog.base(this);

  /**
   * List of all the listeners on this emitter. Used for selective disposal.
   *  {@link goog.events.events} provides the triggering behavior.
   * @type {Array.<rep.EmitterListener>}
   */
  this.listeners_ = [];
};
goog.inherits(rep.Emitter, goog.events.EventTarget);


/**
 * In addition to the base EventTarget disposal, this detaches any listeners
 *  that have been added through on().
 * @override
 */
rep.Emitter.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.off();
};

/**
 * Adds the given fn as a listener for the given type of event.
 * <br><br>
 * If an opt_binder is given, uses that as the context in which the
 *  function will be run. Additionally, this will be used as the object
 *  which can be given to detach the generated listener.
 * <br><br>
 * on() returns a listenerKey, which can be passed to
 *  rep.Emitter#unlistenByKey() in order to detach the listener
 * <br><br>
 * Though it should not be fatal to do so, listeners should generally not
 *  be unlistened for with goog.events.* after calling on,
 *  as it will leave this.listeners_ in an inconsistent state.
 *
 * @param {string} type
 * @param {Function} fn
 * @param {Object=} opt_binder
 * @param {boolean=} opt_capture
 */
rep.Emitter.prototype.on = function(type, fn, opt_binder, opt_capture) {
  var key = goog.events.listen(this, type, fn, opt_capture, opt_binder);

  var listener = {
    key: key,
    type: type,
    fn: fn,
    binder: opt_binder || null
  };
  this.listeners_.push(listener);
  return key;
};

/**
 * Removes any listeners that have been added with on() or derived methods,
 *  whose listener specification matches the given one.
 * <br><br>
 * @see rep.Emitter.isListenerFor_
 *
 * @param {?string=} opt_type
 * @param {?Function=} opt_fn
 * @param {?Object=} opt_binder
 */
rep.Emitter.prototype.off = function(opt_type, opt_fn, opt_binder) {
  var filterFn = function(listener) {
    return rep.Emitter.isListenerFor_(listener, opt_type, opt_fn, opt_binder);
  };
  this.selectiveUnlisten_(filterFn);
};

/**
 * Determines whether the given listener matches the query passed to off()
 * <br><br>
 * If any of the type, function, or function bound context is specified,
 *  the one that was given when the listener was registered must match it.
 *
 * @param {rep.EmitterListener} listener
 * @param {?string=} opt_type
 * @param {?Function=} opt_fn
 * @param {?Object=} opt_binder
 *
 * @return {boolean}
 * @private
 */
rep.Emitter.isListenerFor_ = function(listener, opt_type, opt_fn, opt_binder) {
  return (
    !(goog.isDefAndNotNull(opt_type) && opt_type != listener.type) &&
    !(goog.isDefAndNotNull(opt_fn) && opt_fn != listener.fn) &&
    !(goog.isDefAndNotNull(opt_binder) && opt_binder != listener.binder)
  );
};

/**
 * Unlisten by the goog.events key. (Which was returned by the on() function.)
 * @param {!number} key
 */
rep.Emitter.prototype.unlistenByKey = function(key) {
  var filterFn = function(listener) {
    return listener.key == key;
  };
  this.selectiveUnlisten_(filterFn);
};

/**
 * Unlistens to all listeners for which filterFn returns true.
 *  Retains only the this.listeners_ which are still active.
 * @param {function(rep.EmitterListener): boolean} filterFn
 * @private
 */
rep.Emitter.prototype.selectiveUnlisten_ = function(filterFn) {
  var remaining = []
  for (var i = 0; i < this.listeners_.length; i++) {
    var listener = this.listeners_[i];
    if (filterFn(listener)) {
      goog.events.unlistenByKey(listener.key);
    } else {
      remaining.push(listener);
    }
  }
  this.listeners_ = remaining;
};

// TODO(gregp): rep.Emitter.prototype.setParentEventTarget
