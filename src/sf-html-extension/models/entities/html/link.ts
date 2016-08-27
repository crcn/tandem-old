import { NodeSection } from "sf-core/markup/section";
import { HTMLElementEntity } from "./element";
import { EntityFactoryDependency } from "sf-core/dependencies";
import { DocumentPaneComponentFactoryDependency } from "sf-front-end/dependencies";
import { HTMLElementExpression } from "sf-html-extension/parsers/html";
import { IContainerNode } from "sf-core/markup";

// TODO
export class LinkEntity extends HTMLElementEntity {
  readonly type = "element";

  async load() {
    const type = this.source.getAttribute("type");
    console.log(type);
    // this._file = this._dependencies.query<
    // this.appendChild(this._file.document.root);
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

