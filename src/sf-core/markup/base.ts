import { IActor } from "sf-core/actors";
import { INamed } from "sf-core/object";
import { CallbackBus } from "sf-core/busses";
import { IObservable, Observable } from "sf-core/observable";
import { Action, AttributeChangeAction } from "sf-core/actions";

/**
 * Interfaces here reflect the DOM API a bit to ensure compatibility
 * with tools associated with the implementation below. HOWEVER, The code
 * in this doc isn't limited to HTML, and should only reflect Markup. Anything
 * specific to HTML should live somewhere else (such as saffron-html-extension).
 */

export interface IAttribute {
  name: string;
  value: any;
}

export interface INode extends IObservable, INamed {
  parent: IContainerNode;
  root: IContainerNode;
  readonly name: string;
  clone(): INode;
  nextSibling: INode;
  previousSibling: INode;
}

// TODO - maybe change to ITree
export interface IContainerNode extends INode {
  children: Array<INode>;
  removeChild(child: INode);
  appendChild(child: INode);
  insertBefore(child: INode, existingChild: INode);
  firstChild: INode;
  lastChild: INode;
}

export interface IValueNode extends INode {
  value: any;
}

export interface IElement extends IContainerNode {
  readonly attributes: Array<IAttribute>;
  hasAttribute(key: string): boolean;
  removeAttribute(key: string): void;
  getAttribute(key: string): any;
  setAttribute(key: string, value: any);
}

/**
 * Minimal markup implementation
 */

export class Attribute implements IAttribute {
  constructor(public name: string, public value: any) { }
}

export abstract class Node extends Observable implements INode {

  constructor(readonly name: string) {

    // needed here to ensure that the target observable is always this
    super();
  }

  protected _parent: IContainerNode;
  get parent(): IContainerNode {
    return this._parent;
  }

  get root(): IContainerNode {
    let p: INode = this;
    while (p.parent) p = <INode>p.parent;
    return <IContainerNode>p;
  }

  get nextSibling() {
    return this.parent ? this.parent.children[this.parent.children.indexOf(this) + 1] : undefined;
  }

  get previousSibling() {
    return this.parent ? this.parent.children[this.parent.children.indexOf(this) - 1] : undefined;
  }

  protected didMount() { }
  protected willUnmount() { }

  abstract clone(): Node;
}

export class ContainerNode extends Node implements IContainerNode {

  protected _children: Array<INode> = [];
  private _childObserver: IActor;

  constructor(name: string) {
    super(name);
  }

  clone() {
    const clone = new ContainerNode(this.name);
    for (const child of this.children) {
      clone.appendChild(child.clone());
    }
    return clone;
  }

  get children(): Array<INode> {
    return this._children;
  }

  get firstChild(): INode {
    return this._children[0];
  }

  get lastChild(): INode {
    return this._children[this._children.length - 1];
  }

  appendChild(child: INode) {
    if (child.parent) {
      child.parent.removeChild(child);
    }
    this._children.push(child);
    this._link(child);
  }

  removeChild(child: INode) {
    const i = this._children.indexOf(child);
    if (i !== -1) {
      this._children.splice(i, 1);
      this._unlink(child);
    }
  }

  insertBefore(child: INode, existingChild: INode) {
    const i = this._children.indexOf(existingChild);

    if (child.parent) {
      child.parent.removeChild(child);
    }

    // throw error if existing child doesn"t exist
    if (i === -1) {
      throw new Error("Cannot insert a child before a node that doesn't exist in the parent.");
    } else if (i === 0) {
      this._children.unshift(child);
    } else {
      this._children.splice(i, 0, child);
    }

    this._link(child);
  }

  protected _unlink(child: INode) {
    child.unobserve(this._childObserver);
    (child as any).willUnmount();
    (child as any)._parent = undefined;
  }

  protected _link(child: INode) {

    // only instantiate the child observer when necessary --
    // when there are actual children.
    if (this._childObserver == null) {
      this._childObserver = new CallbackBus(this._onChildAction);
    }

    child.observe(this._childObserver);
    (child as any)._parent = this;
    (child as any).didMount();
  }

  protected addChildrenToClonedNode(node: ContainerNode) {
    for (const child of this.children) {
      node.appendChild(child.clone());
    }
  }

  protected _onChildAction = (action: Action) => {

    // bubble it up
    this.notify(action);
  }

  toString() {
    return this.children.join("");
  }
}

export class Attributes extends Array<Attribute> {

  has(name: string) {
    for (const attribute of this) {
      if (attribute.name === name) return true;
    }
    return false;
  }

  set(name: string, value: any) {
    let found = false;
    for (const attribute of this) {
      if (attribute.name === name) {
        attribute.value = value;
        found = true;
      };
    }
    if (!found) {
      this.push(new Attribute(name, value));
    }
  }

  get(name: string) {
    for (const attribute of this) {
      if (attribute.name === name) return attribute.value;
    }
  }

  remove(name: string) {
    for (let i = this.length; i--; ) {
      const attribute = this[i];
      if (attribute.name === name) {
        this.splice(i, 1);
        return;
      }
    }
  }
}

/**
 * Element examples:
 * <div id="test" />
 */

export class Element extends ContainerNode implements IElement {
  readonly attributes: Attributes = new Attributes();

  constructor(name: string) {
    super(name.toUpperCase());
  }

  hasAttribute(key: string) {
    return this.attributes.has(key);
  }

  removeAttribute(key: string) {
    return this.attributes.remove(key);
  }

  getAttribute(key: string): any {
    return this.attributes.get(key);
  }
  setAttribute(key: string, value: any) {
    this.attributes.set(key, value);
    this.notify(new AttributeChangeAction(key, value));
  }

  clone(): Element {
    const clone = this.cloneInstance();
    for (const attribute of this.attributes) {
      clone.setAttribute(attribute.name, attribute.value);
    }
    this.addChildrenToClonedNode(clone);
    return clone;
  }

  protected cloneInstance() {
    return new Element(this.name);
  }

  toString() {
    const buffer = ["<", this.name];
    const attributesBuffer = [];
    for (const attribute of this.attributes) {
      attributesBuffer.push([attribute.name, "=", "\"", attribute.value, "\""].join(""));
    }
    buffer.push(" ", attributesBuffer.join(""));

    if (this.children.length) {
      buffer.push(">", this.children.join(""), "</", this.name, ">");
    } else {
      buffer.push("/>");
    }
    return buffer.join("");
  }
}

/**
 * A node with a value -- this would represent things souch as DOM text nodes and comments
 * Other example:
 * <div>ValueNode</div>
 */

export class ValueNode extends Node implements IValueNode {
  constructor(name: string, public value: any) {
    super(name);
  }
  clone() {
    return new ValueNode(this.name, this.value);
  }
  toString() {
    return this.value;
  }
}