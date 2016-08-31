import { CSSRuleExpression } from "../expressions";
import { EntityFactoryDependency } from "sf-core/dependencies";
import { INodeEntity, BaseNodeEntity } from "sf-core/ast";

export class CSSRuleEntity extends BaseNodeEntity<CSSRuleExpression> {
  patch(entity: CSSRuleEntity) {
    super.patch(entity);
  }
  _clone() {
    return new CSSRuleEntity(this.source);
  }
}

export const cssRuleEntityFactoryDependency = new EntityFactoryDependency(CSSRuleExpression.name, CSSRuleEntity);