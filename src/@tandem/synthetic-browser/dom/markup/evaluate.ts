import sm = require("source-map");
import { ISourcePosition } from "@tandem/common";
import { DOMNodeType } from "./node-types";
import { SandboxModule } from "@tandem/sandbox";
import { SyntheticDOMNode } from "./node";
import { SyntheticDocument } from "../document";
import { SyntheticDOMContainer } from "./container";
import { SyntheticDocumentFragment } from "./document-fragment";
import { SyntheticDOMAttribute, SyntheticDOMElement } from "./element";
import { IMarkupExpression, MarkupContainerExpression } from "./ast";

// TODO - this needs to be async
export function evaluateMarkup(expression: IMarkupExpression, doc: SyntheticDocument, namespaceURI?: string, module?: SandboxModule, parentContainer?: SyntheticDOMContainer): any {


  const source = module && module.source;
  let smg: sm.SourceMapConsumer;
  let fileUri: string;
  
  if (source) {
    fileUri = source.uri;
    if (source.map) {
      smg = new sm.SourceMapConsumer(source.map);
    }
  }

  
  function linkSourceInfo(expression: IMarkupExpression, synthetic: SyntheticDOMNode) {
    synthetic.$module = module;

    let euri: string = fileUri;
    let start: ISourcePosition = expression.location.start;
    let end: ISourcePosition = expression.location.end;

    if (smg) {
      const org = smg.originalPositionFor({ line: start.line, column: start.column - 1 });
      start = { line: org.line, column: org.column };
      euri  = org.source;
      end = undefined;
    }

    synthetic.$source     = {
      kind: expression.kind,
      uri: euri,
      start: start
    };
    return synthetic;
  }

  function appendChildNodes(container: SyntheticDOMContainer, expression: MarkupContainerExpression) {
    for (let i = 0, n = expression.childNodes.length; i < n; i++) {
      const child = evaluateMarkup(expression.childNodes[i], doc, namespaceURI, module, container);
      child.$createdCallback();
    }
  }

  return expression.accept({
    visitAttribute(expression) {
      return { name: expression.name, value: expression.value };
    },
    visitComment(expression) {
      const node = linkSourceInfo(expression, doc.createComment(expression.nodeValue));
      linkSourceInfo(expression, node);
      parentContainer.appendChild(node);
      return node;
    },
    visitElement(expression) {
      const xmlns = expression.getAttribute("xmlns") || namespaceURI || doc.defaultNamespaceURI;

      // bypass $createdCallback executed by document
      const elementClass = doc.$getElementClassNS(xmlns, expression.nodeName);
      const element = new elementClass(xmlns, expression.nodeName);
      element.$setOwnerDocument(doc);
      parentContainer.appendChild(element);

      for (let i = 0, n = expression.attributes.length; i < n; i++) {
        const attributeExpression = expression.attributes[i];
        const attribute = attributeExpression.accept(this);
        element.setAttribute(attribute.name, attribute.value);
      }

      linkSourceInfo(expression, element);
      appendChildNodes(element, expression);

      return element;
    },
    visitDocumentFragment(expression) {

      let container: SyntheticDOMContainer;

      if (!expression.parent && parentContainer) {
        container = parentContainer;
      } else {
        container = doc.createDocumentFragment();
        linkSourceInfo(expression, container);
      }

      appendChildNodes(container, expression);

      if (container !== parentContainer) {
        container.$createdCallback();
      }

      return container;
    },
    visitText(expression) {
      const node = doc.createTextNode(expression.nodeValue);
      linkSourceInfo(expression, node);
      parentContainer.appendChild(node);
      return node;
    }
  });
}
