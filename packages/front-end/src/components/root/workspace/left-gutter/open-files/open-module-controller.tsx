import * as React from "react";
import { compose, pure } from "recompose";
import { SyntheticDocument, DependencyGraph } from "paperclip";
import { Dispatch } from "redux";
import { InspectorNode } from "../../../../../state/pc-inspector-tree";
const { NodeLayer } = require("./layer.pc");

export type OpenModuleControllerOuterProps = {
  inspectorNode: InspectorNode;
  document: SyntheticDocument;
  graph: DependencyGraph;
  dispatch: Dispatch<any>;
  selectedPaths: string[];
};

export default compose<
  OpenModuleControllerOuterProps,
  OpenModuleControllerOuterProps
>(
  pure,
  Base => ({
    inspectorNode,
    document,
    graph,
    dispatch,
    selectedPaths,
    ...rest
  }: OpenModuleControllerOuterProps) => {
    return (
      <Base {...rest}>
        <NodeLayer
          depth={2}
          selectedPaths={selectedPaths}
          graph={graph}
          dispatch={dispatch}
          document={document}
          inspectorNode={inspectorNode}
        />
      </Base>
    );
  }
);
