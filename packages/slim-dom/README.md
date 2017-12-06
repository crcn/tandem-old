Slim document object model based on the DOM & CSSOM.

#### Goals

- Subset of the DOM, but without mutability
- Should be runnable over a network (web workers, AWS lambda, Node)
- POJO data types
- Ability to target other rendering engines (Canvas, Browserstack)


#### Basic example

```typescript
const * as sdvm from "sdvm";
const * as pc from "paperclip";

// document is a POJO object. VM provided by language libraries
const document = await pc.loadVMDocument("./entry.pc");

const mount = document.createElement("div");
sdvm.renderDOM(document, mount);

// later on...
const document2 = await pc.loadVMDocument("./entry.pc");

const diffs = sdvm.diffDocument(document, document2);
sdvm.patchDOM(diffs, mount);

```

#### Types

##### VMSource 

```typescript

type Position = {
  line: number;
  character: number;
  offset: number;
};

type Range = {
  start: Position;
  end: Position;
};

type VMObjectSource = {
  uri: string; // source file of object source
  kind: any; // kind of source object - usually expression type
  range: Range; // where the object is in the source file
};
```

##### VMObject

```typescript
type VMObject = {
  source: VMObjectSource;
  type: string;
};
```

##### Node

```typescript
type Node = {
} & VMObjct;
```

##### ParentNode

```typescript
type ParentNode = {
  childNodes: Node[]
} & Node;
```

##### Element

```typescript

type Attribute = {
  key: string;
  value?: string;
} & VMObject;

type Element = {
  shadow?: ParentNode;
  attributes: Attribute[];
} & ParentNode;
```

##### Document

Shape:

```typescript
type Document =  {
  
} & Element;
```

#### StyleSheet

```typescript
type StyleSheet = {
  rules: StyleRule[]
};
```

#### StyleRule 

```typescript
type StyleRule = {

}
```

#### MediaRule 

TODO

#### UnknownRule

TODO

#### 

#### API

##### querySelector(element, query);
##### querySelectorAll(element, query);
##### getStyleSheets(element)
##### getElementSlots(element);

#### Reversed tag names

##### `slot`

##### `style`
