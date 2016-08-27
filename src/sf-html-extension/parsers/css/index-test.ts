import { parse } from "./index";
import { expect } from "chai";
import { IElement } from "sf-core/markup";
import {
  CSSStyleExpression,
  CSSLiteralExpression,
  CSSStyleDeclarationExpression,
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
      expect(style.declarations[0].value).to.be.an.instanceOf(CSSLiteralExpression);
    });
  });

  describe("rules", () => {
    it("can parse a simple class rule", () => {
      const expr = parse(`.box { color: red; }`);
      expect(expr.rules[0].selector.toString()).to.equal(".box");
      expect(expr.rules[0].style.declarations[0].key).to.equal("color");
      expect(expr.rules[0].style.declarations[0].value.toString()).to.equal("red");
    });

    it("can parse multiple css rules", () => {
      expect(parse(`.a{ color: red; } .b{ color: blue; }`).rules.length).to.equal(2);
    });
  });

  describe("selectors", () => {

    [

      // individual elements
      [".a", `<div class="a" target />`],
      [".a-b", `<div class="a-b" target />`],
      ["#a", `<div id="a" target />`],
      ["#a-b", `<div id="a-b" target />`],
      ["*", `<div target /><div class="a" target /><ul target><li target /></ul>`],
      ["a", `<a target />`],
      ["div", `<div target />`],
      ["div, a", `<div target /><a target></a><strong>test</strong>`],

      // nested
      ["a > img", `<a><img target /></a>`],
      ["ul > li > a > img", `<div><img /></div><ul><li></li><li><a><img target /></a></li></ul>`],
      ["div img", `<div><img target /></div><div><ul><li></li><li><a><img target /></a></li></ul></div>`],
      ["span > *", `<span><img target /></span><div><span><p target /></span></div>`],
      ["span + img", `<span></span><img target />`],
      ["footer > img + span", `<img /><span></span><footer><img /><span target></span></footer>`],

      // attributes
      ["*[target]", `<div target /><div />`],
      ["div[class=test]", `<div class="test" target /><div class="test2" />`],
      ["div[class^=test]", `<div class="testttt" target /><div class="teb" />`],
      ["div[class$=test]", `<div class="a b test" target /><div class="test a b" />`],
      ["div[class$='test']", `<div class="a b test" target /><div class="test a b" />`]

      // pseudo - TODO
      // ["li:first-child", `<ul><li target></li><li></li></ul>`]
    ].forEach(function([selector, html]) {
      it(`can parse ${selector} { } and select the proper element`, () => {
        const expr = parse(`${selector} { }`);
        const rule = expr.rules[0];
        const div = document.createElement("div");
        div.innerHTML = html;
        const nodes = flattenNode(div);
        nodes.shift(); // remove the initial div
        const targets = nodes.filter((node: Element) => node.nodeType === 1 && node.hasAttribute("target"));
        const matches = nodes.filter((node: Element) => node.nodeType === 1 && rule.selector.test(<IElement><any>node));
        expect(matches).to.eql(targets);
      });
    });
  });
});

function flattenNode(node: any): Array<Node> {
  const nodes = [node];
  if (node.childNodes) {
    for (const child of node.childNodes) {
      nodes.push(...flattenNode(child));
    }
  }
  return nodes;
}