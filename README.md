## rep.js

Closure Compiler optimized, disposable, reactive models

**rep.js** is to be a reactive modeling engine compatible with the Google
Closure Ecosystem ([Compiler][jscomp], [Library][goog], and [Templates][soy]).

It is inspired by [backbone.js][backbone], but secretly wants to play with the
cool kids [Meteor][meteor] and [knockout.js][ko].

### Getting started

(Requires npm & node.js)

Run ``make serve`` to get running (**C-c** exits).
Requires a ``make`` command with the **-j** parallelization feature.

From another terminal, ``make test`` will run the tests
(on a system with an ``open``-equivalent command).
Or, just open each of the following in a web browser (while plovr is running):
- [http://localhost:9810/test/rep/all](http://localhost:9810/test/rep/all)
- [http://localhost:9811/rep/emitter_test.html](http://localhost:9811/rep/emitter_test.html)
- [http://localhost:9811/test/person_test.html](http://localhost:9811/test/person_test.html)
- [http://localhost:9811/test/locality_test.html](http://localhost:9811/test/locality_test.html)

### Discussion

It's really close to backbone currently, though far less featureful.
Backbone's string-based values mapping is replaced with one
based on the uid of the attribute object, so we maintain semantic integrity
through the inheritance chain.

Using formal attribute objects allows us to do formal validation,
selectively add only keyed attributes to exported json,
and refer to model attributes in a way that will compress nicely
while enforcing the conceptual divide
between model attributes and object properties.
It also makes computed and cascading attributes a lot more fun.

#### State of the code

Unproven -- not yet used in a serious project.

The tests and features are far enough along to replace
what I generally use backbone.js for in my work.

Disposability needs some more tests and probably a bit of love.

The state of packaging and project management for google closure
open source projects is quite sad still, or else I'm missing something.
Perhaps this will motivate me to work on that.

See ``PACKAGING.md`` for some additional thoughts.

 [jscomp]: https://developers.google.com/closure/compiler/
 [goog]: https://developers.google.com/closure/library/
 [soy]: https://developers.google.com/closure/templates/
 [backbone]: http://backbonejs.org/
 [ko]: http://knockoutjs.com/
 [meteor]: http://meteor.com/
