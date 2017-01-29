Browser VM that can run in any JavaScript environment. The primary motivation behind this library is to have complete
control over application environment to enable certain features that not possible in regular browsers. Features include:

#### Ability to hot swap application state in a live environment

The browser VM hotswaps parts of loaded application as its being modified by the user. This means that the user is not interupted whenever the application
reloads internally. 

#### Defered rendering

The synthetic browser is built to support native rendering engines over WebRTC including Firefox, Chrome, Safari, along with mobile devices

#### Custom URI protocols

`file:`, `data:`, and `http:` protocols are supported out of the box, but you can register your own as well.

#### Custom languages

The synthetic browser uses the DOM api, but it's not limited to the DOM specification. You can easily extend the synthetic browser to suite
whatever visual editing functionality you need. 

### Kitchen sink example:

```typescript
import { Kernel } from "@tandem/common";
import { htmlExtension } from "@tandem/html-extension";
import { sassExtension } from "@tandem/sass-extension";
import { RemoteSyntheticBrowser, DOMRenderer } from "@tandem/synthetic-browser";
import {
  LocalFileSystem,
  RemoteFileSystem,
  LocalFileResolver,
  RemoveFileResolver,
  ResolverProvider,
  FileCacheProvider,
  FileSystemProvider,
  DependencyGraphProvider,
} from "@tandem/sandbox";


const dependencies = new Kernel(

  new FileCacheProvider(),

  // scans
  new DependencyGraphProvider(),

  // resolves module dependencies (NodeJS, Bower, etc.)
  new FileResolverProvider(new LocalFileResolver()),

  // if running in the browser
  // new FileResolverProvider(new RemoteFileResolver())

  // read, write, and watch files
  new FileSystemProvider(new LocalFileSystem()),

  // extensions that contain the appropriate script loaders, and
  // evaluators
  htmlExtension,
  sassExtension,
);

// renders the synthetic browser to a real DOM
const renderer = new DOMRenderer();

// or use a remote renderer
// const renderer = new RemoteRenderer(`Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)`, dependencies);
// const renderer = new RemoteRenderer(`Mozilla/5.0 (Linux; Android 4.4; Nexus 5 Build/_BuildID_) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Mobile Safari/537.36`, dependencies);

// remote browser
const browser = new RemoteSyntheticBrowser(dependencies, renderer);

// open the main entry
browser.open(`file:///absolute/path/to/file.html`);

// append the renderer element so that the user sees wh
document.body.appendChild(renderer.element);
```