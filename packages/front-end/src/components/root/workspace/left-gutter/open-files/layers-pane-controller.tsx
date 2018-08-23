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
import { BaseLayersPaneProps } from "./view.pc";
const { OpenModule } = require("./open-module.pc");

export type Props = {
  graph: DependencyGraph;
  hoveringInspectorNodeIds: string[];
  selectedInspectorNodeIds: string[];
  sourceNodeInspector: InspectorNode;
  documents: SyntheticDocument[];
  dispatch: Dispatch<any>;
};

export default compose<BaseLayersPaneProps, Props>(
  pure,
  (Base: React.ComponentClass<BaseLayersPaneProps>) => ({
    sourceNodeInspector,
    graph,
    documents,
    dispatch,
    selectedInspectorNodeIds,
    hoveringInspectorNodeIds,
    ...rest
  }: Props) => {
    const content = sourceNodeInspector.children.map(inspectorNode => {
      const sourceNode = getPCNode(inspectorNode.assocSourceNodeId, graph);
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
          key={inspectorNode.assocSourceNodeId}
          document={document}
          graph={graph}
        />
      );
    });
    return <Base {...rest} contentProps={{ children: content }} />;
  }
);
