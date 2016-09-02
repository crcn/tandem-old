import { INamed } from "sf-core/object";
import { inject } from "sf-core/decorators";
import { HTMLFile } from "sf-html-extension/models/html-file";
import { BubbleBus } from "sf-core/busses";
import { DocumentFile } from "sf-front-end/models";
import { watchProperty } from "sf-core/observable";
import { IHTMLNodeEntity } from "./base";
import { EntityFactoryDependency } from "sf-core/dependencies";
import { IDOMSection, GroupNodeSection } from "sf-html-extension/dom";
import { Action, PropertyChangeAction, UpdateAction } from "sf-core/actions";
import { Dependencies, DEPENDENCIES_NS, IInjectable } from "sf-core/dependencies";
import { CSSStylesheetsDependency } from "sf-html-extension/dependencies";
import {
  IEntity,
  EntityMetadata,
  IEntityDocument,
  findEntitiesBySource,
} from "sf-core/ast/entities";

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
} from "sf-html-extension/ast";

import {
  HTMLNodeEntity
} from "sf-html-extension/ast/html/entities/node";


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