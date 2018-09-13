IMMEDIATE:

- alt row color (variant)
- reset prop dropdown
- variants should not be selectable for instances
- deselect selected variant if outside of content node
- experimental window

  - inherit styles
  - inherited styles must be disabled for variants

- instance style reset

  - reset variants too

- get instance variant to work again
- prohibit components from having default styles
- left gutter needs to be resizable

- BUGS
  - cannot inherit for instances

* instance pane (like Figma)

  - reset styles button
  - move variant to here

* style inheritence

  - bolden label to indicate override
  - hover over label should show parent
  - fill in typography with parent props

* redesign variants pane

* EASY

  - eliminiate recompose
  - reduce `root` usage

* UX

  - all layers must be expose. For component instances, take component label
  - shortcuts shouldn't be triggered when keys are pressed
  - unsaved files indicator
  - select parent hotkey

* fix controllers pane

* prepare for online usage

  - edit code in app
  - preview tab
  - "download app" button

* update variant input
  - not toggleable

- start redesign (dark)

UX PROBLEMS:

- hard to find components. Need to include in quick search.
- labels should really be "names" and exported. Prohibit spacing

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
