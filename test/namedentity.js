goog.provide('rep.test.NamedEntity');

goog.require('rep.Model');
goog.require('rep.Attribute');

/**
 * @constructor
 * @extends {rep.Model}
 */
rep.test.NamedEntity = function() {
  goog.base(this);
};
goog.inherits(rep.test.NamedEntity, rep.Model);

/**
 * Stores the name of the given entity.
 * (at)attribute {string}
 */
rep.test.NamedEntity.prototype.name = new rep.Attribute()
  .jsonKey('name');
