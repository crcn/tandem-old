VSCode extension for previewing web components as they're being written.

Sticky points:

Why would anyone want to use Tandem & Paperclip?

What problems does Paperclip + Tandem introduce?

- another language to learn
- Not as flexible
  - should be offset by visual tooling & fast compile times

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

- React code compiler needs to work again
- **DOCS**
- EXPERIMENTAL warning
  - <logic />
  - {#each}, {#if}
- expand namespaced instances
- inferencing in Rust
  - require all props to be defined in preview
- public / protected parts
- fix recursion with parts
- export default part

- get parts to work again
  - compiled to react code
  - fix recursion errors
  - *maybe* add scopes (protected [for export only], )
    - or expose just previews, and have variants of those
    - prohibit preview elements from being rendered anywhere outside of previews
- new react-todomvc example using just parts


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
