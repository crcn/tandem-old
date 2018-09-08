import * as React from "react";
import { memoize } from "tandem-common";
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
import { OpenModule } from "./open-module.pc";
import { LayersPaneContext, LayersPaneContextProps } from "./contexts";

export type Props = {
  graph: DependencyGraph;
  hoveringInspectorNodeIds: string[];
  selectedInspectorNodeIds: string[];
  sourceNodeInspector: InspectorNode;
  documents: SyntheticDocument[];
  dispatch: Dispatch<any>;
};

const generateLayersPaneContext = memoize(
  (
    graph: DependencyGraph,
    document: SyntheticDocument,
    documents: SyntheticDocument[],
    selectedInspectorNodeIds: string[],
    hoveringInspectorNodeIds: string[],
    rootInspectorNode: InspectorNode,
    dispatch: Dispatch
  ): LayersPaneContextProps => ({
    graph,
    document,
    documents,
    rootInspectorNode,
    selectedInspectorNodeIds,
    hoveringInspectorNodeIds,
    dispatch
  })
);

export default (Base: React.ComponentClass<BaseLayersPaneProps>) =>
  class LayersPaneController extends React.PureComponent<Props> {
    render() {
      const {
        sourceNodeInspector,
        graph,
        documents,
        dispatch,
        selectedInspectorNodeIds,
        hoveringInspectorNodeIds,
        ...rest
      } = this.props;

      const content = sourceNodeInspector.children.map((inspectorNode, i) => {
        const sourceNode = getPCNode(inspectorNode.assocSourceNodeId, graph);
        const dependency = getPCNodeDependency(sourceNode.id, graph);
        const document = getSyntheticDocumentByDependencyUri(
          dependency.uri,
          documents,
          graph
        );
        return (
          <LayersPaneContext.Provider
            key={sourceNode.id}
            value={generateLayersPaneContext(
              graph,
              document,
              documents,
              selectedInspectorNodeIds,
              hoveringInspectorNodeIds,
              sourceNodeInspector,
              dispatch
            )}
          >
            <OpenModule inspectorNode={inspectorNode} graph={graph} />
          </LayersPaneContext.Provider>
        );
      });
      return <Base {...rest} contentProps={{ children: content }} />;
    }
  };
