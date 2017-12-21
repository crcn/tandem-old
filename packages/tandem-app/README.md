IMMEDIATE:

- [ ] diff/patch for slim-dom 
- [ ] query selector testing

- [ ] perf test - (preview a TON of windows.)
- [ ] CSS Inspector

- [ ] Bugs
  - [ ] adding & removing windows causes an exception
  - [ ] dev server stops after a while
  - [ ] making change then saving (quickly) replaces content with `[object Object]`
  
- [ ] Tandem
  - [ ] do NOT reload window if error occurs - causes flickering. Display error instead.
  - [ ] breadcrumbs
    - [ ] cmd click breadcrumb to view source
    - [ ] scrolling - no line break
  - [ ] UX
    - [ ] spinner 

HIGH PRIO:

- [ ] Native elements pane

- [ ] Components panes
  - [ ] DND elements to other elements
  - [ ] native elements

- [ ] Tandem
  - [ ] Components Pane
    - [ ] DND components to existing components
    - [ ] filter
  - [ ] CSS Inspector
    - [ ] toggle eye
    - [ ] add declaration
    - [ ] delete declaration
    - [ ] edit declaration
    - [ ] add style rule (auto add to scoped style element)
    - [ ] `:root` inspecting
  - [ ] Guides
    - [ ] snap DND

LOW PRIO:

- [ ] remove synthetic browser impl

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