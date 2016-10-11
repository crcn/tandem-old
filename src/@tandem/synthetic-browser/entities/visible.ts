import { BoundingRect, IPoint } from "@tandem/common";
import { BaseSyntheticDOMContainerEntity, DefaultSyntheticDOMEntity } from "./base";
import { SyntheticDOMElement, SyntheticDOMNode, SyntheticHTMLElement } from "../dom";

// TODO - possibly move this over to @tandem/common/display or similar
export class SyntheticDOMCapabilities {
  constructor(
    readonly movable: boolean,
    readonly resizable: boolean
  ) {}

  merge(...capabilities: SyntheticDOMCapabilities[]) {
    return SyntheticDOMCapabilities.merge(this, ...capabilities);
  }

  static merge(...capabilities: SyntheticDOMCapabilities[]) {
    return capabilities.reduce((a, b) => (
      new SyntheticDOMCapabilities(
        a ? a.movable   && b.movable   : b.movable,
        b ? a.resizable && b.resizable : b.resizable
      )
    ));
  }
}

export abstract class BaseVisibleSyntheticDOMNodeEntity<T extends SyntheticDOMNode, U extends HTMLElement> extends BaseSyntheticDOMContainerEntity<T, U> {

  abstract position: IPoint;
  abstract capabilities: SyntheticDOMCapabilities;
  abstract absoluteBounds: BoundingRect;
  protected _renderedBounds: BoundingRect = BoundingRect.zeros();

  protected onRendered() {
    if (this.source instanceof SyntheticHTMLElement) {
      this.source.setBoundingClientRect(this._renderedBounds = this.browser.renderer.getBoundingRect(this.uid));
    }
  }
}