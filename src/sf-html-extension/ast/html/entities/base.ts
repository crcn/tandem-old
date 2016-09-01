import { IDOMSection } from "sf-html-extension/dom";
import { CSSStyleSheetExpression } from "sf-html-extension/ast";
import { IEntity } from "sf-core/ast/entities";

export interface IHTMLEntity extends IEntity {
  section: IDOMSection;
}
