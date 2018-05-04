import * as React from "react";
import { GutterComponent } from "../../../gutter";
import { FileNavigatorPaneComponent } from "./file-navigator";
import { OpenFilesPaneComponent } from "./open-files";

const BaseLeftGutterComponent = () => <GutterComponent>
    <OpenFilesPaneComponent />
    <FileNavigatorPaneComponent />
</GutterComponent>;

export const LeftGutterComponent = BaseLeftGutterComponent;