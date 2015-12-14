import expect from 'expect.js';
import CssParser from './index.js';
import flatten from 'lodash/array/flattenDeep';

describe(__filename + '#', function() {
  var parser = CssParser.create();

  [
    '.style { }', 'class::style'
  ].forEach(function([style, matches]) {
    xit('can parse ' + style, function() {
      // expect(stringifyExpression(parser.parse(style))).to.be(matches);
    });
  });
});

function stringifyExpression(expression) {
  return flatten(expression).join('::');
}
