import { HTMLNodeType } from "./node-types";
import { SyntheticHTMLValueNode } from "./value-node";
import { SyntheticHTMLDocument } from "./document";

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
}