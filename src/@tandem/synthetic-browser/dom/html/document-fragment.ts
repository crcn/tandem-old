import { SyntheticHTMLContainer } from "./container";
import { HTMLNodeType } from "./node-types";
import { SyntheticHTMLDocument } from "./document";

export class SyntheticHTMLDocumentFragment extends SyntheticHTMLContainer {
  readonly nodeType: number = HTMLNodeType.DOCUMENT_FRAGMENT;
  constructor(ownerDocument: SyntheticHTMLDocument) {
    super("#document-fragment", ownerDocument);
  }
}