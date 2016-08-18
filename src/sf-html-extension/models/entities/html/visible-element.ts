import TAG_NAMES from "./tag-names";
import { IVisibleEntity } from "sf-core/entities";
import { HTMLNodeDisplay } from "./displays";
import { HTMLElementEntity } from "./element";
import { EntityFactoryDependency } from "sf-core/dependencies";
import { HTMLElementExpression } from "sf-html-extension/parsers/html";
import { parseCSSStyle, CSSStyleExpression } from "sf-html-extension/parsers/css";

export class VisibleHTMLElementEntity extends HTMLElementEntity implements IVisibleEntity {

  readonly type: string = "display";

  // TODO - change to something such as DisplayComputer
  readonly display = new HTMLNodeDisplay(this);

  private _styleExpression: CSSStyleExpression;

  protected willSourceChange(value: HTMLElementExpression) {
    const style = value.getAttribute("style");
    const newExpression = style ? parseCSSStyle(style) : new CSSStyleExpression([], null);
    if (this._styleExpression) {
      CSSStyleExpression.merge(this._styleExpression, newExpression);
    } else {
      this._styleExpression = newExpression;
    }

  }

  sync() {
    if (this.styleExpression.declarations.length) {
      this.setAttribute("style", this.styleExpression.toString());
    }
    super.sync();
  }

  get styleExpression(): CSSStyleExpression {
    return this._styleExpression;
  }
}

export const htmlElementDependencies        = TAG_NAMES.map((nodeName) => new EntityFactoryDependency(nodeName, VisibleHTMLElementEntity));
