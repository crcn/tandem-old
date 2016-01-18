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

  calculateWidth() {
    return this.editor.textRuler.calculateSize(this.toString())[0];
  }

  getIndex() {
    return this.editor.lines.indexOf(this);
  }

  getTokenFromColumn(column) {
    var p = 0;

    for (var i = 0, n = this.tokens.length; i < n; i++) {
      var token = this.tokens[i];
      p += token.length;
      if (p > column) {
        return token;
      }
    }

    return void 0;
  }

  getTokenIndexFromColumn(column) {
    return this.tokens.indexOf(this.getTokenFromColumn(column));
  }

  getPosition() {
    return calcPosition(this, this.editor.lines);
  }

  getHeight() {
    return this.editor.textRuler.calculateSize('aZ')[1];
  }

  toString() {
    return this.tokens.map(function(token) {
      return token.value;
    }).join('');
  }
}

export default Line;
