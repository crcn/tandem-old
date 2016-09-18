import * as path from "path";
import { MimeTypes } from "tandem-html-extension/constants";
import { MetadataKeys } from "tandem-front-end/constants";
import { DocumentFile } from "tandem-front-end/models";
import { GroupNodeSection } from "tandem-html-extension/dom";
import { HTMLElementEntity } from "./element";
import { CSSStylesheetsDependency } from "tandem-html-extension/dependencies";
import { HTMLElementExpression, HTMLTextExpression } from "tandem-html-extension/ast/html/expressions";
import {
  File,
  inject,
  BubbleBus,
  patchable,
  BaseEntity,
  Dependency,
  IDisposable,
  bindProperty,
  Dependencies,
  watchProperty,
  patchTreeNode,
  FileFactoryDependency,
  EntityFactoryDependency,
} from "tandem-common";

// TODO - move all of this to EntityImportController

class ImportedFileDependency extends Dependency<string> {
  static IMPORTED_FILES_NS = "importedFiles";
  constructor(value: string) {
    super(ImportedFileDependency.getNamespace(value), value, true);
  }

  static getNamespace(value: string) {
    return [this.IMPORTED_FILES_NS, value].join("/");
  }

  static find(value: string, dependencies: Dependencies) {
    return dependencies.query<ImportedFileDependency>(this.getNamespace(value));
  }
}

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
    return this._file ? this.children.find((child) => child instanceof this._file.entity.constructor) : undefined;
  }

  get documentChildren() {
    return this.rootChild ? this.rootChild.children : [];
  }


  getInitialMetadata() {
    return Object.assign(super.getInitialMetadata(), {
      [MetadataKeys.CHILD_LAYER_PROPERTY]: "documentChildren"
    });
  }

  async evaluate(context: any) {
    await super.evaluate(context);
    const href = this.getAttribute("href");

    if (href) {
      context.dependencies.register(new ImportedFileDependency(href));
    }
  }

  async load() {
    await super.load();
    let href = this.getAttribute("href");

    if (ImportedFileDependency.find(href, this.dependencies)) {
      return;
    }

    const valueSourceNode = this.source.children[0] as HTMLTextExpression;

    const type = this.getAttribute("type") || this.defaultMimeType;

    // check for relative path
    if (href && !/^(\/\/|http)/.test(href)) {
      href = path.join(
        path.dirname(this.document.path),
        href
      );
    }

    let file: DocumentFile<any>;

    if (href) {
      try {
        file = await File.open(href, this.dependencies, type) as DocumentFile<any>;
      } catch (e) {

        // does not exist
        console.error(e.stack);
        return null;
      }

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

    // need to pass down context here so that anything defined in the document
    // is also passed to this document.

    if (file) {
      file.context = this.context;
      await file.load();
      file.owner = this.document;
      this.file = file;
      this.appendChild(file.entity);
    }
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
    if (this._dirty) await this.reload();
  }

  dispose() {
    super.dispose();
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