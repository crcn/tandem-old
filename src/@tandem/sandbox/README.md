Sandboxed environment for running code.

Kitchen sink example:

```typescript
import { Dependencies } from "@tandem/common";
import { SyntheticWindow, SyntheticDocument } from "@tandem/synthetic-browser";
import {
  Bundle,
  Sandbox,
  Bundler,
  FileCacheItem,
  LocalFileSystem,
  LocalFileResolver,
  BundlerDependency,
  ISyntheticObject,
  FileEditorDependency,
  FileSystemDependency,
  FileResolverDependency,
  BundlerLoaderFactoryDependency,
  ContentEditorFactoryDependency,
} from "@tandem/sandbox";


const deps = new Dependencies(
  new BundlerDependency(),
  new FileEditorDependency(),
  new FileSystemDependency(new LocalFileSystem()),
  new FileResolverDependency(new LocalFileResolver()),
  new BundlerLoaderFactoryDependency("text/css", CSSBundleLoader),
  new ContentEditorFactoryDependency("text/css", CSSContentEditor),
);

// fetch the bundler singleton
const bundler: Bundler = BundlerDependency.getInstance(deps);

const sandbox = new Sandbox(deps, function createGlobal() {

  // global environment context -- browser, node, etc
  return new SyntheticWindow();
});

// create an bundle entry -- all dependencies, and nested dependencies
// be bundled up into this object.
const fileBundle: Bundle = bundler.bundle("file:///path/to/local/file.html");

// execute the file bundle. Re-execute if the bundle changes
const fakeDocument: SyntheticDocument = await sandbox.open(fileBundle);

const edit = fakeDocument.body.createEdit().appendChild(fakeDocument.createTextNode("hello world")));

// the synthetic object edit maintains a reference back to the source file -- where it patches changes --
// file:///path/to/local/file.html in this case.
FileEditorDependency.getInstance(deps).applyEditActions(...edit.actions);
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
// edit.applyEditActionsTo(document);
```