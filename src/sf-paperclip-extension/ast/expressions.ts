import { IRange } from "sf-core/geom";
import { HTMLExpression } from "sf-html-extension/ast";

export class PCBlockNodeExpression extends HTMLExpression {
  constructor(public value: string, position: IRange) {
    super("#block", position);
  }
  patch(block: PCBlockNodeExpression) {
    this.value = block.value;
  }
}
