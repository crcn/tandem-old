import { inject } from "sf-core/decorators";
import { NodeSection } from "sf-core/markup";
import { IHTMLDocument } from "./base";
import { HTMLElementEntity } from "./element";
import { parse as parseCSS } from "sf-html-extension/parsers/css";
import { EntityFactoryDependency } from "sf-core/dependencies";
import { CSSStyleSheetExpression } from "sf-html-extension/parsers/css";
import { CSSStyleSheetsDependency } from "sf-html-extension/dependencies";
import { HTMLElementExpression, HTMLTextExpression } from "sf-html-extension/parsers/html";

export class HTMLStyleEntity extends HTMLElementEntity {
  readonly type: string = "element";
  private _style: HTMLStyleElement;
  private _styleSheetExpression: CSSStyleSheetExpression;

  protected willSourceChange(value: HTMLElementExpression) {
    super.willSourceChange(value);
    this._removeStyles();
    const nodeValue = (<HTMLTextExpression>value.childNodes[0]).nodeValue;

    const newStyle = parseCSS(nodeValue);

    if (this._styleSheetExpression) {
      CSSStyleSheetExpression.merge(this._styleSheetExpression, newStyle);
    } else {
      this._styleSheetExpression = newStyle;
    }
  }

  didMount() {
    CSSStyleSheetsDependency.findOrRegister(this._dependencies).register(this._styleSheetExpression);
  }

  willChangeDocument(newDocument) {
    this._removeStyles();
  }

  update() {
    super.update();
    (<HTMLTextExpression>this.source.childNodes[0]).nodeValue = this._styleSheetExpression.toString();
  }

  _removeStyles() {
    const doc = this.document;
    if (!this._styleSheetExpression || !doc) return;
    CSSStyleSheetsDependency.findOrRegister(this._dependencies).unregister(this._styleSheetExpression);
  }

  static mapSourceChildren() {
    return null;
  }

  createSection() {
    return new NodeSection(<any>(this._style = document.createElement("style")));
  }
}

export const htmlStyleEntityDependency = new EntityFactoryDependency("style", HTMLStyleEntity);