goog.provide('rep.ScopedModel');
goog.provide('rep.InheritingAttribute');
goog.provide('rep.OverridingAttribute');

goog.require('rep.Model');
goog.require('rep.DerivedAttribute');

/**
 * A model that is created with a parent, whose value for a given attribute is
 *  partially dependent on its parent's values for that attribute.
 *
 * @param {?rep.ScopedModel=} opt_parent
 * @constructor
 * @extends {rep.Model}
 */
rep.ScopedModel = function(opt_parent) {
  if (goog.isDefAndNotNull(opt_parent)) {
    this.parent = opt_parent;
  }

  goog.base(this);
};
goog.inherits(rep.ScopedModel, rep.Model);

rep.ScopedModel.prototype.recompute_ = function(attr) {
  var uid = attr.id_();
  var oldRecomputeFn = this.recomputeFn_[uid];
  return goog.base(this, 'recompute_', attr);

  console.log('ScopedModel recomputing', this.parent, this, attr);
  if (this.parent && (
        attr instanceof rep.InheritingAttribute ||
        attr instanceof rep.OverridingAttribute
      )) {
    this.parent.off(null, oldRecomputeFn, attr);
    var recomputeFn = this.recomputeFn_[uid];
    console.log('Adding recompute handler on ', this.parent, this);
    this.parent.onSet(attr, recomputeFn, attr);
  }
};


/**
 * Returns the given attribute's value.
 * <br><br>
 * If the attribute is inherited, we need to check the parent first.
 * <br><br>
 * If the attribute is overriding, we check the parent only if it's undefined.
 * <br><br>
 */

/**
 * An attribute whose value cascades from its parent whenever the parent
 *  has a defined value for it, even if it is defined at this scope.
 * @constructor
 * @extends {rep.DerivedAttribute}
 */
rep.InheritingAttribute = function() {
  rep.Attribute.call(this);
  // Skip rep.DerivedAttribute as it would override our #compute() fns.
};
goog.inherits(rep.InheritingAttribute, rep.DerivedAttribute);

/**
 * Since the top level scope's value would be inherited by all of the
 *  sub-scoped models, we need to provide a default on the attribute.
 * @param {*} defaultValue
 */
rep.InheritingAttribute.prototype.setDefault = function(defaultValue) {
  this.defaultValue = defaultValue;
  return this;
};

/**
 * Computes the value given the scoped model.
 *  parent > local > default > undefined
 * @param {rep.ScopedModel} model
 */
rep.InheritingAttribute.prototype.compute = function(model) {
  if (goog.isDef(model.parent)) {
    // Use a parent's value if it exists
    var parentValue = model.parent.get(this);
    if (goog.isDef(parentValue)) {
      return parentValue;
    }
  }

  // Otherwise use our value
  var localValue = model.getRaw(this);
  if (goog.isDef(localValue)) {
    return localValue;
  }

  // Otherwise use the default value
  var myDefault = this.defaultValue;
  if (goog.isDef(myDefault)) {
    return myDefault;
  }

  // Otherwise undefined
};

/**
 * An attribute whose value inherits from its parent
 *   when it is undefined at the current scope.
 * @constructor
 * @extends {rep.DerivedAttribute}
 */
rep.OverridingAttribute = function() {
  rep.Attribute.call(this);
  // Skip rep.DerivedAttribute as it would override our #compute() fns.
};
goog.inherits(rep.OverridingAttribute, rep.DerivedAttribute);

/**
 * Computes the value given the scoped model.
 *  local > parent > undefined
 * @param {rep.ScopedModel} model
 */
rep.OverridingAttribute.prototype.compute = function(model) {
  // If we have a defined value here, use it.
  var localValue = model.getRaw(this);
  if (goog.isDef(localValue)) {
    return localValue;
  }

  // Otherwise, if there is a parent and it has a value, use that
  if (goog.isDef(model.parent)) {
    var parentValue = model.parent.get(this);
    if (goog.isDef(parentValue)) {
      return parentValue;
    }
  }

  // Otherwise undefined
};
