import { IFile } from "sf-core/active-records";
import { inject } from "sf-core/decorators";
import { HTMLFile } from "sf-html-extension/models/html-file";
import { Observable } from "sf-core/observable";
import { MetadataKeys } from "sf-front-end/constants";
import { DocumentFile } from "sf-front-end/models";
import { watchProperty } from "sf-core/observable";
import { GroupNodeSection } from "sf-html-extension/dom";
import { parseCSS, CSSStyleSheetExpression } from "sf-html-extension/ast";
import { Dependencies, DEPENDENCIES_NS, Injector } from "sf-core/dependencies";
import {BaseEntity, EntityMetadata, IEntityDocument } from "sf-core/ast/entities";

import { CSSRuleEntity } from "./rule";
import  { ICSSRuleEntity } from "./base";

export class CSSRootEntity extends BaseEntity<CSSStyleSheetExpression> {

  public owner: HTMLFile;

  constructor(source: CSSStyleSheetExpression, public document: DocumentFile<any>, protected _dependencies: Dependencies) {
    super(source);
  }

  compareChild(a: ICSSRuleEntity, b: ICSSRuleEntity) {
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

  cloneLeaf() {
    return new CSSRootEntity(this.source, this.document, this._dependencies);
  }
}