import { HTMLNodeType } from "./node-types";
import { IMarkupNodeVisitor } from "./visitor";
import { SyntheticDocument } from "../document";
import { SyntheticMarkupValueNode } from "./value-node";

export class SyntheticMarkupComment extends SyntheticMarkupValueNode {
  readonly nodeType: number = HTMLNodeType.COMMENT;

  constructor(nodeValue: string, ownerDocument: SyntheticDocument) {
    super("#comment", nodeValue, ownerDocument);
  }

  toString() {
    return "";
  }

  get textContent() {
    return "";
  }

  accept(visitor: IMarkupNodeVisitor) {
    return visitor.visitComment(this);
  }

  cloneNode() {
    return new SyntheticMarkupComment(this.nodeValue, this.ownerDocument);
  }
}