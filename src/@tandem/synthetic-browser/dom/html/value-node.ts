import { HTMLNodeType } from "./node-types";
import { SyntheticHTMLNode } from "./node";
import { SyntheticHTMLDocument } from "./document";
import { patchable, bindable } from "@tandem/common/decorators";

export abstract class SyntheticHTMLValueNode extends SyntheticHTMLNode {

  @patchable()
  @bindable()
  public nodeValue: string;

  constructor(nodeName: string, nodeValue: string, ownerDocument: SyntheticHTMLDocument) {
    super(nodeName, ownerDocument);
    this.nodeValue = nodeValue;
  }
}