import { DOMNodeType } from "./node-types";
import { IMarkupNodeVisitor } from "./visitor";
import { SyntheticDocument } from "../document";
import { SyntheticDOMValueNode, createDOMValueNodeSerializer } from "./value-node";
import { serializable } from "@tandem/common";

const SyntheticDOMCommentSerializer = createDOMValueNodeSerializer(value => new SyntheticDOMComment(value));

@serializable(new SyntheticDOMCommentSerializer())
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