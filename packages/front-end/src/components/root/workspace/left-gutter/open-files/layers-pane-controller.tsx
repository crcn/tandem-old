import * as React from "react";
import { compose, pure } from "recompose";
import {
  getSyntheticDocumentByDependencyUri,
  DependencyGraph,
  getPCNodeDependency,
  getPCNode,
  SyntheticDocument,
  SyntheticNode,
  getSyntheticInstancePath
} from "paperclip";
import { InspectorNode } from "../../../../../state/pc-inspector-tree";
import { Dispatch } from "redux";
import { getNestedTreeNodeById } from "tandem-common";
const { OpenModule } = require("./open-module.pc");

export type LayersPaneControllerOuterProps = {
  graph: DependencyGraph;
  selectedNodes: SyntheticNode[];
  inspectorNodes: InspectorNode[];
  documents: SyntheticDocument[];
  dispatch: Dispatch<any>;
};

export default compose<
  LayersPaneControllerOuterProps,
  LayersPaneControllerOuterProps
>(
  pure,
  Base => ({
    inspectorNodes,
    graph,
    documents,
    dispatch,
    selectedNodes,
    ...rest
  }: LayersPaneControllerOuterProps) => {
    const content = inspectorNodes.map(inspectorNode => {
      const sourceNode = getPCNode(inspectorNode.sourceNodeId, graph);
      const dependency = getPCNodeDependency(sourceNode.id, graph);
      const document = getSyntheticDocumentByDependencyUri(
        dependency.uri,
        documents,
        graph
      );
      const selectedPaths = selectedNodes
        .filter(node => getNestedTreeNodeById(node.id, document))
        .map(node => getSyntheticInstancePath(node, document));
      return (
        <OpenModule
          selectedPaths={selectedPaths}
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
