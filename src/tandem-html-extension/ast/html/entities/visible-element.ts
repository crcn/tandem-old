import { IVisibleEntity } from "tandem-common/ast/entities";
import { HTMLNodeDisplay } from "./displays";
import { HTMLElementEntity } from "./element";
import { HTMLElementExpression } from "tandem-html-extension/ast";
import { EntityFactoryDependency } from "tandem-common/dependencies";
import { IDOMSection, NodeSection } from "tandem-html-extension/dom";
import { parseCSSStyle } from "tandem-html-extension/ast";
import { CSSRuleExpression } from "tandem-html-extension/ast/css/expressions";

export class VisibleHTMLElementEntity extends HTMLElementEntity implements IVisibleEntity {

  readonly type: string = "display";
  readonly displayType: string = "element";

  // TODO - change to something such as DisplayComputer
  readonly display = new HTMLNodeDisplay(this);

  private _styleExpression: CSSRuleExpression;
  private _originalStyle: string;

  updateFromLoaded() {
    const style = this.getAttribute("style");
    const newExpression = parseCSSStyle(String(style || ""));


    this._styleExpression = newExpression;

    this._originalStyle = this._styleExpression.children.join("");
  }

  updateSource() {
    if (this.styleExpression.children.length) {
      const newStyle = this.styleExpression.children.join("");
      if (newStyle !== this._originalStyle) {
        this.source.setAttribute("style", this._originalStyle = newStyle);
      }
    }

    super.updateSource();
  }

  createSection(): IDOMSection {
    return new NodeSection(document.createElement(this.source.name));
  }

  get styleExpression(): CSSRuleExpression {
    return this._styleExpression;
  }
}


export const defaultElementFactoyDependency =  new EntityFactoryDependency(HTMLElementExpression, VisibleHTMLElementEntity);
