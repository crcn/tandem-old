import { SyntheticNode } from "./node";
import { synthetic, SyntheticValueObject } from "../synthetic";

export class SyntheticTextNode extends SyntheticNode {

  constructor(nodeValue: SyntheticValueObject<string>) {
    super("#text");
    this.set("nodeValue", nodeValue);
  }
}