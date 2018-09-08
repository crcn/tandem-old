import * as React from "react";
import { BaseInstancePaneProps } from "./view.pc";
import { Dispatch } from "redux";
import {
  SyntheticDocument,
  SyntheticNode,
  DependencyGraph,
  PCVariant,
  getSyntheticSourceNode,
  PCSourceTagNames
} from "paperclip";

export type Props = {
  syntheticDocument: SyntheticDocument;
  selectedNodes: SyntheticNode[];
  dispatch: Dispatch<any>;
  graph: DependencyGraph;
  selectedVariant: PCVariant;
};

export default (Base: React.ComponentClass<BaseInstancePaneProps>) =>
  class InstancePaneController extends React.PureComponent<Props> {
    render() {
      const {
        syntheticDocument,
        selectedNodes,
        dispatch,
        graph,
        selectedVariant,
        ...rest
      } = this.props;
      const selectedNode = selectedNodes[0];
      const sourceNode = getSyntheticSourceNode(selectedNode, graph);
      if (sourceNode.name !== PCSourceTagNames.COMPONENT_INSTANCE) {
        return null;
      }

      return (
        <Base
          {...rest}
          variantInputProps={{
            syntheticDocument,
            selectedNodes,
            dispatch,
            graph,
            selectedVariant
          }}
        />
      );
    }
  };
