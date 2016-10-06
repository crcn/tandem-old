import { Action } from "@tandem/common";
import { WrapBus } from "mesh";
import { BoundingRect, watchProperty } from "@tandem/common";
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

  private _rects: any;

  getBoundingRect(element: SyntheticMarkupElement) {
    return (this._rects && this._rects[element.uid]) || new BoundingRect(0, 0, 0, 0);
  }

  update() {

    // simple for now -- just reset the entire outer HTML
    this.element.innerHTML = this.target.toString();

    const allSyntheticElementsById = {};
    this._rects = {};

    for (const node of this.element.querySelectorAll("*")) {
      const rect = node.getBoundingClientRect();
      const syntheticElement = allSyntheticElementsById[node["dataset"].uid];
      this._rects[node["dataset"].uid] = new BoundingRect(rect.left, rect.top, rect.right, rect.bottom);
    }
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