
Paperclip is a document format for visual editors. Here's a basic example of code that could run within an Tandem artboard VM:

component.pc:

```html
<link rel="import" href="./another-component.pc">

<component id="x-button">
  <a id="clicker-button" href="#">
    click me! [[bind count]]
  </a>
  <preview>
    <link rel="context" href="./fixtures.json" />

    <!-- count provided-->
    <x-button count=[[bind count]] />
  </preview>
</component>
```

bundler:

````typescript
import * as paperclip from "paperclip";

paperclip.bundleVanilla("component.pc", {
  readFile: async (resolvedPath) => {
    return await (await fetch(resolvedPath)).text()
  }
}).then(({ code }) => {

  // run within context of this window. 
  new Function(code)(window);
  
  const button = document.body.createElement("x-button");
  button.count = 0;

  document.body.appendChild(button);

  button.addEventListener("event", (event) => {
    if (event.type === "click" && event.target.id === "clicker-button") {
      button.count++;
    }
  });
});
````π

#### HIGH PRIO TODOS

- [ ] Linting
  - Error for existing components
  - Warning for unknown tag names
- [ ] i18n error messages - used also as codes. Used in Tandem as well to help user fix issues.

- [ ] parser
  - [ ] CSS selector -- needed for inferencing props like `:host([property])`

- [ ] Source maps*

#### LOW PRIO CORE TODOS

- [ ] a11y helpers
- [ ] remove property attr parsing code
- [ ] pretty formatter
- [ ] i18n support (use standard)
- [ ] vanilla transpiler needs to also bundle assets like images
- Warning when element (besides style) defined outside of component

#### LOW PRIO EXTENSION TODOS

- [ ] strategy for upgrading paperclip files to newer versions
- [ ] Vue transpiler
- [ ] plain HTML transpiler (static site generator)

#### Qs

- [ ] possibly provide hash for each expression based on shape of data? May help with memoization.
