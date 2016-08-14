import Line from './line';
import Caret from './caret';
import Marker from './marker';
import TextRuler from './text-ruler';
import { IActor } from "sf-core/actors";
import { BrokerBus } from "sf-core/busses";
import { SourceChangeAction } from "../actions";
import StringTokenizer from 'saffron-common/tokenizers/string';
import { translateLengthToInteger } from 'saffron-common/utils/html/css/translate-style';
import { SPACE, NEW_LINE, TAB } from 'saffron-common/tokenizers/token-types';

class TextEditor {

  public lines: Array<Line>;
  public textRuler: TextRuler;
  public marker: Marker;
  public caret: Caret;
  private _source: string;

  constructor(public bus: BrokerBus, public maxColumns: number = Infinity, public tokenizer: any = new StringTokenizer(), private _style: any = {}) {

    this.textRuler = new TextRuler(this.style);
    this.marker = new Marker(this, this.bus);
    this.caret = new Caret(this, this.marker, this.bus);


    this.bus.register(this.caret, this.marker);
  }

  get source() {
    return this._source || '';
  }

  set source(value) {
    this._source = String(value || '');
    if (this.style.whitespace === "nowrap") {
      this._source = String(this._source).replace(/[\n\r]/g, '')
    }
    this._createLines();
  }

  get style() {
    return this._style;
  }

  set style(value: any) {
    this.textRuler.style = value;
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
    return this.lines[cell.row].position + cell.column;
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
    this.source = source;
    this.bus.execute(new SourceChangeAction(this.source));
  }

  calculateWidth() {
    return Math.max(...this.lines.map(function(line) {
      return line.calculateWidth();
    }));
  }

  getMaxWidth() {
    var maxWidth = Infinity;

    if (this.style.width) {
      maxWidth = translateLengthToInteger(this.style.width);
    }

    return maxWidth;
  }

  getTokenFromPosition(position) {
    var cell = this.getCellFromPosition(position);
    var line = this.lines[cell.row];
    var diff = position - line.getPosition();
    var col  = cell.column;


    var p = 0;
    for (var i = 0, n = line.tokens.length; i < n; i++) {
      var token = line.tokens[i];
      p += token.length;
      if (p > diff) return token;
    }

    return void 0;
  }

  /**
   */

  _createLines() {
    var tokens = this.tokenizer.tokenize(this.source);

    var lines = [];
    var cline;

    var addLine = () => {
      // do not add another line if there is no token stuff
      if (cline && !cline.length) return cline;
      cline = new Line(this)
      lines.push(cline);
      return cline;
    }

    // add the first line
    addLine();

    // TODO - take max columns into consideration here
    var maxWidth = this.getMaxWidth();

    var breakWord = this.style.wordWrap === 'break-word';

    var addToken = (token) => {

      if (this.textRuler) {

        // split it apart
        if (this.textRuler.calculateSize(token.value)[0] >= maxWidth) {

          if (breakWord) {

            var buffer = token.value;

            while(this.textRuler.calculateSize(buffer)[0] >= maxWidth) {
              buffer = buffer.substr(0, buffer.length - 1);
            }

            var c1 = Object.assign({}, token);
            c1.length = buffer.length;
            c1.value = buffer;

            var c2 = Object.assign({}, token);
            c2.value = c2.value.substr(buffer.length);
            c2.length = c2.value.length;

            addLine();
            addToken(c1);
            addToken(c2);
          } else {
            addLine();
            cline.addRawToken(token);
          }
          return;
        } else if (this.textRuler.calculateSize(cline.toString() + token.value)[0] > maxWidth) {
          addLine();
          return addToken(token);
        }
      }

      cline.addRawToken(token);
    }

    for (var i = 0, n = tokens.length; i < n; i++) {
      var token = tokens[i];

      addToken(token);

      if (token.type === NEW_LINE) {
        addLine();
      }
    }

    this.lines = lines;
  }

}

export default TextEditor;
