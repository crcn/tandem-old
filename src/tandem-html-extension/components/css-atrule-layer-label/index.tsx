
import "./index.scss";

import * as cx from "classnames";
import * as React from "react";
import { Workspace } from "tandem-front-end/models";
import { MetadataKeys } from "tandem-front-end/constants";
import { SelectAction } from "tandem-front-end/actions";
import { getCSSSelection } from "tandem-html-extension/ast";
import { FrontEndApplication } from "tandem-front-end/application";
import { SelectWithCSSSelectorAction } from "tandem-html-extension/actions";
import { CSSAtRuleEntity, CSSATRuleExpression } from "tandem-html-extension/ast";
import { LayerLabelComponentFactoryDependency } from "tandem-front-end/dependencies";

class CSSAtRuleLayerLabelComponent extends React.Component<{ app: FrontEndApplication, workspace: Workspace, entity: CSSAtRuleEntity }, any> {

  render() {
    return <span
      className="m-label m-css-atrule-layer-label">
      <span className="m-css-atrule-layer-label--name">
        { String(this.props.entity.source.name || "").trim() }
      </span>
      <span className="m-css-atrule-layer-label--params">
        { String(this.props.entity.source.params || "").trim() }
      </span>
    </span>;
  }
}


export const cssAtRuleLayerLabelComponentDependency = new LayerLabelComponentFactoryDependency(CSSATRuleExpression.name, CSSAtRuleLayerLabelComponent);

