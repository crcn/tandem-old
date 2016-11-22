import { bindable } from "@tandem/common";
import { DOMNodeType } from "./node-types";
import { SyntheticDocument } from "../document";
import { ISerializer, PropertyChangeEvent, Mutation, SetValueMutation, PropertyMutation  } from "@tandem/common";
import { SyntheticDOMNode, SyntheticDOMNodeEdit } from "./node";
import { BaseContentEdit} from "@tandem/sandbox";

export interface ISerializedSyntheticDOMValueNode {
  nodeValue: string;
}

export namespace SyntheticDOMValueNodeMutationTypes {
  export const SET_VALUE_NODE_EDIT = "setValueNodeEdit";
}

export class SyntheticDOMValueNodeEdit extends SyntheticDOMNodeEdit<SyntheticDOMValueNode> {

  setValueNode(nodeValue: string) {
    return this.addChange(new SetValueMutation(SyntheticDOMValueNodeMutationTypes.SET_VALUE_NODE_EDIT, this.target, nodeValue));
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

  private _nodeValue: any;

  public targetNode: SyntheticDOMValueNode;

  constructor(nodeName: string, nodeValue: string) {
    super(nodeName);
    this.nodeValue = nodeValue;
  }

  get nodeValue() {
    return this._nodeValue;
  }

  set nodeValue(value: any) {
    this._nodeValue = value;

    this.notify(new PropertyMutation(SyntheticDOMValueNodeMutationTypes.SET_VALUE_NODE_EDIT, this, "nodeValue", value));
    this.notify(new PropertyChangeEvent(PropertyChangeEvent.PROPERTY_CHANGE, "nodeValue", value));
  }

  createEdit() {
    return new SyntheticDOMValueNodeEdit(this);
  }

  applyEditChange(change: Mutation<any>) {
    switch(change.type) {
      case SyntheticDOMValueNodeMutationTypes.SET_VALUE_NODE_EDIT:
        this.nodeValue = (<SetValueMutation<any>>change).newValue;
      break;
      case SyntheticDOMNodeEdit.SET_SYNTHETIC_SOURCE_EDIT:
        (<PropertyMutation<any>>change).applyTo(this);
      break;
    }
  }
}