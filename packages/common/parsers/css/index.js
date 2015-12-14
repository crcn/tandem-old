import Scanner from '../scanner';

class CssParser {

  parse(source) {
    this._scanner = Scanner.create(source);
  }

  static create() {
    return new this();
  }
}

export default CssParser;
