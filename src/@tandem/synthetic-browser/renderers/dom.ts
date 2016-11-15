import * as React from "react";
import * as ReactDOM from "react-dom";

import { Action } from "@tandem/common";
import { decode } from "ent";
import { CallbackDispatcher } from "@tandem/mesh";
import { camelCase } from "lodash";
import { BaseRenderer } from "./base";
import { HTML_VOID_ELEMENTS } from "@tandem/synthetic-browser/dom";

import {
  bindable,
  isMaster,
  flattenTree,
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
} from "../dom";

// TODO - Ditch React and use the diffs served from
// the worker in order to patch changes here. Should be a
// huge performance boost.
export class SyntheticDOMRenderer extends BaseRenderer {

  private _currentCSSText: string;
  private _firstRender: boolean;

  createElement() {
    const element = document.createElement("div");
    element.innerHTML = `<style type="text/css"></style><div></div>`;
    return element;
  }

  render() {
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        const document = this.document as SyntheticDocument;
        const styleElement = this.element.firstChild as HTMLStyleElement;
        const currentCSSText = document.styleSheets.map((styleSheet) => styleSheet.cssText).join("\n");
        if (this._currentCSSText !== currentCSSText) {
          styleElement.textContent = this._currentCSSText = currentCSSText;
        }

        // render immediately to the DOM element
        ReactDOM.render(renderSyntheticNode(document), this.element.lastChild as HTMLDivElement, () => {

          // computed properties may not come up immediately. Not a good solution to this fix,
          // but works for now.
          setTimeout(() => {
            this._firstRender = false;
            this.syncRects();
            resolve();
          }, this._firstRender ? 100 : 0);
        });
      });
    });
  }

  private syncRects() {
     const now = Date.now();
    const syntheticDOMNodesByUID = {};

    traverseTree(this.document, (node) => syntheticDOMNodesByUID[node.uid] = node);

    const rects  = {};
    const styles = {};

    const allElements = this.element.querySelectorAll("*");
    let hiddenCount = 0;

    for (let i = 0, n = allElements.length; i < n; i++) {
      const element = <HTMLElement>allElements[i];
      if (!element.dataset) continue;

      const uid = element.dataset["uid"];
      const syntheticNode: SyntheticDOMNode = syntheticDOMNodesByUID[uid];
      if (syntheticNode) {

        const rect = rects[uid]  = BoundingRect.fromClientRect(element.getBoundingClientRect());
        styles[uid] = SyntheticCSSStyleDeclaration.fromObject(window.getComputedStyle(element));

        (<AttachableSyntheticDOMNode<any>>syntheticNode).attachNative(element);
      }
    }

    this.setRects(rects, styles);
  }
}

function renderSyntheticNode(node: SyntheticDOMNode): any {
  switch(node.nodeType) {
    case DOMNodeType.TEXT:
      return decode(node.textContent);
    case DOMNodeType.ELEMENT:
      const element = <SyntheticDOMElement>node;
      const target = element;
      if (/^(style|link)$/.test(target.nodeName)) return null;
      return React.createElement(<any>target.nodeName, renderSyntheticAttributes(target), renderChildren(target));
    case DOMNodeType.DOCUMENT:
    case DOMNodeType.DOCUMENT_FRAGMENT:
      const container = <SyntheticDOMContainer>node;
      return React.createElement("span", {}, container.childNodes.map((child) => renderSyntheticNode(child)));
  }

  return null;
}

function renderChildren(node: SyntheticDOMContainer) {
  const childNodes = node.nodeType === DOMNodeType.ELEMENT && (<SyntheticDOMElement>node).shadowRoot ? (<SyntheticDOMElement>node).shadowRoot.childNodes : node.childNodes;

  if (HTML_VOID_ELEMENTS.indexOf(node.nodeName.toLowerCase()) !== -1) {
    return null;
  }

  return childNodes.map(renderSyntheticNode);
}

function renderSyntheticAttributes(node: SyntheticDOMElement) {

  const attribs = {
    key: node.uid,
    "data-uid": node.uid
  };

  // fix attributes for React
  if (node && node.nodeType === DOMNodeType.ELEMENT) {
    const element = (<SyntheticDOMElement><any>node);
    Object.assign(attribs, element.attributes.toObject());
  }

  const renderedAttribs = {};

  for (let name in attribs) {
    let value = attribs[name];
    if (name === "class") {
      name = "className";
    } else if (name === "style") {
      value = SyntheticCSSStyleDeclaration.fromString(value);
    }

    if (!/^data-/.test(name)) {
      name = camelCase(name);
    }

    renderedAttribs[name] = value;
  }

  return renderedAttribs;
}