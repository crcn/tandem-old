import { bindable } from "@tandem/common";

import {
  DOMNodeType,
  SyntheticDOMText,
  SyntheticDOMNode,
  IMarkupNodeVisitor,
  SyntheticDOMElement,
  SyntheticDOMComment,
  SyntheticDOMContainer,
  SyntheticDOMValueNode,
  syntheticElementClassType,
  SyntheticDocumentFragment,
} from "./markup";

import { SyntheticWindow } from "./window";
import { SyntheticLocation } from "../location";
import { SyntheticCSSStyleSheet } from "./css";

interface IRegisterComponentOptions {
  prototype: any;
  extends: string;
}

export class SyntheticDocument extends SyntheticDOMContainer {

  readonly nodeType: number = DOMNodeType.DOCUMENT;

  @bindable()
  public styleSheets: SyntheticCSSStyleSheet[];

  private _registeredElements: any;

  // namespaceURI here is non-standard, but that's
  constructor(private _window: SyntheticWindow, readonly defaultNamespaceURI: string) {
    super("#document", null);
    this.styleSheets = [];
    this._registeredElements = {};
  }

  get browser() {
    return this._window.browser;
  }

  get sandbox() {
    return this.defaultView && this.defaultView.sandbox;
  }

  get defaultView(): SyntheticWindow {
    return this._window;
  }

  get documentElement(): SyntheticDOMElement {
    return this.childNodes[0] as SyntheticDOMElement;
  }

  get head(): SyntheticDOMElement {
    return this.documentElement.childNodes[0] as SyntheticDOMElement;
  }

  get body(): SyntheticDOMElement {
    return this.documentElement.childNodes[1] as SyntheticDOMElement;
  }

  get location(): SyntheticLocation {
    return this._window.location;
  }

  set location(value: SyntheticLocation) {
    this._window.location = value;
  }

  accept(visitor: IMarkupNodeVisitor) {
    return visitor.visitDocument(this);
  }

  createElementNS(ns: string, tagName: string): SyntheticDOMElement {
    const nsElements = this._registeredElements[ns] || {};
    const elementClass = nsElements[tagName.toLowerCase()] || nsElements.default || SyntheticDOMElement;
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
    return new SyntheticDOMComment(nodeValue, this);
  }

  createTextNode(nodeValue: string) {
    return new SyntheticDOMText(nodeValue, this);
  }

  createDocumentFragment() {
    return new SyntheticDocumentFragment(this);
  }

  cloneNode(deep?: boolean) {
    const document = new SyntheticDocument(this.defaultView, this.defaultNamespaceURI);
    if (deep === true) {
      for (const child of this.childNodes) {
        document.appendChild(child.cloneNode(true));
      }
    }
    return document;
  }
}

function createElementClass(options: IRegisterComponentOptions): syntheticElementClassType {
  return class extends SyntheticDOMElement {
    // TODO
  };
}