import "./index.scss";
import * as React from "react";
import { Workspace } from "sf-front-end/models";
import PaneComponent from "sf-front-end/components/pane";
import { HTMLElementEntity } from "sf-html-extension/entities/html";
import { parse as parseCSS } from "sf-html-extension/parsers/css";
import { PaneComponentFactoryDependency } from "sf-front-end/dependencies";
import { CSSExpression, CSSStyleExpression, CSSStyleDeclarationExpression } from "sf-html-extension/parsers/css/expressions";

class StyleDeclarationComponent extends React.Component<{ declaration: any }, any> {
  render() {
    const declaration = this.props.declaration;
    return <div className="m-css-style-pane--declaration row">
      <div className="m-css-style-pane--declaration--key">
        { declaration.key }
      </div>
      <div className="m-css-style-pane--declaration--value">
        { String(declaration.value) }
      </div>
    </div>;
  }
}
class StylePaneComponent extends React.Component<any, any> {
  render() {
    const entity: HTMLElementEntity = this.props.entity;
    const styleSource: string = entity.getAttribute("style") || "";
    const styleExpression: CSSStyleExpression = parseCSS(styleSource) as CSSStyleExpression;
    return <div className="m-css-style-pane">
      {
        styleExpression.declarations.map((declaration) => (
          <StyleDeclarationComponent {...this.props} declaration={declaration} key={declaration.key} />
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
      <PaneComponent title="style">
        <StylePaneComponent entity={selection[0]} />
      </PaneComponent>
    </div>;
  }
}

export const dependency = new PaneComponentFactoryDependency("css", CSSPaneComponent);