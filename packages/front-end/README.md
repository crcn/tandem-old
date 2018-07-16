OBJECTIVE:

- eliminate current friction. Don't focus on UI.
- make compiler more efficient. UI needs to be more explicit.

IMMEDIATE:

- PC layers

  - dnd before
  - dnd after
  - dnd over
  - rep slots
  - update DND canvas to accept INSPECTOR_NODE instead of SYNTHETIC_NODE

- Bindings

  - convert to slot shortcut
    - prohibit text elements
    - auto-generate id
  - bindings UI
    - ability to change names
    - scan for bindable element props (native, and custom)

- update code compiler to use new bindings functionality
- typed definition file
- eliminiate

* VSCode
  - Tandem button for opening assoc `*.pc` file (scan PC files for controller)
    - dropdown if multiple controllers attached

- shadow DOM
  - Update UI to reflect shadow (implicit)
  - property bindings UI
    - overridable children (will show up as a slot in the UI)
  - generate random slot name
  - update paperclip to new shadow DOM
    - evaluator must work
    - better patching algorithm for synthetic DOM - `patchSyntheticDOM(syntheticDOM, dslOTs)`
      - this should probably be done internally withinthe synthetic eval script
  - update front-end to persist to data model
  - warning for any case where child overrides exist
  - start refactoring front-end UI to new shadow DOM
  - refactor left side gutter (litmus test)

* inherit style must work work with variants
* measure tool for distance between elements
* show hovered element heights
* shadow DOM updates.
  - needs to come first since it will affect data model c
  - keep this in tandem with pane panes
* update all icons to have same padding
* box shadow color picking doesn't work properly
* research on existing design tools
* gradient input
* CSS parser

* start redesign (dark)

- explicit props
  - do not show for shadow nodes
- explicit slots

- inherit pane needs to be supported in variants

- dts
- variables
- more paperclip tests
- design controls
  - border input
  - color picker
    - swatches
    - RGBA / HSA / HEX inputs
  - clear overrides functionality (need to reset to inherited styles)
- controller UI
- better place to expose properties
- redesign (see https://dribbble.com/shots/4781001-Figma)
- dts
  - code compiler watcher
- show controllers
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
- sometimes editing shadow instance thinking it's the component.
  - breadcrumbs might help
  - outline might help indicating node type

BUGS:

- variant props sometimes persist to default
- prohibit circular components
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
