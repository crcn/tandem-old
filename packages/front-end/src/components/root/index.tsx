import "./index.scss";
import * as React from "react";
import { Dispatch } from "redux";
const { Workspace } = require("./workspace/index.pc");
const { Welcome } = require("./welcome/view.pc");
import { RootState } from "../../state";
import { compose, pure } from "recompose";

export type RootOuterProps = {
  root: RootState;
  dispatch: Dispatch<any>;
};

const RootBaseComponent = ({ root, dispatch }: RootOuterProps) => {
  // TODO - add loading state here
  if (!root.ready) {
    return null;
  }

  if (!root.projectDirectory) {
    return <Welcome dispatch={dispatch} />;
  }

  return (
    <div className="m-root">
      <Workspace root={root} dispatch={dispatch} />
    </div>
  );
};

export const RootComponent = compose<RootOuterProps, RootOuterProps>(pure)(
  RootBaseComponent
);
