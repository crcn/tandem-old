import { MarkupNodeType } from "./node-types";
import { SyntheticDOMNode } from "./node";
import { SyntheticDOMText } from "./text-node";
import { querySelector, querySelectorAll } from "../selector";

export abstract class SyntheticDOMContainer extends SyntheticDOMNode {

  // TODO - insertBefore here
  appendChild(child: SyntheticDOMNode) {
    if (child.nodeType === MarkupNodeType.DOCUMENT_FRAGMENT) {
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

  public querySelector(selector: string) {
    return querySelector(this, selector);
  }

  public querySelectorAll(selector: string) {
    return querySelectorAll(this, selector);
  }
}