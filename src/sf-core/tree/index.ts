import { ITreeNode } from "./base";
import { Observable } from "sf-core/observable";

export { ITreeNode };

class TreeNodeChildren<T extends TreeNode<any>> extends Array<T> {
  constructor(private _node: TreeNode<T>) {
    super();
  }

  push(...items) {
    this.splice(this.length, 0, ...items);
    return this.length;
  }

  unshift(...items) {
    this.splice(0, 0, ...items);
    return this.length;
  }

  pop() {
    return this.splice(this.length - 1, 1)[0];
  }

  remove(...items: Array<T>) {
    for (const child of items) {
      const index = this.indexOf(child);
      if (index !== -1) {
        this.splice(index, 1);
      }
    }
  }

  shift() {
    return this.splice(0, 1)[0];
  }

  splice(start: number, deleteCount?: number, ...items: Array<T>) {
    const ret = super.splice(start, deleteCount, ...items);
    for (const removed of ret) {
      this._node["unlinkChild"](removed);
    }
    for (const added of items) {
      this._node["linkChild"](added);
    }
    return ret;
  }
}

export class TreeNode<T extends TreeNode<any>> extends Observable implements ITreeNode<T> {

  private _parent: T;
  private _children: TreeNodeChildren<T>;

  constructor() {
    super();
    this._children = new TreeNodeChildren<T>(this);
  }

  get children(): Array<T> {
    return this._children;
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

  get firstChild(): T {
    return this.children[0];
  }

  get lastChild(): T {
    return this.children[this.children.length - 1];
  }

  get depth(): number {
    return this.ancestors.length;
  }

  get height(): number {
    return Math.max(0, ...this.children.map((child) => child.height + 1));
  }

  public appendChild(...children: Array<T>): void {
    this._children.push(...children);
  }
  public removeChild(...children: Array<T>): void {
    this._children.remove(...children);
  }

  public insertChild(index: number, ...children: Array<T>) {
    if (index !== -1) {
      this._children.splice(index, 0, ...children);
    }
  }

  protected linkChild(child: T): void {
    if (child._parent) {
      child._parent.removeChild(child);
    }
    child._parent = this;
    child.onAdded();
  }

  protected unlinkChild(child: T): void {
    child._parent = undefined;
    child.onRemoved();
  }

  protected onAdded() {

  }

  protected onRemoved() {

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
}