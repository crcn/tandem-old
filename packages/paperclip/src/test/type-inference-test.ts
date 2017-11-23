import { InferredType, inferredType, InferredTypeKind, inferRootNodeTypes, loadModuleAST, parseModuleSource } from "../";
import { expect } from "chai";

describe(__filename + "#", () => {
  [
    [`[[bind a]]`, inferredType(InferredTypeKind.OBJECT, {
      a: [InferredTypeKind.ANY, null]
    })],

    // Number operations
    [`[[bind a * b]]`, inferredType(InferredTypeKind.OBJECT, {
      a: [InferredTypeKind.NUMBER, null],
      b: [InferredTypeKind.NUMBER, null]
    })],
    [`[[bind a / b]]`, inferredType(InferredTypeKind.OBJECT, {
      a: [InferredTypeKind.NUMBER, null],
      b: [InferredTypeKind.NUMBER, null]
    })],
    [`[[bind a - b]]`, inferredType(InferredTypeKind.OBJECT, {
      a: [InferredTypeKind.NUMBER, null],
      b: [InferredTypeKind.NUMBER, null]
    })],
    [`[[bind a + 1]]`, inferredType(InferredTypeKind.OBJECT, {
      a: [InferredTypeKind.STRING_OR_NUMBER, null]
    })],
    [`[[bind 1 + a]]`, inferredType(InferredTypeKind.OBJECT, {
      a: [InferredTypeKind.STRING_OR_NUMBER, null]
    })],
    [`[[bind a + ""]]`, inferredType(InferredTypeKind.OBJECT, {
      a: [InferredTypeKind.STRING_OR_NUMBER, null]
    })],
    [`[[bind (a + b) + 1]]`, inferredType(InferredTypeKind.OBJECT, {
      a: [InferredTypeKind.STRING_OR_NUMBER, null],
      b: [InferredTypeKind.STRING_OR_NUMBER, null]
    })],

    // Boolean operations
    [`[[bind a || b]]`, inferredType(InferredTypeKind.OBJECT, {
      a: [InferredTypeKind.ANY, null],
      b: [InferredTypeKind.ANY, null]
    })],
    [`[[bind a && b]]`, inferredType(InferredTypeKind.OBJECT, {
      a: [InferredTypeKind.ANY, null],
      b: [InferredTypeKind.ANY, null]
    })],
    [`[[bind a === b]]`, inferredType(InferredTypeKind.OBJECT, {
      a: [InferredTypeKind.ANY, null],
      b: [InferredTypeKind.ANY, null]
    })],

    // equality
    [`[[bind a + 1]][[bind a == b]]`, inferredType(InferredTypeKind.OBJECT, {
      a: [InferredTypeKind.STRING_OR_NUMBER, null],
      b: [InferredTypeKind.ANY, null]
    })],
    [`[[bind a + 1]][[bind a != b]]`, inferredType(InferredTypeKind.OBJECT, {
      a: [InferredTypeKind.STRING_OR_NUMBER, null],
      b: [InferredTypeKind.ANY, null]
    })],
    [`[[bind a + 1]][[bind a === b]]`, inferredType(InferredTypeKind.OBJECT, {
      a: [InferredTypeKind.STRING_OR_NUMBER, null],
      b: [InferredTypeKind.STRING_OR_NUMBER, null]
    })],
    [`[[bind a + 1]][[bind a !== b]]`, inferredType(InferredTypeKind.OBJECT, {
      a: [InferredTypeKind.STRING_OR_NUMBER, null],
      b: [InferredTypeKind.STRING_OR_NUMBER, null]
    })],
    [`[[bind a + ""]][[bind b !== a]]`, inferredType(InferredTypeKind.OBJECT, {
      a: [InferredTypeKind.STRING_OR_NUMBER, null],
      b: [InferredTypeKind.STRING_OR_NUMBER, null]
    })],

    // elements
    [`<a href=[[bind link]] />`, inferredType(InferredTypeKind.OBJECT, {
      link: [InferredTypeKind.STRING, null]
    })],
    [`<a [[repeat items as item]] href=[[bind item]] />`, inferredType(InferredTypeKind.OBJECT, {
      items: inferredType(InferredTypeKind.OBJECT_OR_ARRAY, {
        item: [InferredTypeKind.STRING, null]
      })
    })],
    [`<a [[if a]] />`, inferredType(InferredTypeKind.OBJECT, {
      a: [InferredTypeKind.ANY, null]
    })],
    [`<a [[if a]] /><a [[elseif b]] />`, inferredType(InferredTypeKind.OBJECT, {
      a: [InferredTypeKind.ANY, null],
      b: [InferredTypeKind.ANY, null]
    })],
    [`[[bind a + 1]]<a [[if a]] /><a [[elseif b === a]] />`, inferredType(InferredTypeKind.OBJECT, {
      a: [InferredTypeKind.STRING_OR_NUMBER, null],
      b: [InferredTypeKind.STRING_OR_NUMBER, null]
    })],
    [`<a [[repeat items as item]]>[[bind item.name]]</a>`, inferredType(InferredTypeKind.OBJECT, {
      items: inferredType(InferredTypeKind.OBJECT_OR_ARRAY, {
        item: inferredType(InferredTypeKind.OBJECT, {
          name: inferredType(InferredTypeKind.ANY)
        })
      })
    })],
    [`<a [[repeat items as item]] [[bind item]]>[[bind item.name]]</a>`, inferredType(InferredTypeKind.OBJECT, {
      items: inferredType(InferredTypeKind.OBJECT_OR_ARRAY, {
        item: inferredType(InferredTypeKind.OBJECT | InferredTypeKind.EXTENDABLE, {
          name: inferredType(InferredTypeKind.ANY)
        })
      })
    })]

  ].forEach(([source, expectation]: [string, InferredType]) => {
    it(`can infer types for ${source}`, () => {
      const module = loadModuleAST(parseModuleSource(`<component id="test"><template>${source}</template></component>`), "nada");
      expect(inferRootNodeTypes(module.components[0].template)).to.eql(expectation);
    });
  });
});