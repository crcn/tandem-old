
import { expect } from "chai";
import { patchTreeNode } from "@tandem/common";
import { CSSExpressionLoader, parseCSS } from "@tandem/html-extension";

describe(__filename + "#", () => {
  [
    [`color: red;  `, `color: blue;`, `color: blue;  `],
    [`color: red  ;  `, `color: blue;`, `color: blue;  `]
  ].forEach(([input, change, output]) => {
    it(`can change ${input} to ${output} while maintaining whitespace`, async () => {
      const loader = new CSSExpressionLoader();
      await loader.load({ content: input });
      patchTreeNode(loader.expression, parseCSS(change));
      expect(loader.source.content).to.equal(output);
    });
  });
});

