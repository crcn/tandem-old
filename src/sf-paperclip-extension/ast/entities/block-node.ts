import { parsePC } from "sf-paperclip-extension/ast";
import { IPCEntity } from "./base";
import { MetadataKeys } from "sf-front-end/constants";
import { parseBlockScript } from "./utils";
import { PCBlockExpression } from "sf-paperclip-extension/ast/expressions";
import { Node as MarkupNode } from "sf-core/markup";
import { EntityFactoryDependency } from "sf-core/dependencies";
import { GroupNodeSection, IDOMSection } from "sf-html-extension/dom";
import { INodeEntity, EntityMetadata, IContainerNodeEntity, IEntity, IValueNodeEntity, getContext } from "sf-core/ast";
import { HTMLContainerEntity, HTMLTextEntity, HTMLTextExpression, HTMLValueNodeEntity, HTMLExpression, IHTMLEntity } from "sf-html-extension/ast";


export class PCBlockNodeEntity extends HTMLContainerEntity<PCBlockExpression> implements IValueNodeEntity  {
  private _script: Function;
  public value: any;
  public source: PCBlockExpression;
  public error: Error;

  constructor(source: PCBlockExpression) {
    super(source);
    this.willSourceChange(source);
  }

  getInitialMetadata() {
    return Object.assign(super.getInitialMetadata(), {
      [MetadataKeys.HIDDEN]: true
    });
  }

  protected willSourceChange(source: PCBlockExpression) {
    try {
      this._script = parseBlockScript(source.value);
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
    const clone = new PCBlockNodeEntity(this.source);
    this.cloneChildrenToContainerNode(clone);
    return clone;
  }
}

export const pcBlockNodeEntityDependency = new EntityFactoryDependency("#block", PCBlockNodeEntity);