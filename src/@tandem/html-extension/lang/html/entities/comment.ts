import { NodeSection } from "@tandem/html-extension/dom";
import { MarkupValueNodeEntity } from "./value-node";
import { MarkupCommentExpression } from "@tandem/html-extension/lang/html/ast";
import { EntityFactoryDependency } from "@tandem/common/dependencies";

export class MarkupCommentEntity extends MarkupValueNodeEntity<MarkupCommentExpression> {
  createSection() {
    return new NodeSection(document.createComment(this.source.value));
  }
  toString() {
    return `<!-- ${this.value} -->`;
  }
  cloneLeaf() {
    return new MarkupCommentEntity(this.source);
  }
}

export const htmlCommentDependency = new EntityFactoryDependency(MarkupCommentExpression, MarkupCommentEntity);
