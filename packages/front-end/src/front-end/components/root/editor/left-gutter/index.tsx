import * as React from "react";
import { Dispatch } from "redux";
import { OpenFile } from "../../../../state";
import { Directory } from "../../../../../common";
import { GutterComponent } from "../../../gutter";
import { OpenFilesPaneComponent } from "./open-files";
import { FileNavigatorPaneComponent } from "./file-navigator";

type LeftGutterProps = {
    dispatch: Dispatch<any>;
    rootDirectory: Directory;
    openFiles: OpenFile[];
}

const BaseLeftGutterComponent = ({ dispatch, rootDirectory, openFiles }: LeftGutterProps) => <GutterComponent>
    <OpenFilesPaneComponent openFiles={openFiles} dispatch={dispatch} />
    <FileNavigatorPaneComponent dispatch={dispatch} rootDirectory={rootDirectory} />
</GutterComponent>;

export const LeftGutterComponent = BaseLeftGutterComponent;