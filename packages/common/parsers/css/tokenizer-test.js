import expect from 'expect.js'
import { DOT, NAME } from './token-types';
import Tokenizer from './tokenizer';
import Scanner from '../scanner';
import flatten from 'lodash/array/flattenDeep';

describe(__filename + '#', function() {

  it('can be created', function() {
    Tokenizer.create();
  });

  [
    ['.', [DOT, '.']]
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
