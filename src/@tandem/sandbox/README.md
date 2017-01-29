

Kitchen sink example:

```typescript
import { Kernel } from "@tandem/common";
import { SyntheticWindow, SyntheticDocument } from "@tandem/synthetic-browser";
import {
  Sandbox,
  Dependency,
  FileCacheItem,
  LocalFileSystem,
  DependencyGraph,
  ISyntheticObject,
  LocalFileResolver,
  FileSystemProvider,
  FileEditorProvider,
  FileResolverProvider,
  DependencyGraphProvider,
  ContentEditorFactoryProvider,
  DependencyLoaderFactoryProvider,
} from "@tandem/sandbox";


const kernel = new Kernel(
  new DependencyGraphProvider(),
  new FileEditorProvider(),
  new FileSystemProvider(new LocalFileSystem()),
  new FileResolverProvider(new LocalFileResolver()),
  new DependencyLoaderFactoryProvider("text/css", CSSDependencyLoader),
  new ContentEditorFactoryProvider("text/css", CSSContentEditor),
);

// fetch the dependency graph singleton
const dependencyGraph: DependencyGraph = DependencyGraphProvider.getInstance("webpack", kernel);

const sandbox = new Sandbox(deps, function createGlobal() {

  // global environment context -- browser, node, etc
  return new SyntheticWindow();
});

// create an dependency entry -- all dependencies, and nested dependencies
// be dependency up into this object.
const fileDependency: Dependency = dependencyGraph.getDependency("file:///path/to/local/file.html");

// execute the file dependency. Re-execute if the dependency changes
const fakeDocument: SyntheticDocument = await sandbox.open(fileDependency);

const edit = fakeDocument.body.createEdit().appendChild(fakeDocument.createTextNode("hello world")));

// the synthetic object edit maintains a reference back to the source file -- where it patches changes --
// file:///path/to/local/file.html in this case.
FileEditorProvider.getInstance(deps).applyMutations(...edit.mutations);
```

Diffing & patching synthetic objects example:

```javascript
import { SyntheticWindow } from "@tandem/synthetic-browser";
import { SyntheticObjectTreeEditor } from "@tandem/sandbox";

const { document } = new SyntheticWindow();
document.body.innerHTML = `Hello World`;

const documentClone = document.cloneNode(true);
documentClone.body.innerHTML = `Hello Again!`;

// create a diff from a newer node
const edit = document.createEdit().fromDiff(documentClone);

// apply the edit to the original document
new SyntheticObjectTreeEditor(document).applyMutations(...edit.mutations);

// this also works
// edit.applyMutationsTo(document);
```
