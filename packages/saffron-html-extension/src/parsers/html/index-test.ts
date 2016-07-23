import { expect } from 'chai';
import { parse } from './index.peg';
import { 
  HTML_TEXT,
  HTML_COMMENT,
  HTML_ELEMENT,
  HTML_FRAGMENT,
  HTML_ATTRIBUTE,
  HTMLTextExpression,
  HTMLCommentExpression,
  HTMLElementExpression,
  HTMLFragmentExpression,
  HTMLAttributeExpression
} from './expressions';

describe(__filename + `#`, () => { 

  describe('smoke tests#', function() { 
    [
      `a`,
      `<!-- a -->`,
      `<a></a>`,
      `<a />`,
      `<a b="c" />`,
      `<a b='c' d />`,
      `<a b="c" d>e</a>`
    ].forEach(function(source) {
      it(`can parse ${source}`, function() {
        const expression = parse(source);
        expect(expression.position.start).to.equal(0);
      });
    });
  })

  describe('text nodes#', () => {
    it('can be parsed on their own', () => {
      var text = parse('hello');
      expect(text.type).to.equal(HTML_TEXT);
      expect((<HTMLTextExpression>text).nodeValue).to.equal('hello');
    });

    it('trims the ends', () => {
      expect((<HTMLTextExpression>parse('  hello  ')).nodeValue).to.equal('hello');
    });
  });

  describe('elements#', () => {
    it('can be parsed without attributes or children', () => {
      var element = parse('<div />') as HTMLElementExpression;
      expect(element.type).to.equal(HTML_ELEMENT);
      expect(element.position.start).to.equal(0);
    });

    it('can parse attribute values', () => {
      var element = parse(`<div a="b" c='d' />`) as HTMLElementExpression;
      expect(element.attributes[0].key).to.equal('a');
      expect(element.attributes[0].value).to.equal('b');
      expect(element.attributes[1].key).to.equal('c');
      expect(element.attributes[1].value).to.equal('d');
    });

    it('can define attributes without any values', () => {
      var element = parse('<div a b />') as HTMLElementExpression;
      expect(element.attributes[0].value).to.equal('');
      expect(element.attributes[0].key).to.equal('a');
      expect(element.attributes[1].value).to.equal('');
    });

    it('can be parsed with one text child node', () => {
      var element = parse('<div>ab</div>') as HTMLElementExpression;
      expect(element.type).to.equal(HTML_ELEMENT);
      expect(element.childNodes.length).to.equal(1);
      expect(element.childNodes[0].type).to.equal(HTML_TEXT);
    });

    it('throws an error if the end tag does not match the start tag', () => {
      expect(() => parse('<div></span>')).to.throw(`SyntaxError: Expected </div> but "<div></span>`);
    });

    it('can parse a div with attributes and child nodes', () => {
      var element = parse('<div a="b" c><span />cd</div>') as HTMLElementExpression;
      expect(element.attributes[0].value).to.equal('b');
      expect(element.attributes[1].value).to.equal('');
      expect(element.childNodes.length).to.equal(2);
    });
  });

  describe('comments#', () => {
    it('can be parsed', () => {
      var element = parse('<!-- hello -->') as HTMLCommentExpression;
      expect(element.nodeValue).to.equal(' hello ');
      expect(element.position.start).to.equal(0);
    });
  });

  describe('fragments#', () => {
    it('are created when there are two root nodes', () => {
      var element = parse('<!-- hello -->text');
      expect(element.type).to.equal(HTML_FRAGMENT);
    });

    it('are created when the source is blank', () => {
      var element = parse('');
      expect(element.type).to.equal(HTML_FRAGMENT);
      expect((element as HTMLFragmentExpression).childNodes.length).to.equal(0);
    });
  });

  describe('whitespace#', () => {
    it('can parse multi-line docs', () => {
      var element = parse(`
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

    it('eats whitespace between elements', () => {
      var element = parse(`
        <div>
          <button class="button">
            text
          </button>
          <div>
          </div>
        </div>
      `) as HTMLElementExpression;
 
      expect(element.type).to.equal(HTML_ELEMENT);
      expect(element.childNodes.length).to.equal(2);
      expect(element.childNodes[0].type).to.equal(HTML_ELEMENT);
      expect(element.childNodes[1].type).to.equal(HTML_ELEMENT);
    });
  });
});