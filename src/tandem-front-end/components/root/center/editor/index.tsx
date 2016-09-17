import "./index.scss";
import * as React from "react";
import HeaderComponent from "./header";
import FooterComponent from "./footer";
import CanvasComponent from "./canvas";
import { Dependencies } from "tandem-common/dependencies";
import { KeyBindingManager } from "tandem-front-end/key-bindings";
import { Editor, Workspace } from "tandem-front-end/models";
import { FrontEndApplication } from "tandem-front-end/application";
import { ReactComponentFactoryDependency } from "tandem-front-end/dependencies";

export default class StageComponent extends React.Component<{ app: FrontEndApplication, editor: Editor, workspace: Workspace }, any> {

  private _keyBindings: KeyBindingManager;

  render() {

    return (<div ref="container" className="m-editor-stage">
      <HeaderComponent {...this.props} />
      { this.props.workspace.file && this.props.workspace.file.entity ? <CanvasComponent {...this.props} zoom={this.props.editor.transform.scale} workspace={this.props.workspace} dependencies={this.props.app.dependencies} /> : null }
      <FooterComponent {...this.props} />
    </div>);
  }
}

