import BaseObject from 'common/object/base';
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

  getPosition() {
    return this.line.getPosition() + calcPosition(this, this.line.tokens);
  }
}

export default Token;
