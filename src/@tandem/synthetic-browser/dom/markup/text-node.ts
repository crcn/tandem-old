import { DOMNodeType } from "./node-types";
import { SyntheticDocument } from "../document";
import { IMarkupNodeVisitor } from "./visitor";
import { SyntheticDOMNodeSerializer } from "./node";
import { BaseContentEdit, EditAction } from "@tandem/sandbox";
import { serializable, serialize, deserialize, ISerializable, ISerializer } from "@tandem/common";
import { SyntheticDOMValueNode, SyntheticDOMValueNodeSerializer, SyntheticDOMValueNodeEdit } from "./value-node";


@serializable(new SyntheticDOMNodeSerializer(new SyntheticDOMValueNodeSerializer()))
export class SyntheticDOMText extends SyntheticDOMValueNode {
  readonly nodeType: number = DOMNodeType.TEXT;
  constructor(nodeValue: string) {
    super("#text", nodeValue);
  }

  get textContent(): string {
    return this.nodeValue;
  }

  toString() {
    return this.nodeValue;
  }

  accept(visitor: IMarkupNodeVisitor) {
    return visitor.visitText(this);
  }

  clone() {
    return this.linkClone(new SyntheticDOMText(this.nodeValue));
  }

  createEdit(): SyntheticDOMValueNodeEdit<SyntheticDOMText> {
    return new SyntheticDOMValueNodeEdit(this);
  }
}