import { parsePCStyle } from "../../paperclip";
import { expect } from "chai";

describe(__filename + "#", () => {
  [
    "@media { }",
    ".selector { }",
    ".a { .b { }}",
    ".a { .b { color: red; }}",
    ".a { .b { color: $blue; }}",
    ".a { .b { width: calc($var - 4px); }}",
    ".a { .b { width: calc($var - -44.4px); }}",
    "@media screen { } .b { }"
  ].forEach((source) => {
    it(`can parse ${source}`, () => {
      parsePCStyle(source);
    }); 
  })
});