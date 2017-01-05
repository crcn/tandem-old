import "./index.scss";
import * as React from "react";
import { Workspace } from "@tandem/editor/browser";

class CursorComponent extends React.Component<{ workspace: Workspace }, any> {
  render() {
    const { workspace } = this.props;
    const style = {
      transformOrigin: "top left",
      left: 100,
      top: 100,
      transform: `scale(${1/workspace.transform.scale})`
    };

    const fillColor = "#F60";
    return <div className="cursor" style={style}>
      <svg version="1.2" x="0px" y="0px" viewBox="0 0 100 100">
        <polygon stroke="#F60" fill={fillColor} points="27.5,7.5 27.5,71.14 45.381,63.733 57.296,92.5 66.535,88.674 54.619,59.907 72.5,52.5"></polygon>
      </svg>
      <span className="label" style={{ background: fillColor }}>
        Tom Andersen
      </span>
    </div>;
  }
}

export class CursorsStageToolComponent extends React.Component<{ workspace: Workspace }, any> {
  render() {
    const { workspace } = this.props;
    return <div className="share-cursors hide">
      <CursorComponent workspace={workspace} />
    </div>
  }
}