import { parse } from "./index";
import { expect } from "chai";
import {
  CSS_STYLE,
  CSS_LIST_VALUE,
  CSS_LITERAL_VALUE,
  CSS_FUNCTION_CALL,
  CSS_STYLE_DECLARATION
} from "./expressions";

describe(__filename + "#", () => {
  describe("smoke tests#", () => {
    [
      "color:red;",
      "color:#F60;",
      "color:#FF6600;",
      "--webkit-pointer-events:none;",
      "background-color:black;",
      "color:red;background-color:blue;",
      "background-color: #CCC; width: 1024px; height: 768px; display:block;",
      "display:block; width:110.422px; height:50px; "
    ].forEach(source => {
      it(`can parse ${source}`, () => {
        parse(`.style { ${source} }`);
      });
    });
  });

  describe("declarations", () => {
    it("can parse color values", () => {
      const style = parse(`.style{color:#F60;}`).rules[0].style;
      expect(style.declarations[0].value.type).to.equal(CSS_LITERAL_VALUE);
    });
    [
      "color:rgba();",
      "color:rgba(0);",
      "color:rgba(0, 0, 0.1);"
    ].forEach(source => {
      it(`parses ${source} as a function call`, () => {
        expect(parse(`.style { ${source} }`).rules[0].style.declarations[0].value.type).to.equal(CSS_FUNCTION_CALL);
      });

    });

    [
      "background:red blue;",
      "background:red rgba(0,0,0.5) url(http://google.com);"
      // "background:red, green, blue;"
    ].forEach(source => {
      it(`parse ${source} as a list value`, () => {
        const style = parse(`.style { ${source} }`).rules[0].style;
        expect(style.declarations[0].value.type).to.equal(CSS_LIST_VALUE);
      });
    });
  });

  describe("rules", () => {
    it("can parse a simple class rule", () => {
      const expr = parse(`.box { color: red; }`);
      expect(expr.rules[0].selector).to.equal(".box");
      expect(expr.rules[0].style.declarations[0].key).to.equal("color");
      expect(expr.rules[0].style.declarations[0].value.toString()).to.equal("red");
    });

    it("can parse multiple css rules", () => {
      expect(parse(`.a{ color: red; } .b{ color: blue; }`).rules.length).to.equal(2);
    });
  });
});