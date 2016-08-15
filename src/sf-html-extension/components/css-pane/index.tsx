import "./index.scss";
import * as React from "react";
import { Workspace } from "sf-front-end/models";
import PaneComponent from "sf-front-end/components/pane";
import { HTMLElementEntity } from "sf-html-extension/entities/html";
import { parse as parseCSS } from "sf-html-extension/parsers/css";
import { PaneComponentFactoryDependency } from "sf-front-end/dependencies";
import { CSSExpression, CSSStyleExpression, CSSStyleDeclarationExpression, CSSLiteralExpression } from "sf-html-extension/parsers/css/expressions";

class StyleDeclarationComponent extends React.Component<{ workspace: Workspace, declaration: CSSStyleDeclarationExpression, style: CSSStyleExpression, addNewDeclaration: Function }, any> {

  componentDidMount() {
    if (this.props.declaration.key === "") {
      (this.refs["key"] as any).focus();
    }
  }

  onKeyChange = (event) => {
    this.props.declaration.key = event.target.value;
    this.props.workspace.file.save();
  }

  onValueChange = (event) => {
    this.props.declaration.value = new CSSLiteralExpression(event.target.value, null);
    this.props.workspace.file.save();
  }

  onKeyDown = (event: KeyboardEvent) => {
    // if (event.keyCode === 8 && event.target === this.refs["key"] && event.target === "") {

    // }
    if ([13, 9].indexOf(event.keyCode) !== -1 && !event.shiftKey && this.props.style.declarations[this.props.style.declarations.length - 1] === this.props.declaration) {
      event.preventDefault();
      this.props.addNewDeclaration();
    }
  }

  remove = () => {
    this.props.style.declarations.splice(this.props.style.declarations.indexOf(this.props.declaration), 1);
  }

  onKeyBlur = () => {
    if ((this.refs["key"] as any).value === "") {
      this.remove();
    }
    this.props.workspace.file.save();
  }

  onValueBlur = () => {
    // if ((this.refs["value"] as any).value === "") {
    //   this.remove();
    // }
    // this.props.workspace.file.save();
  }

  render() {
    const declaration = this.props.declaration;
    return <div className="m-css-style-pane--declaration row">
      <div className="m-css-style-pane--declaration--key">
        <input ref="key" type="text" value={String(declaration.key)} onChange={this.onKeyChange} onBlur={this.onKeyBlur} />
      </div>
      <div className="m-css-style-pane--declaration--value">
        <input ref="value" type="text" value={String(declaration.value)} onChange={this.onValueChange} onKeyDown={this.onKeyDown} onBlur={this.onValueBlur} />
      </div>
    </div>;
  }
}

class StylePaneComponent extends React.Component<any, any> {
  addNewDeclaration = () => {
    this.styleExpression.declarations.push(new CSSStyleDeclarationExpression("", new CSSLiteralExpression("", null), null));
    this.forceUpdate();
  }

  get styleExpression(): CSSStyleExpression {
    return this.props.entity.styleExpressions[0];
  }

  render() {
    const styleExpression: CSSStyleExpression = this.styleExpression;
    return <div className="m-css-style-pane">
      {
        styleExpression.declarations.map((declaration, i) => (
          <StyleDeclarationComponent {...this.props} declaration={declaration} style={this.styleExpression} key={i} addNewDeclaration={this.addNewDeclaration} />
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