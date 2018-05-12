import * as React from "react";
import { Dispatch } from "redux";
import { Directory } from "../../../../../common";
import { GutterComponent } from "../../../gutter";
import { OpenFile, RootState } from "../../../../state";
import { OpenFilesPaneComponent } from "./open-files";
import { FileNavigatorPaneComponent } from "./file-navigator";

type LeftGutterProps = {
    activeFileUri: string;
    dispatch: Dispatch<any>;
    rootDirectory: Directory;
    root: RootState;
}

const BaseLeftGutterComponent = ({ activeFileUri, dispatch, rootDirectory, root }: LeftGutterProps) => <GutterComponent>
    <OpenFilesPaneComponent root={root} activeFileUri={activeFileUri} dispatch={dispatch} />
    <FileNavigatorPaneComponent dispatch={dispatch} rootDirectory={rootDirectory} selectedFileNodeIds={root.selectedFileNodeIds} insertFileInfo={root.insertFileInfo} />
</GutterComponent>;

export const LeftGutterComponent = BaseLeftGutterComponent;