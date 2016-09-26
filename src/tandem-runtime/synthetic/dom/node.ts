import { WrapBus } from "mesh";
import { SymbolTable } from "../core";
import { SyntheticNodeAction } from "../../actions";
import { IActor, Action } from "tandem-common";
import { synthetic, SyntheticObject, SyntheticValueObject, SyntheticArray } from "../core";

// TODO - implement innerHTML parse
export abstract class SyntheticNode extends SyntheticObject {
  private _parentNode: SyntheticNode;
  private _childObserver: IActor;

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
    if (!this._childObserver) {
      this._childObserver = new WrapBus(this.onChildAction.bind(this));
    }
    node.observe(this._childObserver);
    node.notify(new SyntheticNodeAction(SyntheticNodeAction.NODE_ADDED));
  }

  @synthetic removeChild(node: SyntheticNode) {
    const index = this.childNodes.value.indexOf(node);
    if (index !== -1) {
      this.childNodes.value.splice(index, 1);
      node.notify(new SyntheticNodeAction(SyntheticNodeAction.NODE_REMOVED));
      node._parentNode = undefined;
      node.unobserve(this._childObserver);
    }
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

    const buffer = [];

    for (const child of this.childNodes.value) {
      buffer.push(child.outerHTML);
    }

    return buffer.join("");
  }
}