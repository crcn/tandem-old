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

  getSelectedText() {
    return this.editor.source.substr(this.position, this.length);
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

  }
}

export default Marker;
