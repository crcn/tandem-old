import { synthetic, SyntheticObject, SyntheticValueObject, SyntheticArray } from "../core";

// TODO - implement innerHTML parse
export abstract class SyntheticNode extends SyntheticObject {
  private _parentNode: SyntheticNode;

  constructor(nodeName: SyntheticValueObject<string>) {
    super();
    this.set("nodeName", nodeName);
    this.set("childNodes", new SyntheticArray<SyntheticNode>());
  }

  abstract get innerHTML();
  abstract get outerHTML();

  get nodeName(): SyntheticValueObject<string> {
    return this.get<SyntheticValueObject<string>>("nodeName");
  }

  get parentNode(): SyntheticNode {
    return this._parentNode;
  }

  get childNodes(): SyntheticArray<SyntheticNode> {
    return this.get<SyntheticArray<SyntheticNode>>("childNodes");
  }

  @synthetic appendChild(node: SyntheticNode) {
    this.childNodes.value.push(node);
    node._parentNode = this;
  }

  @synthetic removeChild(node: SyntheticNode) {
    const index = this.childNodes.value.indexOf(node);
    if (index !== -1) {
      this.childNodes.value.splice(index, 1);
      node._parentNode = undefined;
    }
  }
}

export abstract class SyntheticContainerNode extends SyntheticNode {

  get outerHTML()  {
    return this.innerHTML;
  }

  get innerHTML() {

    const buffer = [];

    for (const child of this.childNodes.value) {
      buffer.push(child.outerHTML);
    }

    return buffer.join("");
  }
}