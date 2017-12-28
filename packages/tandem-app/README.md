IMMEDIATE:

- [ ] fix eye toggler
- [ ] wire up eye toggler
- [ ] parse imported styles 
- [ ] show inherited props from slots
- [ ] lock computed properties
- [ ] changes to css files should trigger reload

- [ ] CSS Inspector* 
  - [ ] eye toggler
  - [ ] add new style - specific to target element
  - [ ] delete style rule
  - [ ] delete declaration
  - [ ] edit raw declaration value
  - [ ] inspect `:root`
  - [ ] prioritized css 

- [ ] persistence
  - [ ] persist css changes in css inspector

- [ ] Components pane
  - [ ] add new new component
  - [ ] delete component
  - [ ] highlight artboards that match component cells

- [ ] Native elements pane

- [ ] stage tools
  - [ ] DND elements (native & custom) to stage elements
    - [ ] auto select dropped element
    - [ ] "Double click to edit" for text
    
  - [ ] prompt to create new element when native element dropped to empty space

- [ ] Bug fixing
  - [ ] "Cannot read property 'type' of undefined" - start typing new component
  - [ ] Infinite loop - create new [[if statement]]
  - [ ] preview hangs up when removing primary child
  - [ ] allow for string style attributes
  - [ ] transpiling react scoped styles doesn't work for `.loader, .loader:after` - need to properly parse and transform 
  - [ ] hovering prop not working for components pane
  - [ ] **NULL replacing content (hard to reproduce)
  - [ ] **disconnecting front-end after a while -- smells like things are getting clogged up
  - [ ] need to recompute bounds when images load
  - [ ] fix flickering for imported files

- [ ] CSS Inspector enhanced
  - [ ] color picker
  - [ ] measurement converter

- [ ] breadcrumbs

- [ ] stage tools enhanced
  - [ ] highlight affected nodes
  - [ ] snap into place tools
  - [ ] multi select artboards
  - [ ] warning for multi selecting elements

- [ ] Error pane (displayed in footer - pops )
  - [ ] error items display "quick fix" button that points user to UI where they can make change.

- [ ] pretty CSS pane

- [ ] Bugs
  - [ ] dev server stops after a while
  - [ ] making change then saving (quickly) replaces content with `[object Object]`

SAFETY FEATURES:

- [ ] ALL errors pane showing paperclip warnings
  
LOW PRIO:

- [ ] do not allow artboards to overlap

POSSIBLY:

- [ ] Paperclip
  - [ ] implement "is" with components
    - [ ] can do neat diagrams about grouped elements
    - [ ] ability to inherit styles (assuming it matches spec)

- [ ] show inferred types for component as they're being coded

#### FOCUS

- [ ] Safety is #1 priority
  - [ ] type safety
  - [ ] 
- [ ] Warnings & Errors for paperclip
- [ ] Must be able to code everything visually (conditions as well)

#### V0 (before launch)

- [ ] paperclip
  - [ ] v1.5 type inferences
  - [ ] remove component properties -- scan for them.

#### V1

- [ ] Paperclip
  - [ ] warn when component id overriden
  - [ ] Linter
- [ ] Stage tools
  - [ ] highlight dynamic bindings
  - [ ] 
- [ ] CSS Editor
  - [ ] add new style rule
  - [ ] add new style declaration
  - [ ] box shadow editor
  - [ ] background color editor
  - [ ] filter editor
  - [ ] measurement converter (px <-> %)
  - [ ] :root editor
  - [ ] var() editor
- [ ] text editor integration
  - [ ] vscode
    - [ ] 
- [ ] Components pane
- [ ] promo
  - [ ] ui kit 
- [ ] Type safety
  - [ ] Display error when component is missing a prop (even with spread operator)
  - [ ] Display banner error for syntax errors
- [ ] Website
  - [ ] Example on site
- [ ] Screenshots
  - [ ] visual difference?

#### V2

- [ ] Paperclip 
  - [ ] strong types
  - [ ] source maps support
  - [ ] i18n errors

- [ ] Tandem
  - [ ] Components filter
  - [ ] Themable

- [ ] Sketch file import
  - [ ] `<vector src="./file.sketch" name="Some vector icon" />

#### V3

- [ ] Notes
- [ ] Git integration
- [ ] FSM - connecting UIs