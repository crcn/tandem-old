import {
  SyntheticDocument,
} from "../document";

import {
  SyntheticHTMLNode,
} from "./node";

import {
  IMarkupExpression
} from "./ast";

export function evaluateMarkup(node: IMarkupExpression, doc: SyntheticDocument): SyntheticHTMLNode {
  return node.accept({
    visitAttribute(expression) {
      return { name: expression.name, value: expression.value };
    },
    visitComment(expression) {
      return doc.createComment(expression.value);
    },
    visitElement(expression) {
      const element = doc.createElement(expression.name);
      for (const childExpression of expression.childNodes) {
        element.appendChild(childExpression.accept(this));
      }
      for (const attributeExpression of expression.attributes) {
        const attribute = attributeExpression.accept(this);
        element.setAttribute(attribute.name, attribute.value);
      }
      return element;
    },
    visitDocumentFragment(expression) {
      const fragment = doc.createDocumentFragment();
      for (const child of expression.childNodes) {
        fragment.appendChild(child.accept(this));
      }
      return fragment;
    },
    visitText(expression) {
      return doc.createTextNode(expression.value);
    }
  });
}