import * as React from "react";
import { EditorComponent } from "./editor";
import { RootState } from "front-end/state";
import { compose, pure } from "recompose";

export type RootOuterProps = {
  root: RootState;
}

const RootBaseComponent = ({ root }: RootOuterProps) => {
  return <div className="m-root">
    <EditorComponent root={root} />
  </div>;
};

export const RootComponent = compose<RootOuterProps, RootOuterProps>(pure)(EditorComponent);