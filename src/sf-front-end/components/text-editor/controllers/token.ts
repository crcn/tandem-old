import BaseObject from 'saffron-common/object/base';
import calcPosition from './calc-position';
import encode from './encode';

class Token extends BaseObject {

  constructor({ value, type, length, line, editor }) {
    super({
      value: value,
      encodedValue: encode(value),
      line: line,
      editor: editor,
      type: type,
      length: length || value.length
    });
  }

  getColumn() {
    return this.line.tokens.indexOf(this);
  }

  setValue(value) {
    this.encodedValue = encode(this.value = value);
    this.editor.splice(this.getPosition(), this.length, value);
  }

  toString() {
    return this.encodedValue;
  }

  getPosition() {
    return this.line.getPosition() + calcPosition(this, this.line.tokens);
  }
}

export default Token;
