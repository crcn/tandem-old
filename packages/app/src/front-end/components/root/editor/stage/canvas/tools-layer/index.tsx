/**
 * tools overlay like measurements, resizers, etc
 */

import "./index.scss";
import * as React from "react";
import { Dispatch } from "redux";
import { SyntheticWindow } from "paperclip";
import { RootState, getActiveWindow } from "front-end/state";
import { SelectableToolsComponent } from "./selectables";
import { NodeOverlaysTool } from "./document-overlay";
import { SelectionStageTool } from "./selection";

export type ToolsLayerComponent = {
  root: RootState;
  zoom: number;
  dispatch: Dispatch<any>
};

const BaseToolsLayerComponent = ({ root, zoom, dispatch }: ToolsLayerComponent) => {
  const activeWindow = getActiveWindow(root);
  return <div className="m-tools-layer">
    <NodeOverlaysTool root={root} zoom={zoom} dispatch={dispatch} />
    { activeWindow && <SelectableToolsComponent documents={activeWindow.documents} /> }
    <SelectionStageTool root={root} dispatch={dispatch} zoom={zoom} />
  </div>;
};

export const ToolsLayerComponent = BaseToolsLayerComponent;