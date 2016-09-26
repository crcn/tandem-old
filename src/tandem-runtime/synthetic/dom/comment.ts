import { SyntheticNode } from "./node";
import { synthetic, SyntheticValueObject, SyntheticString } from "../core";

export class SyntheticComment extends SyntheticNode {

  constructor(nodeValue: SyntheticValueObject<string>) {
    super(new SyntheticString("#comment"));
    this.set("nodeValue", nodeValue);
  }

  get outerHTML()  {
    return this.innerHTML;
  }

  get innerHTML()  {
    return `<!-- ${this.get("nodeValue").toString()} -->`;
  }
}