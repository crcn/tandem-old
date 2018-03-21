import { stringifyNode } from "./utils";
import { expect } from "chai";
import { loadModuleDependencyGraph, runPCFile } from "..";
import { querySelectorAll, SlimParentNode, SlimElement } from "slim-dom";

describe(__filename + "#", () => {
  [
    [`div`, `<span><div>a</div><div>b</div></span>`, [`<div>a</div>`, `<div>b</div>`]],
    [`#a`, `<span><div id="a">a</div><div>b</div></span>`, [`<div id="a">a</div>`]],
    [`.a`, `<span><div class="a">a</div><div class="a b c">b</div><div class="b c">c</div></span>`, [`<div class="a">a</div>`, `<div class="a b c">b</div>`]],
    [`*`, `<span><div></div></span>`, [`<span><div></div></span>`, `<div></div>`]],
    [`*[a]`, `<span><div a="true"></div><div b></div></span>`, [`<div a="true"></div>`]],
    [`div > span`, `<div><span>a</span></div><span>b</span>`, [`<span>a</span>`]],
    [`div > span:last-child`, `<div><span>a</span><span>b</span></div><span>c</span>`, [`<span>b</span>`]]
  ].forEach(([selectorText, source, matches]: any) => {
    it(`can query ${selectorText} in ${source}`, async () => {
      const wrapped = `<component id="test"><template>${source}</template><preview name="main"><test /></preview></component>`;
      const { graph } = await loadModuleDependencyGraph("entry.pc", {
        readFile: () => Promise.resolve(wrapped)
      });
      const { document, diagnostics } = runPCFile({ 
        entry: {
          filePath: "entry.pc",
          componentId: "test",
          previewName: "main"
        },
        graph
      });

      expect(querySelectorAll(selectorText, ((document as any as SlimParentNode).childNodes[0] as SlimElement).shadow.childNodes[0] as SlimParentNode, document).map(stringifyNode)).to.eql(matches);
    });  
  });
});