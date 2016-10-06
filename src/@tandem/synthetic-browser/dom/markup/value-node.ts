import { HTMLNodeType } from "./node-types";
import { SyntheticHTMLNode } from "./node";
import { SyntheticDocument } from "../document";
import { patchable, bindable } from "@tandem/common/decorators";

export abstract class SyntheticMarkupValueNode extends SyntheticHTMLNode {

  @patchable()
  @bindable()
  public nodeValue: string;

  constructor(nodeName: string, nodeValue: string, ownerDocument: SyntheticDocument) {
    super(nodeName, ownerDocument);
    this.nodeValue = nodeValue;
  }
}