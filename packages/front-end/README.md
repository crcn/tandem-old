MILESTONE OBJECTIVE: get to point where styles panel can be created in Tandem.

IMMEDIATE:

- fix selection
- fix overriding children
- variants (design tabs with this)
- tabs
- multiple windows

- components
  - dropdown
  - button
  - text input
  - background input
  - pane
  - split pane view
  - tabs
- styles pane
  - basic components
    - background fill
  - panes
    - typography
      - text alignment
      - font family
- ability to load images

TOMORROW (FRI):

- use JSON instead of PC (no compiling necessary)
- renaming layers
- changing text
- edit text
- changing types
- react compiler
- quick search
- style panel
- variants


TODO (UNORG AFTER OBJECTIVE):


- styles pane
  - color picker
  - layout constraint (abstract CSS)


- UX
  - highlight child variant

- WOWZA
  - merge conflict resolver
  - browsertap integration
  - sharing online
  - GIT integration

FEATURES:

- multiple file tabs (like vscode)
- ability to inherit styles from other components?

- states
  -
- style pane
  - background color
  - position
  - size
- insert new elements
- layers pane
  - move elements around
- navigator pane
- load dependencies from other files
- load dependency graph from file directory (scan for PC files)
- load initial file based on file directory
- start persisting changes to dependency graph


POLISH (after MVP):

- zoom
- pixel grid
- remove *Component from name

IMMEDIATE:

- [ ] web workers for editing files
- [ ] get canvas to state where HiFi components can be create with D&D interface
  - [ ] measurement tools
  - [ ] grid tool
  - [ ] resizer
  - [ ] drop box tool (div)

GOALS:

- [ ] MUST be runnable on the web
- [ ] ability to create hifi mock-ups like in sketch
  - [ ] product should eventually support SVG, but this is NOT an MVP feature
- [ ] ability to create variants
- [ ] web worker for compiling pc components
- [ ] ability to edit any file
  - [ ] PC files in split view (like vscode)
  - [ ] markdown (plain text)

TODOS:

- [ ] color picker
  - [ ] swatches

- [ ] start on components -- create single page of all examples
- [ ] components (in order of importance)
  - [ ] left gutter
    - [ ] file navigator
    - [ ] open files
      - [ ] show selectable objects (components, styles )
    - [ ] Layers (part of open files?)
  - [ ] toolbar
    - [ ] artboard tool
    - [ ] text tool
    - [ ] insert component tool (native, or custom)
  - [ ] right gutter
     - [ ] element settings
     - [ ] element style
  - [ ] css inspector
  - [ ] context menu
  - [ ] canvas
    - [ ] measurement
    - [ ] grid (zoomed in)
    - [ ] resizer
  - [ ] atoms
    - [ ] measurement input
      - [ ] scrollable
    - [ ] input


QUESTIONS:

- [ ] possible to make pretty style pane similar to inspector? Could be _all_ styles combined. Quick shortcuts for things like background, typography, shadows.
  - [ ] needs to be visually present


- [ ] core
  - [ ] web worker


