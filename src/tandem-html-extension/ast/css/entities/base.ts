import { CSSFile } from "tandem-html-extension/models";
import { CSSRuleExpression } from "tandem-html-extension/ast";
import { IEntity, BaseEntity, IExpression } from "tandem-common";

export interface ICSSEntity extends IEntity {
  document: CSSFile;
}

export interface ICSSRuleEntity extends ICSSEntity {
  selectedHTMLEntities: Array<IEntity>;
  readonly source: CSSRuleExpression;
}

export class BaseCSSEntity<T extends IExpression> extends BaseEntity<T> {
  cloneLeaf() {
    return new (<any>this.constructor)(this.source);
  }
}