import { Action } from "@tandem/common";
import { WrapBus } from "mesh";
import { BoundingRect, watchProperty, patchTreeNode, flattenTree, calculateAbsoluteBounds } from "@tandem/common";
import {
  MarkupNodeType,
  querySelectorAll,
  SyntheticDOMNode,
  SyntheticDOMText,
  SyntheticDocument,
  SyntheticDOMElement,
  SyntheticCSSStyleDeclaration,
} from "../dom";

import {
  ISyntheticComponent
} from "../components";

import {
  BaseRenderer
} from "./base";

export class SyntheticDOMRenderer extends BaseRenderer {

  update() {

    // simple for now -- just reset the entire outer HTML
    // this.element.appendChild(this.target.render(document as any as SyntheticDocument) as any as Node);
    this.element.innerHTML = this.target.render();

    const syntheticComponentsBySourceUID = {};

    for (const component of flattenTree(this.target)) {
      syntheticComponentsBySourceUID[component.source.uid] = component;
    }

    const rects = {};

    for (const node of this.element.querySelectorAll("*")) {
      const element = <HTMLElement>node;
      if (!element.dataset) continue;
      const uid = element.dataset["uid"];
      const sourceComponent: ISyntheticComponent = syntheticComponentsBySourceUID[uid];
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