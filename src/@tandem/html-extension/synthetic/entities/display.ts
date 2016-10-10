// import { parseCSS } from "@tandem/html-extension/lang";
// import * as memoize from "memoizee";
// import { watchProperty } from "@tandem/common/observable";
// import { Action, UPDATE } from "@tandem/common/actions";
// import { SyntheticVisibleHTMLEntity } from "./default";
// import { BoundingRect, IPoint } from "@tandem/common/geom";
// import { SyntheticHTMLElement } from "@tandem/synthetic-browser";
// import { IEntityDisplay, IVisibleEntity, DisplayCapabilities } from "@tandem/common/lang/entities";

// function calculateCSSMeasurments(style): any {
//   const calculated = {};
//   for (let key in style) {
//     if (hasMeasurement(key)) {
//       calculated[key] = Number(style[key].replace("px", ""));
//     }
//   }
//   return calculated;
// }

// /**
//  * Robust method for fetching parent nodes outside
//  * of an iframe
//  */

// function getParentNode(node: SyntheticHTMLElement): SyntheticHTMLElement {
//   const parentNode = <SyntheticHTMLElement>node.parentNode;

//   if (parentNode && parentNode.nodeName === "#document") {
//     const localWindow  = node.ownerDocument.defaultView;
//     if (localWindow && localWindow.parent) {
//       const parentWindow = localWindow.parent;
//       return Array.prototype.find.call(parentWindow.document.querySelectorAll("iframe"), (iframe) => {
//         return iframe.contentWindow === localWindow;
//       });
//     }
//   }

//   return <SyntheticHTMLElement>parentNode;
// }

// function parseCSSMatrixValue(value: string) {
//   return value.replace(/matrix\((.*?)\)/, "$1").split(/,\s/).map((value) => Number(value));
// }

// function calculateTransform(node: SyntheticHTMLElement, includeIframes: boolean = true) {
//   let cnode = <SyntheticHTMLElement>node;
//   let matrix = [0, 0, 0, 0, 0, 0];
//   while (cnode) {

//     if (cnode.nodeName === "IFRAME" && cnode !== node && !includeIframes) {
//       break;
//     }

//     if (cnode.nodeType === 1) {

//       // TODO - this needs to be memoized - getComputedStyle is expensive.
//       const style = window.getComputedStyle(cnode);
//       if (style.transform !== "none") {
//         const cnodeMatrix = parseCSSMatrixValue(style.transform);
//         for (let i = cnodeMatrix.length; i--; ) {
//           matrix[i] += cnodeMatrix[i];
//         }
//       }
//     }

//     cnode = getParentNode(cnode);
//   }

//   return [matrix[0] || 1, matrix[1], matrix[2], matrix[3] || 1, matrix[4], matrix[5]];
// }

// function calculateUntransformedBoundingRect(node: SyntheticHTMLElement) {
//   const rect = node.getBoundingClientRect();
//   const bounds = new BoundingRect(rect.left, rect.top, rect.right, rect.bottom);
//   const matrix = calculateTransform(node, false);
//   return bounds.move({ left: -matrix[4], top: -matrix[5] }).zoom(1 / matrix[0]);
// }

// function scewBounds(bounds: BoundingRect, matrix: Array<number>) {
//   return bounds.zoom(matrix[0] || 1).move({ left: matrix[4], top: matrix[5] });
// }

// function hasMeasurement(key) {
//   return /left|top|right|bottom|width|height|padding|margin|border/.test(key);
// }

// function roundMeasurements(style) {
//   const roundedStyle = {};
//   for (let key in style) {
//     const measurement: string = roundedStyle[key] = style[key];
//     if (hasMeasurement(key)) {
//       const value = measurement.match(/^(-?[\d\.]+)/)[1];
//       const unit  = measurement.match(/([a-z]+)$/)[1];

