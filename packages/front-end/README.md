MILESTONE OBJECTIVE: get to point where styles panel can be created in Tandem.TOP:

IMMEDIATE:

* persist raw style
* expanding / collapsing PC layers
* moving layers
* renaming PC layers
* back onto styling doc

* ability to load images & other resources in PC file. (start with ionicons)
* document bounds on element should be stored in editor namespace
* when converting elements to artboards, move new artboard to BEST position
* select newly inserted elements

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
