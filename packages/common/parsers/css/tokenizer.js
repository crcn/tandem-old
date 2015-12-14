import {
  DOT, HASH, LEFT_CURLY_BRACKET, RIGHT_CURLY_BRACKET
} from './token-types';

function createToken(code, value) {
  return [code, value];
}

var tokenCharMap = {
  '.' : DOT,
  '#' : HASH,
  '{' : LEFT_CURLY_BRACKET,
  '}' : RIGHT_CURLY_BRACKET
}

class Tokenizer {

  constructor(scanner) {
    this.scanner = scanner;
  }

  getNextToken() {
    var cchar = this.scanner.scan(/./);

    if (tokenCharMap[cchar]) {
      return createToken(tokenCharMap[cchar], cchar);
    }
  }


  static create(scanner) {
    return new this(scanner);
  }
}

export default Tokenizer;
