import { BoundingRect, serializable } from "@tandem/common";
import { SyntheticDocument } from "../document";
import { SyntheticCSSStyleDeclaration } from "../css";
import {
  parseMarkup,
  evaluateMarkup,
  SyntheticDOMElement,
  SyntheticDOMAttribute,
  IDOMNodeEntityCapabilities,
} from "../markup";

@serializable()
export class SyntheticHTMLElement extends SyntheticDOMElement {

  private _style: SyntheticCSSStyleDeclaration;
  private _styleProxy: SyntheticCSSStyleDeclaration;
  public $rect: BoundingRect;

  constructor(ns: string, tagName: string) {
    super(ns, tagName);
    this._style = new SyntheticCSSStyleDeclaration();
  }

  getBoundingClientRect() {
    return this.$rect || BoundingRect.zeros();
  }

  get style(): SyntheticCSSStyleDeclaration {
    return this._styleProxy || this._resetStyleProxy();
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
    this._style.clearAll();
    Object.assign(this._style, value);
    this.onStyleChange();
  }

  protected attributeChangedCallback(name: string, value: string) {
    if (name === "style") {
      this._resetStyleFromAttribute();
    }
  }

  get innerHTML(): string {
    return this.childNodes.map((child) => child.toString()).join("");
  }

  get outerHTML(): string {
    return this.toString();
  }

  set innerHTML(value: string) {
    this.removeAllChildren();
    this.appendChild(evaluateMarkup(parseMarkup(value), this.ownerDocument, this.namespaceURI));
  }

  private _resetStyleFromAttribute() {
    this._style.clearAll();
    Object.assign(this._style, SyntheticCSSStyleDeclaration.fromString(this.getAttribute("style") || ""));
  }

  private _resetStyleProxy() {

    // Proxy the style here so that any changes get synchronized back
    // to the attribute -- along with the entity representing this synthetic
    // element.
    return this._styleProxy = new Proxy(this._style, {
      get: (target, propertyName, receiver) => {
        return target[propertyName];
      },
      set: (target, propertyName, value, receiver) => {

        // normalize the value if it's a pixel unit. Numbers are invalid for CSS declarations.
        if (typeof value === "number") {
          value = value + "px";
        }

        target[propertyName] = value;
        this.onStyleChange();
        return true;
      }
    });
  }

  protected onStyleChange() {
    this.setAttribute("style", this.style.cssText);
  }
}