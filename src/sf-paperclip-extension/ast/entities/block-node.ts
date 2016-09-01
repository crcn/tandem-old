import { parsePC } from "sf-paperclip-extension/ast";
import { MetadataKeys } from "sf-front-end/constants";
import { parseBlockScript } from "./utils";
import { PCBlockExpression } from "sf-paperclip-extension/ast/expressions";
import { EntityFactoryDependency } from "sf-core/dependencies";
import { GroupNodeSection, IDOMSection } from "sf-html-extension/dom";
import { BaseEntity, IEntity, IValueEntity, getContext } from "sf-core/ast";
import { HTMLNodeEntity, HTMLTextEntity, HTMLTextExpression, HTMLValueNodeEntity, HTMLExpression, IHTMLEntity } from "sf-html-extension/ast";

export class PCBlockNodeEntity extends HTMLNodeEntity<PCBlockExpression> implements IValueEntity  {
  private _script: Function;
  public value: any;
  public source: PCBlockExpression;
  public error: Error;


  getInitialMetadata() {
    return Object.assign(super.getInitialMetadata(), {
      [MetadataKeys.HIDDEN]: true
    });
  }

  protected updateFromSource() {
    try {
      this._script = parseBlockScript(this.source.value);
    } catch (e) {
      this.error = e;
    }
  }

  createSection() {
    return new GroupNodeSection();
  }

  patch(source: PCBlockNodeEntity) {
    super.patch(source);
  }

  get context() {
    return getContext(this);
  }

  async load() {
    let value;

    if (this.error) {
      return this.appendChild(new HTMLTextEntity(new HTMLTextExpression(`Syntax Error: ${this.error.message}`, null)));
    } else {
      try {
        value = this._script(this.context);
      } catch (e) {
        return this.appendChild(new HTMLTextEntity(new HTMLTextExpression(this.source.toString(), this.source.position)));
      }
    }

    this.value = value;

    for (const item of Array.isArray(value) ? value : [value]) {
      if (item instanceof BaseEntity) {
        this.appendChild(item.clone());
      } else {
        const child = EntityFactoryDependency.createEntityFromSource(parsePC(String(item)), this._dependencies);
        this.appendChild(child);
        await child.load();
      }
    }
  }

  cloneLeaf() {
    return new PCBlockNodeEntity(this.source);
  }
}

export const pcBlockNodeEntityDependency = new EntityFactoryDependency("#block", PCBlockNodeEntity);