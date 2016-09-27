import { HTMLNodeType } from "./node-types";
import { SyntheticString } from "../core";
import { SyntheticDocument } from "./document";
import { SyntheticContainerNode } from "./node";

export class SyntheticDocumentFragment extends SyntheticContainerNode {
  readonly nodeType = HTMLNodeType.DOCUMENT_FRAGMENT;
  constructor(doc: SyntheticDocument) {
    super(new SyntheticString("#document-fragment"), doc);
  }
}