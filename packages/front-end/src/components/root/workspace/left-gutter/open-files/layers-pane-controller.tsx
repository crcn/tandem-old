import * as React from "react";
import { compose, pure } from "recompose";
import {
  getSyntheticDocumentByDependencyUri,
  DependencyGraph,
  getPCNodeDependency,
  getPCNode,
  SyntheticDocument
} from "paperclip";
import { InspectorNode } from "../../../../../state/pc-inspector-tree";
import { Dispatch } from "redux";
const { OpenModule } = require("./open-module.pc");

export type LayersPaneControllerOuterProps = {
  graph: DependencyGraph;
  hoveringInspectorNodeIds: string[];
  selectedInspectorNodeIds: string[];
  sourceNodeInspector: InspectorNode;
  documents: SyntheticDocument[];
  dispatch: Dispatch<any>;
};

export default compose<
  LayersPaneControllerOuterProps,
  LayersPaneControllerOuterProps
>(
  pure,
  Base => ({
    sourceNodeInspector,
    graph,
    documents,
    dispatch,
    selectedInspectorNodeIds,
    hoveringInspectorNodeIds,
    ...rest
  }: LayersPaneControllerOuterProps) => {
    const content = sourceNodeInspector.children.map(inspectorNode => {
      const sourceNode = getPCNode(inspectorNode.sourceNodeId, graph);
      const dependency = getPCNodeDependency(sourceNode.id, graph);
      const document = getSyntheticDocumentByDependencyUri(
        dependency.uri,
        documents,
        graph
      );
      return (
        <OpenModule
          selectedInspectorNodeIds={selectedInspectorNodeIds}
          hoveringInspectorNodeIds={hoveringInspectorNodeIds}
          inspectorNode={inspectorNode}
          dependency={dependency}
          dispatch={dispatch}
          key={inspectorNode.sourceNodeId}
          document={document}
          graph={graph}
        />
      );
    });
    return <Base {...rest} contentProps={{ children: content }} />;
  }
);
