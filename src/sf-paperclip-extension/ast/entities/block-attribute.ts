import { HTMLElementEntity } from "sf-html-extension/ast";
import { PCBlockExpression } from "sf-paperclip-extension/ast";
import { ElementAttributeValueEntity } from "sf-core/dependencies";
import { parseBlockScript } from "./utils";
import { IContextualEntity, IEntityDocument, BaseEntity, EntityMetadata, getContext } from "sf-core/ast";

export class BlockAttributeValueEntity extends BaseEntity<PCBlockExpression> {
  public value: any;
  private _script: Function;
  public document: IEntityDocument;
  public metadata: EntityMetadata = new EntityMetadata(this);

  constructor(readonly source: PCBlockExpression, readonly element: IContextualEntity) {
    super(source);
    this.document = element.document;
    try {
      this._script = parseBlockScript(source.value);
    } catch (e) {
      if (!process.env.TESTING) {
        console.error(e.stack);
      }
    }
  }

  async load() {
    try {
      this.value = this._script(getContext(this.element));
    } catch (e) {
      this.value = ""; // this.source.toString();
    }
  }

  cloneLeaf() {
    return new BlockAttributeValueEntity(this.source, this.element);
  }
}

export const pcBlockAttributeValueEntityDependency = new ElementAttributeValueEntity("attributeBlock", BlockAttributeValueEntity);