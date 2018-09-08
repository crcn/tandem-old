import * as React from "react";
import * as cx from "classnames";
import { compose, pure } from "recompose";
import {
  PCSourceTagNames,
  getPCNode,
  DependencyGraph,
  SyntheticElement
} from "paperclip";
import { BasePropertiesProps } from "./view.pc";
import { InspectorNode } from "../../../../../state/pc-inspector-tree";
import { Dispatch } from "redux";

export type PropertiesControllerOuterProps = {};

export type Props = {
  visible: boolean;
  selectedNodes: SyntheticElement[];
  selectedInspectorNodes: InspectorNode[];
  graph: DependencyGraph;
  className?: string;
  dispatch: Dispatch<any>;
  sourceNodeUri: string;
} & BasePropertiesProps;

type InnerProps = Props;

export default compose<InnerProps, Props>(
  pure,
  (Base: React.ComponentClass<BasePropertiesProps>) => ({
    visible,
    className,
    selectedInspectorNodes,
    selectedNodes,
    graph,
    dispatch,
    sourceNodeUri,
    ...rest
  }: InnerProps) => {
    if (!selectedInspectorNodes.length || !visible) {
      return null;
    }

    const selectedNode = selectedInspectorNodes[0];

    const sourceNode = getPCNode(selectedNode.assocSourceNodeId, graph);

    return (
      <Base
        className={className}
        {...rest}
        variant={cx({
          slot: sourceNode.name === PCSourceTagNames.SLOT,
          component: sourceNode.name === PCSourceTagNames.COMPONENT,
          text: sourceNode.name === PCSourceTagNames.TEXT,
          element: sourceNode.name !== PCSourceTagNames.TEXT
        })}
        controllersPaneProps={{
          selectedNodes,
          graph,
          dispatch,
          sourceNodeUri
        }}
        textProps={{
          dispatch,
          selectedNodes
        }}
        elementProps={{
          selectedNodes,
          dispatch
        }}
      />
    );
  }
);
