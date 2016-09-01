import { CSSFile } from "sf-html-extension/models";
import { IEntity } from "sf-core/ast";
import { CSSRuleExpression } from "sf-html-extension/ast";

export interface ICSSEntity extends IEntity {
  document: CSSFile;
}

export interface ICSSRuleEntity extends ICSSEntity {
  selectedHTMLEntities: Array<IEntity>;
  readonly source: CSSRuleExpression;
}