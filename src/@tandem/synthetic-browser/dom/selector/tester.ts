import { parseSelector } from "./parser";
import { SyntheticDOMNode, SyntheticDOMElement, MarkupNodeType } from "../markup";
import { SelectorExpression, AllSelectorExpression } from "./ast";

export function createSelectorTester(selectorSource: string) {

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

  return {
    test: test.bind(this, ast)
  };
}