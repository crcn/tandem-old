// import { File } from "tandem-common/models";
import { WrapBus } from "mesh";
import * as path from "path";
import { Response } from "mesh";
import { DocumentFile } from "tandem-front-end/models";
import { MetadataKeys } from "tandem-front-end/constants";
import { GroupNodeSection } from "tandem-html-extension/dom";
import { HTMLElementEntity } from "./element";
import { FileFactoryDependency, MAIN_BUS_NS } from "tandem-common/dependencies";
import { DocumentPaneComponentFactoryDependency } from "tandem-front-end/dependencies";
import { HTMLElementExpression, HTMLDocumentRootEntity } from "tandem-html-extension/ast";

import {
  File,
  IActor,
  inject,
  Action,
  BubbleBus,
  EntityAction,
  EntityRuntimeAction,
  EntityFactoryDependency,
} from "tandem-common";

// TODO
export class LinkEntity extends HTMLElementEntity {
  readonly type = "element";
  private _file: DocumentFile<any>;

  @inject(MAIN_BUS_NS)
  private _bus: IActor;

  onRemoved() {
    this._file.dispose();
  }

  get documentChildren() {
    return this._file.entity.children;
  }

  getInitialMetadata() {
    return Object.assign(super.getInitialMetadata(), {
      [MetadataKeys.CHILD_LAYER_PROPERTY]: "documentChildren"
    });
  }

  get href() {
    return path.join(
      path.dirname(this.document.path),
      this.source.getAttribute("href")
    );
  }

  mapContext(context) {
    context.a = 1234;
    return context;
  }

  onEvaluated() {
    this.context.dependencies = this._file.entity.context.dependencies;
  }

  async load() {

    const type = this.source.getAttribute("type");

    if (!type) {
      throw new Error(`type property is missing from link entity`);
    }

    this._file = await File.open(this.href, this.dependencies, type) as DocumentFile<any>;
    this._file.sync();

    this._file.owner = this.document;

    await this._file.load();
    this._file.observe(new BubbleBus(this));
    this.appendChild(this._file.entity);

    return super.load();
  }

  createSection() {
    return new GroupNodeSection();
  }
  cloneNode() {
    return new LinkEntity(this.source);
  }

  dispose() {
    if (this._file) {
      this._file.dispose();
    }
  }
}

export const linkEntityDependency  = new EntityFactoryDependency(HTMLElementExpression, LinkEntity, "link");

