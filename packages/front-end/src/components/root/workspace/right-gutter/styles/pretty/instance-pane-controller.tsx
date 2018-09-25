import * as React from "react";
import { BaseInstancePaneProps } from "./index.pc";
import { Dispatch } from "redux";
import {
  SyntheticDocument,
  SyntheticNode,
  DependencyGraph,
  PCVariant,
  InspectorNode,
  getSyntheticSourceNode,
  PCSourceTagNames,
  extendsComponent,
  getInspectorSourceNode
} from "paperclip";

export type Props = {
  selectedInspectorNodes: InspectorNode[];
  rootInspectorNode: InspectorNode;
  syntheticDocument: SyntheticDocument;
  dispatch: Dispatch<any>;
  graph: DependencyGraph;
  selectedVariant: PCVariant;
};

export default (Base: React.ComponentClass<BaseInstancePaneProps>) =>
  class InstancePaneController extends React.PureComponent<Props> {
    render() {
      const {
        syntheticDocument,
        selectedInspectorNodes,
        rootInspectorNode,
        selectedVariant,
        dispatch,
        graph,
        ...rest
      } = this.props;
      const selectedInspectorNode = selectedInspectorNodes[0];
      if (!selectedInspectorNode) {
        return null;
      }
      const sourceNode = getInspectorSourceNode(
        selectedInspectorNode,
        rootInspectorNode,
        graph
      );
      if (
        sourceNode.name !== PCSourceTagNames.COMPONENT_INSTANCE &&
        (sourceNode.name !== PCSourceTagNames.COMPONENT ||
          !extendsComponent(sourceNode))
      ) {
        return null;
      }

      return (
        <Base
          {...rest}
          variantInputProps={{
            selectedVariant,
            selectedInspectorNode,
            rootInspectorNode,
            dispatch,
            graph
          }}
        />
      );
    }
  };
