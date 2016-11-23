import * as assert from "assert";
import { DOMNodeType } from "./node-types";
import {BaseContentEdit } from "@tandem/sandbox";
import { SyntheticDocument } from "../document";
import { IMarkupNodeVisitor } from "./visitor";
import { MarkupNodeExpression } from "./ast";

import {
  IEditor,
  IEditable,
  IDiffable,
  BaseEditor,
  Dependency,
  SandboxModule,
  SyntheticObjectEdit,
  ISyntheticObject,
  ISyntheticSourceInfo,
  SyntheticObjectEditor,
  generateSyntheticUID,
  SyntheticObjectSerializer,
 } from "@tandem/sandbox";

import { ISyntheticBrowser } from "../../browser";

import {
  Mutation,
  TreeNode,
  Metadata,
  BubbleDispatcher,
  serialize,
  ITreeWalker,
  deserialize,
  ISerializer,
  IComparable,
  findTreeNode,
  serializable,
} from "@tandem/common";

export interface ISerializedSyntheticDOMNode {
  source: ISyntheticSourceInfo;
  uid: any;
}

export const SyntheticDOMNodeSerializer = SyntheticObjectSerializer;


export abstract class SyntheticDOMNodeEdit<T extends SyntheticDOMNode> extends SyntheticObjectEdit<T> { }
export class SyntheticDOMNodeEditor<T extends SyntheticDOMNode> extends SyntheticObjectEditor<T> { }

// TODO - possibly have metadata here since it's generic and can be used with any synthetic
export abstract class SyntheticDOMNode extends TreeNode<SyntheticDOMNode> implements IComparable, ISyntheticObject, IEditable {

  readonly metadata: Metadata;

  abstract textContent: string;
  readonly namespaceURI: string;
  public $uid: any;
  protected _attached: boolean;

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
    this.metadata.observe(new BubbleDispatcher(this));
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

  get browser(): ISyntheticBrowser {
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

  onChildAdded(child: SyntheticDOMNode) {
    super.onChildAdded(child);
    if (this.ownerDocument) {
      child.$setOwnerDocument(this.ownerDocument);
      if (this._attached) {
        child.$attach(this.ownerDocument);
      } else if (child._attached) {
        child.$detach();
      }
    }
  }

  onChildRemoved(child: SyntheticDOMNode) {
    super.onChildRemoved(child);
    if (this._attached) {
      child.$detach();
    }
  }

  $setOwnerDocument(document: SyntheticDocument) {
    this._ownerDocument = document;
    for (let i = 0, n = this.childNodes.length; i < n; i++) {
      this.childNodes[i].$setOwnerDocument(document);
    }
  }


  $attach(document: SyntheticDocument) {

    if (this._attached && this._ownerDocument === document) {
      return console.warn("Trying to attach an already attached node");
    }

    this._attached = true;
    this._ownerDocument = document;

    this.attachedCallback();

    for (let i = 0, n = this.childNodes.length; i < n; i++) {
      this.childNodes[i].$attach(document);
    }
  }

  $detach() {
    if (!this._attached) return;
    this._attached = false;
    this.detachedCallback();
    for (let i = 0, n = this.childNodes.length; i < n; i++) {
      this.childNodes[i].$detach();
    }
  }

  public $linkClone(clone: SyntheticDOMNode) {
    clone.$source = this.$source;
    clone.$module = this.$module;
    clone.$uid    = this.uid;
    clone.$setOwnerDocument(this.ownerDocument);
    return clone;
  }

  protected attachedCallback() { }
  protected detachedCallback() { }

  /**
   * Clone alias for standard DOM API. Note that there's a slight difference
   * with how these work -- cloneNode for the DOM calls createdCallback on elements. Whereas
   * cloneNode in this context doesn't. Instead cloneNode here serializes & deserializes the node -- reloading
   * the exact state of the object
   *
   * @param {boolean} [deep]
   * @returns
   */

  cloneNode(deep?: boolean) {
    return this.clone(deep);
  }

  abstract accept(visitor: IMarkupNodeVisitor);
  clone(deep?: boolean) {
    if (deep) return deserialize(serialize(this), undefined);
    return this.$linkClone(this.cloneShallow());
  }

  protected abstract cloneShallow();
  abstract createEdit(): BaseContentEdit<any>;
  createEditor(): IEditor {
    return new SyntheticDOMNodeEditor(this);
  }
}
