MILESTONE OBJECTIVE: get to point where styles panel can be created in Tandem.TOP:

IMMEDIATE:

* switching between files doesn't work
* ability to move frames
* persist raw style
* insert commands need to work
* expanding / collapsing PC layers
* renaming PC layers
* start on _master_ doc

* ability to load images & other resources in PC file. (start with ionicons)
* document bounds on element should be stored in editor namespace
* when converting elements to artboards, move new artboard to BEST position
* select newly inserted elements
* When inserting new elements, only highlight slots when mouse is over component instance

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
