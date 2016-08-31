import { INamed } from "sf-core/object";
import { inject } from "sf-core/decorators";
import { HTMLFile } from "sf-html-extension/models/html-file";
import { BubbleBus } from "sf-core/busses";
import { DocumentFile } from "sf-front-end/models";
import { watchProperty } from "sf-core/observable";
import { EntityFactoryDependency } from "sf-core/dependencies";
import { IDOMSection, GroupNodeSection } from "sf-html-extension/dom";
import { Action, PropertyChangeAction, UpdateAction } from "sf-core/actions";
import { Dependencies, DEPENDENCIES_NS, IInjectable } from "sf-core/dependencies";
import { IHTMLEntity, IHTMLDocumentEntity, IHTMLContainerEntity } from "./base";
import {
  IEntity,
  EntityMetadata,
  IElementEntity,
  IEntityDocument,
  IVisibleNodeEntity,
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
  HTMLContainerEntity
} from "sf-html-extension/ast/html/entities/container";


import { ContainerNode, INode, IContainerNode } from "sf-core/markup";

export class HTMLDocumentRootEntity extends HTMLContainerEntity<HTMLFragmentExpression> implements IHTMLDocumentEntity {

  /**
   * The source content of this document
   */

  private _globalStyle: HTMLStyleElement;

  /**
   * Creates an instance of HTMLDocumentEntity.
   *
   * @param {any} [readonly=file] the source file
   * @param {any} HTMLFile
   */

  public stylesheets: Array<CSSStyleSheetExpression> = [];

  constructor(source: HTMLFragmentExpression, document: HTMLFile, _dependencies: Dependencies) {
    super(source);
    this.document = document;
    this._dependencies = _dependencies.clone();
  }

  createSection(): IDOMSection {
    return new GroupNodeSection();
  }


  addStyleSheet(stylesheet: CSSStyleSheetExpression) {
    this.stylesheets.push(stylesheet);
  }

  removeStylesheet(stylesheet: CSSStyleSheetExpression) {
    const index = this.stylesheets.indexOf(stylesheet);
    if (index !== -1) {
      this.stylesheets.splice(index, 1);
    }
  }

  _clone() {
    const clone = new HTMLDocumentRootEntity(this.source, <HTMLFile>this.document, this._dependencies);
    this.cloneChildrenToContainerNode(clone);
    return clone;
  }

  patch(entity: HTMLDocumentRootEntity) {
    super.patch(entity);
    this.stylesheets = entity.stylesheets;
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
    this._globalStyle.innerHTML = this.stylesheets.join("");
  }
}