OBJECTIVE:

- eliminate current friction. Don't focus on UI.
- make compiler more efficient. UI needs to be more explicit.

IMMEDIATE:

- explicit props
- explicit slots
- dts
- variables
- more paperclip tests
- design controls
  - border input
  - color picker
    - swatches
    - RGBA / HSA / HEX inputs
  - box shadows
  - clear overrides functionality (need to reset to inherited styles)
- variables (easier to refactor to this)
- controller UI
- better place to expose properties
- redesign (see https://dribbble.com/shots/4781001-Figma)
- dts
  - code compiler watcher
- sync frames & metadata
- show controllers
- AJ handoff
- Rust interp
- file navigator refactor
- open files refactor
- preview in app
  - "preview mode" banner
  - "click to interact" button
  - auto save in preview mode

FRICTION POINTS:

- lack of breadcrumbs
- lack of element labels on hover

UX PROBLEMS:

- hard to find components. Need to include in quick search.

BUGS:

- prohibit immutable elements from being deleted
- dropdown must close when another opens
- inherit typography
- tab + open files syncing fix
- open file modal should have editorWindowId prop instead of EditorWindows holding preferences to open files.
- Elements should be draggable of their position is absolute|fixed|relative

Stability:

- CI integration
- istanbul coverage
- more tests

OPTIMIZATIONS:

- maintain history on editor state. (used for syncing)

UX OPTIMIZATIONS:

- When dragging elements to canvas, should highlight layers
- meta + click component instances to reveal component (in separate tab)
- alert save before closing
- ability to measure between elements
- screenshots
- "create component file" button

UI:

- breadcrumb view
  - ability to drop element into crumb
  - ability to insert element into crumb
- component controller UI
- Frames pane
  - mobile presets
  - size & position controls
- Split pane view
- context menu
- UI for defining code props

SAFETY:

- prevent component instances from being deleted

UX BUGS:

UX ENHANCEMENTS:

- quick search for components (update search)
- meta click to navigate to source
- persist changes to parent component
- split view
- breadcrumbs
- ability to hide left gutter
- component HUD should have native element options
- screenshot of components
