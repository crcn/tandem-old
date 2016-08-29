import { INode, IContainerNode, IValueNode, IElement, ContainerNode, Node as MarkupNode, Element as MarkupElement } from "./base";
import { Observable } from "sf-core/observable";

class WrappedNode<T extends Node> extends Observable implements INode {
  readonly name: string;

  constructor(readonly target: T) {
    super();
    this.name = target.nodeName;
  }


  get nextSibling(): INode {
    return <IContainerNode>wrapDOMNode(this.target.nextSibling);
  }

  get previousSibling(): INode {
    return <IContainerNode>wrapDOMNode(this.target.previousSibling);
  }

  get parent(): IContainerNode {
    return <IContainerNode>wrapDOMNode(this.target.parentNode);
  }

  clone() {
    return wrapDOMNode(this.target.cloneNode(true));
  }
}

class WrappedCommentNode extends MarkupNode implements IValueNode {

  constructor(readonly target: Comment) {
    super(target.nodeName);
  }
  get value(): string {
    return this.target.nodeValue;
  }
  set value(value: string) {
    this.target.nodeValue = value;
  }

  clone() {
    return new WrappedCommentNode(<Comment>this.target.cloneNode(true));
  }
}

class WrappedContainerNode<T extends Node> extends ContainerNode implements IContainerNode {
  readonly children: Array<WrappedNode<Node>>;
  constructor(target: T) {
    super(target.nodeName);
    this._children = Array.prototype.map.call(target.childNodes, wrapDOMNode);
  }
}

class WrappedElement extends MarkupElement {
  constructor(target: Element) {
    super(target.nodeName);
  }
}

export function wrapDOMNode(node: Node): INode {
  if (!node) return null;
  if (node.nodeType === 8) {
    return new WrappedCommentNode(<Comment>node);
  }
}