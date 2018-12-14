import * as React from "react";
import * as cx from "classnames";
import { Dispatch } from "redux";
import { BaseBreadcrumbsProps, Breadcrumb } from "./view.pc";
import {
  InspectorNode,
  DependencyGraph,
  PCVisibleNode,
  getInspectorSourceNode
} from "paperclip";
import { getTreeNodeAncestors, EMPTY_ARRAY } from "tandem-common";

export type Props = {
  dispatch: Dispatch<any>;
  graph: DependencyGraph;
  rootInspectorNode: InspectorNode;
  selectedInspectorNode: InspectorNode;
} & BaseBreadcrumbsProps;

type BreadcrumbProps = {
  dispatch: Dispatch<any>;
  inspectorNode: InspectorNode;
  sourceNode: PCVisibleNode;
  selected: boolean;
};

class EnhancedBreadcrumb extends React.PureComponent<BreadcrumbProps> {
  onClick = () => {
    // TODO - select node
  };
  render() {
    const { onClick } = this;
    const { inspectorNode, selected, sourceNode } = this.props;
    return (
      <Breadcrumb
        onClick={onClick}
        variant={cx({
          component: false,
          slot: false,
          plug: false,
          text: false,
          selected,
          element: false,
          shadow: false
        })}
        labelProps={{ text: sourceNode.label }}
      />
    );
  }
}

export default (Base: React.ComponentClass<BaseBreadcrumbsProps>) =>
  class BreadcrumbsController extends React.PureComponent<Props> {
    render() {
      const {
        selectedInspectorNode,
        rootInspectorNode,
        dispatch,
        graph,
        ...rest
      } = this.props;

      const items = selectedInspectorNode
        ? (
            getTreeNodeAncestors(selectedInspectorNode.id, rootInspectorNode) ||
            EMPTY_ARRAY
          )
            .concat(selectedInspectorNode)
            .map(inspectorNode => {
              const sourceNode = getInspectorSourceNode(
                inspectorNode as InspectorNode,
                rootInspectorNode,
                graph
              );
              return (
                <EnhancedBreadcrumb
                  dispatch={dispatch}
                  key={inspectorNode.id}
                  selected={inspectorNode.id === selectedInspectorNode.id}
                  inspectorNode={inspectorNode as InspectorNode}
                  sourceNode={sourceNode as PCVisibleNode}
                />
              );
            })
        : EMPTY_ARRAY;

      return <Base {...rest} items={items} />;
    }
  };
