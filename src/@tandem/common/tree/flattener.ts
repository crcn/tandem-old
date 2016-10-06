import { WrapBus } from "mesh";
import { TreeNode } from "./core";
import { TreeNodeAction } from "./actions";

export class TreeNodeFlattener {

  private _flattenedChildren: TreeNode<any>[];
  private _target: TreeNode<any>;
  private _observer: WrapBus;

  constructor(target: TreeNode<any>) {
    this._target = target;
    target.observe(new WrapBus(this.onTargetAction.bind(this)));
  }

  get flattenedChildren() {
    return this._flattenedChildren || (this._flattenedChildren = this._flattenChildren(this._target));
  }

  private _flattenChildren(target: TreeNode<any>, allChildren: TreeNode<any>[] = []): TreeNode<any>[] {
    allChildren.push(target);
    for (const child of target.children) {
      this._flattenChildren(child, allChildren);
    }
    return allChildren;
  }

  protected onTargetAction(action: TreeNodeAction) {
    if (action.type === TreeNodeAction.NODE_ADDED || action.type === TreeNodeAction.NODE_REMOVED) {

    }
  }
}