import "./index.scss";
import * as React from "react";
import { compose, pure } from "recompose";
import { StageComponent } from "./stage";
import { LeftGutterComponent } from "./left-gutter";
import { RightGutterComponent } from "./right-gutter";
import { RootState, getActiveWindow } from "front-end/state";

export type EditorOuterProps = {
  root: RootState;
};

const EditorBaseComponent = ({ root }: EditorOuterProps) => <div className="m-editor">
  <LeftGutterComponent />
  <StageComponent window={getActiveWindow(root)} />
  <RightGutterComponent />
</div>;

export const EditorComponent = compose<EditorOuterProps, EditorOuterProps>(pure)(EditorBaseComponent);