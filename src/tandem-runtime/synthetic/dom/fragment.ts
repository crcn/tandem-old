import { SyntheticString } from "../core";
import { SyntheticDocument } from "./document";
import { SyntheticContainerNode } from "./node";

export class SyntheticDocumentFragment extends SyntheticContainerNode {
  constructor(doc: SyntheticDocument) {
    super(new SyntheticString("#document-fragment"), doc);
  }
}