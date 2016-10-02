import {
  SymbolTable,
  SyntheticString,
} from "../core";

import {
  SyntheticDocument,
} from "./document";

import {
  SyntheticNode,
} from "./node";

import {
  IHTMLExpression,
  HTMLExpressionKind,
  HTMLElementExpression,
  HTMLCommentExpression,
  HTMLTextExpression
} from "./html-ast";

export function evaluateHTML(node: IHTMLExpression, doc: SyntheticDocument): SyntheticNode {

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
    return doc.createComment(new SyntheticString(node.value));
  }

  function evaluateTextNode(node: HTMLTextExpression) {
    return doc.createTextNode(new SyntheticString(node.value));
  }
}