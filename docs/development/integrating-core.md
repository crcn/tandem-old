The core Tandem libraries are flexible enough to be usable in other visual editing contexts outside of the main Tandem desktop application.  The motivation for companies to use tandem's core is 
primarily that Tandem is for most part a 1-1 map of standard web APIs (with very few exceptions) which are old & battle tested, making them safer to use. 

Tandem's core is also flexible enough that you can use non-standard HTML & CSS APIs including your own markup language, and rendering engines (webGL, Canvas, among others are possible). 

The core libraries you'll need are:

- [Synthetic Browser](./synthetic-browser.md) - browser VM that runs application code. Also has hot swapping capabilities.
- [Sandbox](./sandbox.md) - runs application code in an isolated JavaScript environment.
- [Kernel](./kernel.md) - Provides dependencies throughout the application.
- [Bus](./bus.md) - Messaging channel for the application.

The libraries above provide the *minimal* functionality required for Tandem to run properly. With these, you can build visual editors
that are flexible enough to run most web applications.

#### Installation

For you're application, you'll need to run:

```
npm install @tandem/synthetic-browser @tandem/sandbox @tandem/common --save
```

`@tandem/common` (for the time being) contains common libraries (including the kernel) that are required in `@tandem/sandbox`, and `@tandem/synthetic-browser`. After that, you 
con start hacking away on visual editing features. For TypeScript users, you have have the added benefit of typed definition files that are part of the core modules.

## Simple Hello World

Here's a *very simple* hello world application to help you understand how the core libraries work with each other:

```typescript
import { Kernel } from "@tandem/common";
import { FileSystemProvider } from "@tandem/sandbox";
import { SyntheticBrowser, SyntheticDOMRenderer } from "@tandem/synthetic-browser";

const kernel = new Kernel(
  new FileEditorProvider(),
);

// create the renderer for the synthetic elements -- can be anything from canvas, webgl, or your 
// own custom rendering engine.
const renderer = new SyntheticDOMRenderer();

const browser = new SyntheticBrowser(kernel, renderer);

// Open the URI - http:, and file: are supported out of the box. You can also register your own
// custom protocol. Checkout the Sandbox documentation on how to do this
browser.open({ uri: "http://google.com" }); 


document.body.appendChild(renderer.element);
```

> The above example is less optimial than other strategies for rendering synthetic documents since all of the heavy lifting is done on the client -- using the above code in a production application may result in a laggy application. Ideally you would use the `RemoteSyntheticBrowser` to defer application evaluation to another process - either in a web worker, or a node process. This ensures that the client-side app remains fast and responsive. Check the [Synthetic Browser](./synthetic-browser.md) on how to implement this.


Using the above example, we can start wiring it up to a simple UI editor:

