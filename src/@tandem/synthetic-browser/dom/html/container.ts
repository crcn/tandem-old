import { SyntheticHTMLNode } from "./node";
import { HTMLNodeType } from "./node-types";
import { SyntheticHTMLTextNode } from "./text-node";

export abstract class SyntheticHTMLContainer extends SyntheticHTMLNode {

  // TODO - insertBefore here
  appendChild(child: SyntheticHTMLNode) {
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

  get outerHTML() {
    return this.childNodes.map((child) => child.outerHTML).join("");
  }
}