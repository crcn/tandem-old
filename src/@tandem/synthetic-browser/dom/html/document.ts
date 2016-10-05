import { HTMLNodeType } from "./node-types";
import { bindable } from "@tandem/common";
import { SyntheticWindow } from "../window";
import { IHTMLNodeVisitor } from "./visitor";
import { SyntheticLocation } from "../../location";
import { SyntheticHTMLNode } from "./node";
import { SyntheticHTMLElement } from "./element";
import { SyntheticHTMLComment } from "./comment";
import { SyntheticHTMLTextNode } from "./text-node";
import { SyntheticHTMLContainer } from "./container";
import { SyntheticCSSStyleSheet } from "../css/style-sheet";
import { syntheticElementClassType } from "./types";
import { SyntheticHTMLDocumentFragment } from "./document-fragment";

interface IRegisterComponentOptions {
  prototype: any;
  extends: string;
}

export class SyntheticHTMLDocument extends SyntheticHTMLContainer {

  readonly nodeType: number = HTMLNodeType.DOCUMENT;

  @bindable()
  public styleSheets: SyntheticCSSStyleSheet[];

  private _registeredElements: any;

  constructor(private _window: SyntheticWindow) {
    super("#document", null);
    this.styleSheets = [];
    this._registeredElements = {};

    const documentElement = this.createElement("div");

    this.appendChild(documentElement);
    documentElement.appendChild(this.createElement("div"));
    documentElement.appendChild(this.createElement("div"));
  }

  get defaultView(): SyntheticWindow {
    return this._window;
  }

  get documentElement(): SyntheticHTMLElement {
    return this.childNodes[0] as SyntheticHTMLElement;
  }

  get head(): SyntheticHTMLElement {
    return this.documentElement.childNodes[0] as SyntheticHTMLElement;
  }

  get body(): SyntheticHTMLElement {
    return this.documentElement.childNodes[1] as SyntheticHTMLElement;
  }

  get location(): SyntheticLocation {
    return this._window.location;
  }

  get outerHTML() {
    return `
      <style>
        ${this.styleSheets.map((styleSheet) => styleSheet.cssText).join("\n")}
      </style>
      ${this.childNodes.map((childNode) => childNode.outerHTML).join("")}
    `;
  }

  set location(value: SyntheticLocation) {
    this._window.location = value;
  }

  accept(visitor: IHTMLNodeVisitor) {
    return visitor.visitDocument(this);
  }

  patch(source: SyntheticHTMLDocument) {
    super.patch(source);
    this.styleSheets = source.styleSheets;
  }

  createElement(tagName: string) {
    const elementClass = this._registeredElements[tagName.toLowerCase()] || SyntheticHTMLElement;
    return new elementClass(tagName, this);
  }

  registerElement(tagName: string, elementClass: syntheticElementClassType);
  registerElement(tagName: string, options: IRegisterComponentOptions);

  registerElement(tagName: string, options: any): syntheticElementClassType {
    return this._registeredElements[tagName.toLowerCase()] = typeof options === "function" ? options : createElementClass(options);
  }

  createComment(nodeValue: string) {
    return new SyntheticHTMLComment(nodeValue, this);
  }

  createTextNode(nodeValue: string) {
    return new SyntheticHTMLTextNode(nodeValue, this);
  }

  createDocumentFragment() {
    return new SyntheticHTMLDocumentFragment(this);
  }

  cloneNode() {
    const document = new SyntheticHTMLDocument(this.defaultView);
    for (const child of this.childNodes) {
      document.appendChild(child.cloneNode());
    }
    return document;
  }
}

function createElementClass(options: IRegisterComponentOptions): syntheticElementClassType {
  return class extends SyntheticHTMLElement {
    // TODO
  };
}