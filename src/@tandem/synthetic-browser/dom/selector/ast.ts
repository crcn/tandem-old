import { BaseASTNode, IRange } from "@tandem/common";

import { SyntheticDOMElement } from "../markup";

export enum SelectorKind {
  // ALL = 1;
  // TODO
}

export interface ISelectorVisitor {
  visitClassNameSelector(expression: ClassNameSelectorExpression);
  visitIDSelector(expression: IDSelectorExpression);
  visitAllSelector(expression: AllSelectorExpression);
  visitTagNameSelector(expression: TagNameSelectorExpression);
  visitListSelector(expression: ListSelectorExpression);
  visitDescendentSelector(expression: DescendentSelectorExpression);
  visitChildSelector(expression: ChildSelectorExpression);
  visitAttributeSelector(expression: AttributeSelectorExpression);
  visitAdjacentSiblingSelector(expression: AdjacentSiblingSelectorExpression);
  visitPseudoSelector(expression: PseudoSelectorExpression);
  visitElementSelectors(expression: ElementSelectorsExpression);
  visitPseudoElement(expression: PseudoElementExpression);
  visitProceedingSiblingSelector(expression: ProceedingSiblingSelectorExpression);
}

export abstract class SelectorExpression extends BaseASTNode<SelectorExpression> {
  abstract accept(visitor: ISelectorVisitor);
}

// .item { }
export class ClassNameSelectorExpression extends SelectorExpression {
  constructor(readonly className: string, position: IRange) {
    super(position);
  }
  accept(visitor: ISelectorVisitor) {
    return visitor.visitClassNameSelector(this);
  }
}

// #item { }
export class IDSelectorExpression extends SelectorExpression {
  constructor(readonly id: string, position: IRange) {
    super(position);
  }
  accept(visitor: ISelectorVisitor) {
    return visitor.visitIDSelector(this);
  }
}

// div { }
export class TagNameSelectorExpression extends SelectorExpression {
  constructor(readonly tagName: string, position: IRange) {
    super(position);
  }
  accept(visitor: ISelectorVisitor) {
    return visitor.visitTagNameSelector(this);
  }
}

// div, span { }
export class ListSelectorExpression extends SelectorExpression {
  constructor(readonly selectors: SelectorExpression[], position: IRange) {
    super(position);
  }
  accept(visitor: ISelectorVisitor) {
    return visitor.visitListSelector(this);
  }
}

// * { }
export class AllSelectorExpression extends SelectorExpression {
  accept(visitor: ISelectorVisitor) {
    return visitor.visitAllSelector(this);
  }
}

// div span { }
export class DescendentSelectorExpression extends SelectorExpression {
  constructor(readonly ancestorSelector: SelectorExpression, readonly targetSelector: SelectorExpression, position: IRange) {
    super(position);
  }
  accept(visitor: ISelectorVisitor) {
    return visitor.visitDescendentSelector(this);
  }
}

// div > span { }
export class ChildSelectorExpression extends SelectorExpression {
  constructor(readonly parentSelector: SelectorExpression, readonly targetSelector: SelectorExpression, position: IRange) {
    super(position);
  }
  accept(visitor: ISelectorVisitor) {
    return visitor.visitChildSelector(this);
  }
}

// div + span { }
export class AdjacentSiblingSelectorExpression extends SelectorExpression {
  constructor(readonly startSelector: SelectorExpression, readonly targetSelector: SelectorExpression, position: IRange) {
    super(position);
  }
  accept(visitor: ISelectorVisitor) {
    return visitor.visitAdjacentSiblingSelector(this);
  }
}

// div ~ span { }
export class ProceedingSiblingSelectorExpression extends SelectorExpression {
  constructor(readonly startSelector: SelectorExpression, readonly targetSelector: SelectorExpression, position: IRange) {
    super(position);
  }
  accept(visitor: ISelectorVisitor) {
    return visitor.visitProceedingSiblingSelector(this);
  }
}

// [attribute]
// [attribute~=value]
// [attribute^=value]
// [attribute$=value]
// [attribute*=value]
export class AttributeSelectorExpression extends SelectorExpression {
  constructor(readonly name: string, readonly operator: string, readonly value: string, position: IRange) {
    super(position);
  }
  accept(visitor: ISelectorVisitor) {
    return visitor.visitAttributeSelector(this);
  }
}

export class PseudoSelectorExpression extends SelectorExpression {
  constructor(readonly name: string, readonly parameterSelector: SelectorExpression, position: IRange) {
    super(position);
  }
  accept(visitor: ISelectorVisitor) {
    return visitor.visitPseudoSelector(this);
  }
}

export class ElementSelectorsExpression extends SelectorExpression {
  constructor(readonly selectors: SelectorExpression[], position: IRange) {
    super(position);
  }
  accept(visitor: ISelectorVisitor) {
    return visitor.visitElementSelectors(this);
  }
}

export class PseudoElementExpression extends SelectorExpression {
  constructor(readonly elementSelector: SelectorExpression, readonly name: string, position: IRange) {
    super(position);
  }
  accept(visitor: ISelectorVisitor) {
    return visitor.visitPseudoElement(this);
  }
}
