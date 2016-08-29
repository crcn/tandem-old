import { IDOMSection } from "sf-html-extension/dom";
import { CSSStyleSheetExpression } from "sf-html-extension/parsers/css";
import { INodeEntity, IContainerNodeEntity, IContainerNodeEntitySource, IEntityDocument } from "sf-core/ast/entities";

export interface IHTMLDocument extends IEntityDocument { }

export interface IHTMLEntity extends INodeEntity {
  section: IDOMSection;
  document: IHTMLDocument;
  flatten(): Array<IHTMLEntity>;
}

export interface IHTMLContainerEntity extends IHTMLEntity, IContainerNodeEntity {
  document: IHTMLDocument;
  source: IContainerNodeEntitySource;
  children: Array<IHTMLEntity>;
  flatten(): Array<IHTMLEntity>;
}


