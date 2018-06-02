Paperclip is DSL for building web UIs visually.

#### TODOS

-

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
```

#### TODO

* sketch loader
* global variables
