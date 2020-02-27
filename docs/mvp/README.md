VSCode extension for previewing web components as they're being written.

Sticky points:

Why would anyone want to use Tandem & Paperclip?

- fast compile times
- type safety
- automatic visual regression testing
  - possibly terminal tool for this
- excellent error messaging
- wow-factor is preview - should add some features around that
  - meta-click to reveal source
  - measurement tools

What problems does Paperclip + Tandem introduce?

- another language to learn
- Not as flexible
  - should be offset by visual tooling & fast compile times

Tandem pain points?

- What if they don't have VSCode?
  - Should be able to start Tandem web server

Design Problems:

- Need to figure out how to pass props from parent controllers to child controllers (like event handlers)
  - maybe prohibit nested components in compiled output - treat evkkerything as parts.

Limitations:

#### Development Phases

- Develop + validate
- Design + writing
- Documentation

## Alpha

Goal is to validate the idea & polish it up

#### Todos

- start building out Tandem UI
  - just the style panel
- gotcha trying to add props to View that is fragment
- need a better way of identifying where instances of components are
  - used to render instance -- lives in instance file
- docs
  - what is Tandem
  - getting started
    - with VSCode
    - without VSCode
  - alternative without VSCode (use HMR)
  - testing
- ask friends to play with app
- site

## Beta

#### Todos

- tests (companies won't use otherwise)
- a11y
  - img tags
- linter
  - error with multiple IDs
  - warn for script tags
  - warn when CSS selector tag isn't used
  - prohibit dynamic attr bindings for
    - all import attrs
    - all meta attrs
  - prohibit listeners - force prop injection
- BUGS
  - handle circular dependencies
  - need to be aware of reserved props
  - need to handle cases where files are moved around, especially for moduleDirectory files
