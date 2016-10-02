import TextEditor from "./text-editor";
import Marker from "./marker";
import { IActor } from "@tandem/common/actors";

class Caret {

  constructor(readonly editor: TextEditor, readonly marker: Marker) {

  }

  get position() {
    return this.marker.position;
  }

  setPosition(position) {
    this.marker.setSelection(position);
  }

  moveLeft() {
    this.setPosition(this.position - 1);
  }

  moveRight() {
    this.setPosition(this.position + 1);
  }

  moveUp() {
    this.moveLine(-1);
  }

  moveDown() {
    this.moveLine(1);
  }

  moveToLinePosition(position) {
    const cline = this._getLine();

    const newLineToken = cline.tokens.find(function(token) {
      return token.type === "newLine";
    });

    const eol        = newLineToken ? cline.length - 1 : cline.length;

    // TODO - scan position until new line
    this.setPosition(
      cline.position + Math.max(0, Math.min(eol, position))
    );
  }

  /**
   * TODO - kinda works
   */

  moveToToken(delta) {

    const neg = delta < 0;

    // never should be rounded, but just in case...
    let rest = Math.round(Math.abs(delta));
    let pos  = this.position;

    while (rest--)  {
      pos = this.editor.scanPosition(pos, /[^\s]/, neg) + (neg ? 1 : -1); // skip ws
      pos = this.editor.scanPosition(pos, /\s/, neg) + (neg ? 1 : -1);
    }

    this.setPosition(pos);
  }

  moveLine(delta) {
    const nline = this._getLine(delta);
    const cline = this._getLine();

    // TODO - need to calculate character width here
    this.setPosition(nline === cline ? Infinity * delta : nline.position + (this.position - cline.position));
  }

  _getLine(shift = 0) {
    return this.editor.lines[
      Math.max(0, Math.min(this.editor.lines.length - 1, this.getCell().row + shift))
    ];
  }

  removeCharsUntilEndOfLine() {
    const line = this._getLine();

    this.editor.splice(this.position, line.position + line.length - this.position);
  }

  getLine() {
    return this.editor.lines[this.getCell().row];
  }

  removeNextCharacter() {
    this.editor.splice(this.position, 1);
  }

  getCell() {
    return this.editor.getCellFromPosition(this.position);
  }
}

export default Caret;
