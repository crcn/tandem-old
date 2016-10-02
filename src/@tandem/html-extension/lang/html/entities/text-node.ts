import { decode } from "ent";
import { NodeSection } from "@tandem/html-extension/dom";
import { HTMLValueNodeEntity } from "./value-node";
import { HTMLTextExpression } from "@tandem/html-extension/lang/html/ast";
import { EntityFactoryDependency } from "@tandem/common/dependencies";

export class HTMLTextEntity extends HTMLValueNodeEntity<HTMLTextExpression> {
  createSection() {
    return new NodeSection(document.createTextNode(decode(this.source.value)));
  }
  cloneLeaf() {
    return new HTMLTextEntity(this.source);
  }
}

export const htmlTextDependency = new EntityFactoryDependency(HTMLTextExpression, HTMLTextEntity);
