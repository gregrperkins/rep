goog.provide('rep.test.Person');

goog.require('rep.Model');
goog.require('rep.Attribute');
goog.require('rep.DerivedAttribute');

/**
 * @constructor
 * @extends {rep.test.NamedEntity}
 */
rep.test.Person = function() {
  goog.base(this);
};
goog.inherits(rep.test.Person, rep.test.NamedEntity);

/**
 * The age of the person.
 * (at)attribute {number}
 */
rep.test.Person.prototype.age = new rep.Attribute()
  .jsonKey('age');

/**
 * The residence of the person.
 * (at)attribute {string|rep.test.Planet}
 */
rep.test.Person.prototype.residence = new rep.Attribute()
  .jsonKey('residence');

/**
 * The birthplace of the person.
 * (at)attribute {string}
 */
rep.test.Person.prototype.birthplace = new rep.Attribute()
  .jsonKey('birthplace');

/**
 * The firstName of the person.
 * (at)attribute {string}
 */
rep.test.Person.prototype.firstName = new rep.Attribute();

/**
 * The lastName of the person.
 * (at)attribute {string}
 */
rep.test.Person.prototype.lastName = new rep.Attribute();

/**
 * The full name of the person.
 * Calculated based on the firstName and lastName
 * (at)attribute {string}
 */
rep.test.Person.prototype.name = new rep.DerivedAttribute(
  function(model) {
    var firstName = model.get(model.firstName) || '';
    var lastName = model.get(model.lastName) || '';
    var sep = firstName && lastName ? ' ' : '';
    return firstName + sep + lastName;
  })
  .jsonKey('fullName');
