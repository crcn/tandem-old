import "./index.scss";
import * as React from "react";
import HeaderComponent from "./header";
import FooterComponent from "./footer";
import CanvasComponent from "./canvas";
import PreviewComponent from "./canvas/preview";
import { Workspace } from "@tandem/editor/browser/models";
import { Injector } from "@tandem/common";
import { SyntheticDOMElement } from "@tandem/synthetic-browser";
import { FrontEndApplication } from "@tandem/editor/browser/application";
import { ReactComponentFactoryProvider } from "@tandem/editor/browser/providers";

export default class StageComponent extends React.Component<{ workspace: Workspace }, any> {
  render() {
    return (<div ref="container" className="m-editor-stage">
      <CanvasComponent workspace={this.props.workspace} zoom={this.props.workspace.transform.scale} />
      <FooterComponent workspace={this.props.workspace} />
    </div>);
  }
}

