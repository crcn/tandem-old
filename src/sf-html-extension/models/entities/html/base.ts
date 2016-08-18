import { IEntity } from "sf-core/entities";
import { CSSStyleSheetExpression } from "sf-html-extension/parsers/css";
import { IMarkupSection, IContainerNode } from "sf-core/markup";

export interface IHTMLDocument extends IContainerNode {
  stylesheet: CSSStyleSheetExpression;
}

export interface IHTMLEntity extends IEntity {
  section: IMarkupSection;
  document: IHTMLDocument;
}


