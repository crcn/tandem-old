import { Action } from "tandem-common/actions";
import { WrapBus } from "mesh";
import { parseCSSStyle } from "tandem-html-extension/ast";
import { IVisibleEntity } from "tandem-common/ast/entities";
import { HTMLNodeDisplay } from "./displays";
import { HTMLElementEntity } from "./element";
import { CSSRuleExpression } from "tandem-html-extension/ast/css/expressions";
import { HTMLElementExpression } from "tandem-html-extension/ast";
import { EntityFactoryDependency } from "tandem-common/dependencies";
import { IDOMSection, NodeSection } from "tandem-html-extension/dom";

export class VisibleHTMLElementEntity extends HTMLElementEntity implements IVisibleEntity {

  readonly type: string = "display";
  readonly displayType: string = "element";

  // TODO - change to something such as DisplayComputer
  readonly display = new HTMLNodeDisplay(this);

  private _styleExpression: CSSRuleExpression;

  updateFromLoaded() {
    const style = this.getAttribute("style");
    const newExpression = parseCSSStyle(String(style || ""));

    this._styleExpression = newExpression;

    this._styleExpression.observe(new WrapBus(this.onStyleExpressionChange.bind(this)));
  }

  private onStyleExpressionChange(action: Action) {
    this.source.setAttribute("style", this._styleExpression.children.join(""));
  }

  createSection(): IDOMSection {
    return new NodeSection(document.createElement(this.source.name));
  }

  get styleExpression(): CSSRuleExpression {
    return this._styleExpression;
  }
}


export const defaultElementFactoyDependency =  new EntityFactoryDependency(HTMLElementExpression, VisibleHTMLElementEntity);
