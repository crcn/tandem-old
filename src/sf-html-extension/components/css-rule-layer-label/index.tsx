import "./index.scss";

import * as cx from "classnames";
import * as React from "react";
import { Workspace } from "sf-front-end/models";
import { SelectAction } from "sf-front-end/actions";
import { FrontEndApplication } from "sf-front-end/application";
import { SelectWithCSSSelector } from "sf-html-extension/actions";
import { CSSRuleEntity, CSSRuleExpression } from "sf-html-extension/ast";
import { LayerLabelComponentFactoryDependency } from "sf-front-end/dependencies";

class CSSRuleLayerLabel extends React.Component<{ app: FrontEndApplication, workspace: Workspace, entity: CSSRuleEntity }, any> {

  render() {
    return <span
      className="m-label m-css-rule-layer-label"
      onClick={this.onClick}>
      {
         String(this.props.entity.source.selector.toString() || "").trim()
      }
    </span>;
  }

  onClick = (event: React.MouseEvent) => {
    this.props.app.bus.execute(new SelectWithCSSSelector(this.props.entity.source.selector));
  }
}

export const dependency = new LayerLabelComponentFactoryDependency(CSSRuleExpression.name, CSSRuleLayerLabel);
