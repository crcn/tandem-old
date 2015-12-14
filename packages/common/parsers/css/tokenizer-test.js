import {
  DOT,
  HASH,
  VARIABLE_NAME,
  LEFT_CURLY_BRACKET,
  RIGHT_CURLY_BRACKET
} from './token-types';
import expect from 'expect.js'
import Tokenizer from './tokenizer';
import Scanner from '../scanner';
import flatten from 'lodash/array/flattenDeep';

describe(__filename + '#', function() {

  it('can be created', function() {
    Tokenizer.create();
  });

  [
    ['.', [DOT, '.']],
    ['#', [HASH, '#']],
    ['{', [LEFT_CURLY_BRACKET, '{']],
    ['}', [RIGHT_CURLY_BRACKET, '}']],
    ['name', [VARIABLE_NAME, 'name']]
  ].forEach(function([source, match]) {
    it('can tokenize ' + source, function() {
      var tokenizer = Tokenizer.create(Scanner.create(source));
      var tokens = [];
      while(1) {
        var token = tokenizer.getNextToken();
        if (token == void 0) break;
        tokens.push(token);
      }

      expect(flatten(tokens).join('')).to.be(flatten(match).join(''));
    });
  });
});
