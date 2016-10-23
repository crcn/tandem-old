import * as assert from "assert";
import { DOMNodeType } from "./node-types";
import {BaseSyntheticObjectEdit } from "@tandem/sandbox";
import { SyntheticDocument } from "../document";
import { IMarkupNodeVisitor } from "./visitor";
import { MarkupNodeExpression } from "./ast";

import {
  Bundle,
  IModule,
  IEditable,
  IDiffable,
  EditAction,
  SandboxModule,
  ISyntheticObject,
  ISyntheticSourceInfo,
  generateSyntheticUID,
  SyntheticObjectSerializer,
 } from "@tandem/sandbox";

import {
  TreeNode,
  BubbleBus,
  ITreeWalker,
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

export interface IDOMNode extends TreeNode<any>, IComparable, ISyntheticObject {
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
  clone(deep?: boolean): IDOMNode;
  createEdit(): BaseSyntheticObjectEdit<IDOMNode>;
  visitWalker(walker: ITreeWalker);
}

export interface ISerializedSyntheticDOMNode {
  source: ISyntheticSourceInfo;
  uid: any;
}

export const SyntheticDOMNodeSerializer = SyntheticObjectSerializer;

export abstract class SyntheticDOMNode extends TreeNode<SyntheticDOMNode> implements IComparable, ISyntheticObject, IDOMNode, IEditable {

  abstract textContent: string;
  readonly namespaceURI: string;
  public $uid: any;

  /**
   * TRUE if the node has been loaded
   */

  private _ownerDocument: SyntheticDocument;
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
    this.$uid = generateSyntheticUID();
  }

  get uid(): any {
    return this.$uid;
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

  protected linkClone(clone: SyntheticDOMNode) {
    clone.$source = this.$source;
    clone.$module = this.$module;
    clone.$uid    = this.uid;
    clone.$setOwnerDocument(this.ownerDocument);
    return clone;
  }

  /**
   * Clone alias for standard DOM API
   *
   * @param {boolean} [deep]
   * @returns
   */

  cloneNode(deep?: boolean) {
    return this.clone(deep);
  }

  abstract accept(visitor: IMarkupNodeVisitor);
  abstract clone(deep?: boolean);
  abstract createEdit(): BaseSyntheticObjectEdit<any>;
  // abstract createDiff(newNode: SyntheticDOMNode): BaseSyntheticObjectEdit<any>;
  abstract applyEditAction(action: EditAction);
}