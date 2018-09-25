CURRENT GOAL: Polish Tandem & put in 

REQUIRED BEFORE RELEASE:

- ability to start new project
- example project
- website
- icon
- right pane polish


NEXT:

- ability to change component types
- default labels must be exported
- ability to unset values
- properties tab
  - export name
- override reset
- bolden overridden props
- inherit typography styles
- overrides not working quite right

- performance
  - refreshInspectorPane takes 1s in some cases.
    - calc OTs instead of refreshing pane (possibly re-usable with synthetic graph)

- right gutter polish 
  - UI for overrides
  - display inherited typography

- ability to load images
- ability to create new project

- Examples
  - TodoMVC
  - Astroids game

- website

* instance style reset

* BUGS
  - make hotkeys in app
  - clientHeight error when deleting items too quickly

- style inheritence

  - bolden label to indicate override
  - hover over label should show parent
  - fill in typography with parent props

- UX

  - possibly _export_ functionality for code
  - secondary input for slider (particularly for opacity)
  - all layers must be exposed. For component instances, take component label
  - shortcuts shouldn't be triggered when keys are pressed
  - select parent hotkey
  - breadcrumbs

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
