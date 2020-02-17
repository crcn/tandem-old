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

immediate TODO:

- vscode extension

  - jump to definition
    - tag names
    - src attributes
  - cleanup color presentation
  - other enhancements
    - parse color keywords (red|blue|green|darkgrey)

- typed definition generation

- DSL

  - pc modules
  - handle circular dependencies
  - linter
    - error with multiple IDs
    - warn for script tags
    - warn when CSS selector tag isn't used
    - prohibit dynamic attr bindings for
      - all import attrs
      - all meta attrs

- CLI

  - pretty error output

- preview

  - meta click element to reveal source
  - measuring between elements

- examples

  - chat app

- polish

  - look into WASM instead
  - can't have process hanging
  - maybe move back to neon

- documentation draft

  - what is Tandem
  - getting started with VSCode
  - alternative without VSCode (use HMR)
  - testing

- ask friends to play with app

- site

* web preview for non-vscode users
* pretty terminal compiler output
* DSL

* Language enhancements
  - Nestable

- compilers
  - react
- preview
  - chrome-like inspector
  - ability to change colors
- linter
  - syntax errors
  - prevent bindings for imports
  - prevent bindings for logic
- DSL

  - ability to import .json files into scope
  - ability to import .css files into scope

-

Existing apps:

TODO
