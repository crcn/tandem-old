import { expect } from "chai";
import { parseTypescript } from "./parser";

describe(__filename + "#", () => {
  [
    `function test() { }`
  ].forEach((content: string) => {
    it(`can parse ${content}`, () => {
      parseTypescript(content);
    });
  });
});