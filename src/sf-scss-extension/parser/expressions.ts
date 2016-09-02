import { IRange } from "sf-core/geom";
import { BaseExpression } from "sf-core/ast";

export class SASSExpression extends BaseExpression<SASSExpression> {
  constructor(position: IRange) {
    super(position);
  }
}

export class SASSStyleSheetExpression extends SASSExpression {
  constructor(position: IRange, readonly expressions: Array<SASSExpression>) {
    super(position);
  }
  toString() {
    return this.expressions.join("");
  }
}

export class SCSSVariableDeclarationExpression extends SASSExpression {
  constructor(public name: string, public value: string, position: IRange) {
    super(position);
  }
  toString() {
    return `${this.name}:${this.value};`;
  }
}