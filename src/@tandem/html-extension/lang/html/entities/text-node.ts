import { decode } from "ent";
import { NodeSection } from "@tandem/html-extension/dom";
import { MarkupValueNodeEntity } from "./value-node";
import { MarkupTextExpression } from "@tandem/html-extension/lang/html/ast";
import { EntityFactoryDependency } from "@tandem/common/dependencies";

export class MarkupTextEntity extends MarkupValueNodeEntity<MarkupTextExpression> {
  createSection() {
    return new NodeSection(document.createTextNode(decode(this.source.value)));
  }
  cloneLeaf() {
    return new MarkupTextEntity(this.source);
  }
}

export const htmlTextDependency = new EntityFactoryDependency(MarkupTextExpression, MarkupTextEntity);
