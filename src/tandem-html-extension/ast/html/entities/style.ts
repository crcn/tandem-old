import { MimeTypes } from "tandem-html-extension/constants";
import { MetadataKeys } from "tandem-front-end/constants";
import { DocumentFile } from "tandem-front-end/models";
import { GroupNodeSection } from "tandem-html-extension/dom";
import { HTMLElementEntity } from "./element";
import { CSSStylesheetsDependency } from "tandem-html-extension/dependencies";
import { HTMLElementExpression, HTMLTextExpression } from "tandem-html-extension/ast/html/expressions";
import {
  inject,
  BubbleBus,
  patchable,
  BaseEntity,
  IDisposable,
  bindProperty,
  watchProperty,
  patchTreeNode,
  FileFactoryDependency,
  EntityFactoryDependency,
} from "tandem-common";

// TODO - merge this with link.ts
export class HTMLStyleEntity extends HTMLElementEntity {

  private _file: DocumentFile<any>;

  private _contentWatcher: IDisposable;

  mapSourceChildren() {
    return this.source.attributes;
  }

  get rootChild() {
    return this.children.find((child) => child instanceof this._file.entity.constructor);
  }

  get documentChildren() {
    return this.rootChild ? this.rootChild.children : [];
  }

  getInitialMetadata() {
    return Object.assign(super.getInitialMetadata(), {
      [MetadataKeys.CHILD_LAYER_PROPERTY]: "documentChildren"
    });
  }

  mapContext() {
    return Object.assign({}, this.context, {
      dependencies: this.rootChild ? this.rootChild.context.dependencies : this.dependencies
    });
  }

  async load() {
    await super.load();
    const valueSourceNode = this.source.children[0] as HTMLTextExpression;

    // may be a blank style
    if (!valueSourceNode) return;

    const type = this.getAttribute("type");
    const fileFactory = FileFactoryDependency.find(type || MimeTypes.CSS, this.dependencies);
    const file = fileFactory.create({
      content: valueSourceNode.value,
      path: this.document.path
    }) as DocumentFile<any>;

    file.autoSave = false;
    file.offset = valueSourceNode.position.start;
    file.owner = this.document;

    await file.load();
    this.file = file;

    this.appendChild(file.entity);
  }

  @patchable
  get file(): DocumentFile<any> {
    return this._file;
  }

  set file(value: DocumentFile<any>) {
    if (this._contentWatcher) {
      this._contentWatcher.dispose();
    }

    this._file = value;

    if (value) {
      this._contentWatcher = watchProperty(value, "content", (content) => {
        (<HTMLTextExpression>this.source.children[0]).value = content;
      });
    }
  }

  async update() {
    await this.reload();
  }

  dispose() {
    if (this._contentWatcher) {
      this._contentWatcher.dispose();
      this._contentWatcher = undefined;
    }
  }

  createSection() {
    return new GroupNodeSection();
  }
}

export const htmlStyleEntityDependency = new EntityFactoryDependency(HTMLElementExpression, HTMLStyleEntity, "style");