import calcPosition from "./calc-position";
import encode from "./encode";
import Line from "./line";

export default class Token {

  constructor(
    public type: string,
    private _value: string,
    public length: number = _value.length,
    public line: Line,
    public editor: any
  ) {

  }

  get encodedValue() {
    return encode(this._value);
  }

  get column(): number {
    return this.line.tokens.indexOf(this);
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
    this.editor.splice(this.position, this.length, value);
  }

  toString() {
    return this.encodedValue;
  }

  get position() {
    return this.line.position + calcPosition(this, this.line.tokens);
  }
}
