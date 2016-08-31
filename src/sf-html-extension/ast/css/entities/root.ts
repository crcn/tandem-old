import { IFile } from "sf-core/active-records";
import { inject } from "sf-core/decorators";
import { HTMLFile } from "sf-html-extension/models/html-file";
import { Observable } from "sf-core/observable";
import { MetadataKeys } from "sf-front-end/constants";
import { DocumentFile } from "sf-front-end/models";
import { watchProperty } from "sf-core/observable";
import { ContainerNode } from "sf-core/markup";
import { GroupNodeSection } from "sf-html-extension/dom";
import { HTMLContainerEntity } from "sf-html-extension/ast/html/entities";
import { parseCSS, CSSStyleSheetExpression } from "sf-html-extension/ast";
import { Dependencies, DEPENDENCIES_NS, Injector } from "sf-core/dependencies";
import { IContainerNodeEntity, BaseNodeEntity, BaseContainerNodeEntity, INodeEntity, EntityMetadata, IEntityDocument } from "sf-core/ast/entities";

import { CSSRuleEntity } from "./rule";

export class CSSRootEntity extends BaseContainerNodeEntity<CSSStyleSheetExpression> implements IContainerNodeEntity {

  constructor(source: CSSStyleSheetExpression, public document: DocumentFile<any>, protected _dependencies: Dependencies) {
    super(source);
  }

  compareChild(a: INodeEntity, b: INodeEntity) {
    if (a.constructor !== b.constructor) return false;

    if (a.source.selector) {
      return String(a.source.selector) === String(b.source.selector);
    }

    return super.compareChild(a, b);
  }

  async load() {
    await super.load();

    // TODO - need to add children here instead
    (<HTMLFile>this.document.owner).entity.addStyleSheet(this.source);
  }

  mapSourceChildNodes() {
    return this.source.rules;
  }

  getInitialMetadata() {
    return Object.assign(super.getInitialMetadata(), {
      [MetadataKeys.HIDDEN]: true
    });
  }
}