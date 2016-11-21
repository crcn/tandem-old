import { Action } from "@tandem/common";
import { decode } from "ent";
import { camelCase } from "lodash";
import { BaseRenderer } from "../base";
import { CallbackDispatcher } from "@tandem/mesh";
import { HTML_VOID_ELEMENTS, HTML_XMLNS, SVG_XMLNS, SVG_TAG_NAMES } from "@tandem/synthetic-browser/dom";

import {
  bindable,
  isMaster,
  flattenTree,
  TreeNodeEvent,
  BoundingRect,
  traverseTree,
  watchProperty,
  calculateAbsoluteBounds
} from "@tandem/common";

import {
  DOMNodeType,
  SyntheticDOMNode,
  SyntheticDOMText,
  SyntheticDocument,
  SyntheticDOMElement,
  SyntheticDOMContainer,
  AttachableSyntheticDOMNode,
  SyntheticCSSStyleDeclaration,
} from "../../dom";

import {
  DOMNodeEvent,
  AttributeChangeEvent,
  ValueNodeChangeEvent,
} from "../../messages";

type HTMLElementDictionaryType = {
  [IDentifier: string]: [Element, SyntheticDOMNode]
}

export class SyntheticDOMRenderer extends BaseRenderer {

  private _currentCSSText: string;
  private _firstRender: boolean;
  private _documentElement: HTMLElement;
  private _elementDictionary: HTMLElementDictionaryType;

  createElement() {
    const element = document.createElement("div");
    element.innerHTML = this.getElementInnerHTML();
    return element;
  }

  protected onDocumentMutationEvent(event: Action) {
    super.onDocumentMutationEvent(event);

    if (event.type === ValueNodeChangeEvent.VALUE_NODE_CHANGE) {
      const [native, synthetic] = this.getElementDictItem(event.target);
      if (native) native.textContent = decode((<ValueNodeChangeEvent>event).newValue);
    } else if (event.type === AttributeChangeEvent.ATTRIBUTE_CHANGE) {
      const { name, value } = <AttributeChangeEvent>event;
      const [native, synthetic] = this.getElementDictItem(event.target);
      if (native) native.setAttribute(name, value);
    } else if (event.type === TreeNodeEvent.NODE_ADDED) {
      const [native, synthetic] = this.getElementDictItem(event.target.parent);
      if (native) {
        const childNode = renderHTMLNode(event.target, this._elementDictionary);
        if (childNode) native.appendChild(childNode);
      }
    } else if (event.type === TreeNodeEvent.NODE_REMOVED) {
      const [native, synthetic] = this.getElementDictItem(event.target);
      if (native && native.parentNode) native.parentNode.removeChild(native);
      this._elementDictionary[event.target.uid] = undefined;
    }
  }

  protected getElementDictItem(synthetic: SyntheticDOMNode) {
    return this._elementDictionary[synthetic.uid] || [undefined, undefined];
  }

  protected getElementInnerHTML() {
    return `<style type="text/css"></style><div></div>`;
  }

  render() {
    const { document, element } = this;

    const styleElement = element.firstChild as HTMLStyleElement;
    const now = Date.now();
    const currentCSSText = document.styleSheets.map((styleSheet) => styleSheet.cssText).join("\n");
    if (this._currentCSSText !== currentCSSText) {
      styleElement.textContent = this._currentCSSText = currentCSSText;
    }

    if (!this._documentElement) {
      this._documentElement = renderHTMLNode(document, this._elementDictionary = {});
      element.lastChild.appendChild(this._documentElement);
    }

    this.syncRects();
  }

  protected reset() {
    this._documentElement = undefined;
    this.element.innerHTML = this.getElementInnerHTML();
  }

  private syncRects() {
    const syntheticDOMNodesByUID = {};
    const rects  = {};
    const styles = {};

    for (let uid in this._elementDictionary) {
      const [native, synthetic] = this._elementDictionary[uid] || [undefined, undefined];

      // (<HTMLElement>native).

      const syntheticNode: SyntheticDOMNode = <SyntheticDOMNode>synthetic;
      if (syntheticNode && syntheticNode.nodeType === DOMNodeType.ELEMENT) {
        const rect = rects[uid]  = BoundingRect.fromClientRect(native.getBoundingClientRect());
        const nativeStyle = window.getComputedStyle(native);

        // just attach whatever's returned by the DOM -- don't wrap this in a synthetic, or else
        // there'll be massive performance penalties.
        styles[uid] = nativeStyle;
        (<AttachableSyntheticDOMNode<any>>syntheticNode).attachNative(native);
      }
    }

    this.setRects(rects, styles);
  }
}

function renderHTMLNode(syntheticNode: SyntheticDOMNode, dict: HTMLElementDictionaryType): any {
  switch(syntheticNode.nodeType) {

    case DOMNodeType.TEXT:

      const textElement = renderHTMLElement("span", syntheticNode, dict);
      textElement.appendChild(document.createTextNode(decode(syntheticNode.textContent)));
      return textElement;

    case DOMNodeType.ELEMENT:
      const syntheticElement = <SyntheticDOMElement>syntheticNode;
      if (/^(style|link)$/.test(syntheticElement.nodeName)) return null;
      const element = renderHTMLElement(syntheticElement.tagName, syntheticElement, dict);
      for (let i = 0, n = syntheticElement.attributes.length; i < n; i++) {
        const syntheticAttribute = syntheticElement.attributes[i];
        element.setAttribute(syntheticAttribute.name, syntheticAttribute.value);
      }
      return appendChildNodes(element, syntheticElement.childNodes, dict);
    case DOMNodeType.DOCUMENT:
    case DOMNodeType.DOCUMENT_FRAGMENT:
      const syntheticContainer = <SyntheticDOMContainer>syntheticNode;
      const containerElement = renderHTMLElement("span", syntheticContainer, dict);
      return appendChildNodes(containerElement, syntheticContainer.childNodes, dict);
  }
}

function renderHTMLElement(tagName: string, source: SyntheticDOMNode, dict: HTMLElementDictionaryType): any {
  const element = document.createElementNS(source.namespaceURI === SVG_XMLNS ? SVG_XMLNS : HTML_XMLNS, tagName);
  dict[source.uid] = [element, source];
  return element;
}

function appendChildNodes(container: HTMLElement|DocumentFragment, syntheticChildNodes: SyntheticDOMNode[], dict: HTMLElementDictionaryType) {
  for (let i = 0, n = syntheticChildNodes.length; i < n; i++) {
    const childNode = renderHTMLNode(syntheticChildNodes[i], dict);

    // ignored
    if (childNode == null) continue;
    container.appendChild(childNode);
  }
  return container;
}
