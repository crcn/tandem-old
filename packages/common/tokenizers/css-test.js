import CSSTokenizer from './css';
import expect from 'expect.js';

describe(__filename + '#', function() {
  it('can be created', function() {
    CSSTokenizer.create();
  });

  [
    ['100px', [['100', 'number'], ['px', 'unit']]],
    ['.5em', [['.5', 'number'], ['em', 'unit']]],
    ['0.5vmin', [['0.5', 'number'], ['vmin', 'unit']]],
    ['calc(  100%)', [
        ['calc', 'reference'],
        ['(', 'leftParen'],
        ['  ', 'space'],
        ['100', 'number'],
        ['%', 'unit'],
        [')', 'rightParen']
      ]
    ]
  ].forEach(function([source, matches]) {

    var tok = CSSTokenizer.create();
    var tokens = tok.tokenize(source).map(function(token) {
      return [token.value, token.type];
    });

    expect(tokens).to.eql(matches);
  })
});
