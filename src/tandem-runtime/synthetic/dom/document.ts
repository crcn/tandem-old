import { SyntheticComment } from "./comment";
import { SyntheticElement } from "./element";
import { SyntheticTextNode } from "./text-node";
import { SyntheticDocumentFragment } from "./fragment";
import { SyntheticNode, SyntheticContainerNode } from "./node";
import { synthetic, SyntheticObject, SyntheticString } from "../core";

export class SyntheticDocument extends SyntheticContainerNode {

  constructor() {

    // TODO - get cu
    super(new SyntheticString("#document"));
    const body = this.createElement(new SyntheticString("body"));
    this.appendChild(body);
    this.set("body", body);
  }

  get body(): SyntheticElement {
    return this.get("body") as SyntheticElement;
  }

  @synthetic registerElement(tagName: SyntheticString, properties?: SyntheticObject) {
    // http://www.html5rocks.com/en/tutorials/webcomponents/customelements/
  }

  @synthetic createElement(tagName: SyntheticString) {
    return new SyntheticElement(tagName);
  }

  @synthetic createDocumentFragment() {
    return new SyntheticDocumentFragment();
  }

  @synthetic createTextNode(nodeValue: SyntheticString) {
    return new SyntheticTextNode(nodeValue);
  }

  @synthetic createComment(nodeValue: SyntheticString) {
    return new SyntheticComment(nodeValue);
  }
}