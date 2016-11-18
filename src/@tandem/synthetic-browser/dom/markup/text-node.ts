import { DOMNodeType } from "./node-types";
import { SyntheticDocument } from "../document";
import { IMarkupNodeVisitor } from "./visitor";
import { SyntheticDOMNodeSerializer } from "./node";
import { BaseContentEdit, EditChange } from "@tandem/sandbox";
import { serializable, serialize, deserialize, ISerializable, ISerializer, ITreeWalker } from "@tandem/common";
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

  cloneShallow() {
    return new SyntheticDOMText(this.nodeValue);
  }

  visitWalker(walker: ITreeWalker) { }
}