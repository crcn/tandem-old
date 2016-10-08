import { SyntheticDOMElement, parseMarkup, evaluateMarkup } from "../markup";
import { SyntheticCSSStyleDeclaration } from "../css";
import { SyntheticDocument } from "../document";

export class SyntheticHTMLElement extends SyntheticDOMElement {

  private _style: SyntheticCSSStyleDeclaration;

  constructor(ns: string, tagName: string, ownerDocument: SyntheticDocument) {
    super(ns, tagName, ownerDocument);
    this._style = new SyntheticCSSStyleDeclaration();
  }

  get style(): SyntheticCSSStyleDeclaration {
    return this._style;
  }

  get text(): string {
    return this.getAttribute("text");
  }

  get class(): string {
    return this.getAttribute("class");
  }

  set class(value: string) {
    this.setAttribute("class", value);
  }

  set text(value: string) {
    this.setAttribute("text", value);
  }

  set style(value: SyntheticCSSStyleDeclaration) {
    const style = this._style = new SyntheticCSSStyleDeclaration();
    Object.assign(style, value);
  }

  get innerHTML(): string {
    return this.childNodes.map((child) => child.toString()).join("");
  }

  get outerHTML(): string {
    return this.toString();
  }

  set innerHTML(value: string) {
    this.removeAllChildren();
    this.appendChild(evaluateMarkup(parseMarkup(value), this.ownerDocument));
  }
}