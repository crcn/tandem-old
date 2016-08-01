import { parse } from "./index";
import { expect } from "chai";
import {
  CSS_FUNCTION_CALL,
  CSS_LIST_VALUE,
  CSS_LITERAL_VALUE,
  CSS_STYLE,
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
        parse(source);
      });
    });
  });

  describe("declarations", () => {
    it("can parse color values", () => {
      const style = parse(`color:#F60;`) as any;
      expect(style.declarations[0].value.type).to.equal(CSS_LITERAL_VALUE);
    });
    [
      "color:rgba();",
      "color:rgba(0);",
      "color:rgba(0, 0, 0.1);"
    ].forEach(source => {
      it(`parses ${source} as a function call`, () => {
        expect((parse(source) as any).declarations[0].value.type).to.equal(CSS_FUNCTION_CALL);
      });
    });

    [
      "background:red blue;",
      "background:red rgba(0,0,0.5) url(http://google.com);"
      // "background:red, green, blue;"
    ].forEach(source => {
      it(`parse ${source} as a list value`, () => {
        const style = parse(source) as any;
        expect(style.declarations[0].value.type).to.equal(CSS_LIST_VALUE);
      });
    });
  });
});