import { INamed } from "sf-core/object";
import { inject } from "sf-core/decorators";
import { HTMLFile } from "sf-html-extension/models/html-file";
import { BubbleBus } from "sf-core/busses";
import { DocumentFile } from "sf-front-end/models";
import { watchProperty } from "sf-core/observable";
import { parse as parseCSS } from "sf-html-extension/parsers/css";
import { parse as parseHTML } from "sf-html-extension/parsers/html";
import { EntityFactoryDependency } from "sf-core/dependencies";
import { Action, PropertyChangeAction } from "sf-core/actions";
import { Dependencies, DEPENDENCIES_NS, IInjectable } from "sf-core/dependencies";
import { CSSStyleExpression, CSSStyleSheetExpression } from "sf-html-extension/parsers/css";
import { IHTMLEntity, IHTMLDocument, IHTMLContainerEntity } from "./base";
import {
  IEntity,
  IVisibleEntity,
  IElementEntity,
  findEntitiesBySource,
} from "sf-core/entities";

import {
  HTMLExpression,
  HTMLTextExpression,
  HTMLCommentExpression,
  HTMLElementExpression,
  HTMLFragmentExpression,
  HTMLAttributeExpression,
  IHTMLValueNodeExpression,
} from "sf-html-extension/parsers/html";

import { ContainerNode, INode, IContainerNode } from "sf-core/markup";

export class HTMLDocumentEntity extends ContainerNode implements IHTMLDocument, IInjectable {

  readonly stylesheet: CSSStyleSheetExpression = new CSSStyleSheetExpression([], null);

  /**
   * The source content of this document
   */

  private _root: IHTMLContainerEntity;
  private _source: string;
  private _rootExpression: HTMLFragmentExpression;

  /**
   * Creates an instance of HTMLDocumentEntity.
   *
   * @param {any} [readonly=file] the source file
   * @param {any} HTMLFile
   */

  constructor(readonly file: DocumentFile, readonly dependencies: Dependencies) {
    super();
    watchProperty(file, "content", this._onFileContentChange).trigger();
  }

  cloneNode(deep?: boolean) {
    const clone = new HTMLDocumentEntity(this.file, this.dependencies);
    if (deep)
    for (const child of this.childNodes) {
      clone.appendChild(<IHTMLEntity>child.cloneNode(true));
    }
    return clone;
  }

  didInject() { }

  get root(): IHTMLContainerEntity {
    return this._root;
  }

  _unlink(child: IHTMLEntity) {
    super._unlink(child);
    child.document = undefined;
  }

  _link(child: IHTMLEntity) {
    super._unlink(child);
    child.document = this;
  }

  async update() {

    // need to sync the entities first so that changes
    // reflect back on the source
    await this.root.update();

    await this._render();
  }

  public async load(source: string) {
    this._source = source;
    this._rootExpression = parseHTML(source);
    await this._render();
  }

  private _onFileContentChange = async (content: string) => {
    if (content == null) return;
    await this.load(content);
    this.root.update();
  }

  private async _render() {
    const root = <IHTMLContainerEntity>(await this._loadEntity(this._rootExpression));

    const oldRoot = this._root;
    if (this._root) {
      this._root.patch(root);
    } else {
      this._root = root;
      this.appendChild(this._root);
      this._root.observe(new BubbleBus(this));
    }
    this._root.document = this;

    this.notify(new PropertyChangeAction("root", this._root, oldRoot));
  }

  private async _loadEntity(source: INamed): Promise<INode> {
    const entity = EntityFactoryDependency.createEntityFromSource(source, this.dependencies);
    await entity.load();
    return entity;
  }
}

