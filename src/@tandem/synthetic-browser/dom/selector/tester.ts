import { parseSelector } from "./parser";
import { SyntheticMarkupNode, SyntheticMarkupElement, MarkupNodeType } from "../markup";
import { SelectorExpression, AllSelectorExpression } from "./ast";

export function createSelectorTester(selectorSource: string) {

  const ast = parseSelector(selectorSource);

  function test(ast: SelectorExpression, node: SyntheticMarkupElement) {
    if (node.nodeType !== MarkupNodeType.ELEMENT) return false;
    return ast.accept({
      visitAllSelector(expression) {
        return true;
      }
    });
  }

  return {
    test: test.bind(this, ast)
  };
}