MILESTONE OBJECTIVE: get to point where styles panel can be created in Tandem.
FOCUS: **do what's convenient for you**
TOP:

IMMEDIATE:

* ability to load images & other resources in PC file. **helps with arch**.
* When dropping a new element, ensure that it ends up where the mouse is, even when zoomed in.
* Use native elements as source node tags.
* document bounds on element should be stored in editor namespace
* node IDS should be unique\*\* (always use `createSyntheticElement`)
* when converting elements to artboards, move new artboard to BEST position
* select newly inserted elements
* When inserting new elements, only highlight slots when mouse is over component instance

CLEAN UP:

* do not use `undefined` for default namespace
* eliminiate getAttribute usage
* evaluate whether to actually use `attributes` or `props`
* eliminiate `ref` attribute. Use `id` instead.
* change SyntheticWindow to SyntheticDocument
* change SyntheticDocument to SyntheticFrame
* change `xmlns` to `ns`
* component style props need to go on `template` instead
* move `Dependency` to separate
* root nodes must have separate bounds param
* use Box (left, top, width, height) instead of bounds
* add Constraints (left, top, right, bottom)

HIGH PRIO:

* **move back to style sheets** - functionality is already built-in for overriding styles. Will be a cleaner compile. Works better for future
  ideas around importing other design files like Sketch
* **stronger source data type, don't use tree node structure**

HIGH IMPACT:

* **importing sketch files for translation** - copy attributes from shapes like colors, fonts, shadows, backgrounds. Source of truth for that information stays in Sketch. Separation of concerns between Tandem & design apps. Seems scalable, but need to test.

QUEUE:

styles panel
