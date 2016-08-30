import { MetadataKeys } from "sf-front-end/constants";
import { GroupNodeSection } from "sf-html-extension/dom";
import { HTMLContainerEntity } from "./container";
import { HTMLFragmentExpression } from "sf-html-extension/ast";
import { EntityFactoryDependency } from "sf-core/dependencies";

export class HTMLDocumentFragmentEntity extends HTMLContainerEntity<HTMLFragmentExpression> {

  createSection() {
    return new GroupNodeSection();
  }

  getInitialMetadata() {
    return Object.assign(super.getInitialMetadata(), {
      [MetadataKeys.HIDDEN]: true
    })
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