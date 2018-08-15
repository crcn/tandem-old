import * as React from "react";
import { Dispatch } from "redux";
import { Directory, memoize } from "tandem-common";
const { LayersPane } = require("./open-files/view.pc");
import { GutterComponent } from "../../../gutter";
import { RootState, EditorWindow } from "../../../../state";
import { FileNavigatorPaneComponent } from "./file-navigator";
import {
  getSyntheticNodeById,
  SyntheticDocument,
  getSyntheticVisibleNodeDocument,
  DependencyGraph
} from "../../../../../node_modules/paperclip";
import {
  InspectorNode,
  getSyntheticInspectorNode
} from "state/pc-inspector-tree";

type LeftGutterProps = {
  editorWindows: EditorWindow[];
  dispatch: Dispatch<any>;
  rootDirectory: Directory;
  root: RootState;
};

const BaseLeftGutterComponent = ({
  dispatch,
  rootDirectory,
  root,
  editorWindows
}: LeftGutterProps) => (
  <GutterComponent>
    <LayersPane
      selectedInspectorNodeIds={root.selectedInspectorNodeIds}
      hoveringInspectorNodeIds={root.hoveringInspectorNodeIds}
      sourceNodeInspector={root.sourceNodeInspector}
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

const split = memoize((str: string, separator: string) => {
  return str.split(separator);
}, 100);

export const LeftGutterComponent = BaseLeftGutterComponent;
