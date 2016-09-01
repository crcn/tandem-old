import { CSSFile } from "sf-html-extension/models";
import { NodeSection } from "sf-html-extension/dom";
import { ICSSRuleEntity } from "./base";
import { HTMLNodeEntity } from "sf-html-extension/ast/html/entities";
import { CSSRuleExpression } from "../expressions";
import { EntityFactoryDependency } from "sf-core/dependencies";
import { INodeEntity, BaseNodeEntity } from "sf-core/ast";

export class CSSRuleEntity extends BaseNodeEntity<CSSRuleExpression> implements ICSSRuleEntity {

  readonly document: CSSFile;

  get selectedHTMLEntities(): Array<INodeEntity> {
    return <Array<INodeEntity>>this.document.owner.entity.flatten().filter(this.source.selector.test.bind(this.source.selector));
  }

  _clone() {
    return new CSSRuleEntity(this.source);
  }
}

export const cssRuleEntityFactoryDependency = new EntityFactoryDependency(CSSRuleExpression.name, CSSRuleEntity);