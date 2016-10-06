import { IMarkupExpression } from "./ast";
import { SyntheticDocument } from "../document";
import { SyntheticMarkupNode } from "./node";
import { SyntheticMarkupAttribute } from "./element";


export function evaluateMarkup(node: IMarkupExpression, doc: SyntheticDocument, namespaceURI?: string): SyntheticMarkupNode {

  return node.accept({
    visitAttribute(expression) {
      return { name: expression.name, value: expression.value };
    },
    visitComment(expression) {
      return doc.createComment(expression.value);
    },
    visitElement(expression) {
      const xmlns = expression.getAttribute("xmlns") || namespaceURI || doc.defaultNamespaceURI;

      const element = doc.createElementNS(xmlns, expression.name);
      for (const childExpression of expression.childNodes) {
        element.appendChild(evaluateMarkup(childExpression, doc, xmlns));
      }
      for (const attributeExpression of expression.attributes) {
        const attribute = evaluateMarkup(attributeExpression, doc, xmlns) as any as SyntheticMarkupAttribute;
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
      return doc.createTextNode(expression.value);
    }
  });
}