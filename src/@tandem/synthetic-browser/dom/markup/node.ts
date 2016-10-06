import { IMarkupNodeVisitor } from "./visitor";
import { SyntheticDocument } from "../document";
import { TreeNode, patchTreeNode } from "@tandem/common/tree";
import { IPatchable, IComparable } from "@tandem/common/object";

export abstract class SyntheticHTMLNode extends TreeNode<SyntheticHTMLNode> implements IComparable, IPatchable {

  readonly childNodes: SyntheticHTMLNode[];
  abstract readonly nodeType: number;
  readonly namespaceURI: string;
  private _loaded: boolean;

  constructor(readonly nodeName: string, public ownerDocument: SyntheticDocument) {
    super();

    this.childNodes = this.children;
  }

  addEventListener() {
    // TODO
  }

  patch(source: SyntheticHTMLNode) {
    patchTreeNode(this, source);
  }

  abstract textContent: string;

  compare(source: SyntheticHTMLNode) {
    return Number(source.constructor === this.constructor && this.nodeName === source.nodeName);
  }

  removeEventListener() {
    // TODO
  }

  onChildAdded(child: SyntheticHTMLNode) {
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