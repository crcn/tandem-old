import { expect } from "chai";
export { querySelectorAll } from "./query";
import {
  parseMarkup,
  evaluateMarkup,
  querySelectorAll,
  SyntheticDocument
} from "@tandem/synthetic-browser";

describe(__filename + "#", () => {
  [
    ["*", "<div>a</div>b<span>c</span>", "<div>a</div><span>c</span>"]
  ].forEach(([selector, a, b]) => {
    it(`selector ${selector} for ${a} equals ${b}`, () => {
      const el = evaluateMarkup(parseMarkup(a), new SyntheticDocument(null, ""));
      const nodes = querySelectorAll(el, selector);
      expect(nodes.join("")).to.equal(b);
    });
  });
});