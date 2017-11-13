Paperclip is a tiny DSL for building web components that are optimized for visual editors. Here's a basic example of code that could run within an Tandem artboard VM:

````typescript
import { paperclipToVanilla, PaperclipTargetType } from "paperclip";

const source = `
  <link rel="import" href="./another-component.pc">
  <component id="x-button">
    [[property count]]
    <a id="clicker-button" href="#" [[emit click]]>
      click me! [[bind count]]
    </a>
  </component>
`;

paperclipToVanilla(source, {

  // attaches additional information to the window object, and elements
  target: PaperclipTargetType.TANDEM,
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
    if (event.triggerEvent.type === "click" && event.target.id === "clicker-button") {
      button.count++;
    }
  });
});
````
