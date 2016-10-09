import { MarkupNodeType } from "./node-types";
import { SyntheticDOMNode } from "./node";
import { SyntheticDocument } from "../document";
import { patchable, bindable, PropertyChangeAction } from "@tandem/common";

export abstract class SyntheticDOMValueNode extends SyntheticDOMNode {

  private _nodeValue: string;
  public targetNode: SyntheticDOMValueNode;

  constructor(nodeName: string, nodeValue: string, ownerDocument: SyntheticDocument) {
    super(nodeName, ownerDocument);
    this.nodeValue = nodeValue;
  }

  @patchable()
  get nodeValue(): string {
    return this._nodeValue;
  }

  set nodeValue(value: string) {
    const oldValue = this._nodeValue;
    this._nodeValue = value;
    if (this.targetNode) {
      this.targetNode.nodeValue = value;
    }
    this.notify(new PropertyChangeAction("nodeValue", value, oldValue));
  }

}