import { DOMNodeType } from "./node-types";
import { IMarkupNodeVisitor } from "./visitor";
import { SyntheticDocument } from "../document";
import { SyntheticDOMValueNode } from "./value-node";

export class SyntheticDOMText extends SyntheticDOMValueNode {
  readonly nodeType: number = DOMNodeType.TEXT;
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
    const clone = new SyntheticDOMText(this.nodeValue, this.ownerDocument);
    clone.$expression = this.expression;
    clone.$module = this.module;
    return clone;
  }
}