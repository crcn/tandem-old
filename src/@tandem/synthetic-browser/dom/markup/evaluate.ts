import { DOMNodeType } from "./node-types";
import { SyntheticDOMNode } from "./node";
import { SyntheticDocument } from "../document";
import { SyntheticDOMContainer } from "./container";
import { SyntheticDOMAttribute, SyntheticDOMElement } from "./element";
import { IMarkupExpression, MarkupContainerExpression } from "./ast";

export function evaluateMarkup(expression: IMarkupExpression, doc: SyntheticDocument, namespaceURI?: string, async?: boolean): SyntheticDOMNode {

  function appendChildNodesSync(container: SyntheticDOMContainer, expression: MarkupContainerExpression) {
    for (const childExpression of expression.childNodes) {
      container.appendChild(evaluateMarkup(childExpression, doc, namespaceURI, async));
    }
    return container;
  }

  async function appendChildNodesAsync(container: SyntheticDOMContainer, expression: MarkupContainerExpression) {
    for (const childExpression of expression.childNodes) {
      container.appendChild(await evaluateMarkup(childExpression, doc, namespaceURI, async));
    }
    return container;
  }

  function appendChildNodes(container: SyntheticDOMContainer, expression: MarkupContainerExpression) {
    return async ? appendChildNodesAsync(container, expression) : appendChildNodesSync(container, expression);
  }

  const synthetic = expression.accept({
    visitAttribute(expression) {
      return { name: expression.name, value: expression.value };
    },
    visitComment(expression) {
      return doc.createComment(expression.nodeValue);
    },
    visitElement(expression) {
      const xmlns = expression.getAttribute("xmlns") || namespaceURI || doc.defaultNamespaceURI;

      const elementClass = doc.$getElementClassNS(xmlns, expression.nodeName);
      const element = new elementClass(xmlns, expression.nodeName, doc);

      for (const attributeExpression of expression.attributes) {
        const attribute = attributeExpression.accept(this);
        element.setAttribute(attribute.name, attribute.value);
      }

      return appendChildNodes(element, expression);
    },
    visitDocumentFragment(expression) {
      return appendChildNodes(doc.createDocumentFragment(), expression);
    },
    visitText(expression) {
      return doc.createTextNode(expression.nodeValue);
    }
  });

  synthetic.$expression = expression;
  synthetic.$module     = doc.sandbox && doc.sandbox.currentModule;

  if (synthetic.nodeType === DOMNodeType.ELEMENT) {
    (<SyntheticDOMElement>synthetic).$createdCallback();
  }

  if (async) {
    // return new Promise((resolve) => {
      // return synthetic.$load();
    // });
  }

  return synthetic;
}