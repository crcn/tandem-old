import {
  SyntheticHTMLDocument,
} from "./document";

import {
  SyntheticHTMLNode,
} from "./node";

import {
  IHTMLExpression,
  HTMLExpressionKind,
  HTMLAttributeExpression,
  HTMLFragmentExpression,
  HTMLElementExpression,
  HTMLCommentExpression,
  HTMLTextExpression
} from "./ast";

export function evaluateHTML(node: IHTMLExpression, doc: SyntheticHTMLDocument): SyntheticHTMLNode {
  return node.accept({
    visitAttribute(expression: HTMLAttributeExpression) {
      return { name: expression.name, value: expression.value };
    },
    visitComment(expression: HTMLCommentExpression) {
      return doc.createComment(expression.value);
    },
    visitElement(expression: HTMLElementExpression) {
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
    visitDocumentFragment(expression: HTMLFragmentExpression) {
      const fragment = doc.createDocumentFragment();
      for (const child of expression.childNodes) {
        fragment.appendChild(child.accept(this));
      }
      return fragment;
    },
    visitTextNode(expression: HTMLTextExpression) {
      return doc.createTextNode(expression.value);
    }
  });
}