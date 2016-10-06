import { IMarkupNodeVisitor } from "./visitor";
import { SyntheticDocument } from "../document";
import { TreeNode, patchTreeNode } from "@tandem/common/tree";
import { IPatchable, IComparable } from "@tandem/common/object";

export abstract class SyntheticMarkupNode extends TreeNode<SyntheticMarkupNode> implements IComparable, IPatchable {

  readonly childNodes: SyntheticMarkupNode[];
  abstract readonly nodeType: number;
  private _loaded: boolean;

  constructor(readonly nodeName: string, public ownerDocument: SyntheticDocument) {
    super();

    this.childNodes = this.children;
  }

  get parentNode() {
    return this.parent;
  }

  addEventListener() {
    // TODO
  }

  patch(source: SyntheticMarkupNode) {
    patchTreeNode(this, source);
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