/**
 * tools overlay like measurements, resizers, etc
 */

import "./index.scss";
import * as React from "react";
import { SyntheticWindow } from "paperclip";
import { RootState, getActiveWindow } from "front-end/state";
import { SelectableToolsComponent } from "./selectables";

export type ToolsLayerComponent = {
  window: SyntheticWindow;
};

const BaseToolsLayerComponent = ({ window }: ToolsLayerComponent) => {
  return <div className="m-tools-layer">
    { window && <SelectableToolsComponent documents={window.documents} /> }
  </div>;
};

export const ToolsLayerComponent = BaseToolsLayerComponent;