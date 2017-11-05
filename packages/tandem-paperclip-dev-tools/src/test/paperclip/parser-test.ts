import { 
  parse, 
  PCString, 
  PCExpressionType,
  PCElement,
  PCSelfClosingElement,
  PCStartTag,
  PCEndTag,
} from "../../paperclip";
import { expect } from "chai";

describe(__filename + "#", () => {
  it("can parse a self closing element", () => {
    const ast = parse("<a />").children[0] as PCSelfClosingElement;
    expect(ast.type).to.eql(PCExpressionType.SELF_CLOSING_ELEMENT);
    expect(ast.name).to.eql("a");
    expect(ast.attributes.length).to.eql(0);
  });

  it("can parse an element with a start and end tag", () => {
    const ast = parse("<a></a>").children[0] as PCElement;
    expect(ast.type).to.eql(PCExpressionType.ELEMENT);
    expect(ast.startTag.name).to.eql("a");
    expect(ast.endTag.name).to.eql("a");
  });

  it("can parse a self closing element with one attribute", () => {
    const ast = parse("<a b='c' />").children[0] as PCSelfClosingElement;
    expect(ast.type).to.eql(PCExpressionType.SELF_CLOSING_ELEMENT);
    expect(ast.name).to.eql("a");
    expect(ast.attributes.length).to.eql(1);
    expect(ast.attributes[0].type).to.eql(PCExpressionType.ATTRIBUTE);
    expect(ast.attributes[0].name).to.eql("b");
    expect(ast.attributes[0].value.type).to.eql(PCExpressionType.STRING);
    expect((ast.attributes[0].value as PCString).value).to.eql('c');
    // expect(ast.attributes[0].type).to.eql(PCExpressionType.STRING);
  });

  it("can parse a text node", () => {
    const ast: PCString = parse("a b").children[0] as PCString;
    expect(ast.type).to.eql(PCExpressionType.STRING);
    expect(ast.value).to.eql("a b");
  });
  
  it("can parse a fragment", () => {
    const ast = parse("a b <a />");
    expect(ast.children[0].type).to.eql(PCExpressionType.STRING);
    expect(ast.children[1].type).to.eql(PCExpressionType.SELF_CLOSING_ELEMENT);
  });

  // smoke
  [
    'a',
    '<a b="c" d="e" />',
    '<a b={{{color: red}}} />',
    '<a></a>',
    '<a />',
    '<a b c d="e" />',
    '<!--a b c d="e" -->',
    '<a b="c" d="e"><f h="i" j="k"></f></a>',
    '<a b="c" d="e"><f h="i" j="k"></f></a>',
    '<a b="c" d="e">1<f h="i" j="k"></f>2</a>',
  ].forEach((source) => {
    it(`can parse ${source}`, () => {
      parse(source);
    });
  });

  // smoke error test
  [
    `<a`,
    `<a>`,
    `<a b="c />`,
    `<a b=c />`,
    `<a></b>`
  ].forEach((source) => {
    it(`throws an error when parsing ${source}`, () => {
      expect(() => {
        try {
          const ast = parse(source);
        } catch(e) {
          throw e;
        }
      }).to.throw();

    });
  });
});