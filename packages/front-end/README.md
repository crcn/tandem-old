IMMEDIATE:

* Build tools

  * install & link deps
  * prohibit push if package is touched without publish

* test setup from clean run
* possibly setup docker

* open file page
* SVG options
* clean up build process
* increase speed of build
* ability to load fonts
* flexbox
* variables
* Refactor layers pane to mirror AST
* _import_ SVG file when dropped, don't include it

- Styler
  * right gutter drawer
  * Spacing
  * Box Shadows
  * code tab
    * raw input (inspector style)
  * Borders pane
- Properties
  * Type
  * Attributes (raw)
- Left Gutter
- Variants

* Layers

  * Possibly represent AST instead of synthetic nodes

* breadcrumb view
* mobile size preset (when selecting content node)

  * Tree Component
  * Open Files
    * Display labels that are exposed for public API
  * Navigator

- tab bar (canvas)

- Workspace

Polish:

* Typed generation files
* Styles Pane
  * Gradient input
* split view
* Rust port
* component preview
* context menu
* insert rect into layer pane should work
* drag element layers to canvas
* when dragging, should display hovering on stage
* drop component to stage to create instance
* ability to drop component into EMPTY file
* alert to save before closing
* fail safe for clobbered tree IDs
* ability to navigate to source component
* show info when component doesn't exist

- Ability to override instance labels. Used to expose layers

BUGS:

* diffing / patching doesn't work in some re-ordering scenarios
* Typography needs to be inherited

USEFUL:

* Prohibit component from being deleted until all references are removed
* Unhandled notification (allows for console to be hidden, necessary for Alpha too & reporting)
* ability to load images & other resources in PC file. (start with ionicons)
* ability to persist instance changes to main component
* C for inserting components to stage (needs to show HUD)
* Minimap of document
* pasted elements should be added after selected node
* Measurement tools (not snapping)
* custom tooling depending on native element
  * UL - stage UI for adding list item

LOW PRIO TODOS:

* Navigator
  * auto expand file when opened

SAFETY:

* ensure that ids aren't colliding
  * will happen if a file is copied

HIGH IMPACT:

* **importing sketch files for translation** - copy attributes from shapes like colors, fonts, shadows, backgrounds. Source of truth for that information stays in Sketch. Separation of concerns between Tandem & design apps. Seems scalable, but need to test.
