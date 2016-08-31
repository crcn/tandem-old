// import { File } from "sf-common/models";
import * as path from "path";
import { IActor } from "sf-core/actors";
import { inject } from "sf-core/decorators";
import { Response } from "mesh";
import { DocumentFile } from "sf-front-end/models";
import { IContainerNode } from "sf-core/markup";
import { GroupNodeSection } from "sf-html-extension/dom";
import { HTMLElementEntity } from "./element";
import { EntityFactoryDependency } from "sf-core/dependencies";
import { ReadFileAction, WatchFileAction } from "sf-core/actions";
import { DocumentPaneComponentFactoryDependency } from "sf-front-end/dependencies";
import { HTMLElementExpression, HTMLDocumentRootEntity } from "sf-html-extension/ast";
import { ActiveRecordFactoryDependency, MAIN_BUS_NS } from "sf-core/dependencies";

// TODO
export class LinkEntity extends HTMLElementEntity {
  readonly type = "element";
  private _file: DocumentFile<any>;

  @inject(MAIN_BUS_NS)
  private _bus: IActor;
  private _watcher: Response;

  patch(entity: LinkEntity) {
    entity._unwatch();
  }

  willUnmount() {
    this._unwatch();
  }

  get href() {
    return path.join(
      path.dirname(this.document.path),
      this.source.getAttribute("href")
    );
  }

  update() {
    this._watch();
  }

  didMount() {
    this._watch();
  }

  async load() {
    const type = this.source.getAttribute("type");
    const { value } = await this._bus.execute(new ReadFileAction(this.href)).read();
    const fileFactory = ActiveRecordFactoryDependency.find(type, this._dependencies);
    this._file = fileFactory.create("linkFiles", value);
    await this._file.load();
    this.appendChild(this._file.entity);
    return super.load();
  }

  createSection() {
    return new GroupNodeSection();
  }
  cloneNode() {
    return new LinkEntity(this.source);
  }

  private _unwatch() {
    if (this._watcher) {
      this._watcher.cancel();
      this._watcher = undefined;
    }
  }

  private _watch() {
    this._unwatch();
    this._watcher = this._bus.execute(new WatchFileAction(this.href));
    this._watcher.pipeTo({
      close: () => { },
      abort: () => { },
      write: (value) =>  {
        // reload the entire document since other entities
        // may be affected
        this.document.update();
      }
    });
  }
}

export const linkEntityDependency  = new EntityFactoryDependency("link", LinkEntity);

