import { getContext } from "./utils";
import { IPCEntity } from "./base";
import { parsePC } from "sf-paperclip-extension/ast";
import { Node as MarkupNode } from "sf-core/markup";
import { PCBlockNodeExpression } from "sf-paperclip-extension/ast/expressions";
import { EntityFactoryDependency } from "sf-core/dependencies";
import { GroupNodeSection, IDOMSection } from "sf-html-extension/dom";
import { HTMLContainerEntity, BaseHTMLContainerEntity, HTMLTextEntity, HTMLTextExpression, HTMLValueNodeEntity, HTMLExpression, IHTMLEntity } from "sf-html-extension/ast";
import { INodeEntity, EntityMetadata, IContainerNodeEntity, IEntity, IValueNodeEntity } from "sf-core/ast";

export class PCBlockNodeEntity extends BaseHTMLContainerEntity<PCBlockNodeExpression> implements IValueNodeEntity  {
  private _script: Function;
  public value: any;
  public source: PCBlockNodeExpression;
  public error: Error;

  constructor(source: PCBlockNodeExpression) {
    super("#block", source);
    this.willSourceChange(source);
  }

  protected willSourceChange(source: PCBlockNodeExpression) {
    try {
      this._script = new Function("context", `with(context) { return (${source.value}); }`);
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
      if (item instanceof MarkupNode) {
        this.appendChild((<MarkupNode>item).clone());
      } else {
        const child = EntityFactoryDependency.createEntityFromSource(parsePC(String(item)), this._dependencies);
        this.appendChild(child);
        await child.load();
      }
    }
  }

  _clone() {
    return new PCBlockNodeEntity(this.source);
  }
}

export const bcBlockNodeEntityDependency = new EntityFactoryDependency("#block", PCBlockNodeEntity);