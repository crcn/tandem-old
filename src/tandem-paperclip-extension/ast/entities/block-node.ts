import { parsePC } from "tandem-paperclip-extension/ast";
import { MetadataKeys } from "tandem-front-end/constants";
import { parseBlockScript } from "./utils";
import { PCBlockNodeExpression } from "tandem-paperclip-extension/ast/expressions";

import {
  IEntity,
  TreeNode,
  Injector,
  BaseEntity,
  IValueEntity,
  patchTreeNode,
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
  private _executed: boolean;
  public value: any;
  public source: PCBlockNodeExpression;
  public error: Error;

  createSection() {
    return new GroupNodeSection();
  }

  async load() {
    let value;
    let scriptExecuted = false;

    let error: Error;
    let execute: Function;
    try {
      execute = parseBlockScript(this.source.value);
    } catch (e) {
      error = e;
    }

    if (error) {
      value = `Syntax Error: ${error.message}`;
    } else {
      try {
        value = execute(this.context);
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
          const entity = new HTMLTextEntity(item.source);
          this.appendChild(entity);
          await entity.evaluate(this.context);
        } else {
          this.appendChild(item.clone());
        }
      } else {
        await this.loadExpressionAndAppendChild(parsePC(String(item)));
      }
    }
  }

  async update() {
    await this.reload();
  }

  cloneLeaf() {
    return new PCBlockNodeEntity(this.source);
  }
}

export const pcBlockNodeEntityDependency = new EntityFactoryDependency(PCBlockNodeExpression, PCBlockNodeEntity);