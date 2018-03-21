import "./index.scss";
import * as React from "react";
import { compose } from "recompose";
import { StageComponent } from "./stage";
import { LeftGutterComponent } from "./left-gutter";
import { RightGutterComponent } from "./right-gutter";

const EditorBaseComponent = () => <div className="m-editor">
  <LeftGutterComponent />
  <StageComponent />
  <RightGutterComponent />
</div>;

export const EditorComponent = EditorBaseComponent;