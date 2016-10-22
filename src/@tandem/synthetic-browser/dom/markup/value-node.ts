import { bindable } from "@tandem/common";
import { DOMNodeType } from "./node-types";
import { ISerializer } from "@tandem/common";
import { SyntheticDOMNode } from "./node";
import { SyntheticDocument } from "../document";
import { BaseContentEdit, EditAction, SetValueEditActon } from "@tandem/sandbox";

export interface ISerializedSyntheticDOMValueNode {
  nodeValue: string;
}

export class SyntheticDOMValueNodeEdit<T extends SyntheticDOMValueNode> extends BaseContentEdit<T> {
  static readonly SET_VALUE_NODE_EDIT = "setValueNodeEdit";

  setValueNode(nodeValue: string) {
    return this.addAction(new SetValueEditActon(SyntheticDOMValueNodeEdit.SET_VALUE_NODE_EDIT, this.target, nodeValue));
  }
  addDiff(newValueNode: T) {
    if (this.target.nodeValue !== newValueNode.nodeValue) {
      this.setValueNode(newValueNode.nodeValue);
    }
    return this;
  }
}

export class SyntheticDOMValueNodeSerializer implements ISerializer<SyntheticDOMValueNode, ISerializedSyntheticDOMValueNode> {
  serialize({ nodeValue }: SyntheticDOMValueNode) {
    return { nodeValue };
  }
  deserialize({ nodeValue }, dependencies, ctor) {
    return new ctor(nodeValue);
  }
}
export abstract class SyntheticDOMValueNode extends SyntheticDOMNode {

  @bindable()
  public nodeValue: string;

  public targetNode: SyntheticDOMValueNode;

  constructor(nodeName: string, nodeValue: string) {
    super(nodeName);
    this.nodeValue = nodeValue;
  }
}