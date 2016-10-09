import { parseSelector } from "./parser";
import { SyntheticDOMNode, SyntheticDOMElement, MarkupNodeType } from "../markup";
import { SelectorExpression, AllSelectorExpression } from "./ast";

const _testers = {};

export function getSelectorTester(selectorSource: string): { test(node: SyntheticDOMElement): boolean } {
  if (_testers[selectorSource]) return _testers[selectorSource];

  const ast = parseSelector(selectorSource);

  function test(ast: SelectorExpression, node: SyntheticDOMElement) {
    if (node.nodeType !== MarkupNodeType.ELEMENT) return false;
    return ast.accept({
      visitAllSelector(expression) {
        return true;
      },
      visitTagNameSelector(expression) {
        return expression.tagName.toLowerCase() === node.tagName.toLowerCase();
      }
    });
  }

  return _testers[selectorSource] = {
    test: test.bind(this, ast)
  };
}