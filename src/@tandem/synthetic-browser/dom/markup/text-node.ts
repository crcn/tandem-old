import { MarkupNodeType } from "./node-types";
import { IMarkupNodeVisitor } from "./visitor";
import { SyntheticDocument } from "../document";
import { SyntheticDOMValueNode } from "./value-node";

export class SyntheticDOMText extends SyntheticDOMValueNode {
  readonly nodeType: number = MarkupNodeType.TEXT;
  constructor(nodeValue: string, ownerDocument: SyntheticDocument) {
    super("#text", nodeValue, ownerDocument);
  }

  get textContent(): string {
    return this.nodeValue;
  }

  toString() {
    return this.nodeValue;
  }

  accept(visitor: IMarkupNodeVisitor) {
    return visitor.visitText(this);
  }

  cloneNode() {
    return new SyntheticDOMText(this.nodeValue, this.ownerDocument);
  }
}