import { DOMNodeType } from "./node-types";
import { SyntheticDOMNode } from "./node";
import { SyntheticDocument } from "../document";
import { SyntheticDOMContainer } from "./container";
import { SyntheticDOMAttribute, SyntheticDOMElement } from "./element";
import { IMarkupExpression, MarkupContainerExpression } from "./ast";
import { IMarkupModule } from "@tandem/synthetic-browser/sandbox";
import { BaseSandboxModule } from "@tandem/sandbox";

function evaluateMarkup(expression: IMarkupExpression, doc: SyntheticDocument, namespaceURI?: string, module?: IMarkupModule, async?: boolean): any {

  function appendChildNodesSync(container: SyntheticDOMContainer, expression: MarkupContainerExpression) {
    for (const childExpression of expression.childNodes) {
      container.appendChild(evaluateMarkup(childExpression, doc, namespaceURI, module, async));
    }
    return container;
  }

  async function appendChildNodesAsync(container: SyntheticDOMContainer, expression: MarkupContainerExpression) {
    for (const childExpression of expression.childNodes) {
      container.appendChild(await evaluateMarkup(childExpression, doc, namespaceURI, module, async));
    }
    return container;
  }

  function appendChildNodes(container: SyntheticDOMContainer, expression: MarkupContainerExpression) {
    return async ? appendChildNodesAsync(container, expression) : appendChildNodesSync(container, expression);
  }

  const result = expression.accept({
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

  const onSynthetic = (synthetic: SyntheticDOMNode) => {

    synthetic.$expression = expression as any;
    synthetic.$module     = module;

    if (synthetic.nodeType === DOMNodeType.ELEMENT) {
      (<SyntheticDOMElement>synthetic).$createdCallback();
    }

    return new Promise((resolve, reject) => {
      synthetic.$load().then(() => resolve(synthetic), reject);
    });
  }

  if (async && result.then) {
    return result.then(onSynthetic);
  } else {
    onSynthetic(result);
    return async ? Promise.resolve(result) : result;
  }
}

export function evaluateMarkupAsync(expression: IMarkupExpression, doc: SyntheticDocument, namespaceURI?: string, module?: IMarkupModule): Promise<SyntheticDOMNode> {
  return evaluateMarkup(expression, doc, namespaceURI, module, true);
}

export function evaluateMarkupSync(expression: IMarkupExpression, doc: SyntheticDocument, namespaceURI?: string, module?: IMarkupModule): SyntheticDOMNode {
  return evaluateMarkup(expression, doc, namespaceURI, module, false);
}