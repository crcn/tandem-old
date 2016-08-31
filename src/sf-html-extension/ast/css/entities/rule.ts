import { HTMLFile } from "sf-html-extension/models";
import { NodeSection } from "sf-html-extension/dom";
import { HTMLNodeEntity } from "sf-html-extension/ast/html/entities";
import { CSSRuleExpression } from "../expressions";
import { EntityFactoryDependency } from "sf-core/dependencies";
import { INodeEntity, BaseNodeEntity } from "sf-core/ast";

export class CSSRuleEntity extends BaseNodeEntity<CSSRuleExpression> {

  async load() {

  }

  _clone() {
    return new CSSRuleEntity(this.source);
  }
}

export const cssRuleEntityFactoryDependency = new EntityFactoryDependency(CSSRuleExpression.name, CSSRuleEntity);