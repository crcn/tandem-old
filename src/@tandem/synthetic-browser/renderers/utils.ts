import { SyntheticDOMElement } from "../dom";

export function getBoundingRect(element: SyntheticDOMElement) {
  return element.ownerDocument.defaultView.renderer.getBoundingRect(element);
}