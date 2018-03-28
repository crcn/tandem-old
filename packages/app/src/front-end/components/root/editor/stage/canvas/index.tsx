import "./index.scss";
import * as React from "react";
import { Dispatch } from "redux";
import { compose, pure } from "recompose";
import { RootState, getActiveWindow } from "front-end/state";
import { SyntheticWindow, Dependency } from "paperclip";
import { PreviewLayerComponent } from "./preview-layer";
import { ToolsLayerComponent } from "./tools-layer";

export type CanvasOuterProps = {
  root: RootState;
  dependency: Dependency;
  dispatch: Dispatch<any>;
}

const BaseCanvasComponent = ({ root, dispatch, dependency }: CanvasOuterProps) => {
  const activeWindow = getActiveWindow(root);
  return <div className="m-canvas">
    <PreviewLayerComponent window={activeWindow} dependency={dependency} />
    <ToolsLayerComponent root={root} dispatch={dispatch} zoom={1} />
  </div>;
}

export const CanvasComponent = compose<CanvasOuterProps, CanvasOuterProps>(pure)(BaseCanvasComponent);