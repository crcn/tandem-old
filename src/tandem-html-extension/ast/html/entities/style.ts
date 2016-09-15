import { MimeTypes } from "tandem-html-extension/constants";
import { MetadataKeys } from "tandem-front-end/constants";
import { DocumentFile } from "tandem-front-end/models";
import { GroupNodeSection } from "tandem-html-extension/dom";
import { HTMLElementEntity } from "./element";
import { CSSStylesheetsDependency } from "tandem-html-extension/dependencies";
import { HTMLElementExpression, HTMLTextExpression } from "tandem-html-extension/ast";
import {
  patchable,
  inject,
  watchProperty,
  bindProperty,
  EntityFactoryDependency,
  FileFactoryDependency,
  patchTreeNode,
  BubbleBus
} from "tandem-common";

// TODO - merge this with link.ts
export class HTMLStyleEntity extends HTMLElementEntity {

  @patchable
  private _file: DocumentFile<any>;

  mapSourceChildren() {
    return this.source.attributes;
  }

  get documentChildren() {
    return this._file.entity.children;
  }

  getInitialMetadata() {
    return Object.assign(super.getInitialMetadata(), {
      [MetadataKeys.CHILD_LAYER_PROPERTY]: "documentChildren"
    });
  }

  mapContext() {
    return Object.assign({}, this.context, {
      dependencies: this._file ? this._file.entity.context.dependencies : this.dependencies
    });
  }

  async load() {
    await super.load();
    const valueSourceNode = this.source.children[0] as HTMLTextExpression;

    // may be a blank style
    if (!valueSourceNode) return;

    const type = this.getAttribute("type");
    const fileFactory = FileFactoryDependency.find(type || MimeTypes.CSS, this.dependencies);
    const file = this._file = fileFactory.create({
      content: valueSourceNode.value,
      path: this.document.path
    }) as DocumentFile<any>;

    file.autoSave = false;
    file.offset = valueSourceNode.position.start;
    file.owner = this.document;

    await file.load();
    watchProperty(file, "content", (content) => {
      (<HTMLTextExpression>this.source.children[0]).value = content;
    });

    // bindProperty(file, "content", valueSourceNode, "value");
    this.appendChild(file.entity);
  }

  async update() {
    const clone = this.cloneLeaf();
    this.context = await clone.evaluate(this.context);
    patchTreeNode(this, clone);
  }

  createSection() {
    return new GroupNodeSection();
  }
}

export const htmlStyleEntityDependency = new EntityFactoryDependency(HTMLElementExpression, HTMLStyleEntity, "style");