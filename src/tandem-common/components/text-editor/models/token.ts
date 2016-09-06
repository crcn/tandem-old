import calcPosition from './calc-position';
import encode from './encode';
import Line from "./line";

class Token {

  public encodedValue: any;

  constructor(
    public type: string,
    private _value: string,
    public length: number = _value.length,
    public line: Line,
    public editor: any
  ) {

  }

  getColumn() {
    return this.line.tokens.indexOf(this);
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this.encodedValue = encode(this._value = value);
    this.editor.splice(this.position, this.length, value);
  }

  toString() {
    return this.encodedValue;
  }

  get position() {
    return this.line.position + calcPosition(this, this.line.tokens);
  }
}

export default Token;
