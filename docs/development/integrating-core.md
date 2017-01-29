The core Tandem libraries are flexible enough to be usable in other visual editing contexts outside of the main Tandem application.  The motivation for companies to use tandem's core is 
primarily that Tandem is for most part a 1-1 map of standard web APIs (with very few exceptions) which are old & battle tested, making them safe to use. 

Tandem's core is also flexible enough that you can use non-standard HTML & CSS APIs including your own markup language, and rendering engines (webGL, Canvas, among others are possible). 

The core libraries you'll need are:

- [Synthetic Browser](./synthetic-browser.md) - browser VM that runs application code. Also has hot swapping capabilities.
- [Sandbox](./sandbox.md) - runs application code in an isolated JavaScript environment.
- [Kernel](./kernel.md) - Provides dependencies throughout the application.
- [Bus](./bus.md) - Messaging channel for the application.

The libraries abov e provide the *minimal* functionality required for Tandem to run properly. With these, you can build visual editors
that are flexible enough to run most web applications.

#### Installation

In your application code, you'll need to run:

```
npm install @tandem/synthetic-browser @tandem/sandbox @tandem/common --save
```

`@tandem/common` (for the time being) contains common libraries (including the kernel) that are required in `@tandem/sandbox`, and `@tandem/synthetic-browser`. After that, you 
con start hacking away on visual editing features. For TypeScript users, you have have the added benefit of typing definition files that are part of the core modules.

#### Simple Hello World

Here's a *very simple* hello world application to help you understand how the core libraries work with each other:

```typescript
import { Kernel } from "@tandem/common";
import { FileSystemProvider } from "@tandem/sandbox";
import { SyntheticBrowser, DOMRenderer } from "@tandem/synthetic-browser";

const kernel = new Kernel(

);

const browser = new SyntheticBrowser(kernel);
browser.open({ url: "http://" });
```

> The above example is less optimial than other strategies for rendering synthetic documents since all of the heavy lifting is done on the client -- using the above code in a production application may result in a laggy application. Ideally you would use the `RemoteSyntheticBrowser` to defer application evaluation to another process - either in a web worker, or a node process. This ensures that the client-side app remains fast and responsive. Check the [Synthetic Browser](./synthetic-browser.md) on how to implement this.











