import { parsePC } from "tandem-paperclip-extension/ast";
import { MetadataKeys } from "tandem-front-end/constants";
import { parseBlockScript } from "./utils";
import { PCBlockNodeExpression } from "tandem-paperclip-extension/ast/expressions";

import {
  IEntity,
  TreeNode,
  Injector,
  getContext,
  BaseEntity,
  IValueEntity,
  EntityFactoryDependency
} from "tandem-common";

import {
  IDOMSection,
  HTMLNodeEntity,
  HTMLTextEntity,
  HTMLExpression,
  IHTMLNodeEntity,
  GroupNodeSection,
  HTMLTextExpression,
  HTMLNodeExpression,
  HTMLValueNodeEntity,
  HTMLAttributeEntity,
  HTMLAttributeExpression,
} from "tandem-html-extension";

export class PCBlockNodeEntity extends HTMLNodeEntity<PCBlockNodeExpression> implements IValueEntity  {
  private _script: Function;
  private _sourceParent: TreeNode<HTMLNodeExpression>;
  private _executed: boolean;
  public value: any;
  public source: PCBlockNodeExpression;
  public error: Error;

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

  get context() {
    return getContext(this);
  }

  async load() {
    let value;
    let scriptExecuted = false;

    if (this.error) {
      value = `Syntax Error: ${this.error.message}`;
    } else {
      try {
        value = this._script(this.context);
        scriptExecuted = true;
      } catch (e) {
        value = this.source.toString();
      }
    }
    this._executed = scriptExecuted;
    this.value = value;
    if (!scriptExecuted) return;

    for (const item of Array.isArray(value) ? value : [value]) {
      if (item instanceof BaseEntity) {

        // a bit of a hack, but we need a container for the attribute -- closest
        // thing is to re-use the HTML Text entity. This way any changes to the item
        // source get reflected back to the attribute it came from
        if (item instanceof HTMLAttributeEntity) {
          this.appendChild(Injector.inject(new HTMLTextEntity(item.source), this.dependencies));
        } else {
          this.appendChild(item.clone());
        }
      } else {
        await this.loadExpressionAndAppendChild(parsePC(String(item)));
      }
    }
  }

  cloneLeaf() {
    return new PCBlockNodeEntity(this.source);
  }
}

export const pcBlockNodeEntityDependency = new EntityFactoryDependency(PCBlockNodeExpression, PCBlockNodeEntity);