import { intersection, values } from "lodash";
import { CSSRuleExpression, CSSStyleExpression, CSSStyleDeclarationExpression } from "sf-html-extension/parsers/css";
import { VisibleHTMLElementEntity } from "sf-html-extension/models";
import { DisplayEntitySelection } from "sf-front-end/models/display-entity-selection";
import { SelectionFactoryDependency } from "sf-front-end/dependencies";

export class HTMLEntityDisplaySelection extends DisplayEntitySelection<VisibleHTMLElementEntity> {
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

export const htmlDisplayEntitySelectionDependency = new SelectionFactoryDependency("display", HTMLEntityDisplaySelection);


