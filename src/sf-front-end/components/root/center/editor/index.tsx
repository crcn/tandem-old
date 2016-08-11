import "./index.scss";

import * as React from "react";
import HeaderComponent from "./header";
import FooterComponent from "./footer";
import CanvasComponent from "./canvas";
import { ReactComponentFactoryDependency } from "sf-front-end/dependencies";
import { Dependencies } from "sf-core/dependencies";
import { KeyBindingManager } from "sf-front-end/key-bindings";
import { FrontEndApplication } from "sf-front-end/application";
import { Editor } from "sf-front-end/models";

export default class StageComponent extends React.Component<{ app: FrontEndApplication, editor: Editor }, any> {

  private _keyBindings: KeyBindingManager;

  render() {

    const editor = this.props.app.editor;
    const zoom   = this.props.app.editor.zoom;

    // entity might not have been loaded yet
    if (!editor.file) return null;
    return (<div ref="container" className="m-editor-stage noselect">
      <HeaderComponent {...this.props} editor={editor} />
      <CanvasComponent {...this.props} editor={editor} zoom={zoom} dependencies={this.props.app.dependencies} />
      <FooterComponent {...this.props} editor={editor} />
    </div>);
  }
}


export const dependency = new ReactComponentFactoryDependency("components/editors/sfn", StageComponent);
