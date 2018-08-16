IMMEDIATE:

- fix exception for dropdown
- fix style pane props

- fix evaluator exceptions on initial start up
- dts configuration

- update variant input
  - not toggleable

* start redesign (dark)

UX PROBLEMS:

- hard to find components. Need to include in quick search.
- labels should really be "names" and exported. Prohibit spacing

BUGS:

- dropdown must close when another opens
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
