import { bindable } from "@tandem/common";
import { DOMNodeType } from "./node-types";
import { ISerializer } from "@tandem/common";
import { SyntheticDOMNode } from "./node";
import { SyntheticDocument } from "../document";

export function createDOMValueNodeSerializer(createValueNode: (nodeValue) => SyntheticDOMValueNode) {
  return class SyntheticDOMValueNodeSerializer implements ISerializer<SyntheticDOMValueNode, string> {
    serialize(value: SyntheticDOMValueNode) {
      return value.nodeValue;
    }
    deserialize(value: string) {
      return createValueNode(value);
    }
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