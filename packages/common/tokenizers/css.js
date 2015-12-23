import BaseObject from 'common/object/base';
import Scanner from './scanner';
import createToken from './create-token';

import {
  TEXT,
  SPACE,
  TAB,
  DOT,
  COLON,
  LEFT_PAREN,
  RIGHT_PAREN,
  OPERATOR
} from './token-types';

var tokenMap = {
  '.': DOT,
  ':': COLON,
  '(': LEFT_PAREN,
  ')': RIGHT_PAREN
};

class CSSTokenizer extends BaseObject {
  tokenize(source) {
    var scanner = Scanner.create(source);
    var tokens = [];

    function addToken(search, type) {
      if (scanner.scan(search)) {
        tokens.push(createToken(scanner.getCapture(), type));
        return true;
      }
      return false;
    }

    // function addOperator() {
    //   return addToken(/^[\/\*\-\+]/, OPERATOR);
    // }

    while(!scanner.hasTerminated()) {

      if (addToken(/^((\.\d+)|(\d)+(\.\d+)?)/, 'number')) {

        // http://www.w3schools.com/cssref/css_units.asp
        addToken(/^(em|ex|%|px|cm|mm|in|pt|pc|ch|rem|vh|vw|vmin|vmax)/, 'unit');

        // in case we get something like 2-2 (without spaces)
        // addOperator();
        continue;
      }

      if (addToken(/^\w+/, 'reference')) continue;
      if (addToken(/^\u0020+/, SPACE)) continue;
      if (addToken(/^\t+/, TAB)) continue;
      if (addToken(/^[\/\*\-\+]/, OPERATOR)) continue;

      var char = scanner.nextChar();

      tokens.push(createToken(char, tokenMap[char] || 'text'));
    }

    return tokens;
  }
}

export default CSSTokenizer.create();
