import { Action } from "@tandem/common/actions";
import { WrapBus } from "mesh";
import { parseCSSStyle } from "@tandem/html-extension/lang";
import { IVisibleEntity } from "@tandem/common/lang/entities";
import { HTMLNodeDisplay } from "./displays";
import { MarkupElementEntity } from "./element";
import { CSSRuleExpression } from "@tandem/html-extension/lang/css/ast";
import { MarkupElementExpression } from "@tandem/html-extension/lang/html/ast";
import { EntityFactoryDependency } from "@tandem/common/dependencies";
import { IDOMSection, NodeSection } from "@tandem/html-extension/dom";

export class VisibleMarkupElementEntity extends MarkupElementEntity implements IVisibleEntity {

  readonly type: string = "display";
  readonly displayType: string = "element";

  // TODO - change to something such as DisplayComputer
  readonly display = new HTMLNodeDisplay(this);

  private _styleExpression: CSSRuleExpression;

  async evaluate(context: any) {
    await super.evaluate(context);
    const style = this.getAttribute("style");
    const newExpression = parseCSSStyle(String(style || ""));

    this._styleExpression = newExpression;

    this._styleExpression.observe(new WrapBus(this.onStyleExpressionChange.bind(this)));
  }

  private onStyleExpressionChange(action: Action) {
    const styleSource = this._styleExpression.children.join("");
    this.source.setAttribute("style", styleSource);

    // immediate feedback
    this.setAttribute("style", styleSource);
  }

  createSection(): IDOMSection {
    return new NodeSection(document.createElement(this.source.name));
  }

  get styleExpression(): CSSRuleExpression {
    return this._styleExpression;
  }
}


export const defaultElementFactoyDependency =  new EntityFactoryDependency(MarkupElementExpression, VisibleMarkupElementEntity);
