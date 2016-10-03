import { IASTNode } from "@tandem/ast";
import { SyntheticDocument } from "./document";
import { TreeNode, patchTreeNode } from "@tandem/common/tree";

export abstract class SyntheticHTMLNode extends TreeNode<SyntheticHTMLNode> {
  readonly childNodes: SyntheticHTMLNode[];
  abstract readonly nodeType: number;

  constructor(readonly nodeName: string, public ownerDocument: SyntheticDocument) {
    super();

    this.childNodes = this.children;
  }

  addEventListener() {
    // TODO
  }

  removeEventListener() {
    // TODO
  }
}