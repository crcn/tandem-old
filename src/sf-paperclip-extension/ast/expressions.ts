import { IRange } from "sf-core/geom";
import { BaseExpression } from "sf-core/ast";
import { HTMLExpression } from "sf-html-extension/ast";

export class PCBlockExpression extends HTMLExpression {
  constructor(public name: string, public value: string, position: IRange) {
    super(name, position);
  }
  patch(block: PCBlockExpression) {
    this.value = block.value;
  }


  toString() {
    return `\${ ${this.value} }`;
  }
}

