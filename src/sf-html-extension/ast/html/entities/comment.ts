import { NodeSection } from "sf-html-extension/dom";
import { HTMLValueNodeEntity } from "./value-node";
import { HTMLCommentExpression } from "sf-html-extension/ast";
import { EntityFactoryDependency } from "sf-core/dependencies";

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

export const htmlCommentDependency          = new EntityFactoryDependency(HTMLCommentExpression, HTMLCommentEntity);
