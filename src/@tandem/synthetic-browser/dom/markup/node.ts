import { IMarkupModule } from "@tandem/synthetic-browser/sandbox";
import { SyntheticDocument } from "../document";
import { IMarkupNodeVisitor } from "./visitor";
import { MarkupNodeExpression } from "./ast";
import { IModule, ISynthetic, SandboxModule, Bundle } from "@tandem/sandbox";
import * as assert from "assert";
import {
  TreeNode,
  BubbleBus,
  IASTNode,
  IComparable,
  findTreeNode,
  patchTreeNode,
} from "@tandem/common";
import { ISerializer, serializable, deserialize, serialize } from "@tandem/common";

import {
  DOMNodeType
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

export interface ISerializedSyntheticDOMNode {
  bundle: any;
}

export class SyntheticDOMNodeSerializer implements ISerializer<SyntheticDOMNode, ISerializedSyntheticDOMNode> {
  constructor(readonly childSerializer: ISerializer<any, any>) {

  }
  serialize(value: SyntheticDOMNode) {
    return Object.assign(this.childSerializer.serialize(value), {
      bundle: serialize(value.bundle)
    })
  }
  deserialize(value: ISerializedSyntheticDOMNode, dependencies, ctor) {
    return Object.assign(this.childSerializer.deserialize(value, dependencies, ctor), {
      $bundle: deserialize(value.bundle, dependencies)
    })
  }
}

export abstract class SyntheticDOMNode extends TreeNode<SyntheticDOMNode> implements IComparable, ISynthetic, IDOMNode {

  readonly namespaceURI: string;

  /**
   * TRUE if the node has been loaded
   */

  private _loaded: boolean;
  private _ownerDocument: SyntheticDocument;


  /**
   * The source expression that generated this node. May be NULL at times
   * depending on the environment
   */

  /**
   * @deprecated. Use location instead.
   */

  public $expression: MarkupNodeExpression;

  /**
   * The DOM node type
   */

  abstract readonly nodeType: number;

  /**
   */

  public $module: SandboxModule;
  public $bundle: Bundle;


  constructor(readonly nodeName: string) {
    super();
  }

  get ownerDocument(): SyntheticDocument {
    return this._ownerDocument;
  }

  get bundle(): Bundle {
    return this.$bundle;
  }

  /**
   * @deprecated
   */

  get module(): SandboxModule {
    return this.$module;
  }

  get expression(): MarkupNodeExpression {
    return this.$expression;
  }

  get browser() {
    return this.ownerDocument.defaultView.browser;
  }

  get editor() {

    // TODO - get editor from bundle
    return this.module && this.module["editor"];
  }

  get childNodes() {
    return this.children;
  }

  get parentElement(): HTMLElement {
    const parent = this.parentNode;
    if (!parent || parent.nodeType !== DOMNodeType.ELEMENT) {
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

  onChildAdded(child) {
    super.onChildAdded(child);
    if (this.ownerDocument) {
      child.$setOwnerDocument(this.ownerDocument);
    }
  }

  $setOwnerDocument(document: SyntheticDocument) {
    this._ownerDocument = document;
    for (let i = 0, n = this.childNodes.length; i < n; i++) {
      this.childNodes[i].$setOwnerDocument(document);
    }
  }

  protected linkClone(clone: SyntheticDOMNode) {
    clone.$expression = this.$expression;
    clone.$module     = this.$module;
    clone.$setOwnerDocument(this.ownerDocument);
  }

  abstract accept(visitor: IMarkupNodeVisitor);
  abstract cloneNode(deep?: boolean);
}