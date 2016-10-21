import { DOMNodeType } from "./node-types";
import { SyntheticDocument } from "../document";
import { IMarkupNodeVisitor } from "./visitor";
import { SyntheticDOMNodeSerializer } from "./node";
import { SyntheticDOMValueNode, SyntheticDOMValueNodeSerializer } from "./value-node";
import { serializable, serialize, deserialize, ISerializable, ISerializer } from "@tandem/common";


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

  cloneNode() {
    const clone = new SyntheticDOMText(this.nodeValue);
    this.linkClone(clone);
    return clone;
  }
}