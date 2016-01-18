import Line from './line';
import Caret from './caret';
import Marker from './marker';
import TextRuler from './text-ruler';
import BaseObject from 'common/object/base';
import StringTokenizer from 'common/tokenizers/string';
import { translateLengthToInteger } from 'common/utils/html/css/translate-style';
import { SPACE, NEW_LINE, TAB } from 'common/tokenizers/token-types';
import { clone } from 'common/utils/object';

class TextEditor extends BaseObject {

  constructor(props) {

    if (!props.style) props.style = {};
    if (!props.tokenizer) props.tokenizer = StringTokenizer.create();
    if (!props.maxColumns) props.maxColumns = Infinity;

    super(props);

    this.textRuler = TextRuler.create({
      style: this.style
    });

    this.marker = Marker.create({
      notifier: this.notifier,
      editor: this
    });

    this.caret = Caret.create({
      notifier: this.notifier,
      editor: this,
      marker: this.marker
    });

    this.notifier.push(this.caret);
    this.notifier.push(this.marker);
  }

  get source() {
    return this._source || '';
  }

  set source(value) {
    this._source = String(value || '');
  }

  /**
   */

  setProperties(properties) {
    super.setProperties(properties);

    if (properties.source) {
      if (this.style.whiteSpace === 'nowrap') {
        this.source = String(properties.source).replace(/[\n\r]/g, '');
      }

      // FIXME: text ruler dirty type check here is kinda gross
      if (properties.style && this.textRuler) {
        this.textRuler.setProperties(properties);
      }
    }

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
    var maxWidth = Infinity;

    if (this.style.width) {
      maxWidth = translateLengthToInteger(this.style.width);
    }

    var addToken = (token) => {

      if (this.textRuler) {

        // split it apart
        if (this.textRuler.calculateSize(token.value)[0] > maxWidth) {

          var buffer = token.value;

          while(this.textRuler.calculateSize(buffer)[0] > maxWidth) {
            buffer = buffer.substr(0, buffer.length - 1);
          }

          var c1 = clone(token);
          c1.length = buffer.length;
          c1.value = buffer;

          var c2 = clone(token);
          c2.value = c2.value.substr(buffer.length);
          c2.length = c2.value.length;

          if (cline.length) {
            addLine();
          }

          addToken(c1);
          addToken(c2);
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
