import { parsePCStyle } from "../../paperclip";
import { expect } from "chai";

describe(__filename + "#", () => {
  [
    ":root { --color: red; }",
    ":root { --color: red; } a { color: var(--color); }",
    ".a { .b { }} ",
    "@media { }",
    ".selector { }",
    ".a { .b { }}",
    ".a { .b { color: red; }}",
    ".a { .b { color: $blue; }}",
    ".a { .b { width: calc($var - 4px); }}",
    ".a { .b { width: calc($var - -44.4px); }}",
    "@media screen { } .b { }",
    ".a  { } .b { }",
    "@keyframes a { 0% { color: red; }} ",
    ".test, .b { background-image: url('test.png'); }",
    ".container { color: red; } @keyframes a { 0% { color: red; }} ",
  ].forEach((source) => {
    it(`can parse ${source}`, () => {
      const ast = parsePCStyle(source);
      // console.log(ast);
    }); 
  })
});