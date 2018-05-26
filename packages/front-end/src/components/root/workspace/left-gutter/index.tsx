import * as React from "react";
import { Dispatch } from "redux";
import { Directory } from "tandem-common";
import { GutterComponent } from "../../../gutter";
import { OpenFile, RootState, Editor } from "../../../../state";
import { OpenFilesPaneComponent } from "./open-files";
import { FileNavigatorPaneComponent } from "./file-navigator";
import { ComponentsPaneComponent } from "./components";

type LeftGutterProps = {
  editors: Editor[];
  dispatch: Dispatch<any>;
  rootDirectory: Directory;
  root: RootState;
};

const BaseLeftGutterComponent = ({
  editors,
  dispatch,
  rootDirectory,
  root
}: LeftGutterProps) => (
  <GutterComponent>
    <OpenFilesPaneComponent root={root} editors={editors} dispatch={dispatch} />
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
