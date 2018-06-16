/**
 * tools overlay like measurements, resizers, etc
 */

import "./index.scss";
import * as React from "react";
import { Dispatch } from "redux";
import { pure, compose } from "recompose";
import {
  RootState,
  EditorWindow,
  getOpenFile
} from "../../../../../../../../state";
import { SelectableToolsComponent } from "./selectables";
import { NodeOverlaysTool } from "./document-overlay";
import { SelectionCanvasTool } from "./selection";
const { Frames } = require("./frames-view.pc");
import { InsertLayer } from "./insert-layer";

export type ToolsLayerComponent = {
  editorWindow: EditorWindow;
  root: RootState;
  zoom: number;
  dispatch: Dispatch<any>;
};

const BaseToolsLayerComponent = ({
  editorWindow,
  root,
  zoom,
  dispatch
}: ToolsLayerComponent) => {
  const canvas = getOpenFile(editorWindow.activeFilePath, root).canvas;
  return (
    <div className="m-tools-layer">
      <InsertLayer
        canvas={canvas}
        editorWindow={editorWindow}
        toolType={root.toolType}
        dispatch={dispatch}
      />
      <Frames
        root={root}
        canvas={canvas}
        translate={canvas.translate}
        dispatch={dispatch}
        editorWindow={editorWindow}
      />
      <NodeOverlaysTool
        root={root}
        zoom={zoom}
        dispatch={dispatch}
        editorWindow={editorWindow}
      />
      {/* {activeWindow && (
        <SelectableToolsComponent documents={activeWindow.documents} />
      )} */}
      <SelectionCanvasTool
        canvas={canvas}
        root={root}
        dispatch={dispatch}
        zoom={zoom}
        editorWindow={editorWindow}
      />
    </div>
  );
};

export const ToolsLayerComponent = compose<
  ToolsLayerComponent,
  ToolsLayerComponent
>(pure)(BaseToolsLayerComponent);
