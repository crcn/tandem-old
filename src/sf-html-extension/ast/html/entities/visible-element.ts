import TAG_NAMES from "./tag-names";
import { HTMLNodeDisplay } from "./displays";
import { HTMLElementEntity } from "./element";
import { IVisibleNodeEntity } from "sf-core/ast/entities";
import { HTMLElementExpression } from "sf-html-extension/ast";
import { EntityFactoryDependency } from "sf-core/dependencies";
import { IDOMSection, NodeSection } from "sf-html-extension/dom";
import { parseCSSStyle, CSSStyleExpression } from "sf-html-extension/ast";

export class VisibleHTMLElementEntity extends HTMLElementEntity implements IVisibleNodeEntity {

  readonly type: string = "display";
  readonly displayType: string = "element";

  // TODO - change to something such as DisplayComputer
  readonly display = new HTMLNodeDisplay(this);

  private _styleExpression: CSSStyleExpression;
  private _originalStyle: string;

  protected willSourceChange(value: HTMLElementExpression) {
    const style = value.getAttribute("style");
    const newExpression = style ? parseCSSStyle(style) : new CSSStyleExpression([], null);

    if (this._styleExpression) {
      this._styleExpression.patch(newExpression);
    } else {
      this._styleExpression = newExpression;
    }

    this._originalStyle = this._styleExpression.toString();
  }
  update() {
    if (this.styleExpression.declarations.length) {
      const newStyle = this.styleExpression.toString();
      if (newStyle !== this._originalStyle) {
        this.source.setAttribute("style", this._originalStyle = newStyle);
      }
    }

    super.update();
  }

  createSection(): NodeSection {
    return new NodeSection(document.createElement(this.name));
  }

  get styleExpression(): CSSStyleExpression {
    return this._styleExpression;
  }
}

export const htmlElementDependencies        = TAG_NAMES.map((nodeName) => new EntityFactoryDependency(nodeName, VisibleHTMLElementEntity));
