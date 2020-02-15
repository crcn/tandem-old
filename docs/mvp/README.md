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

immediate TODO:

- pc config
- pc modules
- :root selector
- ability to load local images
- ability to load local files
- ability to load local CSS Urls
- style inspector (in paperclip)
  - list all selectors that apply to element
  - ability to change colors
- browser preview (VSCode escape hatch)
- quick guide to setup Tandem

- linter

  - error with multiple IDs
  - warn for script tags
  - warn when CSS selector tag isn't used
  - prohibit dynamic attr bindings for
    - all import attrs
    - all meta attrs

- DX enhancements
  - jump to definition

* web preview for non-vscode users
* pretty terminal compiler output
* DSL

* Language enhancements

  - Nestable

* testing tools

- JS evaluator
  - strings
  - numbers
  - arrays
  - objects
  - groups
  - operations
    - or
    - and
    - +
    - -
    - %
  - elements
- #each

* diff/patch

- examples
  - chat app
  - todo list
- <logic /> element
- optimizations
  - diff / patch
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
