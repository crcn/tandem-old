import { IActor } from "sf-core/actors";
import { Action } from "sf-core/actions";
import TextEditor from "./text-editor";

/**
 * TODO - marks a selection of text. Also used for the cursor
 */

class Marker implements IActor {

  private _position: number = 0;
  private _length: number = 0;

  constructor(readonly editor: TextEditor, readonly bus: IActor) {

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

    this.bus.execute(new Action("changeMarkerSelection"));
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

  execute(message) { }
}

export default Marker;
