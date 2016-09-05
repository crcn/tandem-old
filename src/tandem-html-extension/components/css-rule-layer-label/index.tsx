import "./index.scss";

import * as cx from "classnames";
import * as React from "react";
import { Workspace } from "tandem-front-end/models";
import { MetadataKeys } from "tandem-front-end/constants";
import { SelectAction } from "tandem-front-end/actions";
import { getCSSSelection } from "tandem-html-extension/ast";
import { FrontEndApplication } from "tandem-front-end/application";
import { SelectWithCSSSelectorAction } from "tandem-html-extension/actions";
import { CSSRuleEntity, CSSRuleExpression } from "tandem-html-extension/ast";
import { LayerLabelComponentFactoryDependency } from "tandem-front-end/dependencies";

class CSSRuleLayerLabel extends React.Component<{ app: FrontEndApplication, workspace: Workspace, entity: CSSRuleEntity }, any> {

  render() {
    return <span
      className="m-label m-css-rule-layer-label">
      <span className="m-css-rule-layer-label--rule-name" onDoubleClick={this.edit}>
        { String(this.props.entity.source.selector.toString() || "").trim() }
      </span>
    </span>;
  }

  edit = () => {
    console.log("edit name");
  }

  onClick = (event: React.MouseEvent) => {
    this.props.app.bus.execute(new SelectWithCSSSelectorAction(this.props.entity.source));
  }

  // onMouseOver = (event: React.MouseEvent) => {
  //   this.props.entity.selectedHTMLEntities.forEach((entity) => {
  //     entity.metadata.set(MetadataKeys.HOVERING, true);
  //   });
  // }

  // onMouseOut = (event: React.MouseEvent) => {
  //   this.props.entity.selectedHTMLEntities.forEach((entity) => {
  //     entity.metadata.set(MetadataKeys.HOVERING, false);
  //   });
  // }
}

export const dependency = new LayerLabelComponentFactoryDependency(CSSRuleExpression.name, CSSRuleLayerLabel);
