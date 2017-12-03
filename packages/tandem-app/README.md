RESEARCH:

- [ ] spread prop for react. Why? Why not?

IMMEDIATE:

(need to start using tandem to build itself completely)

- [ ] Cleanup
  - [ ] remove aerial-sandbox

- [ ] Bugs
  - [ ] cannot remove CSS selectors (try removing td-stage for workspace)

- [ ] VSCode
  - [ ] change do not always show up immediately
  - [ ] Open current file in Tandem
  - [ ] *syncing issues with code
  - [ ] edit live button hovering over components
  - [ ] auto complete for components 

- [ ] Tandem
  - [ ] do NOT reload window if error occurs - causes flickering. Display error instead.
  - [ ] cache files on front-end
    - [ ] pool loading resources
  - [ ] breadcrumbs
    - [ ] cmd click breadcrumb to view source
    - [ ] scrolling - no line break
    - [ ] update UI

- [ ] Paperclip
  - [ ] make it resilient to exceptions

HIGH PRIO:

- [ ] paperclipc
  - [ ] Must work with firefox

- [ ] Native elements pane

- [ ] Components pane
  - [ ] + button
  - [ ] DND elements to stage (create new window)
    - [ ] insert preview for elements that do not have one
  - [ ] DND elements to other elements
  - [ ] native elements

- [ ] UX
  - [ ] turn features on / off based on server capabilities
    - [ ] ability to add or remove components

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

PROBLEMS:

- [ ] views not need props by react components

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
  - [ ] content editor (need mutations lib)
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
- [ ] Screenshots