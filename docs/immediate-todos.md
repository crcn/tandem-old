- [ ] component library - img, p, 
- [ ] fix click through bug with resizer

- [ ] just one style pane - organize declarations by color or similar 

- [ ] rotation tool - part of resizer
- [ ] background fill
- [ ] drop shadow tool
- [ ] 3D transform tool
- [ ] animation tool
- [ ] move entity to front / back / forward (zIndex)
- [ ] entity-specific props pane (images and stuff)
- [ ] components tool
- [x] ruler tool
- [x] sink tool (snap to grid)
- [ ] on enter key for property, add new property 

- [ ] multi-select tool
  - [x] shift click layers
  - [x] shift click preview items
  - [ ] drag select items

- [ ] layers
  - [x] hide / show layers with arrow keys (left right)
  - [ ] ability to edit attributes directly
  - [x] min width should be bigger
  - [ ] ability to add children (plus button)
  - [x] double click to edit - edit whole element
  - [ ] double click layer - edit layer and all children (IDE mode) 
  
- [ ] mirror mode8
  - [ ] show display resolution above canvas + label
  - [ ] show zoom above canvas
  - [ ] highlight canvas in focus
  - [ ] browsertap renderer
  
- [ ] properties
  - [ ] ability to change style name 
  - [ ] breadcrumbs for properties panel
  - [ ] easier way of adding css styles (some filter for typography - drop down)
  - [ ] raw mode for CSS
  
- [ ] warnings
  - [ ] when adding children to void elements
  - [ ] when defining left/top props an element that cannot be moved
  
- [ ] more border information
  - [ ] display line heights

- [ ] shadow DOM for encapsulating review

- [x] history
  - [ ] use git

- [ ] alignment tools in props pane

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
  - east/south resizer points both mutating width & height props when they shouldn't
  

#### Keep this in mind when writing code

- [ ] do not abstract CSS. Build tools that augment it.
- [ ] write tools that help organize designs. Also write tools that help refactor design that are monolithic (exporting layers to individual files for instance)

#### When writing features

- focus on features that might bog down the entire app, but are essential

#### Future

- [ ] online community where people can show their creations. Like codepen
