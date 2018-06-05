IMMEDIATE:

* drop file into canvas to import all
* ability to use images
  * dnd file images to stage should create component
* move components to separate files (need to globally load components)
* update code compiler to handle overrides
* wire up styles panel

BUGS:

* cannot override in some cases (try changing variant text in right gutter component)
* padding / margins affect pane
* diffing / patching doesn't work in some re-ordering scenarios

USEFUL:

* ability to load images & other resources in PC file. (start with ionicons)
* ability to persist instance changes to main component
* insert rect into layer pane should work
* drag element layers to canvas
* when dragging, should display hovering on stage
* multi selector
* C for inserting components to stage (needs to show HUD)
* Minimap of document
* pasted elements should be added after selected node
* Measurement tools (not snapping)
* drop component to stage to create instance
* copy & paste images (like components) to create new instances

COMPONENTS:

* Components (left gutter)
  * display preview of component
* Re-design layers panel
* Re-design files pane

HIGH IMPACT:

* **importing sketch files for translation** - copy attributes from shapes like colors, fonts, shadows, backgrounds. Source of truth for that information stays in Sketch. Separation of concerns between Tandem & design apps. Seems scalable, but need to test.
