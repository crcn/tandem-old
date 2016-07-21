import Scanner from './scanner';
import BaseObject from 'saffron-common/src/object/index';
import createToken from './create-token';

// linear-gradient(45deg, blue, red)
// linear-gradient(to left top, blue, red);
// linear-gradient(0deg, blue, green 40%, red);
import {
  SPACE,
  TAB,
  DOT,
  COLON,
  LEFT_PAREN,
  RIGHT_PAREN,
  OPERATOR,
  COMMA,
} from './token-types';

var tokenMap = {
  '.': DOT,
  ':': COLON,
  '(': LEFT_PAREN,
  ')': RIGHT_PAREN,
  ',': COMMA,
};

export class CSSTokenizer extends BaseObject {
  tokenize(source) {
    var scanner = new Scanner(source);
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

    while (!scanner.hasTerminated()) {

      const number = scanner.scan(/^((\.\d+)|(\d)+(\.\d+)?)/);

      if (number) {
        if (scanner.scan(/^deg/)) {
          tokens.push(createToken(number, 'degree'));
        } else {
          tokens.push(createToken(number, 'number'));
          // http://www.w3schools.com/cssref/css_units.asp
          addToken(/^(em|ex|%|px|cm|mm|in|pt|pc|ch|rem|vh|vw|vmin|vmax)/, 'unit');
        }
        continue;
      }

      if (addToken(/^#\w{1,6}/, 'color')) continue;
      if (addToken(/^\w+(\-\w+)?/, 'reference')) continue;
      if (addToken(/^\u0020+/, SPACE)) continue;
      if (addToken(/^\t+/, TAB)) continue;
      if (addToken(/^[\/\*\-\+]/, OPERATOR)) continue;
      if (addToken(/^,/, COMMA)) continue;

      const char = scanner.nextChar();

      tokens.push(createToken(char, tokenMap[char] || 'text'));
    }

    return tokens;
  }
}

export default new CSSTokenizer({});
