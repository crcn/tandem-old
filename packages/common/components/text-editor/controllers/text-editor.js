import BaseObject from 'common/object/base';
import StringTokenizer from './tokenizers/string';
import { SPACE, NEW_LINE, TAB } from './tokenizers/token-types';
import Caret from './caret';
import Line from './line';
import Marker from './marker';
import TextRuler from './text-ruler';

class TextEditor extends BaseObject {

  constructor({
    source,
    notifier,
    style = {},
    tokenizer = StringTokenizer.create(),
    maxColumns = Infinity
   }) {

    super({
      style      : style,
      tokenizer  : tokenizer,
      maxColumns : maxColumns,
      source     : source,
      notifier   : notifier
    });

    this.textRuler = TextRuler.create({
      style: style
    });

    this.marker = Marker.create({
      notifier: notifier,
      editor: this
    });

    this.caret = Caret.create({
      notifier: notifier,
      editor: this
    });

    notifier.push(this.caret);
    notifier.push(this.marker);
  }

  get source() {
    return this._source || '';
  }

  set source(value) {
    var source = String(value || '');

    if (this.style.whiteSpace === 'nowrap') {
      source = source.replace(/[\n\r]/g, '');
    }

    this._source = source;
  }

  /**
   */

  setProperties(properties) {
    super.setProperties(properties);
    this._createLines();
  }

  /**
   * returns an x-y cell based on the buffer position
   */

  getCellFromPosition(position) {
    var cpos = 0;
    for (var i = 0, n = this.lines.length; i < n; i++) {

      var line = this.lines[i];
      cpos    += line.length;

      // on the right line. Find the column
      if (cpos > position) {
        return {
          row    : i,
          column : position - (cpos - line.length)
        };
      }
    }

    // return EOL
    var lastRow = this.lines.length - 1;

    return {
      row    : lastRow,
      column : this.lines[lastRow].length
    };
  }

  /**
   */

  getPositionFromCell(cell) {
    return this.lines[cell.row].getPosition() + cell.column;
  }

  /**
   */

  scanPosition(start, regexp, reverse = false) {
    var rest;
    if (reverse) {
      rest = this.source.substr(0, start).split('').reverse().join('');
    } else {
      rest = this.source.substr(start);
    }

    var match = rest.match(regexp);

    if (!match) return start;
    return start + (rest.indexOf(match[0]) + match[0].length) * (reverse ? -1 : 1);
  }

  /**
   */

  splice(start, count, repl = '') {
    var source = this.source.substr(0, start) + repl + this.source.substr(start + count);
    this.setProperties({
      source: source
    });

    this.notifier.notify({
      type: 'sourceChange',
      source: this.source
    });
  }

  /**
   */

  _createLines() {
    var tokens = this.tokenizer.tokenize(this.source);

    var lines = [];
    var cline;

    var addLine = () => {
      cline = Line.create({ editor: this });
      lines.push(cline);
      return cline;
    }

    // add the first line
    addLine();

    // TODO - take max columns into consideration here
    for (var i = 0, n = tokens.length; i < n; i++) {
      var token = tokens[i];

      cline.addRawToken(token);

      if (token.type === NEW_LINE) {
        addLine();
      }
    }

    this.lines = lines;
  }

}

export default TextEditor;
