import "./index.scss";
import React =  require("react");
import HeaderComponent from "./header";
import FooterComponent from "./footer";
import CanvasComponent from "./canvas";
import PreviewComponent from "./canvas/preview";
import { Workspace } from "@tandem/editor/browser/stores";
import { Injector } from "@tandem/common";
import { SyntheticDOMElement } from "@tandem/synthetic-browser";
import { ReactComponentFactoryProvider } from "@tandem/editor/browser/providers";

export default class StageComponent extends React.Component<{ workspace: Workspace }, any> {
  render() {
    const { workspace } = this.props;
    return (<div ref="container" className="m-editor-stage">
      { workspace && <CanvasComponent workspace={workspace} zoom={workspace.transform.scale} /> }
      { workspace && <FooterComponent workspace={workspace} />  }
    </div>);
  }
}

