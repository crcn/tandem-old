import { SyntheticHTMLDocument } from "./document";
import { TreeNode, patchTreeNode } from "@tandem/common/tree";
import { IPatchable, IComparable } from "@tandem/common/object";

export abstract class SyntheticHTMLNode extends TreeNode<SyntheticHTMLNode> implements IComparable, IPatchable {
  readonly childNodes: SyntheticHTMLNode[];
  abstract readonly nodeType: number;

  constructor(readonly nodeName: string, public ownerDocument: SyntheticHTMLDocument) {
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

  get outerHTML() {
    return "";
  }

  compare(source: SyntheticHTMLNode) {
    return Number(source.constructor === this.constructor && this.nodeName === source.nodeName);
  }

  removeEventListener() {
    // TODO
  }
}