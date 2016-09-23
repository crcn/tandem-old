import { SyntheticObject, SyntheticString } from "../synthetic";
import { SyntheticElement } from "./element";
import { SyntheticNode } from "./node";

export class SyntheticDocument extends SyntheticNode {

  readonly body: SyntheticElement;

  constructor() {
    super("#document");
    this.appendChild(this.body = this.createElement(new SyntheticString("body")));
  }

  createElement(tagName: SyntheticString) {
    return new SyntheticElement(tagName.value);
  }

  createTextNode(value: SyntheticString) {

  }

  createComment(value: SyntheticString) {

  }
}