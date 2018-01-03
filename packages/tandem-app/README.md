IMMEDIATE:

- [ ] edit selector text
- [ ] add style rule
- [ ] delete style rule
- [ ] psuedo selectors need to show up

- [ ] WARM UP
  - [ ] width/height labels around hovered & selected stage items (like inspector)
  - [ ] get padding / margin stage tool working again
  - [ ] investigate why syntax errors do not show up
  - [ ] disabled CSS declaration eye should not be dimmed
  - [ ] start on error handling for FE
  - [ ] check if conditional slots work

- [ ] Bugs
  - [ ] pseudo selectors don't work (:focus, :after: :before)
  - [ ] removing hover prop on css inspector component doesn't remove eye icon.
  - [ ] full screen mode doesn't resize when gutters are toggled
  - [ ] `calc(100% - 10px)` parses as a list, not as an op expr

- [ ] CSS Inspector* 
  - [ ] add new style - specific to target element
  - [ ] delete style rule
  - [ ] delete declaration
  - [ ] edit raw declaration value
  - [ ] prioritized css 
  - [ ] quick add style feature (like chrome inspector)

- [ ] Color inspector
  - [ ] hsl picker
  - [ ] hue icker
  - [ ] alpha picker
  - [ ] color preview
  - [ ] li

- [ ] shadow picker
- [ ] border inspector

- [ ] Pretty CSS Inspector

- [ ] persistence
  - [ ] persist css changes in css inspector

- [ ] UX
  - [ ] `computed` property locks dynamic styles. Should also have a special UI associated with them that links to the source code.

- [ ] Components pane
  - [ ] add new new component
  - [ ] delete component
  - [ ] highlight artboards that match component cells

- [ ] Pretty pane

- [ ] Native elements pane

- [ ] HTML layers

- [ ] stage tools
  - [ ] DND elements (native & custom) to stage elements
    - [ ] auto select dropped element
    - [ ] "Double click to edit" for text
    
  - [ ] prompt to create new element when native element dropped to empty space

- [ ] Bug fixing
  - [ ] "Cannot read property 'type' of undefined" - start typing new component
  - [ ] preview hangs up when removing primary child
  - [ ] transpiling react scoped styles doesn't work for `.loader, .loader:after` - need to properly parse and transform 
  - [ ] **NULL replacing content (hard to reproduce)
  - [ ] need to recompute bounds when images load
  - [ ] fix flickering for imported css files

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

#### LAUNCH
- [ ] online playground. Ability to export components as zip file.

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
- [ ] Sketch file import
  - [ ] `<vector src="./file.sketch" name="Some vector icon" />

- [ ] paperclip
  - [ ] use Rust for parsing & evaluating
