import { BoundingRect } from "sf-core/geom";
import { VisibleHTMLElementEntity } from "../base";
import { IEntityDisplay, IVisibleEntity, DisplayCapabilities } from "sf-core/entities";


export class HTMLNodeDisplay implements IEntityDisplay {
  constructor(readonly entity: VisibleHTMLElementEntity) { }

  /**
   */

  get capabilities() {

    const style = window.getComputedStyle(this.node);

    // TODO - need to wire this up
    return new DisplayCapabilities(
      style.position !== "static",
      /fixed|absolute/.test(style.position) || !/^inline$/.test(style.display)
    );
  }

  /**
   * returns the DOM node of the entity
   */

  get node(): Element {
    return <any>this.entity.section.targetNode;
  }

  /**
   * returns TRUE if the child node display information is isolated - meaning
   * that they need to consider *THIS* display object when calculating bounding
   * rect information
   */

  get isolatedChildNodes(): boolean {
    return /iframe/i.test(this.node.nodeName);
  }

  /**
   * the bounds of the visible element
   */

  get bounds(): BoundingRect {
    const clientRect: ClientRect = this.node.getBoundingClientRect();

    // convert into something that is not DOM specific
    const rect: BoundingRect = new BoundingRect(clientRect.left, clientRect.top, clientRect.right, clientRect.bottom);
    this._addIsolationOffset(rect);

    return rect;
  }

  private _addIsolationOffset(rect: BoundingRect) {
    for (const display of this._getParentDisplays()) {
      if (display.isolatedChildNodes) {
        const parentBounds = display.bounds;
        rect.move(parentBounds.left, parentBounds.top);

        // break - parent display will also calculate
        // isolation if it's embedded in an iframe
        break;
      }
    }
  }

  private _getParentDisplays(): Array<HTMLNodeDisplay> {
    let p = this.entity.parentNode;
    const parentDisplays = [];
    while (p) {
      if ((<IVisibleEntity><any>p).display instanceof HTMLNodeDisplay) {
        parentDisplays.push(<HTMLNodeDisplay>(<IVisibleEntity><any>p).display);
      }
      p = p.parentNode;
    }
    return parentDisplays;
  }
}