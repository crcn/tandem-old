import { CSSFile } from "tandem-html-extension/models";
import { NodeSection } from "tandem-html-extension/dom";
import { ICSSEntity } from "./base";
import { HTMLNodeEntity } from "tandem-html-extension/lang/html/entities";
import { CSSATRuleExpression } from "../ast";
import { BaseEntity, IEntity } from "tandem-common/lang";
import { EntityFactoryDependency } from "tandem-common/dependencies";

export class CSSAtRuleEntity extends BaseEntity<CSSATRuleExpression> implements ICSSEntity {
  readonly document: CSSFile;

  cloneLeaf() {
    return new CSSAtRuleEntity(this.source);
  }
}

export const cssAtRuleEntityFactoryDependency = new EntityFactoryDependency(CSSATRuleExpression, CSSAtRuleEntity);