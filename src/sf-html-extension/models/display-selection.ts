import { intersection } from "lodash";
import { CSSRuleExpression } from "sf-html-extension/parsers/css";
import { VisibleHTMLElementEntity } from "sf-html-extension/models";
import { DisplayEntitySelection } from "sf-front-end/models/display-entity-selection";
import { SelectionFactoryDependency } from "sf-front-end/dependencies";

export class HTMLEntityDisplaySelection extends DisplayEntitySelection<VisibleHTMLElementEntity> {
  get cssRuleExpressions(): Array<CSSRuleExpression> {
    return intersection(...this.map((entity) => entity.cssRuleExpressions));
  }
}

export const htmlDisplayEntitySelectionDependency = new SelectionFactoryDependency("display", HTMLEntityDisplaySelection);


