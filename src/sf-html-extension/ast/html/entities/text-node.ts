import { decode } from "ent";
import { NodeSection } from "sf-html-extension/dom";
import { HTMLValueNodeEntity } from "./value-node";
import { HTMLCommentExpression } from "sf-html-extension/ast";
import { EntityFactoryDependency } from "sf-core/dependencies";

export class HTMLTextEntity extends HTMLValueNodeEntity<HTMLCommentExpression> {
  createSection() {
    return new NodeSection(document.createTextNode(decode(this.source.value)));
  }
}

export const htmlTextDependency             = new EntityFactoryDependency("#text", HTMLTextEntity);
