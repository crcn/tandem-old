very simple online playground for visually creating web applications

TODOS:

- [ ] show measurements between elements (hotkey)
- [ ] snap to element DND
- [ ] ruler tool

- [ ] CSS Inspector
  - [ ] flag invalid properties
  - [ ] autocomplete

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
