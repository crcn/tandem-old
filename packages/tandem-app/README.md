IMMEDIATE:

- [ ] warning if preview tag is missing
- [ ] open window with respected preview size from vscode
- [ ] error banner if cannot open file via meta click
- [ ] get keyframes to work
- [ ] keyframe diffing

HIGH PRIO:

- [ ] Bug fixing
  - [ ] "Cannot read property 'type' of undefined" - start typing new component
  - [ ] Infinite loop - create new [[if statement]]

- [ ] CSS Inspector* 
  - [ ] show inherited props from slots
  - [ ] eye toggler
  - [ ] add new style - specific to target element
  - [ ] delete style rule
  - [ ] delete declaration
  - [ ] edit raw declaration value
  - [ ] inspect `:root`


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

#### V3

- [ ] Notes
- [ ] Git integration
- [ ] FSM - connecting UIs