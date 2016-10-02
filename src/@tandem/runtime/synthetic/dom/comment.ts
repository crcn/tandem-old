import { HTMLNodeType } from "./node-types";
import { SyntheticNode } from "./node";
import { SyntheticDocument } from "./document";
import { synthetic, SyntheticValueObject, SyntheticString } from "../core";

export class SyntheticComment extends SyntheticNode {
  readonly nodeType = HTMLNodeType.TEXT;

  constructor(nodeValue: SyntheticValueObject<string>, doc: SyntheticDocument) {
    super(new SyntheticString("#comment"), doc);
    this.set("nodeValue", nodeValue);
  }

  get outerHTML()  {
    return this.innerHTML;
  }

  get innerHTML()  {
    return new SyntheticString(`<!-- ${this.get("nodeValue").toString()} -->`);
  }
}