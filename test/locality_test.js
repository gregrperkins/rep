goog.require('goog.testing.jsunit');


/////////////////////////////////////////////////////////////////////////////
// Test Locality suite (ScopedModel)
/////////////////////////////////////////////////////////////////////////////
goog.require('rep.test.City');
goog.require('rep.test.State');

var test_rep_test_Locality__staticInheritance = function() {
  var ca = new rep.test.State("California", null, 21);
  // Make sure that the attribute is set correctly
  assertEquals(21, ca.get(ca.drinkingAge));
  // Make sure that passing null does not define an attribute
  assertUndefined(ca.get(ca.callsSodaPop));
  // Set it properly
  ca.set(ca.callsSodaPop, false);
  assertFalse(ca.get(ca.callsSodaPop));

  // Check that the drinking age is inherited
  var sf = new rep.test.City("San Francisco", ca);
  assertEquals(21, sf.get(sf.drinkingAge));
  assertFalse(sf.get(sf.callsSodaPop));

  // Make sure that setting the drinking age locally does not override state
  var uto = new rep.test.City("Utopia", ca, null, 15);
  assertEquals(21, uto.get(uto.drinkingAge));

  // Check that soda/pop preference can be overridden locally
  var nowhere = new rep.test.City("Nowhereland", ca, true);
  assertEquals(21, nowhere.get(nowhere.drinkingAge));
  assertTrue(nowhere.get(nowhere.callsSodaPop));
};

var test_rep_test_Locality__reactivity = function() {
  var ca = new rep.test.State("California", null, 21);
  var sf = new rep.test.City("San Francisco", ca);
  var calls = 0;
  var incrFn = function() {calls++;};
  var key = ca.onSet(ca.drinkingAge, incrFn);
  ca.set(ca.drinkingAge, 20);
  assertEquals(calls, 1);
  ca.unlistenByKey(key);

  key = sf.onSet(sf.drinkingAge, incrFn);
  ca.set(ca.drinkingAge, 21);
  assertEquals(21, sf.get(sf.drinkingAge));
  assertEquals(calls, 2);
  sf.unlistenByKey(key);
};

var test_rep_test_Locality__defaults = function() {
  var ca = new rep.test.State("California");
  var mo = new rep.test.State("Montana");
  var sf = new rep.test.City("San Francisco", ca);
  var sj = new rep.test.City("San Jose", ca);

  // Make sure the defaults are set...
  assertFalse(sf.get(sf.freeEnergy));
  assertFalse(ca.get(ca.freeEnergy));
  assertFalse(mo.get(mo.freeEnergy));

  // Enable miracles in CA
  ca.set(ca.freeEnergy, true);
  assertTrue(ca.get(ca.freeEnergy));
  // SF does the right thing.
  assertTrue(sf.get(sf.freeEnergy));

  // Even though we try to stay sane in San Jose, CA overrides.
  sj.set(sj.freeEnergy, false);
  assertTrue(sj.get(sj.freeEnergy));

  // In another state, of course, reality prevails.
  assertFalse(mo.get(mo.freeEnergy));
};
