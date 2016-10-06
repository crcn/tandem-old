import "./index.scss";

import * as React from "react";
import { SyntheticTDFrame } from "@tandem/tdproject-extension/synthetic";
import { FrontEndApplication } from "@tandem/editor";

export class TDFrameComponent extends React.Component<{ frame: SyntheticTDFrame }, any> {
  render() {
    const style = {

    };

    return <div className="m-tdframe-tool--item" style={style}>
    </div>;
  }
}

export class TDFrameStageToolComponent extends React.Component<{ app: FrontEndApplication }, any> {
  render() {
    const { document } = this.props.app.editor.browser.window;
    const frames = document.querySelectorAll("frame") as SyntheticTDFrame[];
    if (!frames || true) return null;

    // const backgroundStyle = {
    //   // transform:
    // }

    // return <div className="m-tdframe-stage-tool">
    //   <div style={backgroundStyle} className="m-tdframe-stage-tool--background" />
    //   {
    //     frames.map((frame) => {
    //       return <TDFrameComponent key={frame.uid} frame={frame} />;
    //     })
    //   }
    // </div>;
  }
}