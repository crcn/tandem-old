import { HTMLValueNodeEntity } from "./value-node";
import { HTMLCommentExpression } from "sf-html-extension/ast";
import { EntityFactoryDependency } from "sf-core/dependencies";

export class HTMLCommentEntity extends HTMLValueNodeEntity<HTMLCommentExpression> {
  createDOMNode(nodeValue: any) {
    return document.createComment(nodeValue);
  }
}

export const htmlCommentDependency          = new EntityFactoryDependency("#comment", HTMLCommentEntity);
