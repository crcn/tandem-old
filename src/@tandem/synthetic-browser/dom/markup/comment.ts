import { DOMNodeType } from "./node-types";
import { serializable } from "@tandem/common";
import { SyntheticDocument } from "../document";
import { IMarkupNodeVisitor } from "./visitor";
import { SyntheticDOMNodeSerializer } from "./node";
import { SyntheticDOMValueNode, SyntheticDOMValueNodeSerializer } from "./value-node";

@serializable(new SyntheticDOMNodeSerializer(new SyntheticDOMValueNodeSerializer()))
export class SyntheticDOMComment extends SyntheticDOMValueNode {
  readonly nodeType: number = DOMNodeType.COMMENT;

  constructor(nodeValue: string) {
    super("#comment", nodeValue);
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
    const clone = new SyntheticDOMComment(this.nodeValue)
    this.linkClone(clone);
    return clone;
  }
}