import { HTMLElementEntity } from "@tandem/html-extension/lang";
import { PCBlockAttributeExpression } from "@tandem/paperclip-extension/lang/ast";
import { parseBlockScript } from "./utils";
import { EntityFactoryDependency } from "@tandem/common/dependencies";
import { IEntityDocument, BaseEntity, EntityMetadata, getContext } from "@tandem/common/lang";

export class BlockAttributeValueEntity extends BaseEntity<PCBlockAttributeExpression> {
  public value: any;
  private _script: Function;

  constructor(source: PCBlockAttributeExpression) {
    super(source);
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
      this.value = this._script(this.context);
    } catch (e) {
      this.value = ""; // this.source.toString();
    }
  }

  cloneLeaf() {
    return new BlockAttributeValueEntity(this.source);
  }
}

export const pcBlockAttributeValueEntityDependency = new EntityFactoryDependency(PCBlockAttributeExpression, BlockAttributeValueEntity);