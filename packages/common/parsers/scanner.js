class Scanner {

  constructor(source) {
    this.source = source || '';

    // -1 so that the next char is the initial character
    this.position    = 0;
    this.matches     = [];
  }

  /**
   */

  scan(search) {
    var match = this.source.substr(this.position).match(search);
    if (!match) return void 0;
    var value = match[0];
    this.position = this.source.indexOf(value, this.position) + value.length;
    return value;
  }

  /**
   */

  hasTerminated() {
    return this.position >= this.source.length;
  }

  /**
   */

  static create(source) {
    return new this(source);
  }
}

export default Scanner;
