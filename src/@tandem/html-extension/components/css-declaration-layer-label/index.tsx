import "./index.scss";

import * as cx from "classnames";
import * as React from "react";
import { debounce } from "lodash";
import { Workspace } from "@tandem/editor/models";
import { cssTokenizer } from "@tandem/html-extension/tokenizers/css";
import { MetadataKeys } from "@tandem/editor/constants";
import { SelectAction } from "@tandem/editor/actions";
import { getCSSSelection } from "@tandem/html-extension/lang";
import { TextEditorComponent } from "@tandem/editor/components/text-editor";
import { FrontEndApplication } from "@tandem/editor/application";
import { SelectWithCSSSelectorAction } from "@tandem/html-extension/actions";
import { Dependencies } from "@tandem/common";
import { LayerLabelComponentFactoryDependency } from "@tandem/editor/dependencies";
import { CSSDeclarationEntity, CSSDeclarationExpression } from "@tandem/html-extension/lang";

class CSSDeclarationLayerLabelComponent extends React.Component<{ app: FrontEndApplication, workspace: Workspace, entity: CSSDeclarationEntity, dependencies: Dependencies }, any> {

  private _value: string;

  onValueChange = (value) => {
    this.props.entity.source.value = this._value = value;
  };

  onKeyDown = (event: KeyboardEvent) => {
    event.stopPropagation();
  }

  shouldComponentUpdate(props) {
    return this.props.entity.source !== props.entity.source || this.props.entity.source.name !== props.entity.source.name ||
    this._value !== this.props.entity.source.value;
  }

  render() {
    return <span
      className="m-label m-declaration-layer-label">
      <span className="support type">
        { String(this.props.entity.source.name.toString() || "").trim() }
      </span>
      <span>:&nbsp;</span>
      <span className="m-declaration-layer-label--value">
        <TextEditorComponent
          ref="editor"
          className="m-declaration-layer-label--value-editor"
          tokenizer={cssTokenizer}
          dependencies={this.props.dependencies}
          onKeyDown={this.onKeyDown}
          onChange={this.onValueChange}
          source={this._value = this.props.entity.source.value} />

          <span>;</span>
      </span>
    </span>;
  }
}

export const cssDeclarationLayerLabelComponentDependency = new LayerLabelComponentFactoryDependency(CSSDeclarationExpression.name, CSSDeclarationLayerLabelComponent);
