import { IActor } from "sf-core/actors";
import { WrapBus } from "mesh";
import { ITreeNode, ITreeBranch } from "./base";
import { Observable, IObservable } from "sf-core/observable";
import { Action, NODE_ADDED, NODE_REMOVING } from "sf-core/actions";

export { ITreeNode, ITreeBranch };

export class TreeBranch<T extends ITreeNode<any>, U extends ITreeNode<any>> extends Array<U> implements IObservable, ITreeBranch<T, U> {

  private _observer: Observable;
  private _childObserver: IActor;

  constructor(readonly node: T) {
    super();
    this._observer = new Observable(this);
    this._childObserver = new WrapBus(this.onChildAction.bind(this));
  }

  observe(actor: IActor) {
    this._observer.observe(actor);
  }

  notify(action: Action) {
    this._observer.notify(action);
  }

  unobserve(actor: IActor) {
    return this._observer.unobserve(actor);
  }

  push(...items) {
    this.splice(this.length, 0, ...items);
    return this.length;
  }

  get first(): U {
    return this[0];
  }

  get last(): U {
    return this[this.length - 1];
  }

  unshift(...items) {
    this.splice(0, 0, ...items);
    return this.length;
  }

  pop() {
    return this.splice(this.length - 1, 1)[0];
  }

  removeAll() {
    this.splice(0, this.length);
  }

  remove(...items: Array<U>) {
    for (const child of items) {
      const index = this.indexOf(child);
      if (index !== -1) {
        this.splice(index, 1);
      }
    }
  }

  concat() {
    return Array.from(this);
  }

  shift() {
    return this.splice(0, 1)[0];
  }

  splice(start: number, deleteCount?: number, ...newChildren: Array<U>) {

    const removing = this.slice(start, start + deleteCount);

    for (const child of removing) {
      this.onChildRemoving(child);
    }

    super.splice(start, deleteCount);

    // need to individually push items to ensure that props such as nextSibling are
    // not defined
    for (const child of newChildren) {
      if (child.branch) {
        child.branch.remove(child);
      }
      super.splice(start++, 0, child);
      this.onChildAdded(child);
    }

    return removing;
  }

  protected onChildAdded(child: U) {

    child["_branch"] = this;
    child["_parent"] = this.node;

    child.observe(this._childObserver);
    child.notify(new Action(NODE_ADDED));
  }

  protected onChildRemoving(child: U) {
    child.notify(new Action(NODE_REMOVING));
    child["_branch"] = undefined;
    child["_parent"] = undefined;
    child.unobserve(this._childObserver);
  }

  private onChildAction(action: Action) {
    this.notify(action);
  }
}

export class TreeNode<T extends TreeNode<T>> extends Observable implements ITreeNode<T> {

  private _parent: T;
  private _children: ITreeBranch<T, T>;
  private _branchObserver: IActor;
  private _branches: Array<ITreeBranch<T, ITreeNode<any>>>;
  private _branch: ITreeBranch<TreeNode<any>, T>;

  constructor() {
    super();
    this._branches = [];
    this._branchObserver = new WrapBus(this.onBranchAction.bind(this));
    this._children = this.addBranch<T>();
  }

  addBranch<U extends ITreeNode<any>>(branch?: TreeBranch<T, U>): TreeBranch<T, U> {
    if (!branch) branch = new TreeBranch<T, U>(<any>this);
    branch.observe(this._branchObserver);
    this._branches.push(branch);
    return branch;
  }

  get branch(): ITreeBranch<TreeNode<any>, T> {
    return this._branch;
  }

  get branches(): Array<ITreeBranch<T, ITreeNode<any>>> {
    return this._branches;
  }

  get children(): ITreeBranch<T, T> {
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
    return this._branch ? this._branch[this._branch.indexOf(<any>this) + 1] : undefined;
  }

  get previousSibling(): T {
    return this._branch ? this._branch[this._branch.indexOf(<any>this) - 1] : undefined;
  }

  get depth(): number {
    return this.ancestors.length;
  }

  get height(): number {
    return Math.max(0, ...this.children.map((child) => child.height + 1));
  }

  protected onAdded() {
  }

  protected onChildAdded(child: T) {
  }

  protected onRemoving() {
  }

  protected onChildRemoving(child: T) {
  }

  public clone(): T {
    const clone = this.cloneLeaf();
    for (const branch of this.branches) {
      let clonedBranch = branch === this.children ? clone.children : clone.addBranch();
      clonedBranch.push(...branch.map((child) => child.clone()));
    }
    return <T>clone;
  }

  protected cloneLeaf(): T {
    return <T>new TreeNode<T>();
  }

  protected onBranchAction(action: Action) {

    if (action.type === NODE_ADDED) {
      if (action.target === this) {
        this.onAdded();
      } else if (action.target.parent === this) {
        this.onChildAdded(action.target);
      }
    } else if (action.type === NODE_REMOVING) {
      if (action.target === this) {
        this.onRemoving();
      } else if (action.target.parent === this) {
        this.onChildRemoving(action.target);
      }
    }

    // bubble it up
    this.notify(action);
  }
}