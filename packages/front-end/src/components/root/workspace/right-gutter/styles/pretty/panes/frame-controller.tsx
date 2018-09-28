import * as React from "react";
import { BaseFramePaneProps } from "./frame.pc";
import { PCVisibleNode, DependencyGraph, isPCContentNode } from "paperclip";

export type Props = {
  selectedNode: PCVisibleNode;
  graph: DependencyGraph;
}

export default (Base: React.ComponentClass<BaseFramePaneProps>) => class FramePaneController extends React.PureComponent<Props> {
  render() {
    const {selectedNode, graph,...rest} = this.props;
    if (!isPCContentNode(selectedNode, graph)) {
      return null;
    }
    return <Base {...rest} />;
  }
}