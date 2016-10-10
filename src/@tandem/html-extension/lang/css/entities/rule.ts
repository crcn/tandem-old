import { NodeSection } from "@tandem/html-extension/dom";
import { ICSSRuleEntity } from "./base";
import { CSSRuleExpression } from "../ast";
import { BaseEntity, IEntity } from "@tandem/common/lang";
import { EntityFactoryDependency } from "@tandem/common/dependencies";
import { HTMLNodeEntity, MarkupElementEntity } from "@tandem/html-extension/lang/html/entities";

export class CSSRuleEntity extends BaseEntity<CSSRuleExpression> implements ICSSRuleEntity {

  compare(entity: CSSRuleEntity) {
    return super.compare(entity) && String(entity.source.selector) === String(this.source.selector);
  }

  selectorMatches(entity: IEntity) {
    if (!(entity instanceof MarkupElementEntity)) {
      return false;
    }
    return (<Element>(<MarkupElementEntity>entity).section.targetNode).webkitMatchesSelector(this.source.selector);
  }

  cloneLeaf() {
    return new CSSRuleEntity(this.source);
  }
}

export const cssRuleEntityFactoryDependency = new EntityFactoryDependency(CSSRuleExpression, CSSRuleEntity);