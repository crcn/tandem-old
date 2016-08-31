import { IDOMSection } from "sf-html-extension/dom";
import { CSSStyleSheetExpression } from "sf-html-extension/ast";
import { INodeEntity, IContainerNodeEntity, IContainerNodeEntitySource } from "sf-core/ast/entities";

export interface IHTMLEntity extends INodeEntity {
  section: IDOMSection;
}

export interface IHTMLDocumentEntity extends IHTMLEntity {
}

export interface IHTMLContainerEntity extends IHTMLEntity, IContainerNodeEntity {
  children: Array<IHTMLEntity>;
}
