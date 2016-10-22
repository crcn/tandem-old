import { Action } from "@tandem/common";
import { WrapBus } from "mesh";
import { camelCase } from "lodash";
import { HTML_VOID_ELEMENTS } from "@tandem/synthetic-browser/dom";
import {
  BoundingRect,
  watchProperty,
  bindable,
  flattenTree,
  traverseTree,
  calculateAbsoluteBounds
} from "@tandem/common";
import {
  DOMNodeType,
  querySelectorAll,
  SyntheticDOMNode,
  SyntheticDOMText,
  SyntheticDocument,
  SyntheticDOMElement,
  SyntheticDOMContainer,
  SyntheticCSSStyleDeclaration,
} from "../dom";

import * as React from "react";
import * as ReactDOM from "react-dom";

import { BaseRenderer } from "./base";
import { BaseDOMNodeEntity } from "../entities";

export class SyntheticDOMRenderer extends BaseRenderer {


  private _currentCSSText: string;
  private _computedStyles: any = {};


  getComputedStyle(uid: string) {
    if (this._computedStyles[uid]) return this._computedStyles[uid];
    const element = this.element.querySelector(`[data-uid="${uid}"]`);
    return this._computedStyles[uid] = element ? getComputedStyle(element) : undefined;
  }

  createElement() {
    const element = document.createElement("div");
    element.innerHTML = `<style></style><div></div>`;
    return element;
  }

  async fetchComputedStyle(uid: string) {
    return this.getComputedStyle(uid);
  }

  update() {
    this._computedStyles = {};

    return new Promise((resolve) => {

      const document = this.entity.source as SyntheticDocument;
      const styleElement = this.element.firstChild as HTMLStyleElement;
      const currentCSSText = document.styleSheets.map((styleSheet) => styleSheet.cssText).join("\n");
      if (this._currentCSSText !== currentCSSText) {
        styleElement.textContent = this._currentCSSText = currentCSSText;
      }

      // render immediately to the DOM element
      ReactDOM.render(renderSyntheticNode(this.entity.source), this.element.lastChild as HTMLDivElement, () => {
        const syntheticComponentsBySourceUID = {};

        traverseTree(this.entity, (entity) => syntheticComponentsBySourceUID[entity.uid] = entity);

        const rects = {};

        const allElements = this.element.querySelectorAll("*");

        for (let i = 0, n = allElements.length; i < n; i++) {
          const element = <HTMLElement>allElements[i];
          if (!element.dataset) continue;
          const uid = element.dataset["uid"];
          const sourceComponent: BaseDOMNodeEntity<any, any> = syntheticComponentsBySourceUID[uid];
          rects[uid] = BoundingRect.fromClientRect(element.getBoundingClientRect());
          if (sourceComponent) {
            sourceComponent.target = element;
          }
        }
        this.setRects(rects);
        resolve();
      });
    });
  }
}

function renderSyntheticNode(node: SyntheticDOMNode): any {
  switch(node.nodeType) {
    case DOMNodeType.TEXT:
      return node.textContent;
    case DOMNodeType.ELEMENT:
      const element = <SyntheticDOMElement>node;
      return React.createElement(<any>element.nodeName, renderSyntheticAttributes(element), renderChildren(element));
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
    key: node.uid
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