import { expect } from "chai";
import * as ts from "typescript";
import { evaluateTypescript } from "./evaluator";

describe(__filename + "#", () => {
  [
    [`export const i = 100;`, { i: 100 }],
    [`export const a, i = 100;`, { a: undefined, i: 100 }],
    [`export const a = 1, b = 2;`, { a: 1, i: 2 }],
    [`export const a = "1";`, { a: "1" }],
    [`export const a = { b: 1 };`, { a: { b: 1 } }]
  ].forEach(([scriptSource, exports]) => {
    it(`can evaluate ${scriptSource}`, () => {
      const ast = ts.createSourceFile("tmp.tsx", scriptSource as string, ts.ScriptTarget.ES6, true);
      const resultExports = evaluateTypescript(ast);
      expect(resultExports).to.eql(exports);
    });
  });
});