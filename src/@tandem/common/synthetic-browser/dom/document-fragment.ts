import { SyntheticHTMLContainer } from "./container";
import { HTMLNodeType } from "./node-types";
import { SyntheticDocument } from "./document";

export class SyntheticHTMLDocumentFragment extends SyntheticHTMLContainer {
  readonly nodeType: number = HTMLNodeType.DOCUMENT_FRAGMENT;
  constructor(ownerDocument: SyntheticDocument) {
    super("#document-fragment", ownerDocument);
  }
}