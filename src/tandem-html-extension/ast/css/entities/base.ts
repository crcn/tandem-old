import { CSSFile } from "tandem-html-extension/models";
import { IEntity } from "tandem-common/ast";
import { CSSRuleExpression } from "tandem-html-extension/ast";

export interface ICSSEntity extends IEntity {
  document: CSSFile;
}

export interface ICSSRuleEntity extends ICSSEntity {
  selectedHTMLEntities: Array<IEntity>;
  readonly source: CSSRuleExpression;
}