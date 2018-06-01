MILESTONE OBJECTIVE: get to point where styles panel can be created in Tandem.TOP:

IMMEDIATE:

* generalize all overrides to <override key="name" value="a">OR value here</override>
* update override tests
* child overrides
* back onto styling doc
  * **color picker**
* update code compiler to handle overrides
* select inserted elements

* NO imports. All components should be global.
* ability to load images & other resources in PC file. (start with ionicons)
* document bounds on element should be stored in editor namespace
* when converting elements to artboards, move new artboard to BEST position
* select newly inserted elements
* **highlight instances of a selected component**. Part of the function for this is to highlight how an element instance responds to layout constraints.
* eiminate frames. Attach that information to element metadata
* **separate evaluator for creating frames from root module instances**
* evaluator should return a synthetic tree

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
