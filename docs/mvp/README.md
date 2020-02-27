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

- 'open preview' command must only work with pc files
  - change to `Paperclip: open preview`
- prettier ignore markdown
- vsce docs
- online docs (single page)
  - Links at top
  - what it is
  - getting started
  - syntax
    - preview
    - json
    - each
    - if
    - slots
    - spreads
  - integrations
    - react code
      - typed definition files
    - webpack
- examples
  - simpler todos (from README)
  - counter
- get feedback
