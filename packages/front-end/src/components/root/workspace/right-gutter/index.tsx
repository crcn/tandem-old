import * as React from "react";
import { GutterComponent } from "../../../gutter";
import { StylesPaneComponent } from "./styles";
import { compose, pure, withHandlers } from "recompose";
import { RootState } from "../../../../state";
import { Dispatch } from "redux";
import { PrettyAttributesComponent } from "./attributes/pretty";
import { getSyntheticNodeById, SyntheticDocument } from "paperclip";
const { RightGutter } = require("./index.pc");
import { memoize } from "tandem-common";
// import { BehaviorPaneComponent } from "./behavior";
// import { VariantsComponent } from "./variants";

type RightGutterProps = {
  root: RootState;
  dispatch: Dispatch<any>;
};

const getSelectedNoded = memoize(
  (nodeIds: string[], documents: SyntheticDocument[]) => {
    return nodeIds.map(id => getSyntheticNodeById(id, documents));
  }
);

const BaseRightGutterComponent = ({ dispatch, root }: RightGutterProps) => {
  if (!root.selectedNodeIds.length) {
    return null;
  }
  const selectedNodes = getSelectedNoded(root.selectedNodeIds, root.documents);

  return (
    <div>
      {/* <StylesPaneComponent dispatch={dispatch} root={root} /> */}
      <RightGutter selectedNodes={selectedNodes} dispatch={dispatch} />
    </div>
  );
  // return (
  //   <GutterComponent>
  //     {/* <VariantsComponent dispatch={dispatch} root={root} /> */}
  //     {/* <BehaviorPaneComponent dispatch={dispatch} root={root} /> */}
  //     <PrettyAttributesComponent
  //       selectedNodes={selectedNodes}
  //       dispatch={dispatch}
  //     />
  //     <StylesPaneComponent dispatch={dispatch} root={root} />
  //   </GutterComponent>
  // );
};

export const RightGutterComponent = compose<RightGutterProps, RightGutterProps>(
  pure
)(BaseRightGutterComponent);
