import { expect } from "chai";
import { parseDeclaration, stringifyDeclarationAST } from "../index";

describe(__filename + "#", () => {
  [
    ["bold", "bold"],
    ["--test", "--test"],
    ["10px", "10px"],
    ["10", "10"],
    ["rgba(0,0,0,1)", "rgba(0, 0, 0, 1)"],
    ["#F60", "#F60"],
    ["url('http://google.com')", `url("http://google.com")`],
    ["0px #F60", "0px #F60"],
    ["2px sold var(--border-color-deep)", "2px sold var(--border-color-deep)"],
    ["10%", "10%"]
  ].forEach(([input, output]) => {
    it(`can parse ${input}`, () => {
      expect(stringifyDeclarationAST(parseDeclaration(input).root)).to.eql(output);
    }); 
  });
});