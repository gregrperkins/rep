goog.provide('rep.Attribute');
goog.provide('rep.DerivedAttribute');
goog.provide('rep.Model');

goog.require('rep.Emitter');

/**
 * Provides the basic reactive model and attribute functionality.
 * @see <a href="http://backbonejs.org/">backbone.js</a> for inspiration.
 *
 * <br><br>
 * TODO(gregp): how might we listen to *all* events again?
 * <br><br>
 * TODO(gregp): rep.Model.prototype.unset
 * <br><br>
 * TODO(gregp): rep.Model.prototype.defaults
 * <br><br>
 * TODO(gregp): better recursive heierarchies
 * <br><br>
 * TODO(gregp): rep.Set/rep.Array (un)ordered collections
 *
 * @constructor
 * @extends {rep.Emitter}
 */
rep.Model = function() {
  goog.base(this);

  /**
   * Map attribute UIDs to values.
   * @type {Object.<number, *>}
   */
  this.values_ = {};

  /**
   * Map closure object uid to attribute objects.
   * @type {Object.<number, rep.Attribute>}
   */
  this.attributes_ = {};

  this.init_();
};
goog.inherits(rep.Model, rep.Emitter);

/**
 * Initialize the reactive model:
 * For each property, determine which ones are attributes,
 *  and add them to this.attributes_.
 * @private
 */
rep.Model.prototype.init_ = function() {
  for (var key in this) {
    var val = this[key];
    if (val instanceof rep.Attribute) {
      var uid = goog.getUid(val);
      this.attributes_[uid] = val;
    }
  }
};

/**
 * Returns the last set value for the given attribute,
 *  or the current calculated value if the attribute is derived.
 * @param {rep.Attribute} attr, the attribute to get
 * @return {*} value of the given attribute
 */
rep.Model.prototype.get = function(attr) {
    var uid = goog.getUid(attr);
    if (attr instanceof rep.DerivedAttribute) {
      this.values_[uid] = attr.compute(this);
    }
    return this.values_[uid];
};

/**
 * Sets the value of the given attribute on this model.
 * <br><br>
 * Dispatches the attribute's set event.
 *
 * @param {rep.Attribute} attr
 * @param {*} value
 */
rep.Model.prototype.set = function(attr, value) {
  var uid = goog.getUid(attr);
  var prior = this.values_[uid];
  this.values_[uid] = value;
  // TODO(gregp): bubble submodel events
  // if (value instanceof rep.Model) {
  //   value.setParentEventTarget(this);
  // }
  this.dispatchEvent({
    type: attr.set,
    prior: prior,
    value: value
  });
};

/**
 * Set the given {@link rep.Attribute}, but only if the given value
 *  is defined and not null.
 * <br><br>
 * Generally used in a constructor, or anywhere else we might get an
 *  optional parameter.
 *
 * @param {rep.Attribute} attr
 * @param {*=} opt_value
 */
rep.Model.prototype.define = function(attr, opt_value) {
  if (goog.isDefAndNotNull(opt_value)) {
    this.set(attr, opt_value);
  }
};

/**
 * Returns all the attributes defined on this model.
 * @return {Array.<rep.Attribute>}
 * @private
 */
rep.Model.prototype.getAttributes_ = function() {
  return goog.object.getValues(this.attributes_);
};

/**
 * Converts the model to JSON by finding all attributes
 *  which have a key property, then assigning their value to that key.
 * <br><br>
 * Note that the function name is somewhat of a misnomer, as we are not
 *  actually exporting *JSON*, but instead are exporting something that can be
 *  easily converted to JSON when implemented properly on subclasses.
 * <br><br>
 * To fulfill this contract, subclasses must make sure that
 *  any rep.Attribute whose jsonKey has been set is one of the following:
 *  (1) a string
 *  (2) a number
 *  (3) null,
 *  (4) an object with a toJson() function
 *  (5) an object whose properties all satisfy one of these conditions or
 *  (6) an array whose properties all satisfy one of these conditions.
 * <br><br>
 * It will generally break advanced optimizations assumptions,
 *  as it essentially exports objects to bracket-notation.
 * <br><br>
 * Thus it should be used only to generate data objects for HTTP APIs
 *  or non-closure-compiled javascript code.
 * <br><br>
 * Importantly, it should not be used in an attempt to pass data to soy,
 *  or to hack around otherwise clumsy-feeling class interfaces.
 * <br><br>
 * The convention for soy is to use a model-class specific toSoyData()
 *  function, which creates and returns dot-notation objects
 *  using calls to get() for each rep.Attribute needed on that object.
 *
 * @return {Object}
 */
rep.Model.prototype.toJson = function() {
  var json = {};
  goog.array.forEach(this.getAttributes_(), function(attr){
    if (attr.key) {
      var cur = this.get(attr);
      if (!goog.isDef(cur)) {
        return;
      }
      if (goog.isFunction(cur.toJson)) {
        // TODO(gregp): handle recursive model heierarchies better?
        cur = cur.toJson();
      }
      json[attr.key] = cur;
    }
  }, this);
  return json;
};

/**
 * Listens for when a given attribute is set on this model.
 * @param {rep.Attribute} attr
 * @param {Function} fn
 * @param {Object=} opt_binder
 */
rep.Model.prototype.onSet = function(attr, fn, opt_binder) {
  return this.on(attr.set, fn, opt_binder);
};

/**
 * Listens for when a given attribute *changes* value.
 * @param {rep.Attribute} attr
 * @param {Function} fn
 * @param {Object=} opt_binder
 */
rep.Model.prototype.onChange = function(attr, fn, opt_binder) {
  return this.on(attr.set, function(ev) {
    if (ev.prior != ev.value) {
      fn(ev);
    }
  }, opt_binder);
};


/**
 * The base class for an attribute on a rep.Model.
 * @constructor
 */
rep.Attribute = function() {
  this.set = rep.Attribute.SET_EVENT + goog.getUid(this);
};

/** @type {!string} */
rep.Attribute.SET_EVENT = 'rep_set__';

/**
 * The key used when converting this Attribute's value to a bracket
 *  notation property on an object for export.
 * <br><br>
 * TODO(gregp): probably should be setJsonKey()
 *
 * @param {string=} jsonKey
 * @return {rep.Attribute}
 */
rep.Attribute.prototype.jsonKey = function(jsonKey) {
  this.key = jsonKey;
  return this;
};

/**
 * An attribute that is derived from other attributes on the rep.Model.
 *
 * @param {function(rep.Model)} computationFn which accepts the rep.Model
 *  and recomputes its appropriate value accordingly.
 * @constructor
 * @extends {rep.Attribute}
 */
rep.DerivedAttribute = function(computationFn) {
  goog.base(this);
  this.compute = computationFn;
};
goog.inherits(rep.DerivedAttribute, rep.Attribute);
