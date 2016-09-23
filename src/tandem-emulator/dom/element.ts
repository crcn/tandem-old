import { SyntheticNode } from "./node";

export class SyntheticElement extends SyntheticNode {
  constructor(tagName: string) {
    super(tagName);
  }
}