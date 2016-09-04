import { CSSFile } from "tandem-html-extension/models";
import { NodeSection } from "tandem-html-extension/dom";
import { ICSSRuleEntity } from "./base";
import { HTMLNodeEntity } from "tandem-html-extension/ast/html/entities";
import { CSSRuleExpression } from "../expressions";
import { EntityFactoryDependency } from "tandem-common/dependencies";
import { BaseEntity, IEntity } from "tandem-common/ast";

export class CSSRuleEntity extends BaseEntity<CSSRuleExpression> implements ICSSRuleEntity {

  readonly document: CSSFile;

  get selectedHTMLEntities(): Array<IEntity> {
    return <Array<IEntity>>this.document.owner.entity.flatten().filter(this.source.selector.test.bind(this.source.selector));
  }

  compare(entity: CSSRuleEntity) {
    return super.compare(entity) && String(entity.source.selector) === String(this.source.selector);
  }

  cloneLeaf() {
    return new CSSRuleEntity(this.source);
  }
}

export const cssRuleEntityFactoryDependency = new EntityFactoryDependency(CSSRuleExpression, CSSRuleEntity);