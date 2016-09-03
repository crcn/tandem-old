import { IFile } from "sf-common/active-records";
import { inject } from "sf-common/decorators";
import { HTMLFile } from "sf-html-extension/models/html-file";
import { Observable } from "sf-common/observable";
import { MetadataKeys } from "sf-front-end/constants";
import { DocumentFile } from "sf-front-end/models";
import { watchProperty } from "sf-common/observable";
import { GroupNodeSection } from "sf-html-extension/dom";
import { CSSStylesheetsDependency } from "sf-html-extension/dependencies";
import { parseCSS, CSSStyleSheetExpression } from "sf-html-extension/ast";
import { Dependencies, DEPENDENCIES_NS, Injector } from "sf-common/dependencies";
import {BaseEntity, EntityMetadata, IEntityDocument } from "sf-common/ast/entities";

import { CSSRuleEntity } from "./rule";
import  { ICSSRuleEntity } from "./base";

export class CSSRootEntity extends BaseEntity<CSSStyleSheetExpression> {

  public owner: HTMLFile;

  constructor(source: CSSStyleSheetExpression, public document: DocumentFile<any>, protected _dependencies: Dependencies) {
    super(source);
  }

  async load() {
    await super.load();
    CSSStylesheetsDependency.getInstance(this._dependencies).addStyleSheet(this.source);
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