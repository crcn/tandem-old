import { bindable } from "@tandem/common";

import {
  MarkupNodeType,
  IMarkupNodeVisitor,
  SyntheticMarkupNode,
  SyntheticMarkupText,
  SyntheticMarkupElement,
  SyntheticMarkupComment,
  SyntheticMarkupContainer,
  syntheticElementClassType,
  SyntheticDocumentFragment,
} from "./markup";

import { SyntheticWindow } from "./window";
import { SyntheticLocation } from "../location";
import { SyntheticHTMLElement } from "./html";
import { SyntheticCSSStyleSheet } from "./css";

interface IRegisterComponentOptions {
  prototype: any;
  extends: string;
}

export class SyntheticDocument extends SyntheticMarkupContainer {

  readonly nodeType: number = MarkupNodeType.DOCUMENT;

  @bindable()
  public styleSheets: SyntheticCSSStyleSheet[];

  private _registeredElements: any;

  // namespaceURI here is non-standard, but that's
  constructor(private _window: SyntheticWindow, readonly defaultNamespaceURI: string) {
    super("#document", null);
    this.styleSheets = [];
    this._registeredElements = {};

    this.registerElement("default", SyntheticMarkupElement);

    const documentElement = this.createElement("div");

    this.appendChild(documentElement);
    documentElement.appendChild(this.createElement("div"));
    documentElement.appendChild(this.createElement("div"));
  }

  get defaultView(): SyntheticWindow {
    return this._window;
  }

  get documentElement(): SyntheticMarkupElement {
    return this.childNodes[0] as SyntheticMarkupElement;
  }

  get head(): SyntheticMarkupElement {
    return this.documentElement.childNodes[0] as SyntheticMarkupElement;
  }

  get body(): SyntheticMarkupElement {
    return this.documentElement.childNodes[1] as SyntheticMarkupElement;
  }

  get location(): SyntheticLocation {
    return this._window.location;
  }

  toString() {
    return `
      <style>
        ${this.styleSheets.map((styleSheet) => styleSheet.cssText).join("\n")}
      </style>
      ${this.childNodes.map((childNode) => childNode.toString()).join("")}
    `;
  }

  set location(value: SyntheticLocation) {
    this._window.location = value;
  }

  accept(visitor: IMarkupNodeVisitor) {
    return visitor.visitDocument(this);
  }

  patch(source: SyntheticDocument) {
    super.patch(source);
    this.styleSheets = source.styleSheets;
  }

  createElementNS(ns: string, tagName: string) {
    const nsElements = this._registeredElements[ns] || {};
    const elementClass = nsElements[tagName.toLowerCase()] || nsElements.default;

    if (!elementClass) {
      throw new Error(`Cannot create synthetic element ${ns}:${tagName}`);
    }

    return new elementClass(ns, tagName, this);
  }

  createElement(tagName: string) {
    return this.createElementNS(this.defaultNamespaceURI, tagName);
  }

  registerElement(tagName: string, elementClass: syntheticElementClassType);
  registerElement(tagName: string, options: IRegisterComponentOptions);

  registerElement(tagName: string, options: any): syntheticElementClassType {
    return this.registerElementNS(this.defaultNamespaceURI, tagName, options);
  }

  // non-standard APIs to enable custom elements according to the doc type -- necessary for
  // cases where we're mixing different template engines such as angular, vuejs, etc.
  registerElementNS(ns: string, tagName: string, elementClass: syntheticElementClassType);
  registerElementNS(ns: string, tagName: string, options: IRegisterComponentOptions);

  registerElementNS(ns: string, tagName: string, options: any): syntheticElementClassType {
    if (!this._registeredElements[ns]) {
      this._registeredElements[ns] = {};
    }
    return this._registeredElements[ns][tagName.toLowerCase()] = typeof options === "function" ? options : createElementClass(options);
  }

  createComment(nodeValue: string) {
    return new SyntheticMarkupComment(nodeValue, this);
  }

  createTextNode(nodeValue: string) {
    return new SyntheticMarkupText(nodeValue, this);
  }

  createDocumentFragment() {
    return new SyntheticDocumentFragment(this);
  }

  cloneNode() {
    const document = new SyntheticDocument(this.defaultView, this.defaultNamespaceURI);
    for (const child of this.childNodes) {
      document.appendChild(child.cloneNode());
    }
    return document;
  }
}

function createElementClass(options: IRegisterComponentOptions): syntheticElementClassType {
  return class extends SyntheticMarkupElement {
    // TODO
  };
}