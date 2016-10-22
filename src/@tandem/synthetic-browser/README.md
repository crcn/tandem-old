"Fake" browser for running code in a controlled environment. Works in most JavaScript
runtime environments.

#### Example:

```typecsript
import { Dependencies } from "@tandem/common";
import { htmlExtension } from "@tandem/html-extension";
import { sassExtension } from "@tandem/sass-extension";
import { RemoteSyntheticBrowser, DOMRenderer } from "@tandem/synthetic-browser";
import {
  LocalFileSystem,
  RemoteFileSystem,
  LocalFileResolver,
  BundlerDependency,
  RemoveFileResolver,
  ResolverDependency,
  FileCacheDependency,
  FileSystemDependency,
} from "@tandem/sandbox";


const dependencies = new Dependencies(

  new FileCacheDependency(),

  // scans
  new BundlerDependency(),

  // resolves module dependencies (NodeJS, Bower, etc.)
  new FileResolverDependency(new LocalFileResolver()),

  // if running in the browser
  // new FileResolverDependency(new RemoteFileResolver())

  // read, write, and watch files
  new FileSystemDependency(new LocalFileSystem()),

  // extensions that contain the appropriate script loaders, and
  // evaluators
  htmlExtension,
  sassExtension,
);

// renders the synthetic browser to a real DOM
const renderer = new DOMRenderer();

// or use a remote renderer
// const renderer = new RemoteRenderer(`Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)
`, dependencies);
// const renderer = new RemoteRenderer(`Mozilla/5.0 (Linux; Android 4.4; Nexus 5 Build/_BuildID_) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Mobile Safari/537.36`, dependencies);

// remote browser
const browser = new RemoteSyntheticBrowser(dependencies, renderer);

// open the main entry
browser.open(`file:///absolute/path/to/file.html`);

// append the renderer element so that the user sees wh
document.body.appendChild(renderer.element);
```