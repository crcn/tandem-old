import { expect } from 'chai';
import { parse } from './xml.peg';

describe(__filename + `#`, function() {

  describe('smoke tests#', function() {
    // smoke tests
    [
      // elements
      `<div></div>`,
      `<div />`,
      `<div a="a"></div>`,
      `<div a b></div>`,
      `<div a b />`,

      // text
      `hello`,
      
      // comment
      `<!--comment-->`,

      // JavaScript
      `{{a}}`,
      `{{a.b}}`,
      `{{"a"}}`,
      `{{'a'}}`,

      // numbers
      `{{1}}`,
      `{{1.1}}`,
      `{{1.123}}`,
      `{{.123}}`,
      `{{-1}}`,

      // math
      `{{a+b}}`,
      `{{a-b}}`,
      `{{a*b}}`,
      `{{a/b}}`,
      `{{a%b}}`,
      
      // condition
      `{{a&&b}}`,
      `{{a||b}}`,

      // other expressions & combos
      `{{!a}}`,
      `{{!!a}}`,
      `{{a?b:c}}`,
      `{{a.b(c)}}`,
      `{{(a+b)-1}}`,
      `{{{a:b,c:d}}}`
    ].forEach(source => {
      it(`can parse ${source}`, () => {
        parse(source);
      });
    });
  }); 

  describe('css tests#', function() {
    it('parses the style attribute as a css delcaration', function() {
      var root = parse(`<div style="color:red;" />`) as any;

      var styleExpression = root.childNodes[0].attributes[0];
      expect(styleExpression.key).to.equal('style');
      expect(styleExpression.value.ns).to.equal('cssStyle');
      expect(styleExpression.value.declarations[0].key).to.equal('color');
    });
  });
});