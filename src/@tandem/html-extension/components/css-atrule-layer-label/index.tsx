
import "./index.scss";

import * as cx from "classnames";
import * as React from "react";
import { Workspace } from "@tandem/editor/models";
import { MetadataKeys } from "@tandem/editor/constants";
import { SelectAction } from "@tandem/editor/actions";
import { getCSSSelection } from "@tandem/html-extension/lang";
import { FrontEndApplication } from "@tandem/editor/application";
import { SelectWithCSSSelectorAction } from "@tandem/html-extension/actions";
import { CSSAtRuleEntity, CSSATRuleExpression } from "@tandem/html-extension/lang";
import { LayerLabelComponentFactoryDependency } from "@tandem/editor/dependencies";

class CSSAtRuleLayerLabelComponent extends React.Component<{ app: FrontEndApplication, workspace: Workspace, entity: CSSAtRuleEntity }, any> {

  render() {
    return <span
      className="m-label m-css-atrule-layer-label">
      <span className="entity name keyword control">
        { String(this.props.entity.source.name || "").trim() }
      </span>
      <span className="string">
        { String(this.props.entity.source.params || "").trim() }
      </span>
    </span>;
  }
}


export const cssAtRuleLayerLabelComponentDependency = new LayerLabelComponentFactoryDependency(CSSATRuleExpression.name, CSSAtRuleLayerLabelComponent);

