import { diffNode } from "slim-dom";
import { expect } from "chai";
import { loadModuleDependencyGraph, runPCFile } from "..";

describe(__filename + "#", () => {
  [
    [`a`, `b`, [
      
    ]]
  ].forEach(([oldSource, newSource, expectedDiffs]) => {
    it(`can diff ${oldSource} against ${newSource}`, async () => {
      const { graph: ag } = await loadModuleDependencyGraph("entry", {
        readFile: () => Promise.resolve(newSource)
      });
      const { graph: bg } =  await loadModuleDependencyGraph("entry", {
        readFile: () => Promise.resolve(oldSource)
      });

      const { document: an } = runPCFile({ entry: {filePath: "entry", componentId: "entry", previewName: "main" }, graph: ag });

      const { document: bn } = runPCFile({ entry: {filePath: "entry", componentId: "entry", previewName: "main" }, graph: ag });

      const diffs = diffNode(an, bn);
      expect(diffs).to.eql(expectedDiffs);
    });
  });
});

const wrapSource = (template: string) => `<component id="entry"><template>${template}</template><preview name="main"><entry  /></preview></component>`;