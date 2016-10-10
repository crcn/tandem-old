import { SyntheticDOMNode } from "./node";
import { IMarkupExpression } from "./ast";
import { SyntheticDocument } from "../document";
import { SyntheticDOMAttribute } from "./element";

export function evaluateMarkup(expression: IMarkupExpression, doc: SyntheticDocument, namespaceURI?: string): SyntheticDOMNode {

  const synthetic = expression.accept({
    visitAttribute(expression) {
      return { name: expression.name, value: expression.value };
    },
    visitComment(expression) {
      return doc.createComment(expression.nodeValue);
    },
    visitElement(expression) {
      const xmlns = expression.getAttributeValue("xmlns") || namespaceURI || doc.defaultNamespaceURI;

      const element = doc.createElementNS(xmlns, expression.nodeName);
      for (const childExpression of expression.childNodes) {
        element.appendChild(evaluateMarkup(childExpression, doc, xmlns));
      }
      for (const attributeExpression of expression.attributes) {
        const attribute = evaluateMarkup(attributeExpression, doc, xmlns) as any as SyntheticDOMAttribute;
        element.setAttribute(attribute.name, attribute.value);
      }
      return element;
    },
    visitDocumentFragment(expression) {
      const fragment = doc.createDocumentFragment();
      for (const childExpression of expression.childNodes) {
        fragment.appendChild(evaluateMarkup(childExpression, doc, namespaceURI));
      }
      return fragment;
    },
    visitText(expression) {
      return doc.createTextNode(expression.nodeValue);
    }
  });

  synthetic.expression = expression;
  synthetic.module     = doc.sandbox && doc.sandbox.currentModule;

  return synthetic;
}