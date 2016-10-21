import { bindable } from "@tandem/common";
import { DOMNodeType } from "./node-types";
import { ISerializer } from "@tandem/common";
import { SyntheticDOMNode } from "./node";
import { SyntheticDocument } from "../document";

export interface ISerializedSyntheticDOMValueNode {
  nodeValue: string;
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