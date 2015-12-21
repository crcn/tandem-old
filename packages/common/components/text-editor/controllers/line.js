import BaseObject from 'common/object/base';
import Token from './token';
import calcPosition from './calc-position';

class Line extends BaseObject {

  constructor({ editor }) {
    super({ editor });
    this.length  = 0;
    this.tokens = [];
  }

  addRawToken(token) {
    this.length += token.length;
    this.tokens.push(Token.create({
      ...token,
      editor: this.editor,
      line: this
    }));
  }

  getIndex() {
    return this.editor.lines.indexOf(this);
  }

  getPosition() {
    return calcPosition(this, this.editor.lines);
  }

  getHeight() {
    return this.editor.textRuler.calculateSize(this.toString())[1];
  }

  toString() {
    return this.tokens.map(function(token) {
      return token.value;
    }).join('');
  }
}

export default Line;
