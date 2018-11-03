import * as React from "react";
import { memoize } from "tandem-common";
import {
  getSyntheticDocumentByDependencyUri,
  DependencyGraph,
  getPCNodeDependency,
  getPCNode,
  SyntheticDocument
} from "paperclip";
import { InspectorNode } from "paperclip";
import { Dispatch } from "redux";
import { BaseLayersPaneProps } from "./view.pc";
import { OpenModule } from "./open-module.pc";
import { LayersPaneContext, LayersPaneContextProps } from "./contexts";

export type Props = {
  graph: DependencyGraph;
  hoveringInspectorNodeIds: string[];
  selectedInspectorNodeIds: string[];
  sourceNodeInspector: InspectorNode;
  renameInspectorNodeId: string;
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
    renameInspectorNodeId: string,
    rootInspectorNode: InspectorNode,
    dispatch: Dispatch
  ): LayersPaneContextProps => ({
    graph,
    document,
    documents,
    rootInspectorNode,
    renameInspectorNodeId,
    selectedInspectorNodeIds,
    hoveringInspectorNodeIds,
    dispatch
  })
);

const CONTENT_STYLE = {
  display: "inline-block",
  overflow: "scroll",
  minWidth: "100%"
};

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
        renameInspectorNodeId,
        ...rest
      } = this.props;

      const content = (
        <div style={CONTENT_STYLE}>
          {sourceNodeInspector.children.map((inspectorNode, i) => {
            const sourceNode = getPCNode(
              inspectorNode.assocSourceNodeId,
              graph
            );

            if (!sourceNode) {
              return null;
            }
            const dependency = getPCNodeDependency(sourceNode.id, graph);
            const document = getSyntheticDocumentByDependencyUri(
              dependency.uri,
              documents,
              graph
            );
            return (
              <LayersPaneContext.Provider
                key={inspectorNode.id}
                value={generateLayersPaneContext(
                  graph,
                  document,
                  documents,
                  selectedInspectorNodeIds,
                  hoveringInspectorNodeIds,
                  renameInspectorNodeId,
                  sourceNodeInspector,
                  dispatch
                )}
              >
                <OpenModule inspectorNode={inspectorNode} />
              </LayersPaneContext.Provider>
            );
          })}
        </div>
      );

      return <Base {...rest} contentProps={{ children: content }} />;
    }
  };
