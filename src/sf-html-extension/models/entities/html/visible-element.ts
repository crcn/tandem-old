import TAG_NAMES from "./tag-names";
import { IVisibleEntity } from "sf-core/entities";
import { HTMLNodeDisplay } from "./displays";
import { HTMLElementEntity } from "./element";
import { EntityFactoryDependency } from "sf-core/dependencies";
import { HTMLElementExpression } from "sf-html-extension/parsers/html";
import { parseCSSStyle, CSSStyleExpression } from "sf-html-extension/parsers/css";

export class VisibleHTMLElementEntity extends HTMLElementEntity implements IVisibleEntity {

  readonly type: string = "display";
  readonly displayType: string = "element";

  // TODO - change to something such as DisplayComputer
  readonly display = new HTMLNodeDisplay(this);

  private _styleExpression: CSSStyleExpression;

  protected willSourceChange(value: HTMLElementExpression) {
    const style = value.getAttribute("style");
    const newExpression = style ? parseCSSStyle(style) : new CSSStyleExpression([], null);

    // TODO - this._styleExpression = recycle(parseCSSStyle(style), this._styleExpression, CSSExpression.merge)
    if (this._styleExpression) {
      CSSStyleExpression.merge(this._styleExpression, newExpression);
    } else {
      this._styleExpression = newExpression;
    }

  }

  update() {
    if (this.hasAttribute("style")) {
      this.source.setAttribute("style", this.getAttribute("style"));
    }
    super.update();
  }

  get styleExpression(): CSSStyleExpression {
    return this._styleExpression;
  }
}

export const htmlElementDependencies        = TAG_NAMES.map((nodeName) => new EntityFactoryDependency(nodeName, VisibleHTMLElementEntity));
