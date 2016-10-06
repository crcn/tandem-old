import { parse } from "./parser.peg";
import { SyntheticMarkupNode, SyntheticMarkupElement, MarkupNodeType } from "../markup";
import { SelectorExpression, AllSelectorExpression } from "./ast";

export function parseSelector(selectorSource: string) {
  return parse(selectorSource);
}
