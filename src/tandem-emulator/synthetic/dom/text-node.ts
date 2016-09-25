import { SyntheticNode } from "./node";
import { synthetic, SyntheticValueObject, SyntheticString } from "../core";

export class SyntheticTextNode extends SyntheticNode {

  constructor(nodeValue: SyntheticValueObject<string>) {
    super(new SyntheticString("#text"));
    this.set("nodeValue", nodeValue);
  }

  get outerHTML()  {
    return this.get("nodeValue").toString();
  }

  get innerHTML()  {
    return this.get("nodeValue").toString();
  }
}