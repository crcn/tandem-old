

import {
  SyntheticHTMLDocument,
} from "./document";

import {
  SyntheticHTMLNode,
} from "./node";

import {
  IHTMLExpression,
  HTMLExpressionKind,
  HTMLElementExpression,
  HTMLCommentExpression,
  HTMLTextExpression
} from "./html-ast";

export function evaluateHTML(node: IHTMLExpression, doc: SyntheticHTMLDocument): SyntheticHTMLNode {

  switch (node.kind) {
    case HTMLExpressionKind.ELEMENT   : return evaluateElement(node as any);
    case HTMLExpressionKind.FRAGMENT  : return evaluateFragment(node as any);
    case HTMLExpressionKind.COMMENT   : return evaluateComment(node as any);
    case HTMLExpressionKind.TEXT_NODE : return evaluateTextNode(node as any);
  }

  function evaluateElement(node: HTMLElementExpression) {
    const element = doc.createElement(node.name);
    for (const attribute of node.attributes) {
      element.setAttribute(attribute.name, attribute.value);
    }
    for (const child of node.childNodes) {
      element.appendChild(evaluateHTML(child, doc));
    }
    return element;
  }

  function evaluateFragment(node: HTMLElementExpression) {
    const fragment = doc.createDocumentFragment();

    for (const child of node.childNodes) {
      fragment.appendChild(evaluateHTML(child, doc));
    }
    return fragment;
  }

  function evaluateComment(node: HTMLCommentExpression) {
    return doc.createComment(node.value);
  }

  function evaluateTextNode(node: HTMLTextExpression) {
    return doc.createTextNode(node.value);
  }
}