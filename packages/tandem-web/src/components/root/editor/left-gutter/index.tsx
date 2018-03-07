import * as React from "react";
import { GutterComponent } from "components/gutter";
import { FileNavigatorComponent } from "./file-navigator";

const BaseLeftGutterComponent = () => <GutterComponent>
    <FileNavigatorComponent />
</GutterComponent>;

export const LeftGutterComponent = BaseLeftGutterComponent;