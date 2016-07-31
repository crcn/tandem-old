import { Action } from "sf-core/actions";
import { IActor } from "sf-core/actors";
import { CallbackBus } from "sf-core/busses";
import { IObservable, Observable } from "sf-core/observable";

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

export interface INode extends IObservable {
  parentNode: IContainerNode;
  readonly nodeName: string;
  cloneNode(deep?: boolean): INode;
  flatten(): Array<INode>;
  nextSibling: INode;
  prevSibling: INode;
}

export interface IContainerNode extends INode {
  childNodes: Array<INode>;
  removeChild(child: INode);
  appendChild(child: INode);
  insertBefore(child: INode, existingChild: INode);
  flatten(): Array<INode>;
  firstChild: INode;
  lastChild: INode;
}

export interface IValueNode extends INode {
  nodeValue: any;
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
  readonly nodeName = null;
  protected _parentNode: IContainerNode;
  get parentNode(): IContainerNode {
    return this._parentNode;
  }

  get nextSibling() {
    return this.parentNode ? this.parentNode.childNodes[this.parentNode.childNodes.indexOf(this) + 1] : undefined;
  }

  get prevSibling() {
    return this.parentNode ? this.parentNode.childNodes[this.parentNode.childNodes.indexOf(this) - 1] : undefined;
  }

  flatten(): Array<INode> {
    return this._flattenDeep([]);
  }

  public _flattenDeep(nodes: Array<INode>) {
    nodes.push(this);
    return nodes;
  }
  protected didMount() { }
  protected willUnmount() { }

  abstract cloneNode(deep?: boolean): Node;
}

export abstract class ContainerNode extends Node implements IContainerNode {

  protected _childNodes: Array<INode> = [];
  private _childObserver: IActor;

  get childNodes(): Array<INode> {
    return this._childNodes;
  }

  get firstChild(): INode {
    return this._childNodes[0];
  }

  get lastChild(): INode {
    return this._childNodes[this._childNodes.length - 1];
  }

  _flattenDeep(nodes) {
    nodes.push(this);
    for (const child of this.childNodes) {
      (<Node>child)._flattenDeep(nodes);
    }
    return nodes;
  }

  appendChild(child: INode) {
    if (child.parentNode) {
      child.parentNode.removeChild(child);
    }
    this._childNodes.push(child);
    this._link(child);
  }

  removeChild(child: INode) {
    const i = this._childNodes.indexOf(child);
    if (i !== -1) {
      this._childNodes.splice(i, 1);
      this._unlink(child);
    }
  }

  insertBefore(child: Node, existingChild: Node) {
    const i = this._childNodes.indexOf(existingChild);

    if (child.parentNode) {
      child.parentNode.removeChild(child);
    }

    // throw error if existing child doesn"t exist
    if (i === -1) {
      throw new Error("Cannot insert a child before a node that doesn't exist in the parent.");
    } else if (i === 0) {
      this._childNodes.unshift(child);
    } else {
      this._childNodes.splice(i, 0, child);
    }

    this._link(child);
  }

  protected _unlink(child: INode) {
    child.unobserve(this._childObserver);
    (child as any).willUnmount();
    (child as any)._parentNode = undefined;
  }

  protected _link(child: INode) {

    // only instantiate the child observer when necessary --
    // when there are actual children.
    if (this._childObserver == null) {
      this._childObserver = new CallbackBus(this._onChildAction);
    }

    child.observe(this._childObserver);
    (child as any)._parentNode = this;
    (child as any).didMount();
  }

  protected addChildNodesToClonedNode(node: ContainerNode) {
    for (const child of this.childNodes) {
      node.appendChild(child.cloneNode(true));
    }
  }

  protected _onChildAction = (action: Action) => {

    // bubble it up
    this.notify(action);
  }
}

class Attributes extends Array<Attribute> { }

/**
 * Element examples:
 * <div id="test" />
 */

export class Element extends ContainerNode implements IElement {
  readonly attributes: Attributes = [];
  readonly nodeName: string;

  constructor(nodeName: string) {
    super();

    // reflect dom uppercase node names
    this.nodeName = nodeName.toUpperCase();
  }

  hasAttribute(key: string) {
    for (const attribute of this.attributes) {
      if (attribute.name === key) return true;
    }
    return false;
  }

  removeAttribute(key: string) {
    for (let i = this.attributes.length; i--; ) {
      const attribute = this.attributes[i];
      if (attribute.name === key) {
        this.attributes.splice(i, 1);
        return;
      }
    }
  }

  getAttribute(key: string): any {
    for (const attribute of this.attributes) {
      if (attribute.name === key) return attribute.value;
    }
  }
  setAttribute(key: string, value: any) {
    for (const attribute of this.attributes) {
      if (attribute.name === key) {
        attribute.value = value;
        return;
      };
    }

    this.attributes.push(new Attribute(key, value));
  }

  cloneNode(deep: boolean = false): Element {
    const clone = this.cloneInstance();
    for (const attribute of this.attributes) {
      clone.setAttribute(attribute.name, attribute.value);
    }
    if (deep) {
      this.addChildNodesToClonedNode(clone);
    }
    return clone;
  }

  protected cloneInstance() {
    return new Element(this.nodeName);
  }
}

/**
 * A node with a value -- this would represent things souch as DOM text nodes and comments
 * Other example:
 * <div>ValueNode</div>
 */

export class ValueNode extends Node implements IValueNode {
  constructor(readonly nodeName: string, public nodeValue: any) {
    super();
  }
  cloneNode() {
    return new ValueNode(this.nodeName, this.nodeValue);
  }
}