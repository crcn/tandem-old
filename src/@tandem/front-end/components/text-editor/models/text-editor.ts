import Line from "./line";
import Caret from "./caret";
import Marker from "./marker";
import TextRuler from "./text-ruler";
import { IActor } from "@tandem/common/actors";
import { bindable } from "@tandem/common/decorators";
import { SourceChangeAction } from "../actions";
import { BrokerBus, BubbleBus } from "@tandem/common/busses";
import { PropertyChangeAction } from "@tandem/common/actions";
import { Observable, watchProperty } from "@tandem/common/observable";
import { StringTokenizer, TokenTypes } from "@tandem/common/tokenizers";

class TextEditor extends Observable {

  public lines: Array<Line>;
  public textRuler: TextRuler;
  public marker: Marker;
  public caret: Caret;

  @bindable()
  public style: any = {};

  @bindable()
  public source: string;

  private _workableSource: string = "";

  constructor(public bus: BrokerBus, public maxColumns: number = Infinity, public tokenizer: any = new StringTokenizer(), private _style: any = {}) {
    super();

    this.textRuler = new TextRuler(this.style);
    this.marker = new Marker(this);
    this.caret = new Caret(this, this.marker);

    this.marker.observe(this.bus);

    watchProperty(this, "style", this.onStyleChange.bind(this));
    watchProperty(this, "source", this.onSourceChange.bind(this));
  }


  /**
   * returns an x-y cell based on the buffer position
   */

  getCellFromPosition(position) {
    let cpos = 0;
    for (let i = 0, n = this.lines.length; i < n; i++) {

      const line = this.lines[i];
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
    const lastRow = this.lines.length - 1;

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

    let rest;
    if (reverse) {
      rest = this.source.substr(0, start).split("").reverse().join("");
    } else {
      rest = this.source.substr(start);
    }

    const match = rest.match(regexp);

    if (!match) return start;
    return start + (rest.indexOf(match[0]) + match[0].length) * (reverse ? -1 : 1);
  }

  /**
   */

  splice(start, count, repl = "") {
    const source = this.source.substr(0, start) + repl + this.source.substr(start + count);
    this.source = source;
    this.bus.execute(new SourceChangeAction(this.source));
  }

  calculateWidth() {
    return Math.max(...this.lines.map(function(line) {
      return line.calculateWidth();
    }));
  }

  getMaxWidth() {
    let maxWidth = Infinity;

    if (this.style.width) {
      maxWidth = Number(this.style.width.replace(/[^\d]/g, ""));
    }

    return maxWidth;
  }

  getTokenFromPosition(position: number) {

    const cell = this.getCellFromPosition(position);
    const line = this.lines[cell.row];
    const diff = position - line.position;
    const col  = cell.column;

    let p = 0;
    for (let i = 0, n = line.tokens.length; i < n; i++) {
      const token = line.tokens[i];
      p += token.length;
      if (p > diff) return token;
    }

    return void 0;
  }

  /**
   */

  _createLines() {
    const tokens = this.tokenizer.tokenize(this._workableSource);

    const lines = [];
    let cline;

    const addLine = () => {
      // do not add another line if there is no token stuff
      if (cline && !cline.length) return cline;
      cline = new Line(this);
      lines.push(cline);
      return cline;
    };

    // add the first line
    addLine();

    // TODO - take max columns into consideration here
    const maxWidth = this.getMaxWidth();

    const breakWord = this.style.wordWrap === "break-word";

    const addToken = (token) => {

      if (this.textRuler) {

        // split it apart
        if (this.textRuler.calculateSize(token.value)[0] >= maxWidth) {

          if (breakWord) {

            let buffer = token.value;

            while (this.textRuler.calculateSize(buffer)[0] >= maxWidth) {
              buffer = buffer.substr(0, buffer.length - 1);
            }

            const c1 = Object.assign({}, token);
            c1.length = buffer.length;
            c1.value = buffer;

            const c2 = Object.assign({}, token);
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
    };

    for (let i = 0, n = tokens.length; i < n; i++) {
      const token = tokens[i];

      addToken(token);

      if (token.type === TokenTypes.NEW_LINE) {
        addLine();
      }
    }

    this.lines = lines;
  }

  private onStyleChange(newStyle: any) {
    this.textRuler.style = newStyle;
    this._reset();
  }

  private onSourceChange() {
    this._reset();
  }

  private _reset() {

    this._workableSource = this.source || "";

    if (this.style.whitespace === "nowrap") {
      this._workableSource = String(this._workableSource).replace(/[\n\r]/g, "");
    }

    this._createLines();
  }
}

export default TextEditor;
