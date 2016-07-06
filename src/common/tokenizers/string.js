import create from 'common/utils/class/create';
import Scanner from './scanner';
import createToken from './create-token';
import { SPACE, TAB, NEW_LINE, TEXT } from './token-types';

class StringTokenizer {

  tokenize(source) {

    var scanner = Scanner.create(source);
    var tokens  = [];

    function addToken(scanRegexp, type) {
      if (scanner.scan(scanRegexp)) {
        tokens.push(createToken(scanner.getCapture(), type));
        return true;
      }
      return false;
    }

    while(!scanner.hasTerminated()) {
      if (addToken(/^[\n\r]/, NEW_LINE)) continue;
      if (addToken(/^\t+/, TAB)) continue;
      if (addToken(/^\u0020+/, SPACE)) continue;
      if (addToken(/[^\s\t\n\r]+/, TEXT)) continue;
      throw new Error('unexpected token: '+ scanner.getCapture());
    }

    return tokens;
  }

  static create = create;
}

export default StringTokenizer;
