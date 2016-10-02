import { IASTNode } from "@tandem/ast";

export abstract class SyntheticNode {
  constructor(readonly nodeName: string, protected _source?: IASTNode) {

  }

  get source(): IASTNode {
    return this._source;
  }
}