import * as React from "react";
import { GutterComponent } from "../../../gutter";
import { FileNavigatorPaneComponent } from "./file-navigator";
import { OpenFilesPaneComponent } from "./open-files";
import { Directory } from "../../../../../common";
import { Dispatch } from "redux";

type LeftGutterProps = {
    dispatch: Dispatch<any>;
    rootDirectory: Directory;
}

const BaseLeftGutterComponent = ({ dispatch, rootDirectory }: LeftGutterProps) => <GutterComponent>
    <OpenFilesPaneComponent />
    <FileNavigatorPaneComponent dispatch={dispatch} rootDirectory={rootDirectory} />
</GutterComponent>;

export const LeftGutterComponent = BaseLeftGutterComponent;