import { HTMLNodeType } from "./node-types";
import { SyntheticWindow } from "../window";
import { SyntheticLocation } from "../../location";
import { SyntheticHTMLNode } from "./node";
import { SyntheticHTMLElement } from "./element";
import { SyntheticHTMLComment } from "./comment";
import { SyntheticHTMLTextNode } from "./text-node";
import { SyntheticHTMLContainer } from "./container";
import { SyntheticHTMLDocumentFragment } from "./document-fragment";

export class SyntheticHTMLDocument extends SyntheticHTMLContainer {

  private _documentElement: SyntheticHTMLElement;
  private _head: SyntheticHTMLElement;
  private _body: SyntheticHTMLElement;

  readonly nodeType: number = HTMLNodeType.DOCUMENT;

  constructor(private _window: SyntheticWindow) {
    super("#document", null);
    this.appendChild(this._documentElement = this.createElement("div"));
    this._documentElement.appendChild(this._head = this.createElement("div"));
    this._documentElement.appendChild(this._body = this.createElement("div"));
  }

  get documentElement(): SyntheticHTMLElement {
    return this._documentElement;
  }

  get head(): SyntheticHTMLElement {
    return this._head;
  }

  get body(): SyntheticHTMLElement {
    return this._body;
  }

  get location(): SyntheticLocation {
    return this._window.location;
  }

  set location(value: SyntheticLocation) {
    this._window.location = value;
  }

  createElement(tagName: string) {
    return new SyntheticHTMLElement(tagName, this);
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
}