import { Action } from "@tandem/common";
import { WrapBus } from "mesh";
import {
  BoundingRect,
  watchProperty,
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
  SyntheticCSSStyleDeclaration,
} from "../dom";

import * as ReactDOM from "react-dom";

import { BaseRenderer } from "./base";
import { BaseDOMNodeEntity } from "../entities";

export class SyntheticDOMRenderer extends BaseRenderer {

  private _computedStyles: any = {};

  getComputedStyle(uid: string) {
    if (this._computedStyles[uid]) return this._computedStyles[uid];
    const element = this.element.querySelector(`[data-uid="${uid}"]`);
    return this._computedStyles[uid] = element ? getComputedStyle(element) : undefined;
  }

  async fetchComputedStyle(uid: string) {
    return this.getComputedStyle(uid);
  }

  update() {
    this._computedStyles = {};

    return new Promise((resolve) => {
      // render immediately to the DOM element
      ReactDOM.render(this.entity.render(), this.element, () => {
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
