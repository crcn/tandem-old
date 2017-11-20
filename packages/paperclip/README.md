Paperclip is a document format for visual editors. Here's a basic example of code that could run within an Tandem artboard VM:

component.pc:

```html
<link rel="import" href="./another-component.pc">

<component id="x-button" [[property count]]>
  <a id="clicker-button" href="#">
    click me! [[bind count]]
  </a>
</component>
```

bundler:

````typescript
import * as paperclip from "paperclip";

paperclip.bundleVanilla("component.pc", {

  // attaches additional information to the window object, and elements
  target: paperclip.PaperclipTargetType.TANDEM,
  readFile: async (resolvedPath) => {
    return await (await fetch(resolvedPath)).text()
  },
  resolveFile: (relativePath, fromPath) => {
    return path.join(path.dirname(fromPath), relativePath);
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


#### TODOS

- [ ] Linter
  - [ ] Warning when there are unhandled nodes 
  - [ ] Error when there are type mismatches
