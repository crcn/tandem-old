export class StringFormatterOptions {
  constructor(public indentationCharacters: string = "  ") {

  }
}

export class StringFormatter {

  private _lines: Array<Array<any>>;
  private _line: Array<any>;

  constructor(readonly options: StringFormatterOptions = new StringFormatterOptions(), readonly depth: number = 0) {
    this._lines = [];
    this.addLine();
  }

  addChild() {
    this.addLine();
    const child = new StringFormatter(this.options, this.depth);
    this._line.push(child);
    return child;
  }

  write(...values) {
    this._line.push(...values);
  }

  addLine() {
    this._lines.push(
      this._line = Array.from({ length: this.depth }, () => this.options.indentationCharacters)
    );
    return this;
  }

  toString() {
    return this._lines.join("\n");
  }
}