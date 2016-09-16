import { CSSFile } from "tandem-html-extension/models";
import { NodeSection } from "tandem-html-extension/dom";
import { ICSSRuleEntity } from "./base";
import { CSSRuleExpression } from "../expressions";
import { BaseEntity, IEntity } from "tandem-common/ast";
import { EntityFactoryDependency } from "tandem-common/dependencies";
import { HTMLNodeEntity, HTMLElementEntity } from "tandem-html-extension/ast/html/entities";

export class CSSRuleEntity extends BaseEntity<CSSRuleExpression> implements ICSSRuleEntity {

  readonly document: CSSFile;
  compare(entity: CSSRuleEntity) {
    return super.compare(entity) && String(entity.source.selector) === String(this.source.selector);
  }

  selectorMatches(entity: IEntity) {
    if (!(entity instanceof HTMLElementEntity)) {
      return false;
    }
    return (<Element>(<HTMLElementEntity>entity).section.targetNode).webkitMatchesSelector(this.source.selector);
  }

  cloneLeaf() {
    return new CSSRuleEntity(this.source);
  }
}

export const cssRuleEntityFactoryDependency = new EntityFactoryDependency(CSSRuleExpression, CSSRuleEntity);