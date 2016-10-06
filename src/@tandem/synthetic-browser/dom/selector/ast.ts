import { BaseASTNode, IRange } from "@tandem/common";

import { SyntheticMarkupElement } from "../markup";

export interface ISelectorVisitor {
  visitAllSelector(expression: AllSelectorExpression);
}

export abstract class SelectorExpression extends BaseASTNode<SelectorExpression> {
  abstract accept(visitor: ISelectorVisitor);
}

export class AllSelectorExpression extends SelectorExpression {
  accept(visitor: ISelectorVisitor) {
    return visitor.visitAllSelector(this);
  }
}