export class StringFormatterOptions {
  public indentationCharacter = "  ";
}


export class StringFormatter {

  private _lines: Array<Array<any>>;
  private _currentLine: Array<any>;

  constructor(readonly indentation: number = 0, readonly options: StringFormatterOptions = new StringFormatterOptions()) {
    this._lines = [];
    this.addLine();
  }

  write(chunk: string) {
    this._currentLine.push(chunk);
    return this;
  }

  createChild() {
    return new StringFormatter(this.indentation + 1, this.options);
  }

  addLine() {
    this._lines.push(
      this._currentLine = Array.from({ length: this.indentation }, () => this.options.indentationCharacter)
    );
  }

  toFormattedString() {
    return this._lines.join("\n")
  }
}