import { CSSFile } from "tandem-html-extension/models";
import { NodeSection } from "tandem-html-extension/dom";
import { ICSSRuleEntity } from "./base";
import { HTMLNodeEntity } from "tandem-html-extension/ast/html/entities";
import { CSSCommentExpression } from "../expressions";
import { BaseEntity, IEntity } from "tandem-common/ast";
import { EntityFactoryDependency } from "tandem-common/dependencies";

export class CSSCommentEntity extends BaseEntity<CSSCommentExpression> {

  readonly document: CSSFile;

  cloneLeaf() {
    return new CSSCommentEntity(this.source);
  }
}

export const cssCommentEntityFactoryDependency = new EntityFactoryDependency(CSSCommentExpression, CSSCommentEntity);