import { SyntheticObject, SyntheticValueObject, SyntheticArray } from "../synthetic";

export abstract class SyntheticNode extends SyntheticObject {
  constructor(nodeName: string) {
    super();
    this.set("nodeName", new SyntheticValueObject(nodeName));
    this.set("childNodes", new SyntheticArray<SyntheticNode>());
  }

  get childNodes(): Array<SyntheticNode> {
    return this.get("childNodes").value;
  }

  appendChild(node: SyntheticNode) {
    this.childNodes.push(node);
  }
}