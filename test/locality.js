goog.provide('rep.test.Locality');

goog.require('rep.ScopedModel');
goog.require('rep.Attribute');
goog.require('rep.InheritingAttribute');
goog.require('rep.OverridingAttribute');

/**
 * @param {?rep.test.Locality} parent
 * @param {?string=} opt_name
 * @param {?boolean=} opt_callsSodaPop
 * @param {?number=} opt_drinkingAge
 * @constructor
 * @extends {rep.ScopedModel}
 */
rep.test.Locality = function(parent, opt_name, opt_callsSodaPop, opt_drinkingAge) {
  goog.base(this, parent);
  this.define(this.name, opt_name);
  this.define(this.callsSodaPop, opt_callsSodaPop);
  this.define(this.drinkingAge, opt_drinkingAge);
};
goog.inherits(rep.test.Locality, rep.ScopedModel);

/**
 * The name of this jurisdiction.
 * TODO(gregp): (at)mixin rep.test.NamedEntity
 * (at)attribute {string}
 */
rep.test.Locality.prototype.name = new rep.Attribute();

/**
 * Whether alcohol is legal in this jurisdiction.
 * (at)attribute {boolean}
 */
rep.test.Locality.prototype.callsSodaPop = new rep.OverridingAttribute();

/**
 * What the age of drinking is in this municipality.
 * (at)attribute {number}
 */
rep.test.Locality.prototype.drinkingAge = new rep.InheritingAttribute();

/**
 * Whether we have free energy here.
 * (at)attribute {boolean}
 */
rep.test.Locality.prototype.freeEnergy = new rep.InheritingAttribute()
  .setDefault(false);
