VSCode extension for previewing web components as they're being written.

Sticky points:

Why would anyone want to use Tandem & Paperclip?

- fast compile times
- type safety
- automatic visual regression testing
  - possibly terminal tool for this
- excellent error messaging

What problems does Paperclip + Tandem introduce?

- another language to learn
- Not as flexible
  - should be offset by visual tooling & fast compile times

Tandem pain points?

- What if they don't have VSCode?
  - Should be able to start Tandem web server

Limitations:

immediate TODO:

- <import not found>
- React compiler

* language server
  - error linter
    - prohibit function calls
  - warn linter (should have config so that user can turn on & off)
    - prohibit <script /> tags
    - warn when CSS selector tag isn't used
    - warn if <property /> tag isn't present
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
