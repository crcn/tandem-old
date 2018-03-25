import "./index.scss";
import * as React from "react";
import { compose, pure } from "recompose";
import { SyntheticWindow } from "paperclip";
import { PreviewLayerComponent } from "./preview-layer";
import { ToolsLayerComponent } from "./tools-layer";

export type CanvasOuterProps = {
  window: SyntheticWindow;
}

const BaseCanvasComponent = ({ window }: CanvasOuterProps) => <div className="m-canvas">
  <PreviewLayerComponent window={window} />
  <ToolsLayerComponent />
</div>;

export const CanvasComponent = compose<CanvasOuterProps, CanvasOuterProps>(pure)(BaseCanvasComponent);