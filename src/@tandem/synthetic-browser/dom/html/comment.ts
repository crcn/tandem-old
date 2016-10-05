import { HTMLNodeType } from "./node-types";
import { SyntheticHTMLValueNode } from "./value-node";
import { SyntheticHTMLDocument } from "./document";

export class SyntheticHTMLComment extends SyntheticHTMLValueNode {
  readonly nodeType: number = HTMLNodeType.COMMENT;
  constructor(nodeValue: string, ownerDocument: SyntheticHTMLDocument) {
    super("#comment", nodeValue, ownerDocument);
  }

  get textContent() {
    return "";
  }
}