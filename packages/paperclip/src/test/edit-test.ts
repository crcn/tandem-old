// TODO - SET_HTML, INSERT_RULE, 
import { expect } from "chai";
import { bundleVanilla, PaperclipTargetType, editPaperclipSource, PC_REMOVE_CHILD_NODE, PC_REMOVE_NODE, PCRemoveChildNodeMutation, PCRemoveNodeMutation } from "..";
import { flatten } from "lodash";
import { getSEnvWindowClass, diffWindow, patchWindow } from "aerial-browser-sandbox";
import { editString } from "source-mutation";

describe(__filename + "#", () => {

  const wrapAsComponent = input => `<component id="x-test"><template><span>${input}</span></template></component>`

  const run = async (input) => {

    const { code } = await bundleVanilla(null, {
      target: PaperclipTargetType.TANDEM,
      io: {
        readFile: async () => input,
        resolveFile: async (a, b) => null
      }
    });

    const SEnvWindow = getSEnvWindowClass({
      fetch: async (uri) => ({
        text: async () => input
      }) as any
    });

    let outerCode = `
    
      // need access to native tags
      with(window) {
        with(context) {
          const { entry } = ${code}
          document.body.appendChild(document.createElement("x-test"));
        }
      }
    `;
    
    const window = new SEnvWindow("index.html", null);
    new Function("window", "context", "console", outerCode)(window, context, console);
    return window;
  }

  [
    ["a", "b"],
    [`<a b></a>`, `<a></a>`],
    [`<a b="1"></a>`, `<a c="1"></a>`],
    [`<h1 />`, `<h2></h2>`],
    [`<span />`, `<span>a</span>`],
    [`<span    />`, `<span>a</span>`],
    [`<span></span>`, `<span>a</span>`],
    [`<span>a</span>`, `<span>b</span>`],
    [`<span b c d>a</span>`, `<span>b</span>`],
    [`<span b="1">a</span>`, `<span b="c">b</span>`]
  ].forEach(([input, output]) => {
    it(`can change the source from ${input} to ${output}`, async () => {
      const wi = wrapAsComponent(input);
      const wo = wrapAsComponent(output);
      const a = await run(wi);
      const b = await run(wo);

      const mutations = diffWindow(a, b);

      const result = editString(wi, flatten(mutations.map(mutation => editPaperclipSource(wi, mutation))));

      expect(result).to.eql(wo);
    });
  }); 
});