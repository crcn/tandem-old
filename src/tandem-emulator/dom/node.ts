import { SyntheticObject } from "../synthetic";

export abstract class SyntheticNode extends SyntheticObject {
  readonly childNodes: Array<SyntheticNode> = [];
  readonly nodeName: string;
  constructor(nodeName: string) {
    super();
    this.nodeName = nodeName;
  }

  appendChild(node: SyntheticNode) {
    this.childNodes.push(node);
  }

}