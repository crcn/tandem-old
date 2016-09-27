import { SymbolTable } from "../core";
import { SyntheticNode } from "../dom";
import { TreeNode, Dependencies } from "tandem-common";

/**
 */

export abstract class BaseComponent<T extends SyntheticNode>  extends TreeNode<BaseComponent<any>> {

  private _evaluated: boolean;

  constructor(readonly target: T, protected _dependencies: Dependencies) {
    super();
  }

  async evaluate(context: SymbolTable) {
    if (this._evaluated) {
      await this.update(context);
    } else {
      this._evaluated = true;
      await this.load(context);
    }
  }

  abstract get innerHTML(): string;

  async update(context: SymbolTable) {
    // overrride me
  }

  async load(context: SymbolTable) {
    // override me
  }
}
