import {
  SymbolTable,
  SyntheticNode,
  SyntheticString,
  SyntheticDocument,
} from "@tandem/runtime";

import {
  IHTMLExpression,
  HTMLExpressionKind,
  HTMLElementExpression,
  HTMLCommentExpression,
  HTMLTextExpression
} from "./ast";

export function evaluateHTML(node: IHTMLExpression, context: SymbolTable): SyntheticNode {

  const doc = context.get<SyntheticDocument>("document");

  switch (node.kind) {
    case HTMLExpressionKind.ELEMENT   : return evaluateElement(node as any);
    case HTMLExpressionKind.FRAGMENT  : return evaluateFragment(node as any);
    case HTMLExpressionKind.COMMENT   : return evaluateComment(node as any);
    case HTMLExpressionKind.TEXT_NODE : return evaluateTextNode(node as any);
  }

  function evaluateElement(node: HTMLElementExpression) {
    const element = doc.createElement(new SyntheticString(node.name));
    for (const attribute of node.attributes) {
      element.setAttribute(new SyntheticString(attribute.name), new SyntheticString(attribute.value));
    }
    for (const child of node.childNodes) {
      element.appendChild(evaluateHTML(child, context));
    }
    return element;
  }

  function evaluateFragment(node: HTMLElementExpression) {
    const fragment = doc.createDocumentFragment();

    for (const child of node.childNodes) {
      fragment.appendChild(evaluateHTML(child, context));
    }
    return fragment;
  }

  function evaluateComment(node: HTMLCommentExpression) {
    return doc.createComment(new SyntheticString(node.value));
  }

  function evaluateTextNode(node: HTMLTextExpression) {
    return doc.createTextNode(new SyntheticString(node.value));
  }
}