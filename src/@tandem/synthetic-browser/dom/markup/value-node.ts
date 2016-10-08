import { MarkupNodeType } from "./node-types";
import { SyntheticDOMNode } from "./node";
import { SyntheticDocument } from "../document";
import { patchable, bindable } from "@tandem/common/decorators";

export abstract class SyntheticDOMValueNode extends SyntheticDOMNode {

  @patchable()
  @bindable()
  public nodeValue: string;

  constructor(nodeName: string, nodeValue: string, ownerDocument: SyntheticDocument) {
    super(nodeName, ownerDocument);
    this.nodeValue = nodeValue;
  }
}