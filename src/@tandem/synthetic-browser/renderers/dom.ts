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

  private _rectangles: BoundingRect[];

  get rectangles(): BoundingRect[] {
    return this._rectangles;
  }

  update() {

    // simple for now -- just reset the entire outer HTML
    this.element.innerHTML = this.target.toString();

    const rectangles: BoundingRect[] = [];
    for (const node of this.element.querySelectorAll("*")) {
      const rect = node.getBoundingClientRect();
      rectangles.push(new BoundingRect(rect.left, rect.top, rect.right, rect.bottom));
    }

    this._rectangles = rectangles;
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