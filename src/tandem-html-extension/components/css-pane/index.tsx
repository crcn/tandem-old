import "./index.scss";
import * as React from "react";
import { Workspace } from "tandem-front-end/models";
import PaneComponent from "tandem-front-end/components/pane";
import { parseCSS } from "tandem-html-extension/ast";
import { SelectAction } from "tandem-front-end/actions";
import { FrontEndApplication } from "tandem-front-end/application";
import { SelectWithCSSSelectorAction } from "tandem-html-extension/actions";
import { EntityPaneComponentFactoryDependency } from "tandem-front-end/dependencies";
import { HTMLElementEntity, VisibleHTMLElementEntity, IHTMLNodeEntity } from "tandem-html-extension/ast";
import { CSSExpression, CSSRuleExpression, CSSDeclarationExpression } from "tandem-html-extension/ast";

class StyleDeclarationComponent extends React.Component<any, any> {

  componentDidMount() {
    if (this.props.declaration.key === "") {
      (this.refs["key"] as any).focus();
    }
  }

  onKeyChange = (event) => {
    this.props.declaration.key = event.target.value;
  }

  onValueChange = (event) => {
    this.props.declaration.value = String(event.target.value);
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
  }

  render() {
    const declaration = this.props.declaration;
    return <div className="m-css-style-pane--declaration row">
      <div className="m-css-style-pane--declaration--key">
        <input ref="key" type="text" value={String(declaration.key)} onChange={this.onKeyChange} onBlur={this.onKeyBlur} />
      </div>
      <div className="m-css-style-pane--declaration--value">
        <input ref="value" type="text" value={String(declaration.value)} onChange={this.onValueChange} onKeyDown={this.onKeyDown} />
      </div>
    </div>;
  }
}

class StylePaneComponent extends React.Component<{ app: FrontEndApplication, workspace: Workspace, entity: VisibleHTMLElementEntity, rule: CSSRuleExpression }, any> {
  addNewDeclaration = () => {
    // this.props.rule.style.declarations.push(new CSSRuleExpression("", new CSSLiteralExpression("", null, null), null, null));
    this.forceUpdate();
  }

  onTitleClick = (event) => {
    this.props.app.bus.execute(new SelectWithCSSSelectorAction(this.props.rule));
  }

  render() {
    return <PaneComponent title={this.props.rule.selector ? this.props.rule.selector.toString() : "element.style"} onTitleClick={this.onTitleClick}>
        <div className="m-css-style-pane">
        {
          this.props.rule.children.map((declaration, i) => (
            <StyleDeclarationComponent {...this.props} declaration={declaration} style={this.props.rule} key={i} addNewDeclaration={this.addNewDeclaration} />
          ))
        }
      </div>
    </PaneComponent>;
  }
}

export class CSSPaneComponent extends React.Component<{ workspace: Workspace, app: FrontEndApplication }, any> {
  render() {
    const workspace = this.props.workspace;
    const selection = [];

    if (!selection.length) return null;

    const entity: VisibleHTMLElementEntity = selection[0];

    return <div className="m-css-pane m-pane-container--content">
        <StylePaneComponent {...this.props} entity={entity} rule={null} key="style" />
    </div>;
  }
}

export const cssPaneComponentDependency = new EntityPaneComponentFactoryDependency("css", CSSPaneComponent);