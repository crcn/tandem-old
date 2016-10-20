import { parseSelector } from "./parser";
import { getTreeAncestors, getPreviousTreeSiblings } from "@tandem/common";
import { SelectorExpression, AllSelectorExpression } from "./ast";
import { SyntheticDOMNode, SyntheticDOMElement, DOMNodeType } from "../markup";

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
    if (!node || node.nodeType !== DOMNodeType.ELEMENT) return false;
    return ast.accept({
      visitClassNameSelector({ className }) {
        return node.hasAttribute("class") && String(node.getAttribute("class")).split(" ").indexOf(className) !== -1;
      },
      visitIDSelector({ id }) {
        return node.getAttribute("id") === id;
      },
      visitAllSelector(expression) {
        return true;
      },
      visitTagNameSelector({ tagName }) {
        return tagName.toLowerCase() === node.tagName.toLowerCase();
      },
      visitListSelector({ selectors }) {
        return !!selectors.find((selector) => test(selector, node));
      },
      visitDescendentSelector({ targetSelector, ancestorSelector }) {
        return test(targetSelector, node) && !!getTreeAncestors(node).find((ancestor) => test(ancestorSelector, ancestor));
      },
      visitChildSelector({ targetSelector, parentSelector }) {
        return test(targetSelector, node) && node.parent && test(parentSelector, <SyntheticDOMElement>node.parent);
      },
      visitAdjacentSiblingSelector({ startSelector, targetSelector }) {
        return test(targetSelector, node) && test(startSelector, <SyntheticDOMElement>node.previousSibling);
      },
      visitProceedingSiblingSelector({ startSelector, targetSelector }) {
        return test(targetSelector, node) && getPreviousTreeSiblings(node).filter((previousSibling) => test(startSelector, previousSibling));
      },
      visitAttributeSelector({ name, operator, value }) {

        if (!node.hasAttribute(name)) return false;
        const nodeValue = String(node.getAttribute(name));

        switch (operator) {
          case "=": return value === nodeValue;
          case "~=": return nodeValue.indexOf(value) !== -1;
          case "^=": return nodeValue.indexOf(value) === 0;
          case "|=": return nodeValue.indexOf(value) === 0;
          case "$=": return nodeValue.indexOf(value) + value.length === nodeValue.length;
          case "*=": return nodeValue.indexOf(value) !== -1;
          default: return true;
        }
      },
      visitPseudoSelector({ name, parameterSelector }) {

        switch (name) {
          case "not": return !test(parameterSelector, node);

          // TODO
          // case "nth-child": return !test(parameterSelector, node);
        }

        return false;
      },
      visitPseudoElement({ elementSelector, name }) {
        return false;
      },
      visitElementSelectors({ selectors }) {
        for (let i = 0, n = selectors.length; i < n; i++) {
          const attributeSelector = selectors[i];
          if (!test(attributeSelector, node)) return false;
        }
        return true;
      }
    });
  }

  return _testers[selectorSource] = {
    test: test.bind(this, ast)
  };
}