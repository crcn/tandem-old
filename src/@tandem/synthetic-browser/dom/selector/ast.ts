import { BaseASTNode, IRange } from "@tandem/common";

import { SyntheticDOMElement } from "../markup";

export interface ISelectorVisitor {
  visitAllSelector(expression: AllSelectorExpression);
  visitTagNameSelector(expression: TagNameSelectorExpression);
}

export abstract class SelectorExpression extends BaseASTNode<SelectorExpression> {
  abstract accept(visitor: ISelectorVisitor);
}

export class AllSelectorExpression extends SelectorExpression {
  accept(visitor: ISelectorVisitor) {
    return visitor.visitAllSelector(this);
  }
}

export class TagNameSelectorExpression extends SelectorExpression {
  constructor(readonly tagName: string, position: IRange) {
    super(position);
  }
  accept(visitor: ISelectorVisitor) {
    return visitor.visitTagNameSelector(this);
  }
}