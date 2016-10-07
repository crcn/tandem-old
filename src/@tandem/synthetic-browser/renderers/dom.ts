import { Action } from "@tandem/common";
import { WrapBus } from "mesh";
import { BoundingRect, watchProperty, calculateAbsoluteBounds } from "@tandem/common";
import {
  MarkupNodeType,
  SyntheticMarkupNode,
  SyntheticMarkupText,
  SyntheticMarkupElement,
  SyntheticCSSStyleDeclaration,
} from "../dom";
import {
  BaseRenderer
} from "./base";

export class DOMRenderer extends BaseRenderer {

  update() {

    // simple for now -- just reset the entire outer HTML
    this.element.innerHTML = this.target.toString();

    const rects = {};

    for (const node of this.element.querySelectorAll("*")) {
      const element = <HTMLElement>node;
      const uid = element.dataset["uid"];
      rects[uid] = calculateAbsoluteBounds(element);
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