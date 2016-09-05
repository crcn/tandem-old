import { inject } from "tandem-common/decorators";
import { HTMLFile } from "tandem-html-extension/models/html-file";
import { Observable } from "tandem-common/observable";
import { MetadataKeys } from "tandem-front-end/constants";
import { DocumentFile } from "tandem-front-end/models";
import { watchProperty } from "tandem-common/observable";
import { GroupNodeSection } from "tandem-html-extension/dom";
import { CSSStylesheetsDependency } from "tandem-html-extension/dependencies";
import { parseCSS, CSSRootExpression } from "tandem-html-extension/ast";
import { Dependencies, DEPENDENCIES_NS, Injector } from "tandem-common/dependencies";
import {BaseEntity, EntityMetadata, IEntityDocument } from "tandem-common/ast/entities";

import { CSSRuleEntity } from "./rule";
import  { ICSSRuleEntity } from "./base";

export class CSSRootEntity extends BaseEntity<CSSRootExpression> {

  public owner: HTMLFile;

  constructor(source: CSSRootExpression, public document: DocumentFile<any>, protected _dependencies: Dependencies) {
    super(source);
  }

  load() {
    super.load();
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