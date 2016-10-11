import { SyntheticDocument } from "../document";
import { IMarkupNodeVisitor } from "./visitor";
import { MarkupNodeExpression } from "./ast";
import { IModule, ISynthetic } from "@tandem/sandbox";
import * as assert from "assert";
import {
  TreeNode,
  BubbleBus,
  IASTNode,
  IComparable,
  findTreeNode,
  patchTreeNode,
} from "@tandem/common";

import {
  IMarkupModule,
} from "@tandem/synthetic-browser/sandbox";

import {
  MarkupNodeType
} from "./node-types";


export interface IDOMNode extends TreeNode<any>, IComparable {
  firstChild: IDOMNode;
  lastChild: IDOMNode;
  nextSibling: IDOMNode;
  previousSibling: IDOMNode;
  insertBefore(newChild: IDOMNode, existingChild: IDOMNode);
  replaceChild(child: IDOMNode, existingChild: IDOMNode);
  nodeType: number;
  nodeName: string;
  appendChild(child: IDOMNode);
  removeChild(child: IDOMNode);
}

export abstract class SyntheticDOMNode extends TreeNode<SyntheticDOMNode> implements IComparable, ISynthetic, IDOMNode {

  readonly namespaceURI: string;

  /**
   * TRUE if the node has been loaded
   */

  private _loaded: boolean;


  /**
   * The source expression that generated this node. May be NULL at times
   * depending on the environment
   */

  public expression: MarkupNodeExpression;

  /**
   * The DOM node type
   */

  abstract readonly nodeType: number;

  /**
   */

  public module: IMarkupModule;


  constructor(readonly nodeName: string, public ownerDocument: SyntheticDocument) {
    super();
  }

  get browser() {
    return this.ownerDocument.defaultView.browser;
  }

  get editor() {
    return this.module && this.module.editor;
  }

  get childNodes() {
    return this.children;
  }

  get parentElement(): HTMLElement {
    const parent = this.parentNode;
    if (!parent || parent.nodeType !== MarkupNodeType.ELEMENT) {
      return null;
    }
    return parent as any as HTMLElement;
  }

  get parentNode() {
    return this.parent;
  }

  addEventListener() {
    // TODO
  }

  contains(node: IDOMNode) {
    return !!findTreeNode(this, child => (<IDOMNode><any>child) === node);
  }

  abstract textContent: string;

  compare(source: IDOMNode) {
    return Number(source.constructor === this.constructor && this.nodeName === source.nodeName);
  }

  removeEventListener() {
    // TODO
  }

  isEqualNode(node: IDOMNode) {
    return !!this.compare(node);
  }

  isSameNode(node: IDOMNode) {
    return (<IDOMNode><any>this) === node;
  }

  hasChildNodes() {
    return this.childNodes.length !== 0;
  }


  abstract accept(visitor: IMarkupNodeVisitor);
  abstract cloneNode(deep?: boolean);
}