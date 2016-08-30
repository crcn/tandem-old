import { getContext } from "./utils";
import { IPCEntity } from "./base";
import { GroupNodeSection } from "sf-html-extension/dom";
import { Node as MarkupNode } from "sf-core/markup";
import { PCBlockNodeExpression } from "sf-paperclip-extension/ast/expressions";
import { EntityFactoryDependency } from "sf-core/dependencies";
import { HTMLContainerEntity, HTMLValueNodeEntity, IHTMLEntity } from "sf-html-extension/ast";
import { INodeEntity, EntityMetadata, IContainerNodeEntity, IEntity } from "sf-core/ast";

export class PCBlockNodeEntity extends HTMLValueNodeEntity<PCBlockNodeExpression> implements IPCEntity {
  public section: GroupNodeSection;
  private _script: Function;

  constructor(source: PCBlockNodeExpression) {
    super(source);
    this.willSourceChange(source);
  }

  protected willSourceChange(source: PCBlockNodeExpression) {
    this._script = new Function("context", `with(context) { return ${source.value}; }`);
  }

  createSection() {
    return new GroupNodeSection();
  }

  update() {
  }

  get context() {
    return getContext(this);
  }

  load() {
    // TODO - get context here
    let value;

    try {
      value = this._script(this.context);
    } catch (e) {
      if (!process.env.TESTING) {
        console.error(e.stack);
      }
    }

    this.value = value;


    this.section.removeChildren();

    if (value instanceof Node) {
      this.section.appendChild(value);
    } else if (value instanceof MarkupNode && value.section) {
      this.section.appendChild(value.section.toFragment());
    } else {
      this.section.appendChild(document.createTextNode(String(value)));
    }
  }

  clone() {
    return new PCBlockNodeEntity(this.source);
  }
}

export const bcBlockNodeEntityDependency = new EntityFactoryDependency("#block", PCBlockNodeEntity);