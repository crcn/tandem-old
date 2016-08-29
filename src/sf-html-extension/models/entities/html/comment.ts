import { HTMLValueNodeEntity } from "./value-node";
import { HTMLCommentExpression } from "sf-html-extension/parsers/html";
import { EntityFactoryDependency } from "sf-core/dependencies";

export class HTMLCommentEntity extends HTMLValueNodeEntity<HTMLCommentExpression> {
  readonly type: string = "comment";
  createDOMNode(nodeValue: any) {
    return document.createComment(nodeValue);
  }
}

export const htmlCommentDependency          = new EntityFactoryDependency("#comment", HTMLCommentEntity);
