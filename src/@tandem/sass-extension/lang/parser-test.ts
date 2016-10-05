import { expect } from "chai";
import { parseSass } from "./index";

describe(__filename + "#", () => {
  [
    `.a {}`,
    `$color: red;`
  ].forEach((source) => {
    it(`can parse ${source}`, async () => {
      expect((await parseSass(source)).toString()).to.equal(source);
    });
  });
});