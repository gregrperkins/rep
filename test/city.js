goog.provide('rep.test.City');

goog.require('rep.test.Locality');

/**
 * @param {string} name
 * @param {rep.test.State} state
 * @param {?boolean=} opt_callsSodaPop
 * @param {?number=} opt_drinkingAge
 * @constructor
 * @extends {rep.test.Locality}
 */
rep.test.City = function(name, state, opt_callsSodaPop, opt_drinkingAge) {
  goog.base(this, state, name, opt_callsSodaPop, opt_drinkingAge);
  this.set(this.state, state);
};
goog.inherits(rep.test.City, rep.test.Locality);

/**
 * Indicates which state the given city is in.
 * (at)attribute {rep.test.State}
 */
rep.test.City.prototype.state = new rep.Attribute();
