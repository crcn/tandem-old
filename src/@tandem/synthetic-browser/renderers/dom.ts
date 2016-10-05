import { Action } from "@tandem/common";
import { WrapBus } from "mesh";
import { BoundingRect, watchProperty } from "@tandem/common";
import {
  HTMLNodeType,
  SyntheticHTMLNode,
  SyntheticHTMLTextNode,
  SyntheticHTMLElement,
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
    this.element.innerHTML = getSyntheticPreviewHTMLPreviewString(this.target);

    const rectangles: BoundingRect[] = [];
    for (const node of this.element.querySelectorAll("*")) {
      const rect = node.getBoundingClientRect();
      rectangles.push(new BoundingRect(rect.left, rect.top, rect.right, rect.bottom));
    }

    this._rectangles = rectangles;
  }
}

/**
 * Preview HTML specific to the editor
 */

function getSyntheticPreviewHTMLPreviewString(node: SyntheticHTMLNode) {
  switch (node.nodeType) {
    case HTMLNodeType.COMMENT: return ``;
    case HTMLNodeType.TEXT: return (<SyntheticHTMLTextNode>node).nodeValue;
    case HTMLNodeType.DOCUMENT:
    case HTMLNodeType.DOCUMENT_FRAGMENT: return node.childNodes.map(getSyntheticPreviewHTMLPreviewString).join("");
    case HTMLNodeType.ELEMENT:
      const element = <SyntheticHTMLElement>node;
      return [
      "<", element.nodeName,
      element.attributes.map((attribute) => ` ${attribute.name}="${attribute.value}"`).join(""),
      ` style="${getStyleDeclarationString(element.style)}"`,
      ">",
      element.childNodes.map(getSyntheticPreviewHTMLPreviewString).join(""),
      "</", element.nodeName + ">"
    ].join("");
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