import { IMarkupNodeVisitor } from "./visitor";
import { SyntheticDocument } from "../document";
import { MarkupNodeExpression } from "./ast";

import {
  TreeNode,
  Metadata,
  BubbleBus,
  IASTNode,
  ISynthetic,
  IPatchable,
  IComparable,
  patchTreeNode,
} from "@tandem/common";

import { ISyntheticMarkupNodeEditor } from "./editor";

let _i = 0;

export abstract class SyntheticMarkupNode extends TreeNode<SyntheticMarkupNode> implements IComparable, IPatchable, ISynthetic {

  /**
   * Unique id for the node -- used particularly for matching rendered DOM nodes
   * with with their synthetic versions.
   */

  private _uid: string;

  /**
   * TRUE if the node has been loaded
   */

  private _loaded: boolean;

  /**
   * extra information specific to the environment that this node is running un
   */

  private _metadata: Metadata;

  /**
   * The source expression that generated this node. May be NULL at times
   * depending on the environment
   */

  public expression: MarkupNodeExpression;

  /**
   * The AST manipulator
   */

  public editor: ISyntheticMarkupNodeEditor;

  /**
   * The DOM node type
   */

  abstract readonly nodeType: number;

  constructor(readonly nodeName: string, public ownerDocument: SyntheticDocument) {
    super();

    this._metadata = new Metadata();
    this._uid = String(++_i);

    // similar to dataset -- specific to the editor
    this._metadata.observe(new BubbleBus(this));
  }

  get childNodes(): SyntheticMarkupNode[] {
    return this.children;
  }

  get uid() {
    return this._uid;
  }

  get metadata() {
    return this._metadata;
  }

  get parentNode() {
    return this.parent;
  }

  addEventListener() {
    // TODO
  }

  patch(source: SyntheticMarkupNode) {
    patchTreeNode(this, source);
    this._metadata.data = Object.assign({}, source.metadata.data);
    this.expression = source.expression;
  }

  abstract textContent: string;

  compare(source: SyntheticMarkupNode) {
    return Number(source.constructor === this.constructor && this.nodeName === source.nodeName);
  }

  removeEventListener() {
    // TODO
  }

  onChildAdded(child: SyntheticMarkupNode) {
    super.onChildAdded(child);
    if (this._loaded) {
      child.load();
    }
  }

  async load() {
    if (this._loaded) return;
    this._loaded = true;
    await this.loadLeaf();
    await this.loadChildNodes();
  }

  protected loadLeaf() { }

  protected async loadChildNodes() {
    for (const child of this.childNodes) {
      await child.load();
    }
  }

  abstract accept(visitor: IMarkupNodeVisitor);
  abstract cloneNode();
}