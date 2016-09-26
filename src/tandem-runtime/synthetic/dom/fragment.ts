import { SyntheticContainerNode } from "./node";
import { SyntheticString } from "../core";

export class SyntheticDocumentFragment extends SyntheticContainerNode {
  constructor() {
    super(new SyntheticString("#document-fragment"));
  }
}