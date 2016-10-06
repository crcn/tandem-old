import { SyntheticMarkupElement } from "../dom";

export function getBoundingRect(element: SyntheticMarkupElement) {
  return element.ownerDocument.defaultView.renderer.getBoundingRect(element);
}