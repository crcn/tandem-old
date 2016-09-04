import { IVisibleEntity } from "tandem-common/ast/entities";
import { HTMLNodeDisplay } from "./displays";
import { HTMLElementEntity } from "./element";
import { HTMLElementExpression } from "tandem-html-extension/ast";
import { EntityFactoryDependency } from "tandem-common/dependencies";
import { IDOMSection, NodeSection } from "tandem-html-extension/dom";
import { parseCSSStyle, CSSStyleExpression } from "tandem-html-extension/ast";

export class VisibleHTMLElementEntity extends HTMLElementEntity implements IVisibleEntity {

  readonly type: string = "display";
  readonly displayType: string = "element";

  // TODO - change to something such as DisplayComputer
  readonly display = new HTMLNodeDisplay(this);

  private _styleExpression: CSSStyleExpression;
  private _originalStyle: string;

  updateFromLoaded() {
    const style = this.getAttribute("style");
    const newExpression = style ? parseCSSStyle(String(style)) : new CSSStyleExpression([], null, null);

    this._styleExpression = newExpression;

    this._originalStyle = this._styleExpression.toString();
  }

  updateSource() {
    if (this.styleExpression.declarations.length) {
      const newStyle = this.styleExpression.toString();
      if (newStyle !== this._originalStyle) {
        this.source.setAttribute("style", this._originalStyle = newStyle);
      }
    }

    super.updateSource();
  }

  createSection(): IDOMSection {
    return new NodeSection(document.createElement(this.source.name));
  }

  get styleExpression(): CSSStyleExpression {
    return this._styleExpression;
  }
}


export const defaultElementFactoyDependency =  new EntityFactoryDependency(HTMLElementExpression, VisibleHTMLElementEntity);
