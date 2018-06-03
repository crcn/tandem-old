IMMEDIATE:

* paperclip tests for persisting + overrides
* ability to move child overrides out of instance
* move is\* to synthetic metadata
* back onto styling doc
  * **color picker**
* update code compiler to handle overrides
* select inserted elements
* ability to load images & other resources in PC file. (start with ionicons)

SAFETY:

* validation that there are no ID collisions.

STYLING:

* insert new style when element is inserted
* slurp up styles when element is copied or moved (reduce into one style)

HIGH PRIO:

ideas around importing other design files like Sketch

* **stronger source data type, don't use tree node structure**

OPTIMIZATION:

generate checksum for synthetic nodes and use those for tree diffing.

HIGH IMPACT:

* **importing sketch files for translation** - copy attributes from shapes like colors, fonts, shadows, backgrounds. Source of truth for that information stays in Sketch. Separation of concerns between Tandem & design apps. Seems scalable, but need to test.

QUEUE:

styles panel
