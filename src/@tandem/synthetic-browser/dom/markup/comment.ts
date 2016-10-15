import { DOMNodeType } from "./node-types";
import { IMarkupNodeVisitor } from "./visitor";
import { SyntheticDocument } from "../document";
import { SyntheticDOMValueNode } from "./value-node";

export class SyntheticDOMComment extends SyntheticDOMValueNode {
  readonly nodeType: number = DOMNodeType.COMMENT;

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
    const clone = new SyntheticDOMComment(this.nodeValue, this.ownerDocument);
    clone.$expression = this.expression;
    clone.$module = this.module;
    return clone;
  }
}