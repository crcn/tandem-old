import { parse } from './css.peg';
import { expect } from 'chai';

describe(__filename + '#', function() {
  describe('smoke tests#', function() {
    [
      'color:red;',
      'color:#F60;',
      'color:#FF6600;',
      '--webkit-pointer-events:none;',
      'background-color:black;',
      'color:red;background-color:blue;'
    ].forEach(source => {
      it(`can parse ${source}`, () => {
        parse(source);
      }); 
    });
  });

  describe('declarations', function() {
    it('can parse color values', function() {
      var style = parse(`color:#F60;`);
      expect(style.declarations[0].value.ns).to.equal('cssLiteral');
    });

    it('can parse measurements', function() {

    });

    
    [
      'color:rgba();',
      'color:rgba(0);',
      'color:rgba(0, 0, 0.1);'
    ].forEach(source => {
        it(`parses ${source} as a function call`, () => {
          expect(parse(source).declarations[0].value.ns).to.equal('cssFunctionCall')
        }); 
      });
    });

    [
      'background:red blue;',
      'background:red rgba(0,0,0.5) url(http://google.com);'
      // 'background:red, green, blue;'
    ].forEach(source => {
      it(`parse ${source} as a list value`, () => {
        var style = parse(source);
        expect(style.declarations[0].value.ns).to.equal('cssListValue');
      });
    });
  });
});
