import {
  getComputedStyle,
  SyntheticHTMLElement,
  SyntheticDOMCapabilities,
  SyntheticCSSStyleDeclaration,
  BaseVisibleSyntheticDOMNodeEntity,
} from "@tandem/synthetic-browser";

import { BoundingRect, IPoint } from "@tandem/common";

export class SyntheticVisibleHTMLEntity extends BaseVisibleSyntheticDOMNodeEntity<SyntheticHTMLElement, any> {

  get position(): IPoint {
    const bounds = this.absoluteBounds;
    return { left: bounds.left, top: bounds.top };
  }

  set position(value: IPoint) {
    Object.assign(this.source.style, {
      left: value.left,
      top: value.top
    });
  }

  get absoluteBounds() {
    return this._renderedBounds;
  }

  set absoluteBounds(bounds: BoundingRect) {
    Object.assign(this.source.style, {
      left: bounds.left,
      top: bounds.top,
      width: bounds.width,
      height: bounds.height
    });
  }

  get capabilities() {
    const style: SyntheticCSSStyleDeclaration = getComputedStyle(this.source);
    return new SyntheticDOMCapabilities(
      style.position !== "static",
      /fixed|absolute/.test(style.position) || !/^inline$/.test(style.display)
    );
  }
}

function calculateCSSMeasurments(style): any {
  const calculated = {};
  for (let key in style) {
    if (hasMeasurement(key)) {
      calculated[key] = Number(style[key].replace("px", ""));
    }
  }
  return calculated;
}

/**
 * Robust method for fetching parent nodes outside
 * of an iframe
 */

function getParentNode(node: SyntheticHTMLElement): SyntheticHTMLElement {
  const parentNode = node.parentNode as SyntheticHTMLElement;

  if (parentNode && parentNode.nodeName === "#document") {
    const localWindow  = node.ownerDocument.defaultView;
    if (localWindow && localWindow.parent) {
      const parentWindow = localWindow.parent;
      return Array.prototype.find.call(parentWindow.document.querySelectorAll("iframe"), (iframe) => {
        return iframe.contentWindow === localWindow;
      });
    }
  }

  return parentNode as SyntheticHTMLElement;
}

function parseCSSMatrixValue(value: string) {
  return value.replace(/matrix\((.*?)\)/, "$1").split(/,\s/).map((value) => Number(value));
}

function calculateTransform(node: SyntheticHTMLElement, includeIframes: boolean = true) {
  let cnode = node as SyntheticHTMLElement;
  let matrix = [0, 0, 0, 0, 0, 0];
  while (cnode) {

    if (cnode.nodeName === "IFRAME" && cnode !== node && !includeIframes) {
      break;
    }

    if (cnode.nodeType === 1) {

      const style = getComputedStyle(cnode);
      if (style.transform !== "none") {
        const cnodeMatrix = parseCSSMatrixValue(style.transform);
        for (let i = cnodeMatrix.length; i--; ) {
          matrix[i] += cnodeMatrix[i];
        }
      }
    }

    cnode = getParentNode(cnode);
  }

  return [matrix[0] || 1, matrix[1], matrix[2], matrix[3] || 1, matrix[4], matrix[5]];
}

function calculateUntransformedBoundingRect(node: SyntheticHTMLElement) {
  const rect = node.getBoundingClientRect();
  const bounds = new BoundingRect(rect.left, rect.top, rect.right, rect.bottom);
  const matrix = calculateTransform(node, false);
  return bounds.move({ left: -matrix[4], top: -matrix[5] }).zoom(1 / matrix[0]);
}

function scewBounds(bounds: BoundingRect, matrix: Array<number>) {
  return bounds.zoom(matrix[0] || 1).move({ left: matrix[4], top: matrix[5] });
}

function hasMeasurement(key) {
  return /left|top|right|bottom|width|height|padding|margin|border/.test(key);
}

function roundMeasurements(style) {
  const roundedStyle = {};
  for (let key in style) {
    const measurement: string = roundedStyle[key] = style[key];
    if (hasMeasurement(key)) {
      const value = measurement.match(/^(-?[\d\.]+)/)[1];
      const unit  = measurement.match(/([a-z]+)$/)[1];

      // ceiling is necessary here for zoomed in elements
      roundedStyle[key] = Math.round(Number(value)) + unit;
    }
  }

  return roundedStyle;
}