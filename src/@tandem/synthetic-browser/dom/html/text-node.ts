import { HTMLNodeType } from "./node-types";
import { IHTMLNodeVisitor } from "./visitor";
import { SyntheticHTMLDocument } from "./document";
import { SyntheticHTMLValueNode } from "./value-node";

export class SyntheticHTMLTextNode extends SyntheticHTMLValueNode {
  readonly nodeType: number = HTMLNodeType.TEXT;
  constructor(nodeValue: string, ownerDocument: SyntheticHTMLDocument) {
    super("#text", nodeValue, ownerDocument);
  }

  get textContent(): string {
    return this.nodeValue;
  }

  get outerHTML() {
    return this.nodeValue;
  }

  accept(visitor: IHTMLNodeVisitor) {
    return visitor.visitTextNode(this);
  }

  cloneNode() {
    return new SyntheticHTMLTextNode(this.nodeValue, this.ownerDocument);
  }
}