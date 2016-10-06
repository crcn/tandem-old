import { SyntheticMarkupElement } from "./element";
import { SyntheticMarkupComment } from "./comment";
import { SyntheticMarkupText } from "./text-node";
import { SyntheticDocument } from "../document";
import { SyntheticDocumentFragment } from "./document-fragment";

export interface IMarkupNodeVisitor {
  visitDocument(node: SyntheticDocument);
  visitElement(node: SyntheticMarkupElement);
  visitDocumentFragment(node: SyntheticDocumentFragment);
  visitText(node: SyntheticMarkupText);
  visitComment(node: SyntheticMarkupComment);
}