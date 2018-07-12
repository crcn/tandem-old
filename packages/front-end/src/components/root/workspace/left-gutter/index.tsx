import * as React from "react";
import { Dispatch } from "redux";
import { Directory } from "tandem-common";
import { GutterComponent } from "../../../gutter";
import { OpenFile, RootState, EditorWindow } from "../../../../state";
import { OpenFilesPaneComponent } from "./open-files";
const { LayersPane } = require("./open-files/view.pc");
import { FileNavigatorPaneComponent } from "./file-navigator";
import { ComponentsPaneComponent } from "./components";

type LeftGutterProps = {
  editorWindows: EditorWindow[];
  dispatch: Dispatch<any>;
  rootDirectory: Directory;
  root: RootState;
};

const BaseLeftGutterComponent = ({
  editorWindows,
  dispatch,
  rootDirectory,
  root
}: LeftGutterProps) => (
  <GutterComponent>
    <LayersPane root={root} />
    <OpenFilesPaneComponent
      root={root}
      editorWindows={editorWindows}
      dispatch={dispatch}
    />
    <FileNavigatorPaneComponent
      dispatch={dispatch}
      rootDirectory={rootDirectory}
      selectedFileNodeIds={root.selectedFileNodeIds}
      insertFileInfo={root.insertFileInfo}
    />
    {/* <ComponentsPaneComponent dispatch={dispatch} /> */}
  </GutterComponent>
);

export const LeftGutterComponent = BaseLeftGutterComponent;
