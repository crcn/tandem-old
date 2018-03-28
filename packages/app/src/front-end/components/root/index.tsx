import * as React from "react";
import { Dispatch } from "redux";
import { EditorComponent } from "./editor";
import { RootState } from "front-end/state";
import { compose, pure } from "recompose";

export type RootOuterProps = {
  root: RootState;
  dispatch: Dispatch<any>;
}

const RootBaseComponent = ({ root, dispatch }: RootOuterProps) => {
  return <div className="m-root">
    <EditorComponent root={root} dispatch={dispatch} />
  </div>;
};

export const RootComponent = compose<RootOuterProps, RootOuterProps>(pure)(EditorComponent);