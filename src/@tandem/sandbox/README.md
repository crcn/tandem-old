Sandboxed environment for running code.

Kitchen sink example:

```typescript
import { Injector } from "@tandem/common";
import { SyntheticWindow, SyntheticDocument } from "@tandem/synthetic-browser";
import {
  BundleDependency,
  Sandbox,
  Bundler,
  FileCacheItem,
  LocalFileSystem,
  LocalFileResolver,
  BundlerProvider,
  ISyntheticObject,
  FileEditorProvider,
  FileSystemProvider,
  FileResolverProvider,
  BundlerLoaderFactoryProvider,
  ContentEditorFactoryProvider,
} from "@tandem/sandbox";


const deps = new Injector(
  new BundlerProvider(),
  new FileEditorProvider(),
  new FileSystemProvider(new LocalFileSystem()),
  new FileResolverProvider(new LocalFileResolver()),
  new BundlerLoaderFactoryProvider("text/css", CSSBundleLoader),
  new ContentEditorFactoryProvider("text/css", CSSContentEditor),
);

// fetch the bundler singleton
const bundler: Bundler = BundlerProvider.getInstance(deps);

const sandbox = new Sandbox(deps, function createGlobal() {

  // global environment context -- browser, node, etc
  return new SyntheticWindow();
});

// create an bundle entry -- all dependencies, and nested dependencies
// be bundled up into this object.
const fileBundle: BundleDependency = bundler.bundle("file:///path/to/local/file.html");

// execute the file bundle. Re-execute if the bundle changes
const fakeDocument: SyntheticDocument = await sandbox.open(fileBundle);

const edit = fakeDocument.body.createEdit().appendChild(fakeDocument.createTextNode("hello world")));

// the synthetic object edit maintains a reference back to the source file -- where it patches changes --
// file:///path/to/local/file.html in this case.
FileEditorProvider.getInstance(deps).applyEditActions(...edit.actions);
```

Diffing & patching synthetic objects example:

```javascript
import { SyntheticWindow } from "@tandem/synthetic-browser";
import { SyntheticObjectEditor } from "@tandem/sandbox";

const { document } = new SyntheticWindow();
document.body.innerHTML = `Hello World`;

const documentClone = document.cloneNode(true);
documentClone.body.innerHTML = `Hello Again!`;

// create a diff from a newer node
const edit = document.createEdit().fromDiff(documentClone);

// apply the edit to the original document
new SyntheticObjectEditor(document).applyEditActions(...edit.actions);

// this also works
// edit.applyActionsTo(document);
```


UPDATE:

```typescript
import {
  WebpackBundleStrategy,
  BundlerStrategyProvider,
  BundlerProvider
} from "@tandem/sandbox";

const dependencies = new Injector(
  new BundlerStrategyProvider("webpack", new WebpackBundleStrategy(webpackConfig)),
  new BundlerStrategyProvider("webpack2", new WebpackBundleStrategy(webpackConfig)),
  new BundlerStrategyProvider("rollup", new RollupBundleStrategy(webpackConfig)),
  new BundlerProvider()
);

const bundler = BundlerProvider.getInstance("webpack"); // webpack strategy

const sandbox = new Sandbox();
sandbox.open(bundler.bundle("./file.js"));
```
