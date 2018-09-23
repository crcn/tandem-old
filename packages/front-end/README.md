IMMEDIATE:

- quick search

- allow for PC files to be renamed
- refresh when files change
- refactor file navigator
  - allow for pc files to be renamed
  - moving files / folders
  - context menu
    - deleting files
    - renaming
  - renaming pc files should reload dependency graph
- custom chrome
  project name in titlebar
- text preview (code)

* top bar must scroll
* refactor styles pane to use computed override map instead of derriving props from synthetic elements.
* varaible text inputs
* inherit styles from parent typogograph

* override resets

* wire up variables input
  - dropdown UI change ()
  - input auto-complete

- start refactoring UI to use variables using same color scheme

  - remove inherited styles
  - ensure that no wild colors exist (create linting tool)

- selectedVariant fudges with other panes
- variants don't show up for instances
- variants for component that inherit instance
- inherit styles per variant
-

* instance style reset

* BUGS

  - clientHeight error when deleting items too quickly
  - cannot inherit for instances

* unsaved prompt
* unsaved button

- style inheritence

  - bolden label to indicate override
  - hover over label should show parent
  - fill in typography with parent props

- redesign variants pane

- EASY

  - eliminiate recompose
  - reduce `root` usage

- UX

  - secondary input for slider (particularly for opacity)
  - all layers must be expose. For component instances, take component label
  - shortcuts shouldn't be triggered when keys are pressed
  - unsaved files indicator
  - select parent hotkey

- fix controllers pane

- prepare for online usage

  - edit code in app
  - preview tab
  - "download app" button

- update variant input
  - not toggleable

* start redesign (dark)

BUGS:

- inherit typography
- open file modal should have editorWindowId prop instead of EditorWindows holding preferences to open files.
- Elements should be draggable of their position is absolute|fixed|relative

STABILITY:

- CI integration
- istanbul coverage

UI:

- breadcrumb view
  - ability to drop element into crumb
  - ability to insert element into crumb
- Frames pane
  - mobile presets
  - size & position controls
- context menu

SAFETY:

- prevent component instances from being deleted
- prohibit circular components

UX ENHANCEMENTS:

- style pane

  - single input for margin, and padding (like borders)

- warning sign if label name if overriding another
- move component picker to quick search
- persist changes to master component
- ability to hide left gutter
- component HUD should have native element options
- screenshot of components
- When dragging elements to canvas, should highlight layers
- alert save before closing
- ability to measure between elements
- screenshots
- "create component file" button
