import "./index.scss";

import * as cx from "classnames";
import * as React from "react";
import { Workspace } from "tandem-front-end/models";
import { MetadataKeys } from "tandem-front-end/constants";
import { SelectAction } from "tandem-front-end/actions";
import { getCSSSelection } from "tandem-html-extension/ast";
import { FrontEndApplication } from "tandem-front-end/application";
import { SelectWithCSSSelectorAction } from "tandem-html-extension/actions";
import { CSSDeclarationEntity, CSSDeclarationExpression } from "tandem-html-extension/ast";
import { LayerLabelComponentFactoryDependency } from "tandem-front-end/dependencies";

class CSSDeclarationLayerLabelComponent extends React.Component<{ app: FrontEndApplication, workspace: Workspace, entity: CSSDeclarationEntity }, any> {

  render() {
    return <span
      className="m-label m-declaration-layer-label">
      <span className="m-declaration-layer-label--name">
        { String(this.props.entity.source.name.toString() || "").trim() }
      </span>
      <span className="m-declaration-layer-label--value">
        { String(this.props.entity.source.value) }
      </span>
    </span>;
  }
}

export const cssDeclarationLayerLabelComponentDependency = new LayerLabelComponentFactoryDependency(CSSDeclarationExpression.name, CSSDeclarationLayerLabelComponent);
