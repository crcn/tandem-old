import {
  getComputedStyle,
  SyntheticHTMLElement,
  SyntheticDOMCapabilities,
  SyntheticCSSStyleDeclaration,
  BaseVisibleSyntheticDOMNodeEntity,
} from "@tandem/synthetic-browser";

import { BoundingRect, IPoint } from "@tandem/common";
// import { HTMLNodeComponentDisplay } from "./display÷";

export class SyntheticVisibleHTMLEntity extends BaseVisibleSyntheticDOMNodeEntity<SyntheticHTMLElement, any> {

  get position(): IPoint {
    const bounds = this.absoluteBounds;
    return { left: bounds.left, top: bounds.top };
  }

  set position(value: IPoint) {
    this.source.style.left = value.left + "px";
    this.source.style.top  = value.top + "px";
  }

  get absoluteBounds() {
    return this._renderedBounds;
  }

  set absoluteBounds(bounds: BoundingRect) {
    this.source.style.left   = bounds.left + "px";
    this.source.style.top    = bounds.top + "px";
    this.source.style.width  = bounds.width + "px";
    this.source.style.height = bounds.height + "px";
  }

  get capabilities() {
    const style: SyntheticCSSStyleDeclaration = getComputedStyle(this.source);
    return new SyntheticDOMCapabilities(
      style.position !== "static",
      /fixed|absolute/.test(style.position) || !/^inline$/.test(style.display)
    );
  }
}