import { HTMLNodeType } from "./node-types";
import { SyntheticMarkupNode } from "./node";
import { SyntheticDocument } from "../document";
import { patchable, bindable } from "@tandem/common/decorators";

export abstract class SyntheticMarkupValueNode extends SyntheticMarkupNode {

  @patchable()
  @bindable()
  public nodeValue: string;

  constructor(nodeName: string, nodeValue: string, ownerDocument: SyntheticDocument) {
    super(nodeName, ownerDocument);
    this.nodeValue = nodeValue;
  }
}