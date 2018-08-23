import * as React from "react";
import { compose, pure } from "recompose";
import { SyntheticDocument, DependencyGraph } from "paperclip";
import { Dispatch } from "redux";
import { InspectorNode } from "../../../../../state/pc-inspector-tree";
import { BaseOpenModuleProps } from "./open-module.pc";
import { NodeLayer } from "./layer.pc";

export type Props = {
  inspectorNode: InspectorNode;
  document: SyntheticDocument;
  graph: DependencyGraph;
  dispatch: Dispatch<any>;
  selectedInspectorNodeIds: string[];
  hoveringInspectorNodeIds: string[];
};

export default compose<BaseOpenModuleProps, Props>(
  pure,
  (Base: React.ComponentClass<BaseOpenModuleProps>) => ({
    inspectorNode,
    document,
    graph,
    dispatch,
    selectedInspectorNodeIds,
    hoveringInspectorNodeIds,
    ...rest
  }: Props) => {
    return (
      <Base {...rest}>
        <NodeLayer
          depth={2}
          hoveringInspectorNodeIds={hoveringInspectorNodeIds}
          selectedInspectorNodeIds={selectedInspectorNodeIds}
          graph={graph}
          dispatch={dispatch}
          document={document}
          inspectorNode={inspectorNode}
        />
      </Base>
    );
  }
);
