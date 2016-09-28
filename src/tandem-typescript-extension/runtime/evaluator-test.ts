import * as ts from "typescript";
import { expect } from "chai";
import { timeout } from "tandem-common/test";
import { evaluateTypescript } from "./evaluator";
import { SymbolTable, NativeFunction, SyntheticObject, SyntheticValueObject } from "tandem-runtime";

describe(__filename + "#", () => {

  function parse(content: string) {
    return ts.createSourceFile("tmp.tsx", content, ts.ScriptTarget.ES6, true);
  }

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

    // assignment
    [`let i = 0; i += 2; export const a = i`, { a: 2 }],
    [`let i = 0; i -= 2; export const a = i`, { a: -2 }],
    [`let i = 4; i *= 2; export const a = i`, { a: 8 }],
    [`let i = 4; i /= 2; export const a = i`, { a: 2 }],

    // unary postfix
    [`let i = 1; export const a = i++; export const b = i;`, { a: 1, b: 2 }],
    [`let i = 0; export const a = i--; export const b = i;`, { a: 0, b: -1 }],

    // unary prefix
    [`let i = 0; export const a = --i; export const b = i;`, { a: -1, b: -1 }],
    [`let i = 0; export const a = ++i; export const b = i;`, { a: 1, b: 1 }],
    [`let i = 0; export const a = !i; export const b = !!i`, { a: true, b: false }],
    [`let i = 1; export const a = -i; export const b = i`, { a: -1, b: 1 }],

    // prefix operators
    [`let i = 0; export const j = ++i;`, { j: 1 }],

    // declarations
    [`export const a, b = 1`, { a: undefined, b: 1 }],
    [`export const a = 1, b = 2, c = 3`, { a: 1, b: 2, c: 3 }],
    [`export const { a } = { a: 1 }`, { a: 1 }],
    [`export const { a, b } = { a: 1, b: 2 }`, { a: 1, b: 2 }],
    [`export const { a: { b } } = { a: { b: 2 } }`, { b: 2 }],
    [`const a = 1; export const b = { c: a };`, {b: { c: 1 }}],
    [`const { a } = { a: 1 }; export const b = a;`, { b: 1 }],

    // Objects
    // Strings
    // Arrays
    [`export const value = new Array(1, 2, 3)`, { value: [1, 2, 3] }],
    [`export const value = Array.from([1, 2, 3])`, { value: [1, 2, 3] }],
    [`export const value = Array.from([1, 2, 3], value => value + 1)`, { value: [2, 3, 4] }],
    [`export const value = Array.isArray(1)`, { value: false }],
    [`export const value = Array.isArray({})`, { value: false }],
    [`export const value = Array.isArray([])`, { value: true }],
    [`export const value = Array.isArray(new Array())`, { value: true }],
    [`export const value = [1, 2].concat([3, 4])`, { value: [1, 2, 3, 4] }],
    [`export const value = [].concat([3, 4], [5, 6])`, { value: [3, 4, 5, 6] }],
    [`export const value = [].concat([3, 4], 5, 6)`, { value: [3, 4, 5, 6] }],
    [`export const value = [0, 1, 2, 3].length`, { value: 4 }],
    [`const a = [1]; a.push(2); export const v = a;`, { v: [1, 2] }],
    [`const a = [1]; a.unshift(2); export const v = a;`, { v: [2, 1] }],
    [`const a = [1, 2]; a.splice(1, 0, 3); export const v = a;`, { v: [1, 3, 2] }],
    [`const a = [1, 2, 3]; a.splice(1, 1, 4); export const v = a;`, { v: [1, 4, 3] }],
    [`const a = [1, 2, 3]; a.pop(); export const v = a;`, { v: [1, 2] }],
    [`const a = [1, 2, 3]; a.shift(); export const v = a;`, { v: [2, 3] }],
    [`const a = [1, 2, 3]; export const v = a.slice(1);`, { v: [2, 3] }],
    [`const a = [3, 2, 1]; export const v = a.sort((a, b) => a > b ? 1 : -1)`, { v: [1, 2, 3] }],
    [`const a = [1, 2, 3, 4]; export const v = a.filter((i) => i % 2)`, { v: [1, 3] }],
    [`const a = [1, 2, 3, 4]; export const v = a.find((i) => i > 1)`, { v: 2 }],
    [`const a = [1, 2, 3, 4]; export const v = a.reverse()`, { v: [4, 3, 2, 1] }],
    // [`export const v = [].indexOf(0)`, { v: -1 }],
    // [`export const v = [1, 0].indexOf(0)`, { v: 1 }],
    [`export const v = [1, 2, 3].join('--')`, { v: "1--2--3" }],
    [`
      let sum = 0;
      [0, 1, 2, 3].forEach(i => sum = sum + i);
      export const value = sum;
    `, { value: 6 }],

    // functions
    [`function a() { }`, {}],
    [`function b() { return 1; } export const a = b();`, { a: 1 }],
    [`const add = (a, b) => a + b; export const result = add(1, 2)`, { result: 3 }],
    [`function add(a) { return this + a; }; export const result = add.call(1, 2)`, { result: 3 }],
    [`const add = (a, b) => a + b; export const result = add.apply(null, [2, 3])`, { result: 5 }],
    [`const add = (...rest) => rest.reduce((a, b) => a + b); export const result = add(1, 2, 3, 4, 5)`, { result: 1 + 2 + 3 + 4 + 5 }],
    [`function test() { } export const name = test.name`, { name: "test" }],
    // [`function test(b) { return this + b; } export const value = test.bind(1)(2);`, { value: 3 }],
    /*[`
      function bind(fn, ctx, ...args) {
        return function(...rest) {
          return fn.apply(ctx, [...args, ...rest]);
        }
      }

      function add(...numbers) {
        return numbers.reduce((a, b) => a + b);
      }

      const bound = bind(add, null, 1, 2, 3);
      export const value = bound(4, 5, 6);
    `, { value: 1 + 2 + 3 + 4 + 5 + 6 }],*/

    // JSX
    [`const render = () => <div />; export const element = render();`, { element: { name: "div", attributes: [], children: [] }}],
    [`const render = () => <div a="b" />; export const element = render();`, { element: { name: "div", attributes: [{ name: "a", value: "b" }], children: [] }}],
    [`const render = (a) => <div a={a} />; export const element = render("b");`, { element: { name: "div", attributes: [{ name: "a", value: "b" }], children: [] }}],
    [`const render = () => <div>a</div>; export const element = render();`, { element: { name: "div", attributes: [], children: ["a"] }}],
    [`const render = (a) => <div>{a}</div>; export const element = render("b");`, { element: { name: "div", attributes: [], children: ["b"] }}],
    [`const render = (...rest) => <ul>{rest.map(i => <li>{i}</li>)}</ul>; export const element = render(1, 2);`, { element: { name: "ul", attributes: [], children: [[{ name: "li", attributes: [], children: [1] }, { name: "li", attributes: [], children: [2] }]] }}],
    [`const Component = () => null; const render = () => <Component />; export const element = render();`, { element: { name: "Component", attributes: [], children: [] }}],
    [`<div>{}</div>`, {}],
    [`<div style></div>`, {}],

    // Synthetic Object
    [`export const v = Object.create({ a: 1 })`, { v: { a: 1 } }],
    [`export const v = Object.assign({ a: 1 }, { b: 2 }, { c: 3 })`, { v: { a: 1, b: 2, c: 3 } }],

    // function classes
    [`function Test() { } new Test();`, {}],
    [`function A(c) { this.b = c; } const inst = new A(1); export const value = inst.b;`, { value: 1 }],
    [`
      function A(name) {
        this.name = name;
      }

      function B(name) {
        A.call(this, name);
      }

      B.prototype = Object.create(A.prototype);

      const inst = new B(2);

      export const value = inst.name;
    `, { value: 2 }],

    [`
      class A {
        public b: string;
        constructor(b) {
          this.b = b;
        }
      }

      const inst = new A(100);
      export const v = inst.b;
    `, { v: 100 }],

    [`
      class ValueObject {
        public  value: any;
        constructor(value) {
          this.value = value;
        }
        valueOf() {
          return this.value;
        }
      }

      const vo = new ValueObject("a");
      export const value = vo.valueOf();
      `, { value: "a" }],

    // for statements
    [`
    const items = [];
    for (let i = 0; i < 4; i++) {
      items.push(i);
    }
    export const value = items;
    `, { value: [0, 1, 2, 3]}],

    [`
    const items = [];
    for (let i = 4; i >= 0; i--) {
      items.push(i);
    }
    export const value = items;
    `, { value: [4, 3, 2, 1, 0]}],

    [`
    const items = [];
    for (let i = 4; i--;) {
      items.push(i);
    }
    export const value = items;
    `, { value: [3, 2, 1, 0]}],

  ].forEach(([scriptSource, exports]) => {
    it(`can evaluate ${scriptSource}`, async () => {
      const ast = parse(<string>scriptSource);
      const resultExports = (await evaluateTypescript(ast)).value;
      const json = resultExports.toJSON();
      expect(json).to.eql(exports);
    });
  });

  it("can import documents", async () => {
    const ast = parse(`import { b } from "./test"; export const a = b;`);
    const context = new SymbolTable();
    context.set("import", new NativeFunction(async function(fileName: string) {
      return new SyntheticObject({
        b: new SyntheticValueObject("c")
      });
    }));
    const result = (await evaluateTypescript(ast, context)).value.toJSON();
    expect(result.a).to.equal("c");
  });
});