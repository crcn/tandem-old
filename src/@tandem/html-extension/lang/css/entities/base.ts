import { CSSRuleExpression } from "@tandem/html-extension/lang";
import { IEntity, BaseEntity, IASTNode } from "@tandem/common";

export interface ICSSEntity extends IEntity {
}

export interface ICSSRuleEntity extends ICSSEntity {
  readonly source: CSSRuleExpression;
}

export class BaseCSSEntity<T extends IASTNode> extends BaseEntity<T> {
  cloneLeaf() {
    return new (<any>this.constructor)(this.source);
  }
}