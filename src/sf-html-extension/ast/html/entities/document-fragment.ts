import { GroupNodeSection } from "sf-html-extension/dom";
import { HTMLContainerEntity } from "./container";
import { EntityFactoryDependency } from "sf-core/dependencies";
import { HTMLFragmentExpression } from "sf-html-extension/ast";

export class HTMLDocumentFragmentEntity extends HTMLContainerEntity<HTMLFragmentExpression> {

  createSection() {
    return new GroupNodeSection();
  }
  clone() {
    const entity = new HTMLDocumentFragmentEntity(this.source);
    for (const child of this.children) {
      entity.appendChild(child.clone());
    }
    return entity;
  }
}

export const htmlDocumentFragmentDependency = new EntityFactoryDependency("#document-fragment", HTMLDocumentFragmentEntity);