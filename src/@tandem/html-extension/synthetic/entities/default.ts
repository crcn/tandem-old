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
      height: bounds.
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