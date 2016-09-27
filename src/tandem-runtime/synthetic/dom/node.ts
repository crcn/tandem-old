import { WrapBus } from "mesh";
import { SymbolTable } from "../core";
import { HTMLNodeType } from "./node-types";
import { IActor, Action } from "tandem-common";
import { SyntheticDocument } from "./document";
import { SyntheticNodeAction } from "../../actions";
import { synthetic, SyntheticObject, SyntheticString, SyntheticValueObject, SyntheticArray } from "../core";

// TODO - implement innerHTML parse
export abstract class SyntheticNode extends SyntheticObject {
  private _parentNode: SyntheticNode;
  abstract readonly nodeType: HTMLNodeType;

  constructor(nodeName: SyntheticValueObject<string>, public ownerDocument: SyntheticDocument) {
    super();
    this.set("nodeName", nodeName);
    this.set("childNodes", new SyntheticArray<SyntheticNode>());
  }

  abstract get innerHTML(): SyntheticString;
  abstract get outerHTML(): SyntheticString;

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
    if (node._parentNode) {
      node._parentNode.removeChild(node);
    }
    this.childNodes.value.push(node);
    node._parentNode = this;
  }

  @synthetic removeChild(node: SyntheticNode) {
    const index = this.childNodes.value.indexOf(node);
  }

  protected onChildAction(action: Action) {
    this.notify(action);
  }
}

export abstract class SyntheticContainerNode extends SyntheticNode {

  get outerHTML()  {
    return this.innerHTML;
  }

  get innerHTML() {
    return new SyntheticString(this.childNodes.value.map(child => child.outerHTML).join(""));
  }
}