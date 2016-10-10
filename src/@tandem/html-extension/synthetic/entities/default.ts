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
    const bounds = this.scaledBounds;
    return { left: bounds.left, top: bounds.top };
  }

  set position(value: IPoint) {
    this.scaledBounds = this.scaledBounds.move(value);
  }

  get scaledBounds() {
    return this._renderedBounds;
  }
  set scaledBounds(bounds: BoundingRect) {
    console.log(bounds);
  }

  get capabilities() {
    const style: SyntheticCSSStyleDeclaration = getComputedStyle(this.source);
    return new SyntheticDOMCapabilities(
      style.position !== "static",
      /fixed|absolute/.test(style.position) || !/^inline$/.test(style.display)
    );
  }
}