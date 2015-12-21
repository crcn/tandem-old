import BaseObject from 'common/object/base';

class Caret extends BaseObject {

  constructor({ editor, marker, notifier }) {
    super({
      editor   : editor,
      marker   : marker,
      notifier : notifier,
      position : 0
    });
  }

  setPosition(position) {
    this.position = Math.max(0, Math.min(this.editor.source.length, position));

    this.notifier.notify({
      type: 'changeCaretPosition'
    });
  }

  moveLeft() {
    this.setPosition(this.position - 1);
  }

  moveRight() {
    console.log('spos');
    this.setPosition(this.position + 1);
  }

  moveUp() {
    this.moveLine(-1);
  }

  moveDown() {
    this.moveLine(1);
  }

  moveToLinePosition(position) {
    var cline = this._getLine();

    var newLinePos = cline.toString().indexOf('\n');
    var eol        = ~newLinePos ? newLinePos : cline.length;

    // TODO - scan position until new line
    this.setPosition(
      cline.getPosition() + Math.max(0, Math.min(eol, position))
    );
  }

  addCharacter(character) {
    this.editor.splice(this.position++, 0, character);
  }

  moveLine(delta) {
    var nline = this._getLine(delta);
    var cline = this._getLine();

    if (nline === cline) {
      // this.setPosition(Infinity * delta);
    } else {
      console.log(this.editor.textRuler)
    }

    // TODO - need to calculate character width here
    this.setPosition(nline === cline ? Infinity * delta : nline.getPosition() + (this.position - cline.getPosition()));
  }

  _getLine(shift = 0) {
    return this.editor.lines[
      Math.max(0, Math.min(this.editor.lines.length - 1, this.getCell().row + shift))
    ];
  }

  removeCharsUntilEndOfLine() {
    var line = this._getLine();

    this.editor.splice(this.position, line.getPosition() + line.length - this.position);
  }

  getLine() {
    return this.editor.lines[this.getCell().row];
  }

  removePreviousCharacter() {
    this.editor.splice(--this.position, 1);
  }

  removeNextCharacter() {
    this.editor.splice(this.position, 1);
  }

  getCell() {
    return this.editor.getCellFromPosition(this.position);
  }

  notify(message) {

    var k = message.keyCode;

    if (message.ctrlKey) {
      if (k === 65) {
        this.moveToLinePosition(0);
      } else if (k === 69) {
        this.moveToLinePosition(Infinity);
      } else if (k === 68) {
        this.removeNextCharacter();
      } else if (k === 75) {
        this.removeCharsUntilEndOfLine();
      }
    }

    if (message.type === 'input') {
      this.addCharacter(message.text);
    } else if (message.type === 'keyCommand') {
      if (message.keyCode === 8) {
        this.removePreviousCharacter();
      } else if (message.keyCode === 39) {
        this.moveRight();
      } else if (message.keyCode === 37) {
        this.moveLeft();
      } else if (message.keyCode === 40) {
        this.moveDown();
      } else if (message.keyCode === 38) {
        this.moveUp();
      }
    }


  }
}

export default Caret;
