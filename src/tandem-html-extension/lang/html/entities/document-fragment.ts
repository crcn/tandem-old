import { MetadataKeys } from "tandem-front-end/constants";
import { GroupNodeSection } from "tandem-html-extension/dom";
import { HTMLContainerEntity } from "./node";
import { HTMLFragmentExpression } from "tandem-html-extension/lang/html/ast";
import { EntityFactoryDependency } from "tandem-common/dependencies";

export class HTMLDocumentFragmentEntity extends HTMLContainerEntity<HTMLFragmentExpression> {

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