goog.provide('rep.ScopedModel');
goog.provide('rep.InheritingAttribute');
goog.provide('rep.OverridingAttribute');

goog.require('rep.Model');

/**
 * A model that is created with a parent, whose value for a given attribute is
 *  partially dependent on its parent's values for that attribute.
 *
 * @param {?rep.ScopedModel=} opt_parent
 * @constructor
 * @extends {rep.Model}
 */
rep.ScopedModel = function(opt_parent) {
  goog.base(this);
  if (goog.isDefAndNotNull(opt_parent)) {
    this.parent = opt_parent;
  }
};
goog.inherits(rep.ScopedModel, rep.Model);

/**
 * Returns the given attribute's value.
 * <br><br>
 * If the attribute is inherited, we need to check the parent first.
 * <br><br>
 * If the attribute is overriding, we check the parent only if it's undefined.
 * <br><br>
 * @override
 */
rep.ScopedModel.prototype.get = function(attr) {
  // TODO(gregp): DRY
  if (attr instanceof rep.InheritingAttribute) {
    if (goog.isDef(this.parent)) {
      // Use a parent's value if it exists
      var parentValue = this.parent.get(attr);
      if (goog.isDef(parentValue)) {
        return parentValue;
      }
    }

    // Otherwise use our value
    var myValue = goog.base(this, 'get', attr);
    if (goog.isDef(myValue)) {
      return myValue;
    }

    // Otherwise use the default value
    var attributeDefault = attr.defaultValue;
    if (goog.isDef(attributeDefault)) {
      return attributeDefault;
    }

    // Otherwise undefined
    return;

  }

  if (attr instanceof rep.OverridingAttribute) {
    // If we have a defined value here, use it.
    var myValue = goog.base(this, 'get', attr);
    if (goog.isDef(myValue)) {
      return myValue;
    }

    // Otherwise, if there is a parent and it has a value, use that
    if (goog.isDef(this.parent)) {
      var parentValue = this.parent.get(attr);
      if (goog.isDef(parentValue)) {
        return parentValue;
      }
    }

    // Otherwise undefined
    return;
  }

  var myValue = goog.base(this, 'get', attr);
  if (goog.isDef(myValue)) {
    return myValue;
  }
  return; // else undefined.
};


/**
 * An attribute whose value cascades from its parent whenever the parent
 *  has a defined value for it, even if it is defined at this scope.
 * @constructor
 * @extends {rep.Attribute}
 */
rep.InheritingAttribute = function() {
  goog.base(this);
};
goog.inherits(rep.InheritingAttribute, rep.Attribute);

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
 * An attribute whose value inherits from its parent
 *   when it is undefined at the current scope.
 * @constructor
 * @extends {rep.Attribute}
 */
rep.OverridingAttribute = function() {
  goog.base(this);
};
goog.inherits(rep.OverridingAttribute, rep.Attribute);
