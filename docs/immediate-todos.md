- obvious implementations
  - [ ] API backend fragment & persisting projects
  - [ ] in-app DB replication

- [ ] saving projects (node-based for now with API) **
- [ ] component library - img, p,
- [ ] fix click through bug with resizer

- [ ] just one style pane - organize declarations by color or similar

- [ ] rotation tool - part of resizer
- [ ] background fill
- [ ] drop shadow tool
- [ ] 3D transform tool
- [ ] animation tool
- [ ] components tool
- [x] ruler tool
- [x] sink tool (snap to grid)
- [ ] on enter key for property, add new property

- [ ] multi-select tool
  - [x] shift click layers
  - [x] shift click preview items
  - [ ] drag select items
  - [x] shift drag to maintain aspect ratio
  - [x] option to maintain center point
  - [ ] ctrl to rotate

- [ ] 3D tool

- [ ] layers
  - [x] hide / show layers with arrow keys (left right)
  - [x] ability to edit attributes directly
  - [x] min width should be bigger
  - [x] ability to add children (plus button)
  - [x] double click to edit - edit whole element
  - [ ] double click layer - edit layer and all children (IDE mode)

- [ ] left bar
  - css declarations (see what they're affecting)

- [ ] mirror mode
  - [ ] show display resolution above canvas + label
  - [ ] show zoom above canvas
  - [ ] highlight canvas in focus
  - [ ] browsertap renderer

- [ ] properties
  - [ ] ability to change style name
  - [ ] breadcrumbs for properties panel
  - [ ] easier way of adding css styles (some filter for typography - drop down)
  - [ ] raw mode for CSS
  - [ ] add style selectors
  - [ ] generic tab -- more sketch like
  - [ ] inputs should word wrap
  - [ ] all inputs text based

- [ ] warnings
  - [ ] when adding children to void elements
  - [ ] when defining left/top props an element that cannot be moved

- [ ] more border information
  - [ ] display line heights

- [ ] shadow DOM for encapsulating review

- [x] history
  - [ ] use git

- [x] alignment tools in props pane

- [x] clipboard
  - [ ] use actual native clipboard for c&p

- [ ] pen tool
  - [ ] points should snap to other horizontal grid points

- [ ] convert HTML to SVG

- [ ] collaboration
  - [ ] annotations & comments (should be another tool layer)

- [ ] grid guide
  - [ ] ability to change num columns & column spacing

- [ ] bugs
  - [x] must double click into layer to select children
  - [x] cannot select child & parent together (messes up dragging)
  - [x] multi-selected items with differing items drift apart
  - [ ] drag needs to respect CSS3 transforms
  - [ ] children do not get re-ordered properly

- [ ] testability
  - [ ] add drag manager that emits mouse events

- [ ] optimizations
  - [ ] only show hover states where mouse is

- [ ] when dragging fixed element long enough, change position to relative
- [ ] eye dropper
- [ ] should be able to scroll individual unit values
- [ ] display multiple values as a drop menu for each element. On Hover, highlight given element
- [ ] display none must be considered

- [x] - refactor how fragments work

#### Keep this in mind when writing code

- [ ] do not abstract CSS. Build tools that augment it.
- [ ] write tools that help organize designs. Also write tools that help refactor design that are monolithic (exporting layers to individual files for instance)

#### When writing features

- focus on features that might bog down the entire app, but are essential

#### Future

- [ ] online community where people can show their creations. Like codepen
