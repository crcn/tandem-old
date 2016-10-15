import "./index.scss";
import * as React from "react";
import HeaderComponent from "./header";
import FooterComponent from "./footer";
import CanvasComponent from "./canvas";
import PreviewComponent from "./canvas/preview";
import { Editor } from "@tandem/editor/models";
import { Dependencies } from "@tandem/common/dependencies";
import { KeyBindingManager } from "@tandem/editor/key-bindings";
import { FrontEndApplication } from "@tandem/editor/application";
import { ReactComponentFactoryDependency } from "@tandem/editor/dependencies";

export default class StageComponent extends React.Component<{ app: FrontEndApplication, editor: any }, any> {

  private _keyBindings: KeyBindingManager;

  render() {

    if (!this.props.app.editor) return null;
    // <HeaderComponent {...this.props} />

    return (<div ref="container" className="m-editor-stage">
      <CanvasComponent {...this.props} zoom={this.props.editor.transform.scale} dependencies={this.props.app.dependencies} />
      <FooterComponent {...this.props} />
    </div>);
  }
}

