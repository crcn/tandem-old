import { expect } from "chai";
import { parseSCSS } from "./index";

describe(__filename + "#", () => {
  [
    `$color:red;`
  ].forEach((source) => {
    it(`can parse ${source}`, () => {
      expect(parseSCSS(source).toString()).to.equal(source);
    });
  });
});