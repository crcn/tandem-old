import { IEntity } from "tandem-common/ast";
import { IDOMSection } from "tandem-html-extension/dom";
import { CSSStyleSheetExpression } from "tandem-html-extension/ast";

export interface IHTMLNodeEntity extends IEntity {
  section: IDOMSection;
}
export interface IHTMLElementAttributeEntity extends IEntity {
  name: string;
  value: any;
}