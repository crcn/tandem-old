import encode from "./encode";
// import {
//   calculateLengthInPixels
// } from "saffron-common/utils/html/css";

/**
 * Simple text width
 */

class TextRuler {

  private _sizes: any = {};
  private _span: HTMLSpanElement;

  constructor(private _style: any = {}) { }

  get style(): any {
    return this._style;
  }

  set style(value: any) {
    this._style = value;
    this._sizes = {};
  }

  /**
   * converts a pixel point to a caret position in text
   */

  convertPointToCharacterPosition(text, point) {
    let position = 0;
    let w = 0;
    for (let i = 0, n = text.length; i < n; i++) {

      const charWidth = this.calculateCharacterSize(text.charAt(i))[0];
      const halfWidth = charWidth / 2;

      if (i > 0) {
        w = this.calculateSize(text.substr(0, i))[0];
      }

      // basic rounding calculation bast on character
      // width
      if (w + halfWidth > point) {
        break;
      }

      position++;
    }

    return position;
  }

  calculateLineHeight() {
    return this.calculateSize("Aa")[1];
  }

  /**
   * calculates the width & height of text
   */

  calculateSize(text) {

    // Note that we must calculate the text against a span
    // in its entirety - calculating individual characters yields
    // incorrect values.
    return this.calculateCharacterSize(text);
  }

  /**
   * calculates the size of one character
   */

  calculateCharacterSize(char) {
    if (this._sizes[char]) return this._sizes[char];

    const span = this._getTemporarySpan();

    // copy over the styles defined for the text ruler so that
    // we can make an accurate measurement
    const ts = this._style;

    Object.assign(span.style, {
      letterSpacing: ts.letterSpacing,
      lineHeight   : ts.lineHeight,
      fontSize     : ts.fontSize,
      fontFamily   : ts.fontFamily,
      fontWeight   : ts.fontWeight
    });

    // set the encoded
    span.innerHTML = encode(char);

    const w = span.offsetWidth; // + this._getLetterSpacing();
    const h = span.offsetHeight;

    return this._sizes[char] = [w, h];
  }

  /**
   */

  _getLetterSpacing() {
    if (this._sizes.letterSpacing) return this._sizes.letterSpacing;
    if (!this.style) return 0;
    const ls = 0; // calculateLengthInPixels(this.style.letterSpacing);
    return this._sizes.letterSpacing = typeof ls === "number" ? ls : 0;
  }

  /**
   * returns a temporary span which gets removed after
   * calculations
   */

  _getTemporarySpan() {
    if (this._span) return this._span;
    const span = this._span = document.createElement("span");

    // move off screen
    Object.assign(span.style, {
      left     : "0px",
      // left: "0px",
      // top: "0px",
      // zIndex: 1024,
      top      : "-1024px",
      position : "absolute"
    });

    document.body.appendChild(span);

    setTimeout(() => {
      this._span = void 0;
      document.body.removeChild(span);
    }, 0);

    return this._getTemporarySpan();
  }

}

export default TextRuler;
