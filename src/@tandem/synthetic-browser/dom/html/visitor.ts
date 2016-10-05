import { SyntheticHTMLElement } from "./element";
import { SyntheticHTMLComment } from "./comment";
import { SyntheticHTMLTextNode } from "./text-node";
import { SyntheticHTMLDocument } from "./document";
import { SyntheticHTMLDocumentFragment } from "./document-fragment";

export interface IHTMLNodeVisitor {
  visitDocument(node: SyntheticHTMLDocument);
  visitElement(node: SyntheticHTMLElement);
  visitDocumentFragment(node: SyntheticHTMLDocumentFragment);
  visitTextNode(node: SyntheticHTMLTextNode);
  visitComment(node: SyntheticHTMLComment);
}