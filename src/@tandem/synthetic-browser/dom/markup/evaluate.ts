import { IMarkupExpression } from "./ast";
import { SyntheticDocument } from "../document";
import { SyntheticMarkupNode } from "./node";
import { SyntheticMarkupAttribute } from "./element";
import { ISyntheticMarkupNodeEditor } from "./editor";

export function evaluateMarkup(expression: IMarkupExpression, doc: SyntheticDocument, namespaceURI?: string, editor?: ISyntheticMarkupNodeEditor): SyntheticMarkupNode {

  const synthetic = expression.accept({
    visitAttribute(expression) {
      return { name: expression.name, value: expression.value };
    },
    visitComment(expression) {
      return doc.createComment(expression.value);
    },
    visitElement(expression) {
      const xmlns = expression.getAttributeValue("xmlns") || namespaceURI || doc.defaultNamespaceURI;

      const element = doc.createElementNS(xmlns, expression.name);
      for (const childExpression of expression.childNodes) {
        element.appendChild(evaluateMarkup(childExpression, doc, xmlns, editor));
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
        fragment.appendChild(evaluateMarkup(childExpression, doc, namespaceURI, editor));
      }
      return fragment;
    },
    visitText(expression) {
      return doc.createTextNode(expression.value);
    }
  });

  synthetic.expression = expression;
  synthetic.editor     = editor;

  return synthetic;
}