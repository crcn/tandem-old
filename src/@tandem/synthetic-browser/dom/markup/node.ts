import * as assert from "assert";
import { DOMNodeType } from "./node-types";
import {BaseContentEdit } from "@tandem/sandbox";
import { SyntheticDocument } from "../document";
import { IMarkupNodeVisitor } from "./visitor";
import { MarkupNodeExpression } from "./ast";

import {
  Bundle,
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
  Metadata,
  BubbleBus,
  serialize,
  ITreeWalker,
  deserialize,
  ISerializer,
  IComparable,
  findTreeNode,
  serializable,
  patchTreeNode,
} from "@tandem/common";

export interface ISerializedSyntheticDOMNode {
  source: ISyntheticSourceInfo;
  uid: any;
}

export const SyntheticDOMNodeSerializer = SyntheticObjectSerializer;

// TODO - possibly have metadata here since it's generic and can be used with any synthetic
export abstract class SyntheticDOMNode extends TreeNode<SyntheticDOMNode> implements IComparable, ISyntheticObject, IEditable {

  readonly metadata: Metadata;

  abstract textContent: string;
  readonly namespaceURI: string;
  public $uid: any;

  /**
   * TRUE if the node has been loaded
   */

  private _ownerDocument: SyntheticDocument;

  /**
   * @type {Node}
   */

  protected _native: Node;

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
    this.metadata = new Metadata(this.getInitialMetadata());
    this.metadata.observe(new BubbleBus(this));
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

  contains(node: SyntheticDOMNode) {
    return !!findTreeNode(this, child => child === node);
  }

  /**
   * TODO - change this method name to something such as computeDifference
   *
   * @param {SyntheticDOMNode<any>} source
   * @returns
   */

  compare(source: SyntheticDOMNode) {
    return Number(source.constructor === this.constructor && this.nodeName === source.nodeName);
  }

  removeEventListener() {
    // TODO
  }

  isEqualNode(node: SyntheticDOMNode) {
    return !!this.compare(node);
  }

  protected getInitialMetadata() {
    return {};
  }

  isSameNode(node: SyntheticDOMNode) {
    return this === node;
  }

  /**
   * Attaches a native DOM node. TODO - possibly
   * change this to addProduct since the renderer can attach anything
   * that it wants -- even non-native elements that share an identical
   * API.
   *
   * @param {Node} node
   */

  attachNative(node: Node) {
    this._native = node;
  }

  get mountedToNative() {
    return this._native;
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
  abstract createEdit(): BaseContentEdit<any>;
  abstract applyEditAction(action: EditAction);
}

export abstract class AttachableSyntheticDOMNode<T extends Node> extends SyntheticDOMNode {


}