import * as React from "react";
import { GutterComponent } from "../../../gutter";
import { AttributesPaneComponent } from "./attributes";
import { StylesPaneComponent } from "./styles";
import { compose, pure } from "recompose";
import { RootState } from "../../../../state";
import { Dispatch } from "redux";
// import { BehaviorPaneComponent } from "./behavior";
// import { VariantsComponent } from "./variants";

type RightGutterProps = {
  root: RootState;
  dispatch: Dispatch<any>;
};

const BaseRightGutterComponent = ({ dispatch, root }: RightGutterProps) => {
  if (!root.selectedNodeIds.length) {
    return null;
  }
  return (
    <GutterComponent>
      {/* <VariantsComponent dispatch={dispatch} root={root} /> */}
      {/* <BehaviorPaneComponent dispatch={dispatch} root={root} /> */}
      <StylesPaneComponent dispatch={dispatch} root={root} />
    </GutterComponent>
  );
};

export const RightGutterComponent = compose<RightGutterProps, RightGutterProps>(
  pure
)(BaseRightGutterComponent);
