import { SyntheticDocument } from "../document";
import { SyntheticCSSStyle } from "../css";
import { BoundingRect, serializable, IPoint } from "@tandem/common";

import {
  parseMarkup,
  evaluateMarkup,
  SyntheticDOMElement,
  SyntheticDOMAttribute,
  VisibleSyntheticDOMElement,
  VisibleDOMNodeCapabilities,
} from "../markup";

// TODO - proxy dataset
@serializable()
export class SyntheticHTMLElement extends VisibleSyntheticDOMElement<SyntheticCSSStyle> {

  private _style: SyntheticCSSStyle;
  private _styleProxy: SyntheticCSSStyle;
  private _classList: string[];
  protected _native: HTMLElement;


  constructor(ns: string, tagName: string) {
    super(ns, tagName);
    this._style = new SyntheticCSSStyle();
  }

  getBoundingClientRect() {
    return (this.browser && this.browser.renderer.getBoundingRect(this.uid)) || BoundingRect.zeros();
  }

  get classList() {
    return this._classList;
  }

  get style(): SyntheticCSSStyle {
    return this._styleProxy || this._resetStyleProxy();
  }

  get text(): string {
    return this.getAttribute("text");
  }

  focus() {
    // TODO - possibly set activeElement on synthetic document
  }

  blur() {
    // TODO
  }
  
  get className(): string {
    return this.class;
  }

  set className(value: string) {
    this.class = value;
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

  set style(value: SyntheticCSSStyle) {
    this._style.clearAll();
    Object.assign(this._style, value);
    this.onStyleChange();
  }

  protected attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === "style") {
      this._resetStyleFromAttribute();
    } else if (name === "class") {
      if (newValue) {
        this._classList = String(newValue).split(" ");
      } else {
        this._classList = [];
      }
    }
    super.attributeChangedCallback(name, oldValue, newValue);
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
    Object.assign(this._style, SyntheticCSSStyle.fromString(this.getAttribute("style") || ""));
  }

  private _resetStyleProxy() {

    // Proxy the style here so that any changes get synchronized back
    // to the attribute
    // element.
    return this._styleProxy = new Proxy(this._style, {
      get: (target, propertyName, receiver) => {
        return target[propertyName];
      },
      set: (target, propertyName, value, receiver) => {

        // normalize the value if it's a pixel unit. Numbers are invalid for CSS declarations.
        if (typeof value === "number") {
          value = Math.round(value) + "px";
        }


        target.setProperty(propertyName.toString(), value);
        this.onStyleChange();
        return true;
      }
    });
  }

  protected onStyleChange() {
    this.setAttribute("style", this.style.cssText.replace(/[\n\t\s]+/g, " "));
  }

  protected computeCapabilities(style: SyntheticCSSStyle): VisibleDOMNodeCapabilities {
    return new VisibleDOMNodeCapabilities(
      false,
      false
    );
  }

  protected computeAbsoluteBounds(style: SyntheticCSSStyle): BoundingRect {
    return this.getBoundingClientRect();
  }

  public setAbsolutePosition({ left, top }: IPoint) {
    // const oldBounds = this.getAbsoluteBounds();

    Object.assign(this.style, {
      left: left,
      top: top
    });
  }

  public setAbsoluteBounds(newBounds: BoundingRect) {
    // const oldBounds = this.getAbsoluteBounds();

    Object.assign(this.style, {
      left: newBounds.left,
      top: newBounds.top,
      width: newBounds.width,
      height: newBounds.height
    });
  }
}