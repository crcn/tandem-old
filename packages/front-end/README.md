IMMEDIATE:

* Styler
  * right gutter drawer
  * Spacing
  * Box Shadows
  * code tab
    * raw input
  * Borders pane
* Properties
  * Type
  * Attributes (raw)
* Left Gutter

  * Tree Component
  * Open Files
    * Display labels that are exposed for public API
  * Navigator

* tab bar (canvas)

* Workspace

* Polish

  * "Live" button connecting to HMR
  * Typed generation files
  * Styles Pane
    * Gradient input
  * split view
  * Rust port

* Ability to override instance labels. Used to expose layers

NEXT WEEK:

* breadcrumb view
* mobile size preset (when selecting content node)

BUGS:

* diffing / patching doesn't work in some re-ordering scenarios
* Typography needs to be inherited

USEFUL:

* switch tabs using cmd+shift+[/]
* Function for explicitly defining cascading styles
* Unhandled notification (allows for console to be hidden)
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
* move elements on canvas to other elements (source elements must be statically positioned)
* tabs model maintaining canvas state of each open file
* inspector-like UI for editing CSS
  * display overrides similar to selector overrides
* ability to drop component into EMPTY file
* ability to navigate to source component
* alert to save before closing
* ability to attach controller to components
* custom tooling depending on native element
  * UL - stage UI for adding list item

LOW PRIO TODOS:

* Navigator
  * auto expand file when opened

SAFETY:

* ensure that ids aren't colliding
  * will happen if a file is copied

COMPONENTS:

* Components (left gutter)
  * display preview of component
* Re-design layers panel
* Re-design files pane

HIGH IMPACT:

* **importing sketch files for translation** - copy attributes from shapes like colors, fonts, shadows, backgrounds. Source of truth for that information stays in Sketch. Separation of concerns between Tandem & design apps. Seems scalable, but need to test.
