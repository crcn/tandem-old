import { HTMLNodeType } from "./node-types";
import { IMarkupNodeVisitor } from "./visitor";
import { SyntheticDocument } from "../document";
import { SyntheticMarkupValueNode } from "./value-node";

export class SyntheticMarkupText extends SyntheticMarkupValueNode {
  readonly nodeType: number = HTMLNodeType.TEXT;
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
    return new SyntheticMarkupText(this.nodeValue, this.ownerDocument);
  }
}