/**
 * Interfaces here reflect the DOM API, but not limited to it
 */

export interface IAttribute {
  key:string;
  value:any;
}

export interface INode {
  parentNode:IContainerNode;
  readonly nodeType:number;
  // nextSibling:INode;
  // prevSibling:INode;
}

export interface IContainerNode  extends INode {
  childNodes:Array<INode>;
  removeChild(child:INode);
  appendChild(child:INode);
  insertBefore(child:INode, existingChild:INode);
}

export interface IValueNode extends INode {
  nodeValue:any;
}

export interface IElement extends IContainerNode {
  readonly attributes:Array<IAttribute>;
  readonly nodeName:string;
  getAttribute(key:string):any;
  setAttribute(key:string, value:any);
}

export interface ITextNode extends IValueNode { }
export interface ICommentNode extends IValueNode { }


export class NodeTypes {
  static readonly ELEMENT:number   = 1;
  static readonly TEXT:number      = 3;
  static readonly COMMENT:number   = 8;
  static readonly FRAGMENT:number = 11;
}

/**
 * Minimal markup implementation
 */

export class Attribute implements IAttribute {
  constructor(public key:string, public value:any) { }
}

export abstract class Node implements INode {
  readonly nodeType = 0; // nil
  protected _parentNode:IContainerNode;
  get parentNode():IContainerNode {
    return this._parentNode;
  }


  protected didMount() {

  }

  protected willUnmount() {

  }
}

export abstract class ContainerNode extends Node implements IContainerNode {

  protected _childNodes:Array<Node> = [];

  get childNodes():Array<Node> {
    return this._childNodes;
  }

  appendChild(child:Node) {
    this._childNodes.push(child);
    this._link(child);
  }

  removeChild(child:Node) {
    const i = this._childNodes.indexOf(child);
    if (i !== -1) {
      this._childNodes.splice(i, 1);
      this._unlink(child);
    }
  }

  insertBefore(child:Node, existingChild:Node) {
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

  protected _unlink(child:Node) {
    (child as any).willUnmount();
    (child as any)._parentNode = undefined;
  }

  protected _link(child:Node) {
    if (child.parentNode) {
      child.parentNode.removeChild(child);
    }
    (child as any)._parentNode = this;
    (child as any).didMount();
  }
}

// TODO - use iterator here
class Attributes extends Array<Attribute> { }

export class Element extends ContainerNode implements IElement {
  readonly nodeType:number = NodeTypes.ELEMENT;
  readonly attributes:Attributes = [];

  constructor(readonly nodeName:string) {
    super();
  }

  getAttribute(key:string):any {
    for (const attribute of this.attributes) {
      if (attribute.key === key) return attribute.value;
    }
  }
  setAttribute(key:string, value:any) {
    for (const attribute of this.attributes) {
      if (attribute.key === key) {
        attribute.value = value;
        return;
      };
    }

    this.attributes.push(new Attribute(key, value));
  }
}

export class ValueNode extends Node implements IValueNode {
  readonly nodeType:number = NodeTypes.TEXT;
  constructor(public nodeValue:string) {
    super();
  }
}

export class TextNode extends ValueNode {}
export class CommentNode extends ValueNode {}