import { Action, Mutation } from "@tandem/common/messages";
import { CallbackDispatcher, IDispatcher } from "@tandem/mesh";
import { ITreeNode } from "./base";
import { ITreeWalker, IWalkable } from "./walker";
import { Observable, IObservable } from "@tandem/common/observable";

export { ITreeNode };

export namespace TreeNodeMutationTypes {
  export const NODE_ADDED = "nodeAdded";
  export const NODE_REMOVED = "nodeRemoved";
}

export class TreeNode<T extends TreeNode<any>> extends Observable implements ITreeNode<T>, IWalkable {

  private _parent: T;
  private _children: Array<T>;
  private _childObserver: IDispatcher<any, any>;

  constructor() {
    super();
    this._children = this.createChildren();
    this._childObserver = new CallbackDispatcher(this.onChildAction.bind(this));
  }

  get children(): Array<T> {
    return this._children;
  }

  get firstChild(): T {
    return this._children[0];
  }

  get lastChild(): T {
    return this._children[this._children.length - 1];
  }

  appendChild(child: T) {
    this.insertChildAt(child, this._children.length);
  }

  removeAllChildren() {
    while (this._children.length) {
      this.removeChild(this._children[0]);
    }
  }

  protected createChildren(): T[] {
    return [];
  }

  removeChild(child: T): T {
    const index = this._children.indexOf(child);
    if (index === -1) {
      return undefined;
    }

    this._children.splice(index, 1);
    this.onChildRemoved(child);
    return child;
  }

  insertChildAt(newChild: T, index: number) {
    if (newChild._parent) {
      newChild._parent.removeChild(newChild);
    }
    this._children.splice(index, 0, newChild);
    this.onChildAdded(newChild);
  }

  insertBefore(newChild: T, existingChild: T) {
    if (existingChild == null) return this.appendChild(newChild);
    const index = this._children.indexOf(existingChild);
    if (index !== -1) {
      this.insertChildAt(newChild, index);
    }
  }

  replaceChild(newChild: T, existingChild: T) {
    const index = this._children.indexOf(existingChild);
    if (index !== -1) {
      this.insertChildAt(newChild, index);
      this.removeChild(existingChild);
    }
    return existingChild;
  }

  get parent(): T {
    return this._parent;
  }

  get root(): T {
    let p: TreeNode<T> = this;
    while (p.parent) p = p.parent;
    return <T>p;
  }

  get ancestors(): Array<T> {
    const ancestors = [];
    let p = this.parent;
    while (p) {
      ancestors.push(p);
      p = p.parent;
    }
    return ancestors;
  }

  get nextSibling(): T {
    return this._parent ? this._parent.children[this._parent.children.indexOf(this) + 1] : undefined;
  }

  get previousSibling(): T {
    return this._parent ? this._parent.children[this._parent.children.indexOf(this) - 1] : undefined;
  }

  get depth(): number {
    return this.ancestors.length;
  }

  protected onChildAdded(child: T) {
    child._parent = this;
    child.observe(this._childObserver);
    child.onAdded();
  }

  protected onChildRemoved(child: T) {
    child.onRemoved();
    child.unobserve(this._childObserver);
    child._parent = undefined;
  }

  protected onAdded() {
    this.notify(new Mutation(TreeNodeMutationTypes.NODE_ADDED));
  }

  protected onRemoved() {
    this.notify(new Mutation(TreeNodeMutationTypes.NODE_REMOVED));
  }

  public clone(deep?: boolean): T {
    const clone = this.cloneLeaf();
    if (deep) {
      for (let i = 0, n = this.children.length; i < n; i++) {
        clone.appendChild(this.children[i].clone(deep));
      }
    }
    return <T>clone;
  }

  protected cloneLeaf(): T {
    return <T>new TreeNode<T>();
  }

  protected onChildAction(action: Action) {
    this.notify(action);
  }

  visitWalker(walker: ITreeWalker) {
    this.children.forEach(child => walker.accept(child));
  }
}