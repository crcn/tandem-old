import "./index.scss";
import * as React from "react";
import { Dispatch } from "redux";
const { Workspace } = require("./workspace/index.pc");
import { RootState } from "../../state";
import { compose, pure } from "recompose";

export type RootOuterProps = {
  root: RootState;
  dispatch: Dispatch<any>;
};

const RootBaseComponent = ({ root, dispatch }: RootOuterProps) => {
  return (
    <div className="m-root">
      <Workspace root={root} dispatch={dispatch} />
    </div>
  );
};

export const RootComponent = compose<RootOuterProps, RootOuterProps>(pure)(
  RootBaseComponent
);
