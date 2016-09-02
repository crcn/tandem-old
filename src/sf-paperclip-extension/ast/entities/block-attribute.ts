import { HTMLElementEntity } from "sf-html-extension/ast";
import { PCBlockAttributeExpression } from "sf-paperclip-extension/ast/expressions";
import { parseBlockScript } from "./utils";
import { EntityFactoryDependency } from "sf-core/dependencies";
import { IContextualEntity, IEntityDocument, BaseEntity, EntityMetadata, getContext } from "sf-core/ast";

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
      this.value = this._script(getContext(this.parent));
    } catch (e) {
      this.value = ""; // this.source.toString();
    }
  }

  cloneLeaf() {
    return new BlockAttributeValueEntity(this.source);
  }
}

export const pcBlockAttributeValueEntityDependency = new EntityFactoryDependency(PCBlockAttributeExpression, BlockAttributeValueEntity);