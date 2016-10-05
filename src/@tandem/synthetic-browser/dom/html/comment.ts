import { HTMLNodeType } from "./node-types";
import { IHTMLNodeVisitor } from "./visitor";
import { SyntheticHTMLDocument } from "./document";
import { SyntheticHTMLValueNode } from "./value-node";

export class SyntheticHTMLComment extends SyntheticHTMLValueNode {
  readonly nodeType: number = HTMLNodeType.COMMENT;
  constructor(nodeValue: string, ownerDocument: SyntheticHTMLDocument) {
    super("#comment", nodeValue, ownerDocument);
  }

  get textContent() {
    return "";
  }

  accept(visitor: IHTMLNodeVisitor) {
    return visitor.visitComment(this);
  }

  cloneNode() {
    return new SyntheticHTMLComment(this.nodeValue, this.ownerDocument);
  }
}