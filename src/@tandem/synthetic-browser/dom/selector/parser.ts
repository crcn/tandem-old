import { parse } from "./parser.peg";
import { SyntheticDOMNode, SyntheticDOMElement, DOMNodeType } from "../markup";
import { SelectorExpression, AllSelectorExpression } from "./ast";

const _cache = {};

export function parseSelector(selectorSource: string) {
  return _cache[selectorSource] || (_cache[selectorSource] = parse(selectorSource));
}
