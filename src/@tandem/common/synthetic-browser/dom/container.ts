import { SyntheticHTMLNode } from "./node";
import { HTMLNodeType } from "./node-types";

export abstract class SyntheticHTMLContainer extends SyntheticHTMLNode {
  appendChild(child: SyntheticHTMLNode) {
    if (child.nodeType === HTMLNodeType.DOCUMENT_FRAGMENT) {
      return child.children.concat().forEach((child) => this.appendChild(child));
    }
    return super.appendChild(child);
  }
}