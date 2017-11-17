// TODO - need to test dynamic updates

import { expect } from "chai";
import { bundleVanilla, PaperclipTargetType } from "..";
import { getSEnvWindowClass } from "aerial-browser-sandbox";

describe(__filename + "#", () => {

  const runCode = async (context: any, input: string, wrap: (value: string) => string = (value) => value) => {
    const { code } = await bundleVanilla(null, {
      target: PaperclipTargetType.TANDEM,
      io: {
        readFile: async () => wrap(input),
        resolveFile: async (a, b) => null
      }
    });

    let outerCode = `

      // need access to native tags
      with(window) {
        with(context) {
          const { entry } = ${code}

          // append stray nodes randomly created in the doc first
          for (const node of entry.globalStyles) {
            window.document.body.appendChild(node);
          }

          // append stray nodes randomly created in the doc first
          for (const node of entry.strays) {
            window.document.body.appendChild(node);
          }
        }
      }
    `;
    
    const SEnvWindow = getSEnvWindowClass({
      fetch: async (uri) => ({
        text: async () => input
      }) as any
    });
    const window = new SEnvWindow("index.html");
    new Function("window", "context", "console", outerCode)(window, context, console);

    return window.document;
  };

  [
    [{}, `a`, `a`],
    [{}, `<span />`, `<span></span>`],
    [{}, `a <span />`, `a <span></span>`],
    [{}, `<span>a</span>`, `<span>a</span>`],
    [{}, `<span><h1 />1</span>`, `<span><h1></h1>1</span>`],
    [{}, `<span>a</span><!-- a -->`, `<span>a</span>`],
    [{}, `<style>.container { }</style>`, `<style></style>`],
    [{}, `<span b="c">!sbang</span>`, `<span b="c">!sbang</span>`],
    [{}, `<span b="c">bang!</span>`, `<span b="c">bang!</span>`],
    [{}, `<span b="c"></span>`, `<span b="c"></span>`],

    // bind
    [{ a: 1, c: 2 }, `<span b="[[bind a]] b [[bind c]]"></span>`, `<span b="1 b 2"></span>`],
    [{ a: 1, c: 2 }, `<span b=[[bind a]]></span>`, `<span></span>`],
    [{ a: 1}, `[[bind a]]`, `1`],
    [{ a: 1, b: 2}, `[[bind a]][[bind b]]`, `12`],
    [{}, `[[bind "a"]]`, `a`],
    [{}, `[[bind "a\\"b\\""]]`, `a"b"`],
    [{}, `[[bind 1]]`, `1`],
    [{}, `[[bind -1]]`, `-1`],
    [{}, `[[bind 1.1]]`, `1.1`],
    [{}, `[[bind -1.1]]`, `-1.1`],
    [{}, `[[bind .1]]`, `0.1`],
    [{ a: 1, b: 2}, `[[bind { a: 1 }]]`, `[object Object]`],
    [{ a: 1, b: 2}, `[[bind {}]]`, `[object Object]`],
    [{ a: 1, b: 2}, `[[bind { a: 1, b: 2 }]]`, `[object Object]`],
    [{ a: 1, b: 2}, `[[bind { "a": 1, b: 2 }]]`, `[object Object]`],
    [{ a: 1, b: 2}, `[[bind { a: 1, b: 2 }]]`, `[object Object]`],
    [{ a: 1, b: 2}, `[[bind { a: 1, b: 2, }]]`, `[object Object]`],
    [{ a: { b: { c: 1}}}, `[[bind a.b.c]]`, `1`],
    [{ }, `[[bind [1, 2, 3]]`, `1,2,3`],
    [{ }, `[[bind []]`, ``],

    // repeat
    [{ items: [1, 2, 3]}, `<span [[repeat items as item]]>[[bind item]]</span>`, `<span>1</span><span>2</span><span>3</span>`],

    // // repeat with index
    [{ items: [1, 2, 3]}, `<span [[repeat items as item, k]]>[[bind item]] [[bind k]]</span>`, `<span>1 0</span><span>2 1</span><span>3 2</span>`],

    // // repeat object
    [{ items: { b: 1, c: 2 }}, `<span [[repeat items as item, k]]>[[bind item]] [[bind k]]</span>`, `<span>1 b</span><span>2 c</span>`],

    // // if
    [{ a: 1 }, `<span [[if a]]>A</span>`, `<span>A</span>`],
    [{ a: 1 }, `<span [[if !a]]>A</span><span [[else]]>B</span>`, `<span>B</span>`],
    [{ a: 1 }, `<span [[if !a]]>A</span>b`, `b`],
    [{ a: 1, b: 2 }, `<span [[if a && b]]>A</span>`, `<span>A</span>`],
    [{ a: 1, b: 1 }, `<span [[if a === b]]>A</span>`, `<span>A</span>`],
    [{ a: 1, b: 2 }, `<span [[if a === b]]>A</span>b`, `b`],
    [{ a: 1, b: 2 }, `<span [[if a == b]]>A</span>b`, `b`],
    [{ a: null }, `<span [[if a == undefined]]>A</span>b`, `b`],
    [{ a: 1 }, `<span [[if a + 1 == 2]]>A</span>b`, `<span>A</span>b`],
    [{ a: 1 }, `<span [[if a > 1]]>A</span>b`, `b`],
    [{ a: 1 }, `<span [[if a >= 1]]>A</span>b`, `<span>A</span>b`],
    [{ a: 1 }, `<span [[if a < 1]]>A</span>b`, `b`],
    [{ a: 1 }, `<span [[if a <= 1]]>A</span>b`, `<span>A</span>b`],
    [{ a: 1, b: 0, c: 1 }, `<span [[if (a || b) && c]]>A</span>b`, `<span>A</span>b`],
    [{ a: 1, b: 0, c: 0 }, `<span [[if (a || b) && c]]>A</span>b`, `b`],
    [{ a: 1, b: 0 }, `<span [[if a || b]]>A</span>b`, `<span>A</span>b`],

    // components
    [
      {},
      `
        <component id="x-test">
          <template>  
            Hello
          </template>
        </component>

        <x-test />
      `,
      `<x-test></x-test>`
    ],
    [
      {},
      `
        <component id="x-test" [[property text]]>
          <template>  
            Hello [[bind text]]
          </template>
        </component>

        <x-test />
      `,
      `<x-test></x-test>`
    ],
    [
      {},
      `
        <component id="x-test">
          <style>
            .container { }
          </style>
          <template>  
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          </template>
        </component>

        <x-test />
      `,
      `<x-test></x-test>`
    ]
  ].forEach(([context, input, output]: [any, string, string]) => {
    it(`renders ${input} as ${output} with ${JSON.stringify(context)}`, async () => {
      const document = await runCode(context, input);
      expect(document.body.innerHTML.trim()).to.eql(output.trim());
    });
  });

  // styles

  [
    [`.container {}`, `.container { }`],
    [`.container {} /*\na comment */ .content {}`, `.container { } .content { }`],
    [`  .container {\na:b;}  `, `.container { a: b; }`],
    [`.container {a:b;c:d}`, `.container { a: b;c: d; }`],
    [`@media screen { .container { color: red; } }`, `@media screen { .container { color: red; } }`],
    [`@unknown screen { .container { color: red; } }`, ``],
    [`@charset "utf8";`, ``],
    [`@keyframes bab { 0% { color: red; }}`, `@keyframes bab { 0% { color: red; } }`],
    [`@font-face { color: red; }`, `@font-face { color: red; }`],
    [`.container:after { content: ": "; }`, `.container:after { content: ": "; }`],
    [`.container:after { content: "; "; }`, `.container:after { content: "; "; }`]
  ].forEach(([input, output]) => {
    it(`can parse ${input} to ${output}`, async () => {
      const wrap = (input) => `<style>${input.trim()}</style>`;
      const document = await runCode({}, input, wrap);
      const cssText = Array.prototype.map.call(document.styleSheets, sheet => sheet.cssText).join("").replace(/[\s\r\n\t]+/g, " ");
      expect(cssText.trim()).to.eql(output);
    });
  });
  
});