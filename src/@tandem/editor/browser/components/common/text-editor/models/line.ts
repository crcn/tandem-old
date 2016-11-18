import { TextEditorToken } from "./token";
import TextEditor from "./text-editor";
import calcPosition from "./calc-position";

export default class TextEditorLine {

  public tokens: Array<TextEditorToken> = [];
  public length: number  = 0;

  constructor(readonly editor: TextEditor) {
  }

  addRawToken(token) {
    this.length += token.length;
    this.tokens.push(new TextEditorToken(token.type, token.value, token.length, this, this.editor));
  }

  calculateWidth() {
    return this.editor.textRuler.calculateSize(this.toString())[0];
  }

  get index() {
    return this.editor.lines.indexOf(this);
  }

  getTokenFromColumn(column) {
    let p = 0;

    for (let i = 0, n = this.tokens.length; i < n; i++) {
      const token = this.tokens[i];
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

  get position() {
    return calcPosition(this, this.editor.lines);
  }

  get height() {
    return this.editor.textRuler.calculateSize("aZ")[1];
  }

  toString() {
    return this.tokens.map(function(token) {
      return token.value;
    }).join("");
  }
}
