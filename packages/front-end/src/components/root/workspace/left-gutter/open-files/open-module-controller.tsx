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
};

export default (Base: React.ComponentClass<BaseOpenModuleProps>) =>
  class OpenModuleController extends React.PureComponent<Props> {
    render() {
      const { graph, dispatch, inspectorNode, ...rest } = this.props;
      return (
        <Base {...rest}>
          <NodeLayer
            depth={2}
            graph={graph}
            dispatch={dispatch}
            document={document}
            inspectorNode={inspectorNode}
          />
        </Base>
      );
    }
  };
