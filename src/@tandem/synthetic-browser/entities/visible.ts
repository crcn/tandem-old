import { BoundingRect, IPoint } from "@tandem/common";
import { BaseDOMContainerEntity, DefaultSyntheticDOMEntity } from "./base";
import { SyntheticDOMElement, SyntheticDOMNode, SyntheticHTMLElement } from "../dom";

// TODO - possibly move this over to @tandem/common/display or similar
export class DOMNodeEntityCapabilities {
  constructor(
    readonly movable: boolean,
    readonly resizable: boolean
  ) {}

  merge(...capabilities: DOMNodeEntityCapabilities[]) {
    return DOMNodeEntityCapabilities.merge(this, ...capabilities);
  }

  static merge(...capabilities: DOMNodeEntityCapabilities[]) {
    return capabilities.reduce((a, b) => (
      new DOMNodeEntityCapabilities(
        a ? a.movable   && b.movable   : b.movable,
        b ? a.resizable && b.resizable : b.resizable
      )
    ));
  }
}

export abstract class BaseVisibleDOMNodeEntity<T extends SyntheticDOMNode, U extends HTMLElement> extends BaseDOMContainerEntity<T, U> {

  abstract position: IPoint;
  abstract capabilities: DOMNodeEntityCapabilities;
  abstract absoluteBounds: BoundingRect;

  protected _renderedBounds: BoundingRect = BoundingRect.zeros();

  protected onRendered() {
    if (this.source instanceof SyntheticHTMLElement) {
      this.source.setBoundingClientRect(this._renderedBounds = this.browser.renderer.getBoundingRect(this.uid));
    }
  }
}