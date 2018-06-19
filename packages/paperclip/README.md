Paperclip is DSL for building web UIs visually.

#### TODOS

* Move evaluator over to Rust
* SVG support
* Eliminate saga dependency
* Global variables
* Sketch loader

#### API Example

```javascript
import {
  DOMRenderer,
  evaluatePCModule,
  createPCModule,
  createPCComponent,
  createPCElement,
  createPCTextNode,
  createPCComponentInstance
} from "paperclip";

const component = createPCComponent("Test");

const pcModule = createPCModule([
  component,
  createPCComponentInstance(component.id)
]);

const syntheticDocument = evaluatePCModule(pcModule);

const runtime = createRuntime(graph, () => {

}, onPatch);
runtime.patchDependencyGraph(graph);
runtime.on("evaluate", () => {

});

```
