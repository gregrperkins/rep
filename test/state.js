goog.provide('rep.test.State');

goog.require('rep.test.Locality');

/**
 * @param {string} name
 * @param {?boolean=} opt_callsSodaPop
 * @param {?number=} opt_drinkingAge
 * @constructor
 * @extends {rep.test.Locality}
 */
rep.test.State = function(name, opt_callsSodaPop, opt_drinkingAge) {
    goog.base(this, null, name, opt_callsSodaPop, opt_drinkingAge);
};
goog.inherits(rep.test.State, rep.test.Locality);
