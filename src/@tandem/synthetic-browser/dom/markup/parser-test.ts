import { expect } from "chai";
import { parseMarkup } from "./parser";

describe(__filename + "#", () => {
  [
    [`<div className="test" />`]
  ].forEach(([input, output]) => {
    it(`can parse ${input}`, () => {
      parseMarkup(input);
    });
  });
});