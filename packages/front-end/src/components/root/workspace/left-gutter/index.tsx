import * as React from "react";
import { Dispatch } from "redux";
import { Directory, memoize } from "tandem-common";
import { LayersPane } from "./open-files/view.pc";
import { GutterComponent } from "../../../gutter";
import { RootState, EditorWindow } from "../../../../state";
import { FileNavigatorPaneComponent } from "./file-navigator";

type LeftGutterProps = {
  editorWindows: EditorWindow[];
  dispatch: Dispatch<any>;
  rootDirectory: Directory;
  root: RootState;
};

const BaseLeftGutterComponent = ({
  dispatch,
  rootDirectory,
  root
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
    <FileNavigatorPaneComponent
      dispatch={dispatch}
      rootDirectory={rootDirectory}
      selectedFileNodeIds={root.selectedFileNodeIds}
      insertFileInfo={root.insertFileInfo}
    />
  </GutterComponent>
);

const split = memoize((str: string, separator: string) => {
  return str.split(separator);
}, 100);

export const LeftGutterComponent = BaseLeftGutterComponent;
