import "./index.scss";

import * as cx from "classnames";
import * as React from "react";
import { Workspace } from "sf-front-end/models";
import { MetadataKeys } from "sf-front-end/constants";
import { SelectAction } from "sf-front-end/actions";
import { getCSSSelection } from "sf-html-extension/ast";
import { FrontEndApplication } from "sf-front-end/application";
import { SelectWithCSSSelector } from "sf-html-extension/actions";
import { CSSRuleEntity, CSSRuleExpression } from "sf-html-extension/ast";
import { LayerLabelComponentFactoryDependency } from "sf-front-end/dependencies";

class CSSRuleLayerLabel extends React.Component<{ app: FrontEndApplication, workspace: Workspace, entity: CSSRuleEntity }, any> {

  render() {

    return <span
      className="m-label m-css-rule-layer-label">
      <span className="m-css-rule-layer-label--rule-name">
        { String(this.props.entity.source.selector.toString() || "").trim() }
      </span>
      <span className="m-css-rule-layer-label--selection-count"
      onClick={this.onClick} onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut}>
        { this.props.entity.selectedHTMLEntities.length }
      </span>
    </span>;
  }

  onClick = (event: React.MouseEvent) => {
    this.props.app.bus.execute(new SelectWithCSSSelector(this.props.entity.source.selector));
  }

  onMouseOver = (event: React.MouseEvent) => {
    this.props.entity.selectedHTMLEntities.forEach((entity) => {
      entity.metadata.set(MetadataKeys.HOVERING, true);
    });
  }

  onMouseOut = (event: React.MouseEvent) => {
    this.props.entity.selectedHTMLEntities.forEach((entity) => {
      entity.metadata.set(MetadataKeys.HOVERING, false);
    });
  }
}

export const dependency = new LayerLabelComponentFactoryDependency(CSSRuleExpression.name, CSSRuleLayerLabel);
