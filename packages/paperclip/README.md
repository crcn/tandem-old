Paperclip is DSL for building web UIs visually.

#### API Example

```javascript
import {
  DOMRenderer,
  evaluatePCModule,
  createPCModule,
  createPCFrame,
  createPCComponent,
  createPCElement,
  createPCTextNode,
  createPCComponentInstance
} from "paperclip";

const component = createPCComponent("Test");

const pcModule = createPCModule([
  createPCFrame([component]),
  createPCFrame([createPCComponentInstance(component.id)])
]);

const syntheticFrames = evaluatePCModule(pcModule);
```

#### TODO

* sketch loader
