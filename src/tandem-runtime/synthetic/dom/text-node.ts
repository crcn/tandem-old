import { SyntheticNode } from "./node";
import { SyntheticDocument } from "./document";
import { synthetic, SyntheticValueObject, SyntheticString } from "../core";

export class SyntheticTextNode extends SyntheticNode {

  constructor(nodeValue: SyntheticValueObject<string>, doc: SyntheticDocument) {
    super(new SyntheticString("#text"), doc);
    this.set("nodeValue", nodeValue);
  }

  get outerHTML()  {
    return this.get("nodeValue");
  }

  get innerHTML()  {
    return this.get("nodeValue");
  }
}