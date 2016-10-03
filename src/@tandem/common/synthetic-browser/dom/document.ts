import { SyntheticWindow } from "./window";
import { SyntheticLocation } from "../location";
import { SyntheticElement } from "./element";
// import { SyntheticComment } from "./comment";

export class SyntheticDocument {

  private _body: SyntheticElement;

  constructor(private _window: SyntheticWindow) {
    // this._body = document.createElement("body");
  }

  get body(): SyntheticElement {
    return this._body;
  }

  get location(): SyntheticLocation {
    return this._window.location;
  }

  set location(value: SyntheticLocation) {
    this._window.location = value;
  }

  createElement(tagName: string) {
    return new SyntheticElement(tagName);
  }

  createComment(nodeValue: string) {

  }

  createTextNode(nodeValue: string) {

  }

  createDocumentFragment() {

  }
}