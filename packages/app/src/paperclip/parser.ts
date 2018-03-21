import { ElementAttributeExpression, ElementExpression, ExpressionLocation, Expression, ExpressionRange } from "./expression-state";

class StringScanner {
  constructor(readonly source: string) {

  }
}

export const parse = (source: string): ElementExpression => {
  const scanner: StringScanner = new StringScanner(source);

  return null;
};