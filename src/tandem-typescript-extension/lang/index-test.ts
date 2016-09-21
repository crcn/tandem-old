import { expect } from "chai";
import { parseTypescript } from "./parser";

describe(__filename + "#", () => {
  [
    `export const i = 10;`
  ].forEach((content: string) => {
    xit(`can evaluate ${content}`, () => {
      const ast = parseTypescript(content);
    });
  });
});