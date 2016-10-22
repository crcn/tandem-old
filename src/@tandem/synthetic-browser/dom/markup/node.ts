import * as assert from "assert";
import { DOMNodeType } from "./node-types";
import { IMarkupModule } from "@tandem/synthetic-browser/sandbox";
import { SyntheticDocument } from "../document";
import { IMarkupNodeVisitor } from "./visitor";
import { MarkupNodeExpression } from "./ast";

import {
  Bundle,
  IModule,
  ISynthetic,
  SandboxModule,
  ISyntheticSourceInfo,
 } from "@tandem/sandbox";

import {
  TreeNode,
  BubbleBus,
  IComparable,
  findTreeNode,
  patchTreeNode,
} from "@tandem/common";

import {
  serialize,
  deserialize,
  ISerializer,
  serializable,
} from "@tandem/common";

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
  source: ISyntheticSourceInfo;
}

export class SyntheticDOMNodeSerializer implements ISerializer<SyntheticDOMNode, ISerializedSyntheticDOMNode> {
  constructor(readonly childSerializer: ISerializer<any, any>) {

  }
  serialize(value: SyntheticDOMNode) {
    return Object.assign(this.childSerializer.serialize(value), {
      source: value.$source
    })
  }
  deserialize(value: ISerializedSyntheticDOMNode, dependencies, ctor) {
    return Object.assign(this.childSerializer.deserialize(value, dependencies, ctor), {
      $source: value.source
    })
  }
}

let _uid: number = 0;

export abstract class SyntheticDOMNode extends TreeNode<SyntheticDOMNode> implements IComparable, ISynthetic, IDOMNode {

  abstract textContent: string;
  readonly namespaceURI: string;

  /**
   * TRUE if the node has been loaded
   */

  private _ownerDocument: SyntheticDocument;
  private _uid: number;
  private _native: Node;

  /**
   */

  public $source: ISyntheticSourceInfo;

  /**
   * The DOM node type
   */

  abstract readonly nodeType: number;

  /**
   * Only set if the synthetic DOM node is running in a sandbox -- not always
   * the case especially with serialization.
   */

  public $module: SandboxModule;


  constructor(readonly nodeName: string) {
    super();
    this._uid = ++_uid;
  }

  get ownerDocument(): SyntheticDocument {
    return this._ownerDocument;
  }

  get source(): ISyntheticSourceInfo {
    return this.$source;
  }

  get browser() {
    return this.ownerDocument.defaultView.browser;
  }

  get native() {
    return this._native;
  }

  get module() {
    return this.$module;
  }

  get uid() {
    return this._uid;
  }

  get childNodes() {
    return this.children;
  }

  get parentElement(): HTMLElement {
    const parent = this.parentNode;
    if (!parent || parent.nodeType !== DOMNodeType.ELEMENT) {

      // NULL is standard here, otherwise undefined would be a better option.
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

  attachNative(node: Node) {
    this._native = node;
  }

  $setOwnerDocument(document: SyntheticDocument) {
    this._ownerDocument = document;
    for (let i = 0, n = this.childNodes.length; i < n; i++) {
      this.childNodes[i].$setOwnerDocument(document);
    }
  }

  get editable() {
    return !!this.$source;
  }

  protected linkClone(clone: SyntheticDOMNode) {
    clone.$source = this.$source;
    clone.$module = this.$module;
    clone.$setOwnerDocument(this.ownerDocument);
  }

  abstract accept(visitor: IMarkupNodeVisitor);
  abstract cloneNode(deep?: boolean);
}