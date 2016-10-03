import { SyntheticWindow } from "./window";
import { SyntheticLocation } from "../location";
import { SyntheticHTMLElement } from "./element";
import { SyntheticHTMLTextNode } from "./text-node";
import { SyntheticHTMLComment } from "./comment";
import { SyntheticHTMLDocumentFragment } from "./document-fragment";
// import { SyntheticComment } from "./comment";

export class SyntheticDocument {

  private _body: SyntheticHTMLElement;

  constructor(private _window: SyntheticWindow) {
    // this._body = document.createElement("body");
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