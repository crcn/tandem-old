TODO:

- resizer
- move elements around (persist)
- multi-select elements
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


POLISH:

- zoom
- pixel grid
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

