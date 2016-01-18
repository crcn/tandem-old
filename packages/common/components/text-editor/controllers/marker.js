import BaseObject from 'common/object/base';

/**
 * TODO - marks a selection of text. Also used for the cursor
 */

class Marker extends BaseObject {

  constructor({ editor, notifier }) {
    super({
      editor: editor,
      notifier: notifier,
      position: 0,
      length  : 0
    });
  }

  get endPosition() {
    return this.position + this.length;
  }

  get position() {
    return this._position || 0;
  }

  set position(value) {
    this._position = Math.max(0, Math.min(this.editor.source.length, value));
  }

  get length() {
    return this._length || 0;
  }

  set length(value) {
    this._length = Math.max(0, Math.min(this.editor.source.length, value));
  }

  setSelection(position, length = 0) {
    this.position = position;
    this.length   = length;

    this.notifier.notify({
      type: 'changeMarkerSelection'
    });
  }

  removeSelection() {
    if (this.length) {
      this.editor.splice(this.position, this.length);
      this.length = 0;
    } else if (this.position) {
      this.editor.splice(--this.position, 1);
    }
  }

  addText(text) {

    if (/[\n\r]/.test(text)) {
      if (this.editor.style.whiteSpace === 'nowrap') return;
    }

    this.editor.splice(this.position, this.length, text);
    this.position += text.length;
    this.length = 0;
  }

  notify(message) {

    if (message.metaKey) {
      // cmd+a
      if (message.keyCode === 65) {
        this.setSelection(0, Infinity);
        message.preventDefault();
      }
    }

    if (message.type === 'input') {
      this.addText(message.text);
      message.preventDefault();
    } else if (message.type === 'keyCommand') {
      if (message.keyCode === 8) {
        this.removeSelection();
        message.preventDefault();
      } else if (message.keyCode === 39) {
        // this.moveRight();
      } else if (message.keyCode === 37) {
        // this.moveLeft();
      } else if (message.keyCode === 40) {
        // this.moveDown();
      } else if (message.keyCode === 38) {
        // this.moveUp();
      }
    }
  }
}

export default Marker;
