import { INamed } from "tandem-common/object";
import { inject } from "tandem-common/decorators";
import { HTMLFile } from "tandem-html-extension/models/html-file";
import { BubbleBus } from "tandem-common/busses";
import { DocumentFile } from "tandem-front-end/models";
import { watchProperty } from "tandem-common/observable";
import { IHTMLNodeEntity } from "./base";
import { EntityFactoryDependency } from "tandem-common/dependencies";
import { CSSStylesheetsDependency } from "tandem-html-extension/dependencies";
import { IDOMSection, GroupNodeSection } from "tandem-html-extension/dom";
import { Action, PropertyChangeAction, UpdateAction } from "tandem-common/actions";
import { Dependencies, DEPENDENCIES_NS, IInjectable } from "tandem-common/dependencies";
import {
  IEntity,
  EntityMetadata,
  IEntityDocument,
  findEntitiesBySource,
} from "tandem-common/ast/entities";

import {
  parseHTML,
  CSSRootEntity,
  HTMLExpression,
  HTMLTextExpression,
  HTMLCommentExpression,
  HTMLElementExpression,
  HTMLFragmentExpression,
  HTMLAttributeExpression,
  IHTMLValueNodeExpression,
} from "tandem-html-extension/ast";

import {
  HTMLNodeEntity
} from "tandem-html-extension/ast/html/entities/node";


export class HTMLDocumentRootEntity extends HTMLNodeEntity<HTMLFragmentExpression> implements IHTMLNodeEntity {

  /**
   * The source content of this document
   */

  private _globalStyle: HTMLStyleElement;

  createSection(): IDOMSection {
    return new GroupNodeSection();
  }

  cloneLeaf() {
    return new HTMLDocumentRootEntity(this.source);
  }

  onEvaluated() {
    // after the root has been loaded in, fetch all of the CSS styles.
    this._globalStyle.innerHTML = CSSStylesheetsDependency.getInstance(this.context.dependencies).toString();
  }

  public async load() {
    this._globalStyle = document.createElement("style");
    this.section.appendChild(this._globalStyle);
    await super.load();
  }
}