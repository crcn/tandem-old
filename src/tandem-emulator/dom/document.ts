import { SyntheticNode } from "./node";
import { SyntheticElement } from "./element";
import { SyntheticTextNode } from "./text-node";
import { synthetic, SyntheticObject, SyntheticString } from "../synthetic";

export class SyntheticDocument extends SyntheticNode {

  readonly body: SyntheticElement;

  constructor() {
    super("#document");
    this.appendChild(this.body = this.createElement(new SyntheticString("body")));
  }

  @synthetic createElement(tagName: SyntheticString) {
    return new SyntheticElement(tagName.value);
  }

  @synthetic createTextNode(nodeValue: SyntheticString) {
    return new SyntheticTextNode(nodeValue);
  }

  @synthetic createComment(value: SyntheticString) {

  }
}