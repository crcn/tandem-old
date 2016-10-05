import { HTMLNodeType } from "./node-types";
import { IHTMLNodeVisitor } from "./visitor";
import { SyntheticHTMLDocument } from "./document";
import { SyntheticHTMLContainer } from "./container";

export class SyntheticHTMLDocumentFragment extends SyntheticHTMLContainer {
  readonly nodeType: number = HTMLNodeType.DOCUMENT_FRAGMENT;
  constructor(ownerDocument: SyntheticHTMLDocument) {
    super("#document-fragment", ownerDocument);
  }
  accept(visitor: IHTMLNodeVisitor) {
    return visitor.visitDocumentFragment(this);
  }
  cloneNode() {
    const fragment = new SyntheticHTMLDocumentFragment(this.ownerDocument);
    for (const child of this.childNodes) {
      this.appendChild(child.cloneNode());
    }
    return fragment;
  }
}