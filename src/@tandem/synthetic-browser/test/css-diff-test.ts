import { generateRandomStyleSheet } from "@tandem/synthetic-browser/test/helpers";
import { parseCSS, evaluateCSS } from "@tandem/synthetic-browser";
import { expect } from "chai";

describe(__filename + "#", () => {
  [
    ['.a { color: red }', '.a { color: blue }', []]
  ].forEach(([oldSource, newSource, changeActions]) => {
    it(`Can diff & patch ${oldSource} to ${newSource} with ops: ${(changeActions as any).join(" ")}`, () => {
      const a = evaluateCSS(parseCSS(oldSource as string));
      const b = evaluateCSS(parseCSS(newSource as string));
      a.createEdit().fromDiff(b).applyActionsTo(a);
      expect(a.cssText).to.equal(b.cssText);
    });;
  });
});