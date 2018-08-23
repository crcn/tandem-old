import * as React from "react";
import * as cx from "classnames";
import { compose, pure, withHandlers } from "recompose";
import { Dispatch } from "redux";
import { EMPTY_OBJECT } from "tandem-common";
const { InheritItem } = require("./inherit-item.pc");
import {
  SyntheticNode,
  getSyntheticSourceNode,
  DependencyGraph,
  getPCNode,
  getAllPCComponents,
  SyntheticElement
} from "paperclip";
import {
  INHERIT_PANE_REMOVE_BUTTON_CLICK,
  inheritPaneAddButtonClick,
  inheritPaneRemoveButtonClick,
  inheritPaneItemClick
} from "actions";
import { BaseInheritProps } from "./inherit.pc";

export type Props = {
  dispatch: Dispatch<any>;
  selectedNodes: SyntheticElement[];
  graph: DependencyGraph;
};

type InheritControllerInnerProps = {
  onAddButtonClick: any;
  onRemoveButtonClick: any;
  onItemClick: any;
  selectedInheritComponentId: string;
} & Props;

export default compose<InheritControllerInnerProps, Props>(
  pure,
  withHandlers({
    onAddButtonClick: ({ dispatch }) => () => {
      dispatch(inheritPaneAddButtonClick());
    },
    onRemoveButtonClick: ({ dispatch }) => () => {
      dispatch(inheritPaneRemoveButtonClick());
    },
    onItemClick: ({ dispatch }) => (componentId: string) => {
      dispatch(inheritPaneItemClick(componentId));
    }
  }),
  (Base: React.ComponentClass<BaseInheritProps>) => ({
    selectedNodes,
    dispatch,
    graph,
    onAddButtonClick,
    onRemoveButtonClick,
    onItemClick,
    selectedInheritComponentId
  }: InheritControllerInnerProps) => {
    const node = selectedNodes[0];
    const sourceNode = getSyntheticSourceNode(node, graph);

    const hasItemSelected = Boolean(selectedInheritComponentId);

    const allComponents = getAllPCComponents(graph);

    const items = Object.keys(sourceNode.inheritStyle || EMPTY_OBJECT)
      .filter(k => Boolean(sourceNode.inheritStyle[k]))
      .sort((a, b) => {
        return sourceNode.inheritStyle[a].priority >
          sourceNode.inheritStyle[b].priority
          ? -1
          : 1;
      })
      .map(componentId => {
        return (
          <InheritItem
            key={componentId}
            selected={selectedInheritComponentId === componentId}
            componentId={componentId}
            component={getPCNode(componentId, graph)}
            allComponents={allComponents}
            onClick={() => onItemClick(componentId)}
            dispatch={dispatch}
          />
        );
      });

    return (
      <Base
        variant={cx({ hasItemSelected })}
        addButtonProps={{ onClick: onAddButtonClick }}
        removeButtonProps={{ onClick: onRemoveButtonClick }}
        contentProps={{ children: items }}
      />
    );
  }
);
