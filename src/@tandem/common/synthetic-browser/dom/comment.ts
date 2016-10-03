import { HTMLNodeType } from "./node-types";
import { SyntheticHTMLValueNode } from "./value-node";
import { SyntheticDocument } from "./document";

export class SyntheticHTMLComment extends SyntheticHTMLValueNode {
  readonly nodeType: number = HTMLNodeType.COMMENT;
  constructor(nodeValue: string, ownerDocument: SyntheticDocument) {
    super("#comment", nodeValue, ownerDocument);
  }
}