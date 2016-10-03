import { HTMLNodeType } from "./node-types";
import { SyntheticHTMLNode } from "./node";
import { SyntheticDocument } from "./document";

export abstract class SyntheticHTMLValueNode extends SyntheticHTMLNode {
  constructor(nodeName: string, public nodeValue: string, ownerDocument: SyntheticDocument) {
    super(nodeName, ownerDocument);
  }
}