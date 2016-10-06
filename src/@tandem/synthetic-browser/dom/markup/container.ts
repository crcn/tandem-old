import { SyntheticMarkupNode } from "./node";
import { HTMLNodeType } from "./node-types";
import { SyntheticMarkupText } from "./text-node";

export abstract class SyntheticMarkupContainer extends SyntheticMarkupNode {

  // TODO - insertBefore here
  appendChild(child: SyntheticMarkupNode) {
    if (child.nodeType === HTMLNodeType.DOCUMENT_FRAGMENT) {
      return child.children.concat().forEach((child) => this.appendChild(child));
    }
    return super.appendChild(child);
  }

  get textContent() {
    return this.childNodes.map((child) => child.textContent).join("");
  }

  set textContent(value) {
    this.removeAllChildren();
    this.appendChild(this.ownerDocument.createTextNode(value));
  }

  toString() {
    return this.childNodes.map((child) => child.toString()).join("");
  }
}