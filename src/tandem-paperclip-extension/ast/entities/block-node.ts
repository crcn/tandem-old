import { parsePC } from "tandem-paperclip-extension/ast";
import { TreeNode } from "tandem-common/tree";
import { MetadataKeys } from "tandem-front-end/constants";
import { parseBlockScript } from "./utils";
import { PCBlockNodeExpression } from "tandem-paperclip-extension/ast/expressions";
import { EntityFactoryDependency } from "tandem-common/dependencies";
import { GroupNodeSection, IDOMSection } from "tandem-html-extension/dom";
import { BaseEntity, IEntity, IValueEntity, getContext } from "tandem-common/ast";
import { HTMLNodeEntity, HTMLTextEntity, HTMLTextExpression, HTMLNodeExpression, HTMLValueNodeEntity, HTMLExpression, IHTMLNodeEntity } from "tandem-html-extension/ast";

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
        this.appendChild(item.clone());
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