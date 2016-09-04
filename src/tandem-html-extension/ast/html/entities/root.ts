import { INamed } from "tandem-common/object";
import { inject } from "tandem-common/decorators";
import { HTMLFile } from "tandem-html-extension/models/html-file";
import { BubbleBus } from "tandem-common/busses";
import { DocumentFile } from "tandem-front-end/models";
import { watchProperty } from "tandem-common/observable";
import { IHTMLNodeEntity } from "./base";
import { EntityFactoryDependency } from "tandem-common/dependencies";
import { IDOMSection, GroupNodeSection } from "tandem-html-extension/dom";
import { Action, PropertyChangeAction, UpdateAction } from "tandem-common/actions";
import { Dependencies, DEPENDENCIES_NS, IInjectable } from "tandem-common/dependencies";
import { CSSStylesheetsDependency } from "tandem-html-extension/dependencies";
import {
  IEntity,
  EntityMetadata,
  IEntityDocument,
  findEntitiesBySource,
} from "tandem-common/ast/entities";

import {
  parseHTML,
  HTMLExpression,
  HTMLTextExpression,
  CSSStyleExpression,
  CSSStyleSheetExpression,
  HTMLCommentExpression,
  HTMLElementExpression,
  HTMLFragmentExpression,
  HTMLAttributeExpression,
  IHTMLValueNodeExpression
} from "tandem-html-extension/ast";

import {
  HTMLNodeEntity
} from "tandem-html-extension/ast/html/entities/node";


export class HTMLDocumentRootEntity extends HTMLNodeEntity<HTMLFragmentExpression> implements IHTMLNodeEntity {

  /**
   * The source content of this document
   */

  private _globalStyle: HTMLStyleElement;
  private _styleSheetsDependency: CSSStylesheetsDependency;


  constructor(source: HTMLFragmentExpression, document: HTMLFile, readonly _dependencies: Dependencies) {
    super(source);
    this.document = document;
    this._styleSheetsDependency = CSSStylesheetsDependency.getInstance(this._dependencies);
  }

  createSection(): IDOMSection {
    return new GroupNodeSection();
  }

  cloneLeaf() {
    return new HTMLDocumentRootEntity(this.source, <HTMLFile>this.document, this._dependencies);
  }

  patch(entity: HTMLDocumentRootEntity) {
    super.patch(entity);
    this._styleSheetsDependency = entity._styleSheetsDependency;
    this._updateCSS();
  }

  public async load() {
    await super.load();
    this._globalStyle = document.createElement("style");
    if (!process.env.TESTING) {
      this.section.appendChild(this._globalStyle);
    }
    this._updateCSS();
  }

  private _updateCSS() {
    // after the root has been loaded in, fetch all of the CSS styles.
    this._globalStyle.innerHTML = this._styleSheetsDependency.toString();
  }
}