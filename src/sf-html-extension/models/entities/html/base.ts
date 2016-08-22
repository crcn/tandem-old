import { CSSStyleSheetExpression } from "sf-html-extension/parsers/css";
import { IEntity, IEntityDocument } from "sf-core/entities";
import { IMarkupSection, IContainerNode } from "sf-core/markup";

export interface IHTMLDocument extends IEntityDocument {
  stylesheet: CSSStyleSheetExpression;
}

export interface IHTMLEntity extends IEntity {
  section: IMarkupSection;
  document: IHTMLDocument;
}

export interface IHTMLContainerEntity extends IHTMLEntity, IContainerNode {

}


