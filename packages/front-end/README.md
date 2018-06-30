IMMEDIATE:

* do not sync synthetic metadata
* fetch frame bounds from source metadata
* controller UI
* better place to expose properties
* dts
  * code compiler watcher
* sync frames & metadata
* show controllers
* AJ handoff
* .tdproject source of truth
  * move pc config to here
* Rust interp
* variables
* measurement input UI
* ability to load fonts
  * store in pc config
* make UI consistent
* file navigator refactor
* react dts files
  * generate on project save
* open files refactor
* prohibit instance layers from being deleted
* drop shadows input
* preview in app
  * "preview mode" banner
  * "click to interact" button
* component controller UI


UX PROBLEMS:

* hard to find components. Need to include in quick search.


BUGS:

* prohibit immutable elements from being deleted
* dropdown must close when another opens
* inherit typography
* tab + open files syncing fix
* open file modal should have editorWindowId prop instead of EditorWindows holding preferences to open files.
* Elements should be draggable of their position is absolute|fixed|relative

Stability:

* CI integration
* istanbul coverage
* more tests

OPTIMIZATIONS:

* maintain history on editor state. (used for syncing)

UX OPTIMIZATIONS:

* When dragging elements to canvas, should highlight layers
* meta + click component instances to reveal component (in separate tab)
* component preview in picker
* alert save before closing
* ability to measure between elements
* minimap (use screenshots for this)
* custom UI tooling for elements

UI:

* breadcrumb view
  * ability to drop element into crumb
  * ability to insert element into crumb
* component controller UI
* Frames pane
  * mobile presets
  * size & position controls
* Split pane view
* context menu
* UI for defining code props

SAFETY:

* prevent component instances from being deleted

UX BUGS:


UX ENHANCEMENTS:

* quick search for components (update search)
* meta click to navigate to source
* persist changes to parent component
* split view
* breadcrumbs
* ability to hide left gutter
* component HUD should have native element options
* screenshot of components


