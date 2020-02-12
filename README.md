⚠️ Currently WIP ⚠️

### Visualize your code in realtime

Tandem provides you with a live preview of your web app directly in VSCode. 

[GIF PREVIEW]

<!-- All of your web component development & debugging in one spot. -->

Tandem uses [Paperclip](packages/paperclip), a super fast template language designed to compile to most languages and frameworks. Currently supporting React & static HTML.


### Why?

Productivity & development speed. Debugging HTML & CSS is a long process, especially with bundlers like Webpack thrown into the mix. The goal around _Tandem_ is to provide visual tooling that helps cut down on development time by work eliminating bottlenecks. 

### Features

#### Designed to compile to any framework or language

#### Realtime development

#### Visual tooling

- measurement tools, responsive design, 

#### Type safety

- Linting


### Goals

- Compatibility with most languages and frameworks.
- Ability to plug into your existing codebase.
- Low barrier to entry. Should just be able to install the VSCode extension and start using immediately.
- Simple template language features that cover _most_ UI cases. 
- Debugging tools for HTML & CSS.

### Non-goals

- Extensive tooling. Tandem will only provide the template language. 
- Turing-complete templates. Tandem will only allow you to create primitive UI behavior. 
- Complex logic in templates. 

### What is Paperclip?

Paperclip is a template language that compiles to React code (more targets planned). Here's an example:


`hello.pc`:

```html
<style>
  .message {
    background: grey;
    border-radius: 3px;
    color: white;
  }
</style>

<div class="message">
  {{message}}
</div>

<!-- conditions -->
{{#if temperature > 90}}
  It's super hot! 🔥
{{/else if temperature > 80}}
  It's hot! 
{{/else}}
  It's a good temp. 👍
{{/}}

<ul>
{{#each items as item, index}}
  <li>{{item}}</li>
{{/}}
</ul>
```

## Development  

Prerequisites:

- VSCode
- NodeJS
- Cargo

To get started with this repository, first run:

```bash
git pull git@github.com:crcn/tandem.git
cd tandem
npm install
npm run build
```

After that, run:

```bash
cd packages/tandem-vscode-extension
code .
```

Then run the VSCode debugger. 
