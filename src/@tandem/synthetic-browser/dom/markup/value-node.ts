import { bindable } from "@tandem/common";
import { ISerializer } from "@tandem/common";
import { DOMNodeType } from "./node-types";
import { SyntheticDOMNode, SyntheticDOMNodeEdit } from "./node";
import { SyntheticDocument } from "../document";
import { BaseContentEdit, EditChange, SetValueEditActon, SetKeyValueEditChange } from "@tandem/sandbox";

export interface ISerializedSyntheticDOMValueNode {
  nodeValue: string;
}

export class SyntheticDOMValueNodeEdit extends SyntheticDOMNodeEdit<SyntheticDOMValueNode> {
  static readonly SET_VALUE_NODE_EDIT = "setValueNodeEdit";

  setValueNode(nodeValue: string) {
    return this.addChange(new SetValueEditActon(SyntheticDOMValueNodeEdit.SET_VALUE_NODE_EDIT, this.target, nodeValue));
  }

  addDiff(newValueNode: SyntheticDOMValueNode) {
    if (this.target.nodeValue !== newValueNode.nodeValue) {
      this.setValueNode(newValueNode.nodeValue);
    }
    return super.addDiff(newValueNode);
  }
}

export class SyntheticDOMValueNodeSerializer implements ISerializer<SyntheticDOMValueNode, ISerializedSyntheticDOMValueNode> {
  serialize({ nodeValue }: SyntheticDOMValueNode) {
    return { nodeValue };
  }
  deserialize({ nodeValue }, injector, ctor) {
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

  applyEditChange(action: EditChange) {
    switch(action.type) {
      case SyntheticDOMValueNodeEdit.SET_VALUE_NODE_EDIT:
        this.nodeValue = (<SetValueEditActon>action).newValue;
      break;
      case SyntheticDOMNodeEdit.SET_SYNTHETIC_SOURCE_EDIT:
        (<SetKeyValueEditChange>action).applyTo(this);
      break;
    }
  }
}