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

export interface ISerializedSyntheticDOMNode {
  source: ISyntheticSourceInfo;
  uid: any;
}

export const SyntheticDOMNodeSerializer = SyntheticObjectSerializer;

// TODO - possibly have metadata here since it's generic and can be used with any synthetic
export abstract class SyntheticDOMNode extends TreeNode<SyntheticDOMNode> implements IComparable, ISyntheticObject, IEditable {

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

  contains(node: SyntheticDOMNode) {
    return !!findTreeNode(this, child => child === node);
  }

  compare(source: SyntheticDOMNode) {
    return Number(source.constructor === this.constructor && this.nodeName === source.nodeName);
  }

  removeEventListener() {
    // TODO
  }

  isEqualNode(node: SyntheticDOMNode) {
    return !!this.compare(node);
  }

  isSameNode(node: SyntheticDOMNode) {
    return this === node;
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
  abstract createEdit(): BaseContentEdit<any>;
  abstract applyEditAction(action: EditAction);
}