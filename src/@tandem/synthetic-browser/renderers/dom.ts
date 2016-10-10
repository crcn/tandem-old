import { Action } from "@tandem/common";
import { WrapBus } from "mesh";
import {
  BoundingRect,
  watchProperty,
  flattenTree,
  calculateAbsoluteBounds
} from "@tandem/common";
import {
  MarkupNodeType,
  querySelectorAll,
  SyntheticDOMNode,
  SyntheticDOMText,
  SyntheticDocument,
  SyntheticDOMElement,
  SyntheticCSSStyleDeclaration,
} from "../dom";

import { BaseRenderer } from "./base";
import { BaseSyntheticDOMNodeEntity } from "../entities";

export class SyntheticDOMRenderer extends BaseRenderer {

  update() {

    // simple for now -- just reset the entire outer HTML
    // this.element.appendChild(this.target.render(document as any as SyntheticDocument) as any as Node);
    this.element.innerHTML = this.entity.render();

    const syntheticComponentsBySourceUID = {};

    for (const component of flattenTree(this.entity)) {
      syntheticComponentsBySourceUID[component.uid] = component;
    }

    const rects = {};

    for (const node of this.element.querySelectorAll("*")) {
      const element = <HTMLElement>node;
      if (!element.dataset) continue;
      const uid = element.dataset["uid"];
      const sourceComponent: BaseSyntheticDOMNodeEntity<any, any> = syntheticComponentsBySourceUID[uid];
      if (sourceComponent) {
        sourceComponent.target = <HTMLElement>node;
      }
      rects[uid] = BoundingRect.fromClientRect(element.getBoundingClientRect());
    }

    this.setRects(rects);
  }
}

function getStyleDeclarationString(style: SyntheticCSSStyleDeclaration) {
  const buffer = [];
  for (const key in style) {
    if (typeof style[key] !== "string") continue;
    buffer.push(`${key}:${style[key]}`);
  }
  return buffer.join(";");
}