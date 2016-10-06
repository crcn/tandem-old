import * as React from "react";
import { FrontEndApplication } from "@tandem/editor";

export class TDProjectStageToolComponent extends React.Component<{ app: FrontEndApplication }, any> {
  render() {
    const { document } = this.props.app.editor.browser.window;
    const frames = document.querySelectorAll("frame");
    if (!frames) return null;
    return <div className="m-tdproject-stage-tool">
      {
        frames.map((frame) => {
          return;
        })
      }
    </div>;
  }
}