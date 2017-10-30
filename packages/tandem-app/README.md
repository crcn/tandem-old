very simple online playground for visually creating web applications

LAUNCHING:

- [ ] Alpha will support paperclip DSL only -- future platforms later on
- [ ] *needs to be labeled as experimental

TODOS:

- [ ] show measurements between elements (hotkey)
- [ ] snap to element DND
- [ ] css inspector components

IMMEDIATE:

high-level - use tandem as an inspector for PC files. Still need to hand-write components, but slowly integrate writing from tandem side.

- [ ] CSS vars, duh.
- [ ] vscode integration
  - [ ] override tandem server
  - [ ] new components should refresh components pane
  - [ ] update buffer when string changes
  - [ ] local storage based on CWD
  - [ ] Open current file in Tandem (should open new window)
  - [ ] show component pane on initial load
  - [ ] empty state should instruct to drag file from pane
- [ ] ability to delete CSS rules
- [ ] adding new style in right pane
- [ ] visual stack traces about how results are computed -- allow for any kind of black box expression.
- [ ] create new components
- [ ] dnd elements to existing components
- [ ] wire up edit text content
- [ ] allow multiple <preview /> tags -- toggle within editor
- [ ] DND for components to existing elements
- [ ] create new component when _native_ element is dropped onto the canvas
- [ ] create a new window when a _custom_ component is dropped onto the canvas
- [ ] add dropped component to existing element
- [ ] re-wire up vscode extension

Steps to visual dev:

- create new window tool
- DND components to canvas tool
- add new style rule button (scoped)
- define where children go
- registered components based on scanned files (from manifest.json)
- manifest defined outside of window -- dev server should be attached to workspace
- windows can have path which puts them in a nested structure (for navigating)


Questions:

- what sketch-like ui tools can be used that won't break the editor?


- [ ] CSS Inspector
  - [ ] flag invalid properties
  - [ ] autocomplete

CSS INSPECTOR COMPONENT STRATEGY:

- use component DND for each element
- code should be vanilla HTML & CSS with dynamic blocks (paperclip)
- registered components for DND
- identify where children should be dropped to
- color picker should contain pallete for manifest.json


PAPERCLIP DSL TODOS:

- [ ] manifest.json
- [ ] repeat component
- [ ] 

GOALS:

- [ ] UX similar to regular browsers
  - [ ] right click inspect element (source code though)
- [ ] built extensions API for windows to hook into
- [ ] developing a language that is optimial for visual development, not hand writing.
  - [ ] visual first, hand-writing second. 
- [ ] appeal to developers first
  - [ ] similar to chrome inspector for now - evolve later on
- [ ] low barrier to entry. Install text editor dev tools, start using with project


COMPONENTS TO START VISUAL DEV QUICKLY:

- [ ] CSS Inspector*
- [ ] on canvas visual tools
- [ ] HTML inspector* (show source code)
- [ ] rich visual tools for CSS properties
  - [ ] color picker
  - [ ] convert measurements (px -> %)
- [ ] stage tools
  - [ ] measuring between elements
  - [ ] 
- [ ] Move style properties to CSS declaration

LITMUS:

- [ ] rebuild mesh.js.org (as async await iterator library)
- [ ] rebuild paperclip.js.org 
- [ ] test against 4k styles

COOL TO HAVE:

- [ ] SVG editing

IMMEDIATE:

- [ ] synthetic browser tests
- [ ] properly reload CSS
- [ ] cleanup socket.io connections
- [ ] timers

NON-GOALS:

- [ ] to cover 100% of UI design & development
- [ ] to attract people with _no_ knowledge of HTML & CSS.

- POLISH:

- [ ] preview mode for windows (opens window in iframe)
- [ ] zoom indicator
- [ ] measurement tooling
- [ ] highlight elements based on text cursor position
- [ ] copy + paste elements
- [ ] meta keywords for controlling UI
  - [ ] `<meta name="no-tools" />`
  - [ ] `<meta name="device=ios5" />` for ios tool overlay
  - [ ] `<meta name="background-task" />` hides window from stage
- [ ] AWS lambda for rendering
- [ ] persisting to local storage needs to reload sibling windows
- [ ] POST needs to reload sibling windows (not self)


- COMPATIBILITY CHECKLIST:

- [ ] works with browser sync
- [ ] works with webpack HMR

- UX

- [ ] notify user when window doesn't have source maps
  - [ ] possibly dim or overlay elements that are not editable
  - [ ] use popdown
- [ ] identify non-editable elements

CLEANUP:

- [ ] file cache namespaced to workspace
- [ ] use old DOM rendering code
- [ ] keep measurements when resizing
- [ ] XHR handler for server

BUGS:


MVP:

- save workspace online

After validating:

- remote renderer


REV:

$var: 5
$var2: $var * 3;
$var3: $var2 * 5;


