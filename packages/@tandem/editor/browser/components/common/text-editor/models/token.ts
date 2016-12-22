import calcPosition from "./calc-position";
import encode from "./encode";
import TextEditorLine from "./line";

export class TextEditorToken {

  private _updated: boolean;

  constructor(
    public type: string,
    private _value: string,
    public length: number = _value.length,
    public line: TextEditorLine,
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

  updateValue(value) {
    if (this._value == value) return Promise.reject("no change");
    if (this._updated) return Promise.reject("already updated");
    this._updated = true;
    this.editor.splice(this.position, this.length, value);
    return Promise.resolve();
  }

  toString() {
    return this.encodedValue;
  }

  get position() {
    return this.line.position + calcPosition(this, this.line.tokens);
  }
}
