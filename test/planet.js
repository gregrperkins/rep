goog.provide('rep.test.Planet');

goog.require('rep.Model');
goog.require('rep.Attribute');

/**
 * @constructor
 * @extends {rep.test.NamedEntity}
 */
rep.test.Planet = function() {
  goog.base(this);
};
goog.inherits(rep.test.Planet, rep.test.NamedEntity);

/**
 * The size of the planet, conceptually.
 * (at)attribute {number|string}
 */
rep.test.Planet.prototype.size = new rep.Attribute()
 .jsonKey('size');
