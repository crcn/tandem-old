very simple online playground for visually creating web applications

TODOS:

- [ ] show measurements between elements (hotkey)
- [ ] snap to element DND
- [ ] css inspector components

LITMUS:

- [ ] should be able to build sites without writing much code

IMMEDIATE:

high-level - use tandem as an inspector for PC files. Still need to hand-write components, but slowly integrate writing from tandem side.

- [ ] Paperclip
  - [ ] import external JS scripts
  - [ ] import external CSS scripts
  - [ ] transpile TS to JS 
  - [ ] figure out how to pass objects to attributes - (set as prop) (possibly check for <props>)

- [ ] Components
  - [ ] color picker
  - [ ] CSS Inspector
    - [ ] color picker
    - [ ] editable properties
    - [ ] var() inspector
    - [ ] :root editor
    - [ ] shadow editor
    - [ ] margin editor

- [ ] Awesome features
   - [ ] live view (switch to iframe) in editor
   - [ ] 

- [ ] paperclip HMR needs to work outside of editor

- [ ] Bugs
  - [ ] allow refresh when script busts
  - [ ] external links are broken
  - [ ] matching styles must also consider slots** - (used assignedSlot for this)
  - [ ] multi drag windows doesn't work properly
  - [ ] editing content from UI still breaks (drag cell)
  - [ ] !important flags show up as overridden in style pane
  - [ ] cannot parse semicolon within CSS string ("; ")
  - [ ] enable javascript expressions in blocks

- [ ] Assist
  - [ ] best guess for CSS selector

- [ ] Window pane
  - [ ] Fit to content

AFTER INITIAL COMPONENTS:

- [ ] Components pane
  - [ ] refresh when local source change
  - [ ] 

- [ ] Color picker
  - [ ] pick presets from :root

- [ ] VSCode integration

- [ ] enable javascript - needed to play with components
- [ ] BUGS
- [ ] vscode integration
  - [ ] new components should refresh 
  components pane
  - [ ] Open current file in Tandem (should open new window)
  - [ ] show component pane on initial load
  - [ ] empty state should instruct to drag file from pane
- [ ] ability to delete CSS rules
- [ ] adding new style in right pane
- [ ] visual stack traces about how results are computed -- allow for any kind of black box expression.
- [ ] create new components
- [ ] dnd elements to existing components
- [ ] wire up edit text content
- [ ] allow multiple <preview /> tags -- toggle within 
editor
- [ ] create new component when _native_ element is dropped onto the canvas
- [ ] create a new window when a _custom_ component is dropped onto the canvas
- [ ] add dropped component to existing element
- [ ] re-wire up vscode extension
- [ ] * color presets should be picked from :root vars

- [ ] components
  - [ ] color picker
  - [ ] pretty pane
  - [ ] CSS inspector (in paperclip)
