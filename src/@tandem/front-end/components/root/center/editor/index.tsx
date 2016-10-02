import "./index.scss";
import * as React from "react";
import HeaderComponent from "./header";
import FooterComponent from "./footer";
import CanvasComponent from "./canvas";
import PreviewComponent from "./canvas/preview";
import { Dependencies } from "@tandem/common/dependencies";
import { KeyBindingManager } from "@tandem/front-end/key-bindings";
import { Editor, Workspace } from "@tandem/front-end/models";
import { FrontEndApplication } from "@tandem/front-end/application";
import { ReactComponentFactoryDependency } from "@tandem/front-end/dependencies";

export default class StageComponent extends React.Component<{ app: FrontEndApplication, editor: any, workspace: Workspace }, any> {

  private _keyBindings: KeyBindingManager;

  render() {

    if (!this.props.app.editor) return null;

    return (<div ref="container" className="m-editor-stage">
      <HeaderComponent {...this.props} />
      <CanvasComponent {...this.props} zoom={this.props.editor.transform.scale} dependencies={this.props.app.dependencies} />
      <FooterComponent {...this.props} />
    </div>);
  }
}

