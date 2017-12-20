
Paperclip is a document format for visual editors. Here's a basic example of code that could run within an Tandem artboard VM:

component.pc:

```html
<link rel="import" href="./another-component.pc">

<component id="x-button">
  <a id="clicker-button" href="#">
    click me! [[bind count]]
  </a>
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
````


#### HIGH PRIO TODOS

- [ ] Bugs
  - [ ] `[object Object]` replacing content
  - [ ] `null` replacing content (hard to reproduce)
  - [ ] dev tools stops working after coding for a bit
  


#### LOW PRIO CORE TODOS

- [ ] Source maps*
- [ ] a11y helpers

- [ ] Linter
  - [ ] Warning when there are unhandled nodes 
  - [ ] Error when there are type mismatches

- [ ] Pretty error handling
- [ ] i18n support (use standard)
- [ ] warning if unknown tag name is used


#### LOW PRIO EXTENSION TODOS

- [ ] strategy for upgrading paperclip files to newer versions
- [ ] Vue transpiler
- [ ] plain HTML transpiler (static site generator)
