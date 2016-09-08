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
  public content: string;
  public document: DocumentFile<any>;

  async evaluate(context: any) {
    await super.evaluate(context);
    await this.registerCSS();
  }

  async registerCSS() {
    this.content = await this.loadCSS();
    CSSStylesheetsDependency.getInstance(this.dependencies).addStyleSheet(this);
  }

  async loadCSS() {
    return this.document.content;
  }

  getInitialMetadata() {
    return Object.assign(super.getInitialMetadata(), {
      [MetadataKeys.HIDDEN]: true
    });
  }

  cloneLeaf() {
    return new CSSRootEntity(this.source);
  }
}