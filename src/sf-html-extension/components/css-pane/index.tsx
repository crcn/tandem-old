import "./index.scss";
import * as React from "react";
import { Workspace } from "sf-front-end/models";
import PaneComponent from "sf-front-end/components/pane";
import { HTMLElementEntity } from "sf-html-extension/entities/html";
import { parse as parseCSS } from "sf-html-extension/parsers/css";
import { PaneComponentFactoryDependency } from "sf-front-end/dependencies";
import { CSSExpression, CSSStyleExpression, CSSStyleDeclarationExpression, CSSLiteralExpression } from "sf-html-extension/parsers/css/expressions";

class StyleDeclarationComponent extends React.Component<{ workspace: Workspace, declaration: CSSStyleDeclarationExpression }, any> {

  onKeyChange = (event) => {
    this.props.declaration.key = event.target.value;
    this.props.workspace.file.save();
  }

  onValueChange = (event) => {
    this.props.declaration.value = new CSSLiteralExpression(event.target.value, null);
    this.props.workspace.file.save();
  }

  render() {
    const declaration = this.props.declaration;
    return <div className="m-css-style-pane--declaration row">
      <div className="m-css-style-pane--declaration--key">
        <input ref="value" type="text" value={String(declaration.key)} onChange={this.onKeyChange} />
      </div>
      <div className="m-css-style-pane--declaration--value">
        <input ref="value" type="text" value={String(declaration.value)} onChange={this.onValueChange} />
      </div>
    </div>;
  }
}

class StylePaneComponent extends React.Component<any, any> {
  render() {
    const entity: HTMLElementEntity = this.props.entity;
    const styleExpression: CSSStyleExpression = entity.styleExpressions[0];
    return <div className="m-css-style-pane">
      {
        styleExpression.declarations.map((declaration, i) => (
          <StyleDeclarationComponent {...this.props} declaration={declaration} key={i} />
        ))
      }
    </div>;
  }
}

export class CSSPaneComponent extends React.Component<{ workspace: Workspace }, any> {
  render() {
    const workspace = this.props.workspace;
    const selection = workspace.selection;

    if (!selection.length) return null;

    return <div className="m-css-pane m-pane-container--content">
      <PaneComponent title="Style">
        <StylePaneComponent {...this.props} entity={selection[0]} />
      </PaneComponent>
    </div>;
  }
}

export const dependency = new PaneComponentFactoryDependency("css", CSSPaneComponent);