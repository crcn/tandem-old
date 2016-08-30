import { HTMLElementEntity } from "sf-html-extension/ast";
import { PCBlockExpression } from "sf-paperclip-extension/ast";
import { ElementAttributeValueEntity } from "sf-core/dependencies";
import { parseBlockScript } from "./utils";
import { IContextualEntity, IEntity, IEntityDocument, EntityMetadata, getContext } from "sf-core/ast";

export class BlockAttributeValueEntity implements IEntity {
  parent: IEntity;
  public value: any;
  private _script: Function;
  public document: IEntityDocument;
  public metadata: EntityMetadata = new EntityMetadata(this);

  constructor(readonly source: PCBlockExpression, readonly element: IContextualEntity) {
    this.document = element.document;
    this.parent = element;
    try {
      this._script = parseBlockScript(source.value);
    } catch (e) {
      if (!process.env.TESTING) {
        console.error(e.stack);
      }
    }
  }

  update() {

  }

  patch() {

  }

  flatten() {
    return [this];
  }

  dispose() { }

  load() {
    try {
      this.value = this._script(getContext(this.element));
    } catch (e) {
      this.value = ""; // this.source.toString();
    }
  }
}

export const pcBlockAttributeValueEntityDependency = new ElementAttributeValueEntity("attributeBlock", BlockAttributeValueEntity);