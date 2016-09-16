import { NodeSection } from "tandem-html-extension/dom";
import { HTMLValueNodeEntity } from "./value-node";
import { HTMLCommentExpression } from "tandem-html-extension/ast/html/expressions";
import { EntityFactoryDependency } from "tandem-common/dependencies";

export class HTMLCommentEntity extends HTMLValueNodeEntity<HTMLCommentExpression> {
  createSection() {
    return new NodeSection(document.createComment(this.source.value));
  }
  toString() {
    return `<!-- ${this.value} -->`;
  }
  cloneLeaf() {
    return new HTMLCommentEntity(this.source);
  }
}

export const htmlCommentDependency = new EntityFactoryDependency(HTMLCommentExpression, HTMLCommentEntity);
