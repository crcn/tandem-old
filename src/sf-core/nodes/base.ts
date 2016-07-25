export interface INode {
  parentNode:INode;
  childNodes:Array<INode>;
  appendChild(child:INode);
  removeChild(child:INode);
  insertBefore(child:INode, existingChild:INode);
}

export class BaseNode<T extends BaseNode<T>> implements INode {

  protected _childNodes:Array<T> = [];
  private _parentNode:BaseNode<T>;

  get childNodes():Array<T> {
    return this._childNodes;
  }

  get parentNode():BaseNode<T> {
    return this._parentNode;
  }

  appendChild(child:T) {
    this._childNodes.push(child);
    this._link(child);
  }

  removeChild(child:T) {
    const i = this._childNodes.indexOf(child);
    if (i !== -1) {
      this._childNodes.splice(i, 1);
      this._unlink(child);
    }
  }

  insertBefore(child:T, existingChild:T) {
    const i = this._childNodes.indexOf(existingChild);

    // throw error if existing child doesn't exist
    if (i === -1) {
      throw new Error("Cannot insert a child before a node that doesn't exist in the parent.");
    } else if (i === 0) {
      this._childNodes.unshift(child);
    } else {
      this._childNodes.splice(i, 0, child);
    }

    this._link(child);
  }

  protected didMount() {

  }

  protected willUnmount() {

  }

  protected _unlink(child:T) {
    child.willUnmount();
    child._parentNode = undefined;
  }

  protected _link(child:T) {
    if (child.parentNode) {
      child.parentNode.removeChild(child);
    }
    child._parentNode = this;
    child.didMount();
  }
}