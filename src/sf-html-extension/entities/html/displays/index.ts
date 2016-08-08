import { BoundingRect, IPosition } from "sf-core/geom";
import { VisibleHTMLElementEntity } from "../base";
import { IEntityDisplay, IVisibleEntity, DisplayCapabilities } from "sf-core/entities";
import { parse as parseCSS } from "sf-html-extension/parsers/css";
import { WrapBus } from "mesh";
import { CSSStyleExpression, CSSStyleDeclarationExpression } from "sf-html-extension/parsers/css/expressions";

export class HTMLNodeDisplay implements IEntityDisplay {

  private _style: CSSStyleExpression;

  constructor(readonly entity: VisibleHTMLElementEntity) {
    entity.observe(WrapBus.create(this._updateStyles));
    this._updateStyles();
  }

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
   */

  movePosition({ left, top }: IPosition) {

    const style = {
      left: left + "px",
      top : top  + "px"
    };

    this._setExpressionStyle(style);
  }

  /**
   * returns the DOM node of the entity
   */

  get node(): HTMLElement {
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

  set bounds(value: BoundingRect) {
    // const clientRect = this.node.getBoundingClientRect();
    const style = {
      left: value.left + "px",
      top : value.top + "px",
      width: value.width + "px",
      height: value.height + "px"
    };

    this._setExpressionStyle(style);
  }

  private _addIsolationOffset(rect: BoundingRect) {
    for (const display of this._getParentDisplays()) {
      if (display.isolatedChildNodes) {
        const parentBounds = display.bounds;
        rect.move(parentBounds.left, parentBounds.top);

        // break - parent display will also calculate
        // isolation if it"s embedded in an iframe
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

  private _updateStyles = () => {
    const style = this.entity.getAttribute("style") || "";
    this._style = <CSSStyleExpression>parseCSS(style);
  }


  private _setExpressionStyle(styles: Object) {
    for (const key in styles) {
      const value = styles[key];
      let found = false;
      for (const declaration of this._style.declarations) {
        if (declaration.key === key) {
          declaration.value = value;
          found = true;
          break;
        }
      }
      if (!found) {
        this._style.declarations.push(new CSSStyleDeclarationExpression(key, value, null));
      }
    }

    this.entity.setAttribute("style", this._style.toString());
  }
}