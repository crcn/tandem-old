import "./index.scss";

import * as cx from "classnames";
import * as React from "react";
import { Workspace } from "tandem-front-end/models";
import { cssTokenizer } from "tandem-html-extension/tokenizers/css";
import { MetadataKeys } from "tandem-front-end/constants";
import { SelectAction } from "tandem-front-end/actions";
import { getCSSSelection } from "tandem-html-extension/lang";
import { FrontEndApplication } from "tandem-front-end/application";
import { SelectWithCSSSelectorAction } from "tandem-html-extension/actions";
import { Dependencies } from "tandem-common";
import { LayerLabelComponentFactoryDependency } from "tandem-front-end/dependencies";
import { CSSCommentEntity, CSSCommentExpression } from "tandem-html-extension/lang";

class CSSCommentLayerLabelComponent extends React.Component<{ app: FrontEndApplication, workspace: Workspace, entity: CSSCommentEntity, dependencies: Dependencies }, any> {

  render() {
    return <span
      className="m-label m-css-comment-layer-label comment">
      { String(this.props.entity.source.value || "").trim() }
    </span>;
  }
}

export const cssCommentLayerLabelComponentDependency = new LayerLabelComponentFactoryDependency(CSSCommentExpression.name, CSSCommentLayerLabelComponent);
