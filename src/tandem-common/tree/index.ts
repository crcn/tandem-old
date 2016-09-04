import { IActor } from "tandem-common/actors";
import { WrapBus } from "mesh";
import { ITreeNode } from "./base";
import { patchTreeNode } from "./patch";
import { Observable, IObservable } from "tandem-common/observable";
import { Action, TreeNodeAction } from "tandem-common/actions";

export { ITreeNode, patchTreeNode };

export class TreeNode<T extends TreeNode<any>> extends Observable implements ITreeNode<T> {

  private _parent: T;
  private _children: Array<T>;
  private _childObserver: IActor;

  constructor() {
    super();
    this._children = [];
    this._childObserver = new WrapBus(this.onChildAction.bind(this));
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
    this.insertAt(child, this._children.length);
  }

  removeAllChildren() {
    while (this._children.length) {
      this.removeChild(this._children[0]);
    }
  }

  removeChild(child: T) {
    const index = this._children.indexOf(child);
    if (index !== -1) {
      this.onRemovingChild(child);
      this._children.splice(index, 1);
    }
  }

  insertAt(newChild: T, index: number) {
    if (newChild._parent) {
      newChild._parent.removeChild(newChild);
    }
    this._children.splice(index, 0, newChild);
    this.onChildAdded(newChild);
  }

  insertBefore(newChild: T, existingChild: T) {
    const index = this._children.indexOf(existingChild);
    if (index !== -1) {
      this.insertAt(newChild, index);
    }
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

  protected onRemovingChild(child: T) {
    child.onRemoving();
    child.unobserve(this._childObserver);
    child._parent = undefined;
  }

  protected onAdded() {
    this.notify(new TreeNodeAction(TreeNodeAction.NODE_ADDED));
  }

  protected onRemoving() {
    this.notify(new TreeNodeAction(TreeNodeAction.NODE_REMOVING));
  }

  public clone(): T {
    const clone = this.cloneLeaf();
    for (const child of this.children) {
      clone.appendChild(child.clone());
    }
    return <T>clone;
  }

  protected cloneLeaf(): T {
    return <T>new TreeNode<T>();
  }

  protected onChildAction(action: Action) {
    this.notify(action);
  }
}