import { parseSelector } from "./parser";
import { getTreeAncestors, getPreviousTreeSiblings } from "@tandem/common";
import { SelectorExpression, AllSelectorExpression } from "./ast";
import { SyntheticDOMNode, SyntheticDOMElement, DOMNodeType } from "../markup";

const _testers = {};

export interface ISelectorTester {
  source: string;
  test(node: SyntheticDOMNode);
}

export function getSelectorTester(selectorSource: string): ISelectorTester {
  if (_testers[selectorSource]) return _testers[selectorSource];

  // check for all - short optimization to avoid AST traversing.
  if (selectorSource === "*") {
    return {
      source: selectorSource,
      test(node) {
        return node && (node.nodeType === DOMNodeType.ELEMENT);
      }
    }
  }

  // if selectorSource is undefined or false, then return a tester
  // that also always returns
  if (!selectorSource) {
    return {
      source: selectorSource,
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
      visitLiteral({ value }) {
        return {
          "number": Number,
          "string": String,
          "boolean": Boolean,
          "object": Object
        }[typeof value](value);
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
      visitPseudoClassSelector({ name, parameter }) {

        if (name === "not") {
          return !test(parameter, node);
        } else if (name === "nth-child") {
          if (node.parentNode.childNodes.indexOf(node) === parameter.accept(this) - 1) {
            return true;
          }
        } else if (name === "nth-last-child") {
          if (node.parentNode.childNodes.indexOf(node) === node.parentNode.childNodes.length - parameter.accept(this)) {
            return true;
          }
        }

        return false;
      },
      visitPseudoElement({ name }) {
        return true;
      },
      visitNestedSelector({ parent, child }) {
        return test(parent, node) && test(child, node);
      }
    });
  }

  return _testers[selectorSource] = {
    source: selectorSource,
    test: test.bind(this, ast)
  };
}