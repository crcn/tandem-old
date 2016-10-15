import { BoundingRect } from "@tandem/common";
import { SyntheticDocument } from "../document";
import { SyntheticCSSStyleDeclaration, parseCSS, evaluateCSS } from "../css";
import {
  parseMarkup,
  evaluateMarkup,
  SyntheticDOMElement,
  SyntheticDOMAttribute,
  IDOMNodeEntityCapabilities,
} from "../markup";

export class SyntheticHTMLElement extends SyntheticDOMElement {

  private _style: SyntheticCSSStyleDeclaration;
  private _styleProxy: SyntheticCSSStyleDeclaration;
  private _rect: BoundingRect;

  constructor(ns: string, tagName: string, ownerDocument: SyntheticDocument) {
    super(ns, tagName, ownerDocument);
    this._style = new SyntheticCSSStyleDeclaration();
  }

  getBoundingClientRect() {
    return this._rect || BoundingRect.zeros();
  }

  setBoundingClientRect(rect: BoundingRect) {
    this._rect = rect;
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