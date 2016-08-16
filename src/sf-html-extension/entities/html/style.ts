import { NodeSection } from "sf-core/markup";
import { HTMLElementEntity } from "./base";
import { parse as parseCSS } from "sf-html-extension/parsers/css";
import { HTMLDocumentEntity } from "./base";
import { EntityFactoryDependency } from "sf-core/dependencies";
import { CSSStyleSheetExpression } from "sf-html-extension/parsers/css/expressions";
import { HTMLElementExpression, HTMLTextExpression } from "sf-html-extension/parsers/html/expressions";

export class HTMLStyleEntity extends HTMLElementEntity {
  private _style: HTMLStyleElement;
  private _source: HTMLElementExpression;
  private _styleSheetExpression: CSSStyleSheetExpression;

  constructor(source: HTMLElementExpression) {
    super(source);
    this._resetStyle();
  }

  get source() {
    return this._source;
  }

  set source(value: HTMLElementExpression) {
    this._removeStyles();
    this._source = value;
    this._styleSheetExpression = parseCSS((<HTMLTextExpression>value.childNodes[0]).nodeValue);
    this._addDocStyles(this.document);
    this._resetStyle();
  }

  willChangeDocument(newDocument) {
    this._removeStyles();
    this._addDocStyles(newDocument);
  }

  updateSource() {
    super.updateSource();
    (<HTMLTextExpression>this.source.childNodes[0]).nodeValue = this._styleSheetExpression.toString();
    this._resetStyle();
  }

  private _addDocStyles(doc) {
    if (doc) {
      doc.stylesheet.rules.push(...this._styleSheetExpression.rules);
    }
  }

  private _resetStyle() {
    if (!this._style) return;
    this._style.innerHTML = this._styleSheetExpression.toString();
  }

  _removeStyles() {
    const doc = this.document;
    if (!this._styleSheetExpression || !doc) return;
    for (const rule of this._styleSheetExpression.rules) {
      doc.stylesheet.rules.splice(doc.stylesheet.rules.indexOf(rule), 1);
    }
  }

  static mapSourceChildren() {
    return null;
  }

  createSection() {
    return new NodeSection(<any>(this._style = document.createElement("style")));
  }
}

export const htmlStyleEntityDependency = new EntityFactoryDependency("style", HTMLStyleEntity);