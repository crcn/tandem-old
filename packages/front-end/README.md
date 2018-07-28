OBJECTIVE:

- eliminate current friction. Don't focus on UI.
- make compiler more efficient. UI needs to be more explicit.

IMMEDIATE:

- ability to name slots
- fix dropdown component
- update compiler to accept bindings
- ensure that all child overrides gone
- make evaluator faster (refactor entirely -- use style sheets for style overrides. Necessary either way for pseudo elements)
  - leverage style sheets for style overrides
  - memoize evaluated instances
- refactor evaluator to compile & run code

* insertion tool should use inspector tree instead of synthetic

- dts compiler (everything explicit)
- refactor TSX
- prohobit override is slot does not exist

* moving component nodes
* test moving to shadow DOM

* prohobit property overrides (necessary)

* property inputs for component dynamic bindings

* update evaluator
* update code compiler to use bindings

- PC layers

  - rep slots

- PC layers (again)
  - prohibit shadow slot labels from being edited

* Variants

  - based on default. Do not allow to be toggleable.

* update code compiler to use new bindings functionality
* typed definition file
* eliminiate

- VSCode
  - Tandem button for opening assoc `*.pc` file (scan PC files for controller)
    - dropdown if multiple controllers attached

* shadow DOM
  - update front-end to persist to data model
  - warning for any case where child overrides exist

- inherit style must work work with variants
- measure tool for distance between elements
- update all icons to have same padding
- box shadow color picking doesn't work properly
- research on existing design tools
- gradient input
- CSS parser

- start redesign (dark)

* explicit props
  - do not show for shadow nodes
* explicit slots

* inherit pane needs to be supported in variants

* dts
* variables
* more paperclip tests
* design controls
  - border input
  - color picker
    - swatches
    - RGBA / HSA / HEX inputs
  - clear overrides functionality (need to reset to inherited styles)
* controller UI
* better place to expose properties
* redesign (see https://dribbble.com/shots/4781001-Figma)
* dts
  - code compiler watcher
* show controllers
* Rust interp
* file navigator refactor
* open files refactor
* preview in app
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
- labels should really be "names" and exported. Prohibit spacing

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
