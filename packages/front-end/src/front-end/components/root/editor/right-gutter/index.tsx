import * as React from "react";
import { GutterComponent } from "../../../gutter";
import { AttributesPaneComponent } from "./attributes";
import { StylesPaneComponent } from "./styles";

const BaseRightGutterComponent = () => <GutterComponent>
    <AttributesPaneComponent />
    <StylesPaneComponent />
</GutterComponent>;

export const RightGutterComponent = BaseRightGutterComponent;