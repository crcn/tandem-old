import { WrapBus } from "mesh";
import { HTMLFile } from "tandem-html-extension/models/html-file";
import { MetadataKeys } from "tandem-front-end/constants";
import { DocumentFile } from "tandem-front-end/models";
import { GroupNodeSection } from "tandem-html-extension/dom";
import { CSSStylesheetsDependency } from "tandem-html-extension/dependencies";
import { parseCSS, CSSRootExpression } from "tandem-html-extension/ast";

import {
  inject,
  Action,
  Observable,
  BaseEntity,
  EntityBodyController,
} from "tandem-common";

import { CSSRuleEntity } from "./rule";
import  { ICSSRuleEntity } from "./base";

export class CSSRootEntity extends BaseEntity<CSSRootExpression> {

  public owner: HTMLFile;
  public content: string;
  public document: DocumentFile<any>;
  private _useASTAsContent: boolean;
  private _childController: EntityBodyController;

  constructor(source: CSSRootExpression) {
    super(source);
    source.observe(new WrapBus(this.onSourceAction.bind(this)));
    this._childController = new EntityBodyController(this);
  }

  async evaluate(context: any) {
    await super.evaluate(context);
    await this._childController.evaluate(context);
    this.content = await this.loadCSS(context);
    CSSStylesheetsDependency.getInstance(context.dependencies).addStyleSheet(this);
  }

  async loadCSS(context) {
    // slight optimization -- if the ast is modified, then we want to use that
    // for the HTML document, otherwise we want to go the faster rought and use the document content
    return this._useASTAsContent ? this.source.toString() : this.document.content;
  }

  getInitialMetadata() {
    return Object.assign(super.getInitialMetadata(), {
      [MetadataKeys.HIDDEN]: true
    });
  }

  protected onSourceAction(action: Action) {
    this._useASTAsContent = true;
  }

  cloneLeaf() {
    const clone = new CSSRootEntity(this.source);
    clone.content = this.content;
    clone.context = this.context;
    return clone;
  }
}