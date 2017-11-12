import { expect } from "chai";
import { paperclipToVanilla, PaperclipTargetType } from "..";
import { getSEnvWindowClass } from "aerial-browser-sandbox";

describe(__filename + "#", () => {

  
  [
    [{}, `a`, `a`],
    [{}, `<span />`, `<span></span>`],
    [{}, `a <span />`, `a <span></span>`],
    [{}, `<span>a</span>`, `<span>a</span>`],
    [{}, `<span><h1 />1</span>`, `<span><h1></h1>1</span>`],
    [{}, `<span>a</span><!-- a -->`, `<span>a</span>`],
    [{}, `<span b="c"></span>`, `<span b="c"></span>`],

    // echo
    [{ a: 1, c: 2 }, `<span b="[[echo a]] b [[echo c]]"></span>`, `<span b="1 b 2"></span>`],
    [{ a: 1, c: 2 }, `<span b=[[echo a]]></span>`, `<span></span>`],
    [{ a: 1}, `[[echo a]]`, `1`],
    [{ a: 1, b: 2}, `[[echo a]][[echo b]]`, `12`],

    // repeat
    [{ a: [1, 2, 3]}, `<span [[repeat items as item]]>[[echo item]]</span>`, `<span>1</span><span>2</span><span>3</span>`],

    // repeat with index
    [{ a: [1, 2, 3]}, `<span [[repeat items as item, k]]>[[echo item]] [[echo k]]</span>`, `<span>1 0</span><span>2 0</span><span>3 0</span>`],

    // repeat object
    [{ a: { b: 1, c: 2 }}, `<span [[repeat items as item, k]]>[[echo item]] [[echo k]]</span>`, `<span>1 b</span><span>2 c</span>`],

    // if
    [{ a: 1 }, `<span [[if a]]>A</span>`, `<span>A</span>`]
    // [{ a: 1 }, `<span [[if !a]]>A</span>b`, `b`],
    // [{ a: 1, b: 2 }, `<span [[if a && b]]>A</span>`, `<span>A</span>`],
    // [{ a: 1, b: 1 }, `<span [[if a === b]]>A</span>`, `<span>A</span>`],
    // [{ a: 1, b: 2 }, `<span [[if a === b]]>A</span>b`, `b`]
  ].forEach(([context, input, output]: [any, string, string]) => {
    it(`renders ${input} as ${output} with ${JSON.stringify(context)}`, async () => {
      const { code } = await paperclipToVanilla(null, {
        target: PaperclipTargetType.TANDEM,
        io: {
          readFile: async () => input,
          resolveFile: async (a, b) => null
        }
      });

      let outerCode = `
        with(context) {
          const result = ${code}
          const entry = result.modules[result.entryPath]();

          // append stray nodes randomly created in the doc first
          for (const node of entry.strays) {
            window.document.body.appendChild(node);
          }
        }
      `;
      
      const SEnvWindow = getSEnvWindowClass({
        fetch: async (uri) => ({
          text: async () => input
        }) as any
      });
      const window = new SEnvWindow("index.html");
      new Function("window", "context", outerCode)(window, context);

      expect(window.document.body.innerHTML).to.eql(output);
    });
  });
});