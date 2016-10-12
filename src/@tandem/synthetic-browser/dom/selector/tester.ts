import { parseSelector } from "./parser";
import { getTreeAncestors } from "@tandem/common";
import { SelectorExpression, AllSelectorExpression } from "./ast";
import { SyntheticDOMNode, SyntheticDOMElement, MarkupNodeType } from "../markup";

const _testers = {};

export function getSelectorTester(selectorSource: string): { test(node: SyntheticDOMElement): boolean } {
  if (_testers[selectorSource]) return _testers[selectorSource];

  // if selectorSource is undefined or false, then return a tester
  // that also always returns
  if (!selectorSource) {
    return {
      test: () => false
    };
  }

  const ast = parseSelector(selectorSource);

  function test(ast: SelectorExpression, node: SyntheticDOMElement) {
    if (node.nodeType !== MarkupNodeType.ELEMENT) return false;
    return ast.accept({
      visitClassNameSelector(expression) {
        return node.hasAttribute("class") && String(node.getAttribute("class")).split(" ").indexOf(expression.className) !== -1;
      },
      visitIDSelector(expression) {
        return node.getAttribute("id") === expression.id;
      },
      visitAllSelector(expression) {
        return true;
      },
      visitTagNameSelector(expression) {
        return expression.tagName.toLowerCase() === node.tagName.toLowerCase();
      },
      visitListSelector(expression) {
        return !!expression.selectors.find((selector) => test(selector, node));
      },
      visitDescendentSelector(expression) {
        test(expression.targetSelector, node) && !!getTreeAncestors(node).find((ancestor) => test(expression.ancestorSelector, ancestor));
      },
      visitChildSelector(expression) {
        return test(expression.targetSelector, node) && node.parent && test(expression.parentSelector, <SyntheticDOMElement>node.parent);
      },
      visitAdjacentSelector(expression) {

      },
      visitProceedingSiblingSelector(expression) {

      }
    });
  }

  return _testers[selectorSource] = {
    test: test.bind(this, ast)
  };
}