import { DOMNodeType } from "./node-types";
import { IMarkupModule } from "@tandem/synthetic-browser/sandbox";
import { SyntheticDOMNode } from "./node";
import { SyntheticDocument } from "../document";
import { SyntheticDOMContainer } from "./container";
import { BaseSandboxModule, Sandbox2Module } from "@tandem/sandbox";
import { SyntheticDOMAttribute, SyntheticDOMElement } from "./element";
import { IMarkupExpression, MarkupContainerExpression } from "./ast";

export function evaluateMarkup(expression: IMarkupExpression, doc: SyntheticDocument, namespaceURI?: string, module?: Sandbox2Module): any {

  function initialize(expression, synthetic: SyntheticDOMNode) {
    synthetic.$module     = module;
    synthetic.$expression = expression;
    if (synthetic.nodeType === DOMNodeType.ELEMENT) {
      (<SyntheticDOMElement><any>synthetic).$createdCallback();
    }
    return synthetic;
  }

  return expression.accept({
    visitAttribute(expression) {
      return { name: expression.name, value: expression.value };
    },
    visitComment(expression) {
      return initialize(expression, doc.createComment(expression.nodeValue));
    },
    visitElement(expression) {
      const xmlns = expression.getAttribute("xmlns") || namespaceURI || doc.defaultNamespaceURI;

      const elementClass = doc.$getElementClassNS(xmlns, expression.nodeName);
      const element = new elementClass(xmlns, expression.nodeName, doc);

      for (const attributeExpression of expression.attributes) {
        const attribute = attributeExpression.accept(this);
        element.setAttribute(attribute.name, attribute.value);
      }

      for (const childExpression of expression.childNodes) {
        element.appendChild(xmlns === namespaceURI ? childExpression.accept(this) : evaluateMarkup(childExpression, doc, xmlns, module));
      }

      return initialize(expression, element);
    },
    visitDocumentFragment(expression) {

      const fragment = doc.createDocumentFragment();

      for (const childExpression of expression.childNodes) {
        fragment.appendChild(childExpression.accept(this));
      }

      return initialize(expression, fragment);
    },
    visitText(expression) {
      return initialize(expression, doc.createTextNode(expression.nodeValue));
    }
  });
}
