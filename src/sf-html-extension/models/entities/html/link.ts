// import { File } from "sf-common/models";
import * as path from "path";
import { IActor } from "sf-core/actors";
import { inject } from "sf-core/decorators";
import { NodeSection } from "sf-core/markup/section";
import { DocumentFile } from "sf-front-end/models";
import { ReadFileAction } from "sf-core/actions";
import { IContainerNode } from "sf-core/markup";
import { HTMLElementEntity } from "./element";
import { HTMLElementExpression } from "sf-html-extension/parsers/html";
import { EntityFactoryDependency } from "sf-core/dependencies";
import { DocumentPaneComponentFactoryDependency } from "sf-front-end/dependencies";
import { ActiveRecordFactoryDependency, MAIN_BUS_NS } from "sf-core/dependencies";

// TODO
export class LinkEntity extends HTMLElementEntity {
  readonly type = "element";
  private _file: DocumentFile<any>;

  @inject(MAIN_BUS_NS)
  private _bus: IActor;

  async load() {
    const type = this.source.getAttribute("type");
    const { value } = await this._bus.execute(new ReadFileAction(path.join("/Users/crcn/Desktop/test.css"))).read();
    const fileFactory = ActiveRecordFactoryDependency.find(type, this._dependencies);
    this._file = fileFactory.create("linkFiles", value);
    return super.load();
  }
  createSection() {
    return new NodeSection(<IContainerNode><any>document.createElement("link"));
  }
  cloneNode() {
    return new LinkEntity(this.source);
  }
}


export const linkEntityDependency  = new EntityFactoryDependency("link", LinkEntity);

