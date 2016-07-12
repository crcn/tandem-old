import create from 'common/utils/class/create';

class Scanner {

  constructor(source) {
    this.source   = source == void 0 ? '' : String(source);
    this.position = 0;
  }

  scan(regexp) {
    const rest = this.source.substr(this.position);
    const match = rest.match(regexp);
    if (!match) return void 0;
    this._capture = match[0];
    this.position += rest.indexOf(this._capture) + this._capture.length;
    return this._capture;
  }

  nextChar() {
    return this.source.charAt(this.position++);
  }

  hasTerminated() {
    return this.position >= this.source.length;
  }

  getCapture() {
    return this._capture;
  }

  static create = create;
}

export default Scanner;
