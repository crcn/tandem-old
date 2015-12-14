import {
  DOT
} from './token-types';

function createToken(code, value) {
  return [code, value];
}

class Tokenizer {

  constructor(scanner) {
    this.scanner = scanner;
  }

  getNextToken() {
    var cchar = this.scanner.scan(/./);

    // it's a class
    if (cchar === '.') {
      return createToken(DOT, cchar);
    }
  }


  static create(scanner) {
    return new this(scanner);
  }
}

export default Tokenizer;
