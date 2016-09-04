import { IRange } from "tandem-common/geom";
import { BaseExpression } from "tandem-common/ast";

export class SASSExpression extends BaseExpression<SASSExpression> {
  constructor(source, position: IRange) {
    super(source, position);
  }
}

export class SASSStyleSheetExpression extends SASSExpression {
  constructor(source: string, position: IRange, readonly expressions: Array<SASSExpression>) {
    super(source, position);
  }
  toString() {
    return this.expressions.join("");
  }
}

export class SCSSVariableDeclarationExpression extends SASSExpression {
  constructor(public name: string, public value: string, source: string, position: IRange) {
    super(source, position);
  }
  toString() {
    return `${this.name}:${this.value};`;
  }
}