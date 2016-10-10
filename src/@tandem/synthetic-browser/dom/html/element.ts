import { SyntheticDocument } from "../document";
import { PropertyChangeAction, Action, BoundingRect } from "@tandem/common";
import { SyntheticCSSStyleDeclaration, parseCSS, evaluateCSS } from "../css";
import {
  parseMarkup,
  evaluateMarkup,
  SyntheticDOMElement,
  SyntheticDOMAttribute,
  ISyntheticDOMCapabilities,
} from "../markup";

import { getComputedStyle } from "./get-computed-style";

export class SyntheticHTMLElement extends SyntheticDOMElement  {

  private _style: SyntheticCSSStyleDeclaration;
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