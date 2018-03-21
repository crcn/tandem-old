import "./index.scss";
import * as React from "react";
import { PreviewLayerComponent } from "./preview-layer";
import { ToolsLayerComponent } from "./tools-layer";

const BaseCanvasComponent = () => <div className="m-canvas">
  <PreviewLayerComponent />
  <ToolsLayerComponent />
</div>;

export const CanvasComponent = BaseCanvasComponent;