import { intersection, values } from "lodash";
import { VisibleEntityCollection } from "sf-front-end/collections/visible-entity-collection";
import { VisibleHTMLElementEntity } from "sf-html-extension/ast";
import { CSSRuleExpression, CSSStyleExpression, CSSStyleDeclarationExpression } from "sf-html-extension/ast";

export class VisibleHTMLElementCollection<T extends VisibleHTMLElementEntity>  extends VisibleEntityCollection<T> {
  private _styleExpression: CSSStyleExpression;

  get cssRuleExpressions(): Array<CSSRuleExpression> {
    return intersection(...this.map((entity) => entity.cssRuleExpressions));
  }

  get styleExpression(): CSSStyleExpression {
    const declarationsByKey = {};

    for (const entity of this) {
      for (const declaration of entity.styleExpression.declarations) {
        if (declarationsByKey[declaration.key]) {
          // if (declarationsByKey)
        } else {
          declarationsByKey[declaration.key] = declaration;
        }
      }
    }

    const expr = new CSSStyleExpression(<Array<CSSStyleDeclarationExpression>>values(declarationsByKey), null);
    if (this._styleExpression) {
      this._styleExpression.patch(expr);
    } else {
      this._styleExpression = expr;
    }
    return this._styleExpression;
  }
}


