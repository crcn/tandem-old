import * as React from "react";
import { GutterComponent } from "../../../gutter";
import { StylesPaneComponent } from "./styles";
import { compose, pure } from "recompose";
import { RootState } from "../../../../state";
import { Dispatch } from "redux";
import { PrettyAttributesComponent } from "./attributes/pretty";
import { getSyntheticNodeById } from "paperclip";
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
  const selectedNodes = root.selectedNodeIds.map(id =>
    getSyntheticNodeById(id, root.syntheticFrames)
  );
  return (
    <GutterComponent>
      {/* <VariantsComponent dispatch={dispatch} root={root} /> */}
      {/* <BehaviorPaneComponent dispatch={dispatch} root={root} /> */}
      <PrettyAttributesComponent
        selectedNodes={selectedNodes}
        dispatch={dispatch}
      />
      <StylesPaneComponent dispatch={dispatch} root={root} />
    </GutterComponent>
  );
};

export const RightGutterComponent = compose<RightGutterProps, RightGutterProps>(
  pure
)(BaseRightGutterComponent);