//       // ceiling is necessary here for zoomed in elements
//       roundedStyle[key] = Math.round(Number(value)) + unit;
//     }
//   }

//   return roundedStyle;
// }

// export class HTMLNodeComponentDisplay implements IEntityDisplay {

//   private _cachedBounds: BoundingRect;

//   constructor(readonly component: SyntheticVisibleHTMLEntity) { }

//   /**
//    */

//   get capabilities() {

//     const style = window.getComputedStyle(this.node);

//     // TODO - need to wire this up
//     return new DisplayCapabilities(
//       style.position !== "static",
//       /fixed|absolute/.test(style.position) || !/^inline$/.test(style.display)
//     );
//   }

//   get position(): IPoint {
//     const bounds = this.bounds;
//     return { left: bounds.left, top: bounds.top };
//   }

//   /**
//    */

//   set position({ left, top }: IPoint) {
//     const bounds = this.bounds;
//     this.bounds = new BoundingRect(left, top, left + bounds.width, top + bounds.height);
//   }

//   /**
//    * the bounds of the visible element
//    */

//   get bounds(): BoundingRect {
//     let rect: BoundingRect = calculateUntransformedBoundingRect(this.node);
//     return rect;
//   }

//   /**
//    * bounds including the border
//    */

//   get innerBounds(): BoundingRect {
//     const bounds = this.bounds;

//     const {
//       borderLeftWidth,
//       borderTopWidth,
//       borderRightWidth,
//       borderBottomWidth,
//       paddingLeft,
//       paddingTop,
//       paddingRight,
//       paddingBottom,
//     } = calculateCSSMeasurments(window.getComputedStyle(this.node));

//     return new BoundingRect(
//       bounds.left + borderLeftWidth + paddingLeft,
//       bounds.top + borderTopWidth + paddingTop,
//       bounds.right - borderLeftWidth - borderRightWidth - paddingRight,
//       bounds.bottom - borderBottomWidth - borderTopWidth - paddingBottom
//     );
//   }

//   set bounds(value: BoundingRect) {
//     this._cachedBounds = undefined;

//     const bounds = this.bounds;

//     const computedStyle: any = calculateCSSMeasurments(window.getComputedStyle(this.node));

//     let newStyle: any = {};

//     const transforms = this._calculateTransforms();
//     const scaled = value.move({ left: -transforms.left, top: -transforms.top }).zoom(1 / transforms.scale);

//     // TODO - this needs to be tested
//     scaled.right  -= computedStyle.borderLeftWidth + computedStyle.borderRightWidth;
//     scaled.bottom -= computedStyle.borderTopWidth + computedStyle.borderBottomWidth;

//     if (value.left !== bounds.left) {
//       // const scale = bounds.left / (existingStyle.left || 0);
//       // const originLeft = bounds.left - existingStyle.left || 0;
//       newStyle.left = scaled.left + "px";
//     }

//     if (value.top !== bounds.top) {
//       const originTop  = bounds.top  - computedStyle.top || 0;
//       newStyle.top = scaled.top + "px";
//     }

//     if (Math.round(value.width) !== Math.round(bounds.width)) {
//       newStyle.width = (scaled.width - computedStyle.paddingLeft - computedStyle.paddingRight) + "px";
//     }

//     if (Math.round(value.height) !== Math.round(bounds.height)) {
//       newStyle.height = (scaled.height - computedStyle.paddingTop - computedStyle.paddingBottom) + "px";
//     }

//     newStyle = roundMeasurements(newStyle);
//   }

//   private _getParentDisplays(): Array<HTMLNodeComponentDisplay> {
//     let p = this.component.parent;
//     const parentDisplays = [];
//     while (p) {
//       if ((<IVisibleEntity><any>p).display instanceof HTMLNodeComponentDisplay) {
//         parentDisplays.push(<HTMLNodeComponentDisplay>(<any>p).display);
//       }
//       p = p.parent;
//     }
//     return parentDisplays;
//   }
// }