import { IRange } from "sf-core/geom";
import { HTMLExpression } from "sf-html-extension/ast";

export class PCBlockNodeExpression extends HTMLExpression {
  constructor(public script: string, position: IRange) {
    super("#block", position);
  }
  patch(block: PCBlockNodeExpression) {
    this.script = block.script;
  }
}
