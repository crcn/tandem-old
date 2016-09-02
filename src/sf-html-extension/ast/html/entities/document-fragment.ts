import { MetadataKeys } from "sf-front-end/constants";
import { GroupNodeSection } from "sf-html-extension/dom";
import { HTMLNodeEntity } from "./node";
import { HTMLFragmentExpression } from "sf-html-extension/ast";
import { EntityFactoryDependency } from "sf-core/dependencies";

export class HTMLDocumentFragmentEntity extends HTMLNodeEntity<HTMLFragmentExpression> {

  createSection() {
    return new GroupNodeSection();
  }

  getInitialMetadata() {
    return Object.assign(super.getInitialMetadata(), {
      [MetadataKeys.HIDDEN]: true
    });
  }

  cloneLeaf() {
    return new HTMLDocumentFragmentEntity(this.source);
  }
}

export const htmlDocumentFragmentDependency = new EntityFactoryDependency(HTMLFragmentExpression, HTMLDocumentFragmentEntity);