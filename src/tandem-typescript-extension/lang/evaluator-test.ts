import { expect } from "chai";
import * as ts from "typescript";
import { evaluateTypescript } from "./evaluator";

describe(__filename + "#", () => {
  [
    // literal types
    [`export const a = true;`, { a: true }],
    [`export const a = false;`, { a: false }],
    [`export const a = 1;`, { a: 1 }],
    [`export const a = "1";`, { a: "1" }],
    [`export const a = Infinity;`, { a: Infinity }],
    [`export const a = NaN;`, { a: NaN }],
    [`export const a = void 0;`, { a: undefined }],
    [`export const a = undefined;`, { a: undefined }],
    [`export const a = null;`, { a: null }],
    [`export const a = { b: 1 };`, { a: { b: 1 } }],
    [`export const a = { b: { c: 2 } };`, { a: { b: { c: 2 } } }],
    [`export const a = [0, 1, 2];`, { a: [0, 1, 2] }],

    // binary PEMDAS operations
    [`export const a = 1 + 2;`, { a: 3 }],
    [`export const a = 1 - 2;`, { a: -1 }],
    [`export const a = 2 * 3;`, { a: 6 }],
    [`export const a = 1 / 2;`, { a: 0.5 }],
    [`export const a = 1 % 2;`, { a: 1 }],

    // binary
    [`export const a = 1 | 2;`, { a: 1 | 2 }],
    [`export const a = 1 & 2;`, { a: 1 & 2 }],
    [`export const a = 1 ^ 2;`, { a: 1 ^ 2 }],

    // binary bool operations
    [`export const a = 1 == 0;`, { a: false }],
    [`export const a = 1 == 1;`, { a: true }],
    [`export const a = 1 == "1";`, { a: true }],
    [`export const a = 1 === "1";`, { a: false }],
    [`export const a = 1 != "1";`, { a: false }],
    [`export const a = 1 !== "1";`, { a: true }],
    [`export const a = 1 > 0;`, { a: true }],
    [`export const a = 1 > 1;`, { a: false }],
    [`export const a = 1 >= 1;`, { a: true }],
    [`export const a = 1 < 1;`, { a: false }],
    [`export const a = 1 <= 1;`, { a: true }],
    [`export const a = 0 || 1;`, { a: 1 }],
    [`export const a = 1 && 2;`, { a: 2 }],
    [`export const a = 0 && 2;`, { a: 0 }],

    // declarations
    [`export const a, b = 1`, { a: undefined, b: 1 }],
    [`export const a = 1, b = 2, c = 3`, { a: 1, b: 2, c: 3 }],
    [`export const { a } = { a: 1 }`, { a: 1 }],
    [`export const { a, b } = { a: 1, b: 2 }`, { a: 1, b: 2 }],
    [`export const { a: { b } } = { a: { b: 2 } }`, { b: 2 }],
    [`const a = 1; export const b = { c: a };`, {b: { c: 1 }}],
    [`const { a } = { a: 1 }; export const b = a;`, { b: 1 }],

    // functions
    [`function a() { }`, {}],
    [`function b() { return 1; } export const a = b();`, { a: 1 }],
    [`const add = (a, b) => a + b; export const result = add(1, 2)`, { result: 3 }],
    [`function add(a) { return this + a; }; export const result = add.call(1, 2)`, { result: 3 }],
    [`const add = (a, b) => a + b; export const result = add.apply(null, [2, 3])`, { result: 5 }],
    [`const add = (...rest) => rest.reduce((a, b) => a + b); export const result = add(1, 2, 3, 4, 5)`, { result: 1 + 2 + 3 + 4 + 5 }],

    // JSX
    [`const render = () => <div />; export const element = render();`, { element: { name: "div", attributes: [], children: [] }}],
    [`const render = () => <div a="b" />; export const element = render();`, { element: { name: "div", attributes: [{ name: "a", value: "b" }], children: [] }}],
    [`const render = (a) => <div a={a} />; export const element = render("b");`, { element: { name: "div", attributes: [{ name: "a", value: "b" }], children: [] }}],
    [`const render = () => <div>a</div>; export const element = render();`, { element: { name: "div", attributes: [], children: ["a"] }}],
    [`const render = (a) => <div>{a}</div>; export const element = render("b");`, { element: { name: "div", attributes: [], children: ["b"] }}],
    [`const render = (...rest) => <ul>{rest.map(i => <li>{i}</li>)}</ul>; export const element = render(1, 2);`, { element: { name: "ul", attributes: [], children: [[{ name: "li", attributes: [], children: [1] }, { name: "li", attributes: [], children: [2] }]] }}],
    [`const Component = () => null; const render = () => <Component />; export const element = render();`, { element: { name: "Component", attributes: [], children: [] }}]

  ].forEach(([scriptSource, exports]) => {
    it(`can evaluate ${scriptSource}`, () => {
      const ast = ts.createSourceFile("tmp.tsx", scriptSource as string, ts.ScriptTarget.ES6, true);
      const resultExports = evaluateTypescript(ast).value;
      const json = resultExports.toJSON();
      expect(json).to.eql(exports);
    });
  });
});