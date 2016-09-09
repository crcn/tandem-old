import { parseCSS } from "./index";
import { expect } from "chai";

describe(__filename + "#", () => {
  [
    `   .style { color: red; }`,
    `
    .a {
      color: red;
      background: url();
    }
    `,
    `
    .a {
      color: red;
      background: url();
    }
    .b {
      color: red;
      background: url();
    }
    `
  ].forEach((source) => {
    xit(`preserves the whitespace for ${source}`, () => {
      expect(parseCSS(source).toString()).to.equal(source);
    });
  });
});

