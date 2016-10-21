import { DOMNodeType } from "./node-types";
import { IMarkupModule } from "@tandem/synthetic-browser/sandbox";
import { SyntheticDOMNode } from "./node";
import { SyntheticDocument } from "../document";
import { SyntheticDOMContainer } from "./container";
import { BaseSandboxModule, SandboxModule } from "@tandem/sandbox";
import { SyntheticDOMAttribute, SyntheticDOMElement } from "./element";
import { IMarkupExpression, MarkupContainerExpression } from "./ast";

export function evaluateMarkup(expression: IMarkupExpression, doc: SyntheticDocument, namespaceURI?: string, module?: SandboxModule): any {

  function initialize(expression: IMarkupExpression, synthetic: SyntheticDOMNode) {

    // deprecated
    synthetic.$module     = module;
    synthetic.$bundle     = module && module.bundle;
    synthetic.$source     = {
      kind: expression.kind,
      location: expression.location
    };
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
      const element = new elementClass(xmlns, expression.nodeName);
      element.$setOwnerDocument(doc);

      for (let i = 0, n = expression.attributes.length; i < n; i++) {
        const attributeExpression = expression.attributes[i];
        const attribute = attributeExpression.accept(this);
        element.setAttribute(attribute.name, attribute.value);
      }

      for (let i = 0, n = expression.childNodes.length; i < n; i++) {
        const childExpression = expression.childNodes[i];
        element.appendChild(xmlns === namespaceURI ? childExpression.accept(this) : evaluateMarkup(childExpression, doc, xmlns, module));
      }

      return initialize(expression, element);
    },
    visitDocumentFragment(expression) {

      const fragment = doc.createDocumentFragment();

      for (let i = 0, n = expression.childNodes.length; i < n; i++) {
        fragment.appendChild(expression.childNodes[i].accept(this));
      }

      return initialize(expression, fragment);
    },
    visitText(expression) {
      return initialize(expression, doc.createTextNode(expression.nodeValue));
    }
  });
}
