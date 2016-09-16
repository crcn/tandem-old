import { MimeTypes } from "tandem-html-extension/constants";
import { MetadataKeys } from "tandem-front-end/constants";
import { DocumentFile } from "tandem-front-end/models";
import { GroupNodeSection } from "tandem-html-extension/dom";
import * as path from "path";
import { HTMLElementEntity } from "./element";
import { CSSStylesheetsDependency } from "tandem-html-extension/dependencies";
import { HTMLElementExpression, HTMLTextExpression } from "tandem-html-extension/ast/html/expressions";
import {
  File,
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
export class HTMLImportEntity extends HTMLElementEntity {

  public defaultMimeType: string;

  private _file: DocumentFile<any>;

  private _contentWatcher: IDisposable;
  private _fileWatcher: IDisposable;

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

    const type = this.getAttribute("type") || this.defaultMimeType;
    let href = this.getAttribute("href");

    // check for relative path
    if (href && !/^(\/\/|http)/.test(href)) {
      href = path.join(
        path.dirname(this.document.path),
        href
      );
    }

    console.log(type, href);

    let file: DocumentFile<any>;

    if (href) {
      file = await File.open(href, this.dependencies, type) as DocumentFile<any>;
      file.sync();
    } else if (valueSourceNode) {
      const fileFactory = FileFactoryDependency.find(type, this.dependencies);
      file = fileFactory.create({
        content: valueSourceNode.value,
        path: this.document.path
      });
      file.autoSave = false;
      file.offset = valueSourceNode.position.start;
    }

    await file.load();
    file.owner = this.document;
    this.file = file;

    this.appendChild(file.entity);
  }

  @patchable
  get file(): DocumentFile<any> {
    return this._file;
  }

  set file(value: DocumentFile<any>) {
    if (this._contentWatcher) {
      this._file.dispose();
      this._contentWatcher.dispose();
    }

    this._file = value;

    if (value && this.source.children.length) {
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

class HTMLStyleEntity extends HTMLImportEntity {
  defaultMimeType = MimeTypes.CSS;
}

export const htmlStyleEntityDependency = [
  new EntityFactoryDependency(HTMLElementExpression, HTMLStyleEntity, "style"),
  new EntityFactoryDependency(HTMLElementExpression, HTMLImportEntity, "link")
];