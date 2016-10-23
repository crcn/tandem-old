import { bindable } from "@tandem/common";
import { ISerializer } from "@tandem/common";
import { DOMNodeType } from "./node-types";
import { SyntheticDOMNode } from "./node";
import { SyntheticDocument } from "../document";
import { BaseSyntheticObjectEdit, EditAction, SetValueEditActon } from "@tandem/sandbox";

export interface ISerializedSyntheticDOMValueNode {
  nodeValue: string;
}

export class SyntheticDOMValueNodeEdit extends BaseSyntheticObjectEdit<SyntheticDOMValueNode> {
  static readonly SET_VALUE_NODE_EDIT = "setValueNodeEdit";

  setValueNode(nodeValue: string) {
    return this.addAction(new SetValueEditActon(SyntheticDOMValueNodeEdit.SET_VALUE_NODE_EDIT, this.target, nodeValue));
  }

  addDiff(newValueNode: SyntheticDOMValueNode) {
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

  @bindable(true)
  public nodeValue: string;

  public targetNode: SyntheticDOMValueNode;

  constructor(nodeName: string, nodeValue: string) {
    super(nodeName);
    this.nodeValue = nodeValue;
  }

  createEdit() {
    return new SyntheticDOMValueNodeEdit(this);
  }

  applyEdit(action: EditAction) {
    switch(action.type) {
      case SyntheticDOMValueNodeEdit.SET_VALUE_NODE_EDIT:
        this.nodeValue = (<SetValueEditActon>action).newValue;
      break;
    }
  }
}