```typescript
import React = require("react");
import ReactDOM = require("react-dom");

class SimpleEditorComponent extends React.Component<{ browser: SyntheticBrowser }, any> {

  componentDidMount() {

    // display the HTML created by the synthetic browser renderer
    const { renderer } = this.props.browser;
    this.prefs.previewContainer.appendChild(renderer.element);
  }

  // render the preview of the application, along with the tools layer
  // used for manipulating visible elements
  render() {
    return <div className="editor">
      <div className="stage">
        { this.renderPreviewLayer() }
        { this.renderToolsLayer() }
      </div>
    </div>
  }

  /**
   * Layer for manipulating elements
   */

  renderToolsLayer() {
    return <div className="tools-layer">
      { this.renderDragTools() }
    </div>;
  }

  /**
   * Renderers overlay drag tools that enable *all* visible elements to be
   * dragged around.
   */

  renderDragTools() {
    const { browser } = this.props;

    return <div className="drag-tools">
      { browser.document.querySelectorAll("*").map((element) => {
        return <DragToolComponent key={element.uid} element={element} />;
      }) }
    </div>;
  }

  /** 
   * application preview layer
   */

  renderPreviewLayer() {
    return <div className="preview-layer">
      <div ref="previewContainer" />
    </div>;
  }
}


class DragToolComponent extends React.Component<{ kernel: Kernel, element: SyntheticHTMLElement }, { startX: number, startY: number }> {
  startDrag = (event: React.MouseEvent<any>) => {
    this.setState({ startX: event.clientX, startY: event.clientY });
    document.body.addEventListener("mouseup", this.stopDrag);
    document.body.addEventListener("mousemove", this.drag);
  }
  
  drag = (event: MouseEvent) => {
    const { element } = this.props;
    const deltaX = event.clientX - this.state.startX;
    const deltaY = event.clientY - this.state.startY;

    // apply the change immediately which will be picked up by the renderer
    element.style.left = deltaX;
    element.style.top  = deltaY;
  }
  
  stopDrag = (event: MouseEvent) => {
    const { element, kernel } = this.props;

    document.body.removeEventListener("mouseup", this.stopDrag);
    document.body.removeEventListener("mousemove", this.drag);


    // finally, apply the edit *after* the user is done dragging
    const edit = element.createEdit();
    edit.setAttribute("style", element.style);

    // apply the edits to the file associated with the element. Note that resource information is attached to each synthetic element including file URI, 
    // line, and column information. This helps the file editor figure out exactly where to apply these mutations in the source code.
    PrivateBusProvider.getInstance(kernel).dispatch(new ApplyFileMutationsRequest(edit.mutations));
  }

  render() {
    const { element } = this.props;
    const bounds = element.getBoundingClientRect();
    return <div className="drag-tool">
      <div onMouseDown={this.startDrag} style={{ position: "absolute", background: "transparent" left: bounds.left, top: bounds.top, width: bounds.width, height: bounds.height }}>
      </div>
    </div>
  }
}


const mount = document.createElement("div");
document.body.appendChild(mount);

syntheticBrowser.open({
  uri: `
    data,text/html:
    <html>
      <head>
      </head>
      <body>
        <div style="position:absolute; background: red; width: 100px; height: 100px">
          Drag me!
        </div>

        <div style="position:absolute; background: blue; width: 100px; height: 100px; left: 100px;">
          Drag me!
        </div>
      </body>
    </html>
  `
})

// render the editor using the synthetic browser code in the previous example
ReactDOM.render(<SimpleEditorComponent browser={syntheticBrowser} />, mount);

```

The example above demonstrates how Tandem works at a very basic level. There are a few notable components to it.

#### Tools layer

The main Tandem application separates the preview from the stage tools that manipulate visible elements. This is just separation of concerns really. Separating the tools layer
also means that UI tools can be displayed on-top of different rendering engines which are in the current roadmap for the tandem core - particularly rendering adapters that defer to native browsers (Firefox, Chrome, Safari, Opera, and possibly native devices)
over WebRTC video.

The stage tools should only interact with synthetic DOM elements for gathering visibility information. These APIs include `element.getBoundingClientRect()`, and `element.getComputedStyle()` (which is NON standard method).
The information returned by these methods are supplied by the rendererer which again may be local (rendered in the client), or remote (rendered by a connected browser over WebRTC). With that said, assume that these methods are asynchronous.

Stage tools may manipulate synthetic elements like DOM elements. Changes to synthetic elements will automatically show up in the target renderer. Keep in mind that changes to synthetic DOM nodes will be *overwritten* the next time any file 
changes that is loaded in the current synthetic browser session. To ensure that edits persist over time, you'll also need to apply a *file edit* as shown in the example above. 

Stage tools may dispatch file edits. This is as simple as creating a new edit, and dispatching the mutations off to the kernel bus which handles *all* messaging. The file editor at the receiving end will take these mutations (which also contain file information such as path, line, and column information), and write the appropriate source code dependending on the registered [file editors](creating-file-editors). After each edit, the synthetic browser will reload the currently opened application, and patch only parts of the application that changed. 

Note that the synthetic browser will reload the *entire* application each time a file edit is made (there are a few optimizations to mitigate this expensive operation, but I won't elaborate here), so it's best to dispatch file edits only *after* the user has finished
with their changes. In the example above, the file edit is dispatched after the user has stopped dragging a given element.




