import { IEntity } from "sf-common/ast";
import { IDOMSection } from "sf-html-extension/dom";
import { CSSStyleSheetExpression } from "sf-html-extension/ast";

export interface IHTMLNodeEntity extends IEntity {
  section: IDOMSection;
}
export interface IHTMLElementAttributeEntity extends IEntity {
  name: string;
  value: any;
}