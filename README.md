### Realtime visual development

Tandem provides you with a live preview of your web app directly in VSCode. 

<!-- All of your web component development & debugging in one spot. -->

Tandem uses [Paperclip](packages/paperclip), a super fast template language designed to compile to most languages and frameworks. Currently supporting React & static HTML.

[GIF PREVIEW]

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

Paperclip is the super fast language used to create dynamic user interfaces. Here's an example:

```html

<!-- import a a tabs component -->
<import id="tabs" src="common/tabs.pc" />

<tabs>
  <div aria-label="Tab 1">
      some content
  </div>
  <div aria-label="Tab 2">
      more content
  </div>
  <div aria-label="Tab 2">
      more content
  </div>
</tabs>
```

> You can explore the code around this example here: [LINK TODO]

