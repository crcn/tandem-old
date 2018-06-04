IMMEDIATE:

* ability to use images
* move components to separate files (need to globally load components)
* start wiring up right gutter
* look into how rust may be used
* prohibit immutable children from being deleted
  * **color picker**
* update code compiler to handle overrides
* ability to load images & other resources in PC file. (start with ionicons)
* ability to persist changes to main component

BUGS:

* cannot override in some cases (try changing variant text in right gutter component)
* padding / margins affect pane
* diffing / patching doesn't work in some re-ordering scenarios

STYLING:

* insert new style when element is inserted
* slurp up styles when element is copied or moved (reduce into one style)

HIGH PRIO:

ideas around importing other design files like Sketch

* **stronger source data type, don't use tree node structure**

LOW PRIO:

* move is\* to synthetic metadata

HIGH IMPACT:

* **importing sketch files for translation** - copy attributes from shapes like colors, fonts, shadows, backgrounds. Source of truth for that information stays in Sketch. Separation of concerns between Tandem & design apps. Seems scalable, but need to test.

QUEUE:

styles panel
