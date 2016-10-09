import { getBoundingRect } from "@tandem/synthetic-browser";
import { SyntheticDocument } from "../document";
import { PropertyChangeAction, Action, BoundingRect } from "@tandem/common";
import { SyntheticCSSStyleDeclaration, parseCSS, evaluateCSS } from "../css";
import {
  parseMarkup,
  evaluateMarkup,
  IVisibleDOMElement,
  SyntheticDOMElement,
  SyntheticDOMAttribute,
  ISyntheticDOMCapabilities,
} from "../markup";

import { getComputedStyle } from "./get-computed-style";

export class SyntheticHTMLElement extends SyntheticDOMElement implements IVisibleDOMElement {

  private _style: SyntheticCSSStyleDeclaration;

  constructor(ns: string, tagName: string, ownerDocument: SyntheticDocument) {
    super(ns, tagName, ownerDocument);
    this._style = new SyntheticCSSStyleDeclaration();
  }

  getUntransformedBoundingClientRect() {
    return new BoundingRect(0, 0, 0, 0);
  }

  getBoundingClientRect() {
    return this.ownerDocument.defaultView.renderer.getBoundingRect(this);
  }

  getCapabilities() {

    const style = getComputedStyle(this);
    return {
      movable: style.position && style.position !== "static",
      resizable: /fixed|absolute/.test(style.position) || !/^inline$/.test(style.display)
    };
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

  protected onAttributesChange(action: Action) {
    super.onAttributesAction(action);
    if (action.type === PropertyChangeAction.PROPERTY_CHANGE) {
      if (action.target instanceof SyntheticDOMAttribute) {
        (<SyntheticDOMAttribute>action.target).name === "style";
        this._style = evaluateCSS(parseCSS(`.style{${(<SyntheticDOMAttribute>action.target).value}}`)).rules[0].style;
      }
    }

    // bubble
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