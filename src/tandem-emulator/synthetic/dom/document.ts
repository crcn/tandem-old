import { SyntheticElement } from "./element";
import { SyntheticTextNode } from "./text-node";
import { SyntheticNode, SyntheticContainerNode } from "./node";
import { synthetic, SyntheticObject, SyntheticString } from "../core";

export class SyntheticDocument extends SyntheticContainerNode {

  constructor() {
    super(new SyntheticString("#document"));
    const body = this.createElement(new SyntheticString("body"));
    this.appendChild(body);
    this.set("body", body);
  }

  get body(): SyntheticElement {
    return this.get("body") as SyntheticElement;
  }

  @synthetic createElement(tagName: SyntheticString) {
    return new SyntheticElement(tagName);
  }

  @synthetic createTextNode(nodeValue: SyntheticString) {
    return new SyntheticTextNode(nodeValue);
  }

  @synthetic createComment(value: SyntheticString) {

  }
}