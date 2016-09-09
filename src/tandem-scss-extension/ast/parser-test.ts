import { expect } from "chai";
import { parseSCSS } from "./index";

describe(__filename + "#", () => {
  [
    `.a {}`,
    `$color: red;`
  ].forEach((source) => {
    it(`can parse ${source}`, async () => {
      expect((await parseSCSS(source)).toString()).to.equal(source);
    });
  });
});