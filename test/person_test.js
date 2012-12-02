goog.require('goog.testing.jsunit');


/////////////////////////////////////////////////////////////////////////////
// Test rep.test.Person
/////////////////////////////////////////////////////////////////////////////
goog.require('rep.test.NamedEntity');
goog.require('rep.test.Person');
goog.require('rep.test.Planet');

var test_rep_test_Person__testSetAndGet = function() {
  var concept = new rep.test.NamedEntity();
  // Ensure that we start with all attributes undefined
  assertUndefined(concept.get(concept.name));

  // Ensure that setting an attribute works
  concept.set(concept.name, 'Being-in-the-world');
  assertEquals('Being-in-the-world', concept.get(concept.name));

  // Ensure that changing the attribute works
  concept.set(concept.name, 'Dasein');
  assertEquals('Dasein', concept.get(concept.name));
};

var test_rep_test_Person__testGetAttributes = function() {
  var bob = new rep.test.NamedEntity();
  // Ensure we have just this attribute
  assertArrayEquals([bob.name], bob.getAttributes_());
};

var test_rep_test_Person__testSimpleInheritance = function() {
  var pluto = new rep.test.NamedEntity();
  var jupiter = new rep.test.Planet();
  // Ensure that the attributes we are listening to are inherited
  // Note -- we are comparing the attribute objects, not their model values
  assertEquals(pluto.name, jupiter.name);
  // Ensure that we have both the old and new attributes
  assertSameElements([jupiter.name, jupiter.size], jupiter.getAttributes_());
};

var test_rep_test_Person__testDerived = function() {
  var joe = new rep.test.Person();
  joe.set(joe.firstName, 'Joe');
  // Make sure that the calculation works with only a first name
  assertEquals('Joe', joe.get(joe.name));
  joe.set(joe.lastName, 'Smith');
  // Make sure the calculation works with both names
  assertEquals('Joe Smith', joe.get(joe.name));
};

var test_rep_test_Person__testToJson = function() {
  var earth = new rep.test.Planet();
  earth.set(earth.name, 'Earth');
  earth.set(earth.size, 'average');

  var rick = new rep.test.Person();
  rick.set(rick.firstName, 'Rick');
  rick.set(rick.lastName, 'Deckard');
  rick.set(rick.age, 30);
  rick.set(rick.residence, earth);

  assertObjectEquals(rick.toJson(), {
    // Make sure we called the attached model's toJson
    "residence": {
      "name": "Earth",
      "size": "average"
    },
    // Make sure the compound attribute is calculated properly
    "fullName": "Rick Deckard",
    // Make sure we get numbers properly
    "age": 30
  });
};

var test_rep_test_Person__testReactivity = function() {
  var mars = new rep.test.Planet();
  var priorValue = 3000;
  var changedValue = 2900;
  var changesSeen = 0;

  var onChange = function(ev){
    changesSeen++
    assertEquals(mars, ev.target);
    assertEquals(priorValue, ev.prior);
    assertEquals(changedValue, ev.value);
  };

  // Set the size initially, (of course, we shan't have seen any changes yet)
  mars.set(mars.size, priorValue);
  assertEquals(0, changesSeen);

  // Use goog.events.listen to avoid testing the rep.Emitter#on/off functions
  goog.events.listen(mars, mars.size.set, onChange);
  // Make sure we see the change
  mars.set(mars.size, changedValue);
  assertEquals(1, changesSeen);
  // Make sure we don't see changes on other attributes
  mars.set(mars.name, 'Mars');
  assertEquals(1, changesSeen);

  // Make sure we don't see after unlistening
  goog.events.unlisten(mars, mars.size.set, onChange);
  mars.set(mars.size, 2950);
  assertEquals(1, changesSeen);
};

var test_rep_test_Person__testOnChange = function() {
  var mars = new rep.test.Planet();
  var changesSeen = 0;
  var initialValue = 2900;
  var changedValue = 3000;
  var incrementChangesSeen = function(){changesSeen++};
  mars.onChange(mars.size, incrementChangesSeen, this);
  mars.set(mars.size, initialValue);
  assertEquals(1, changesSeen);

  // Should not increment since these are not changes.
  mars.set(mars.name, "Mars");
  mars.set(mars.size, initialValue);
  assertEquals(1, changesSeen);

  // Should increment when the value changes.
  mars.set(mars.size, changedValue);
  assertEquals(2, changesSeen);

  // Should increment after change back.
  mars.set(mars.size, initialValue);
  assertEquals(3, changesSeen);

  // Should not increment after calling off().
  mars.off(null, null, this);
  mars.set(mars.size, changedValue);
  assertEquals(3, changesSeen);
};
