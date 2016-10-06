import { parse } from "./parser.peg";
import { expect } from "chai";
import {
  MarkupTextExpression,
  MarkupCommentExpression,
  MarkupElementExpression,
  HTMLFragmentExpression,
  MarkupAttributeExpression,
} from "./ast";

describe(__filename + `#`, () => {

  describe("smoke tests#", () => {
    [
      `a`,
      `<!-- a -->`,
      `<a></a>`,
      `<a />`,
      `<a b="c" />`,
      `<a b="c" d />`,
      `<a b="c" d>e</a>`
    ].forEach(function(source) {
      it(`can parse ${source}`, () => {
        const expression = parse(source);
        expect(expression.position.start).to.equal(0);
      });
    });
  });

  describe("text nodes#", () => {
    it("can be parsed on their own", () => {
      const text = <MarkupTextExpression>(<HTMLFragmentExpression>parse("hello")).children[0];
      expect(text).to.an.instanceOf(MarkupTextExpression);
      expect((<MarkupTextExpression>text).value).to.equal("hello");
    });
  });

  describe("elements#", () => {
    it("can be parsed without attributes or children", () => {
      const element = (<HTMLFragmentExpression>parse("<div />")).children[0] as HTMLFragmentExpression;
      expect(element).to.be.an.instanceOf(MarkupElementExpression);
      expect(element.position.start).to.equal(0);
    });

    it("can parse attribute values", () => {
      const element = (parse(`<div a="b" c="d" />`) as HTMLFragmentExpression).children[0] as MarkupElementExpression;
      expect(element.attributes[0].name).to.equal("a");
      expect(element.attributes[0].value).to.equal("b");
      expect(element.attributes[1].name).to.equal("c");
      expect(element.attributes[1].value).to.equal("d");
    });

    it("can define attributes without any values", () => {
      const element = (parse("<div a b />") as HTMLFragmentExpression).children[0] as MarkupElementExpression;
      expect(element.attributes[0].value).to.equal("");
      expect(element.attributes[0].name).to.equal("a");
      expect(element.attributes[1].value).to.equal("");
    });

    it("can be parsed with one text child node", () => {
      const element = (<HTMLFragmentExpression>parse("<div>ab</div>")).children[0] as MarkupElementExpression;
      expect(element).to.be.an.instanceOf(MarkupElementExpression);
      expect(element.childNodes.length).to.equal(1);
      expect(element.childNodes[0]).to.be.an.instanceOf(MarkupTextExpression);
    });

    it("throws an error if the end tag does not match the start tag", () => {
      expect(() => parse("<div></span>")).to.throw(`SyntaxError: Expected </div> but "<div></span>`);
    });

    it("can parse a div with attributes and child nodes", () => {
      const element = (<any>parse("<div a=\"b\" c><span />cd</div>")).children[0] as MarkupElementExpression;
      expect(element.attributes[0].value).to.equal("b");
      expect(element.attributes[1].value).to.equal("");
      expect(element.childNodes.length).to.equal(2);
    });

    [
      "br"
    ].forEach((voidTagName) => {
      it(`can parse <${voidTagName}>`, () => {
        parse(`<${voidTagName}>`);
      });
    });
  });

  describe("comments#", () => {
    it("can be parsed", () => {
      const element = (<HTMLFragmentExpression>parse("<!-- hello -->")).children[0] as MarkupCommentExpression;
      expect(element.value).to.equal(" hello ");
      expect(element.position.start).to.equal(0);
    });
  });

  describe("dependencies#", () => {
    it("are created when there are two root nodes", () => {
      const element = parse("<!-- hello -->text");
      expect(element).to.be.an.instanceOf(HTMLFragmentExpression);
    });

    it("are created when the source is blank", () => {
      const element = parse("");
      expect(element).to.be.an.instanceOf(HTMLFragmentExpression);
      expect((element as HTMLFragmentExpression).children.length).to.equal(0);
    });
  });

  describe("whitespace#", () => {
    it("can parse multi-line docs", () => {
      const element = parse(`
        <div>
          <style type="text/css">
            .button {
              color: red
            }
          </style>

          <!-- a styled button -->
          <div class="button">
            Some Button
          </div>
        </div>
      `);
    });

    it("eats whitespace between elements", () => {
      const element = (<HTMLFragmentExpression>parse(`
        <div>
          <button class="button">
            text
          </button>
          <div>
          </div>
        </div>
      `)).children[0] as MarkupElementExpression;

      expect(element).to.be.an.instanceOf(MarkupElementExpression);
      expect(element.children.length).to.equal(2);
      expect(element.children[0]).to.be.an.instanceOf(MarkupElementExpression);
      expect(element.children[1]).to.be.an.instanceOf(MarkupElementExpression);
    });
  });
});