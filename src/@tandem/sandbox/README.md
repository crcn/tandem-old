Sandboxed environment for running code.

Kitchen sink example:

```typescript
import { Injector } from "@tandem/common";
import { SyntheticWindow, SyntheticDocument } from "@tandem/synthetic-browser";
import {
  Dependency,
  Sandbox,
  DependencyGraph,
  FileCacheItem,
  LocalFileSystem,
  LocalFileResolver,
  DependencyGraphProvider,
  ISyntheticObject,
  FileEditorProvider,
  FileSystemProvider,
  FileResolverProvider,
  DependencyLoaderFactoryProvider,
  ContentEditorFactoryProvider,
} from "@tandem/sandbox";


const deps = new Injector(
  new DependencyGraphProvider(),
  new FileEditorProvider(),
  new FileSystemProvider(new LocalFileSystem()),
  new FileResolverProvider(new LocalFileResolver()),
  new DependencyLoaderFactoryProvider("text/css", CSSDependencyLoader),
  new ContentEditorFactoryProvider("text/css", CSSContentEditor),
);

// fetch the dependency graph singleton
const dependencyGraph: DependencyGraph = DependencyGraphProvider.getInstance("webpack", deps);

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
FileEditorProvider.getInstance(deps).applyEditChanges(...edit.changes);
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
new SyntheticObjectEditor(document).applyEditChanges(...edit.changes);

// this also works
// edit.applyActionsTo(document);
```


UPDATE:

```typescript
import {
  WebpackDependencyGraphStrategy,
  DependencyGraphStrategyProvider,
  DependencyGraphProvider
} from "@tandem/sandbox";

const dependencies = new Injector(
  new DependencyGraphStrategyProvider("webpack", new WebpackDependencyGraphStrategy(webpackConfig)),
  new DependencyGraphStrategyProvider("webpack2", new WebpackDependencyGraphStrategy(webpackConfig)),
  new DependencyGraphStrategyProvider("rollup", new RollupBundleStrategy(webpackConfig)),
  new DependencyGraphProvider()
);

const dependencyGraph = DependencyGraphProvider.getInstance("webpack"); // webpack strategy

const sandbox = new Sandbox();
sandbox.open(await dependencyGraph.loadDependency(await dependencyGraph.resolve("./file.js", process.cwd()));
```
