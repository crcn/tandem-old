import "./index.scss";
import * as React from "react";
import HeaderComponent from "./header";
import FooterComponent from "./footer";
import CanvasComponent from "./canvas";
import { Dependencies } from "sf-core/dependencies";
import { KeyBindingManager } from "sf-front-end/key-bindings";
import { Editor, Workspace } from "sf-front-end/models";
import { FrontEndApplication } from "sf-front-end/application";
import { ReactComponentFactoryDependency } from "sf-front-end/dependencies";

export default class StageComponent extends React.Component<{ app: FrontEndApplication, editor: Editor, workspace: Workspace }, any> {

  private _keyBindings: KeyBindingManager;

  render() {

    return (<div ref="container" className="m-editor-stage noselect">
      <HeaderComponent {...this.props} />
      <CanvasComponent {...this.props} zoom={this.props.editor.zoom} dependencies={this.props.app.dependencies} />
      <FooterComponent {...this.props} />
    </div>);
  }
}


export const dependency = new ReactComponentFactoryDependency("components/editors/sfn", StageComponent);
