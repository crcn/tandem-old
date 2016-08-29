import { expect } from "chai";
import { parsePC } from "./index";
import { PCBlockNodeExpression } from "./expressions";

describe(__filename + "#", () => {

  describe("smoke", () => {
    [
      "hello {message}",
      "<div class=\"${classes}\" />",
    ].forEach((source) => {
      it(`can parse ${source}`, () => {
        parsePC(source);
      });
    });
  });

  describe("blocks", () => {
    it("can be parsed", () => {
      const expr = parsePC("hello ${message}");
      expect(expr.children.length).to.equal(2);
      const block = <PCBlockNodeExpression>expr.children[1];
      expect(block.script).to.equal("message");
    });
  });
});