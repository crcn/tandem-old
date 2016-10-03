import { HTMLNodeType } from "./node-types";
import { SyntheticHTMLValueNode } from "./value-node";
import { SyntheticDocument } from "./document";

export class SyntheticHTMLTextNode extends SyntheticHTMLValueNode {
  readonly nodeType: number = HTMLNodeType.TEXT;
  constructor(nodeValue: string, ownerDocument: SyntheticDocument) {
    super("#text", nodeValue, ownerDocument);
  }
}