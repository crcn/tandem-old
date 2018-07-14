import * as React from "react";
import { Dispatch } from "redux";
import { Directory, memoize } from "tandem-common";
const { LayersPane } = require("./open-files/view.pc");
import { GutterComponent } from "../../../gutter";
import { OpenFilesPaneComponent } from "./open-files";
import { RootState, EditorWindow } from "../../../../state";
import { FileNavigatorPaneComponent } from "./file-navigator";
import {
  getSyntheticNodeById,
  SyntheticDocument
} from "../../../../../node_modules/paperclip";

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
    <LayersPane
      selectedNodes={getSelectedNodes(root.selectedNodeIds, root.documents)}
      inspectorNodes={root.moduleInspectors}
      dispatch={dispatch}
      graph={root.graph}
      documents={root.documents}
    />
    {/* <OpenFilesPaneComponent
      root={root}
      editorWindows={editorWindows}
      dispatch={dispatch}
    /> */}
    <FileNavigatorPaneComponent
      dispatch={dispatch}
      rootDirectory={rootDirectory}
      selectedFileNodeIds={root.selectedFileNodeIds}
      insertFileInfo={root.insertFileInfo}
    />
    {/* <ComponentsPaneComponent dispatch={dispatch} /> */}
  </GutterComponent>
);

const getSelectedNodes = memoize(
  (selectedNodeIds: string[], documents: SyntheticDocument[]) =>
    selectedNodeIds.map(id => getSyntheticNodeById(id, documents))
);

export const LeftGutterComponent = BaseLeftGutterComponent;
