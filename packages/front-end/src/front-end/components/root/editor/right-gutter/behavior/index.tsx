import "./index.scss";
import * as React from "react";
import { Dispatch } from "redux";
import { RootState } from "../../../../../state";
import { compose, pure, withHandlers, lifecycle, withState } from "recompose";
import { PaneComponent } from "../../../../pane";
import { getSyntheticNodeById, getSyntheticSourceNode, getSourceNodeElementRoot } from "../../../../../../paperclip";
import { getAttribute, EMPTY_OBJECT, stringifyStyle } from "../../../../../../common";
import { rawCssTextChanged, slotToggleClick } from "../../../../..";

/*
TODO - pretty tab, and source tab
*/

type StylePaneOuterProps = {
  dispatch: Dispatch<any>;
  root: RootState;
};

type StylePaneInnerProps = {
  onSlotToggleClick: () => any;
  value: any;
} & StylePaneOuterProps;

const BaseBehaviorPaneComponent = ({ root, onSlotToggleClick, value }: StylePaneInnerProps) => {

  const selectedNodeId = root.selectedNodeIds[0];
  if (!selectedNodeId) {
    return null;
  }
  const sourceNode = getSyntheticSourceNode(selectedNodeId, root.browser);
  const sourceRoot = getSourceNodeElementRoot(sourceNode.id, root.browser);
  if (sourceRoot.name !== "component") {
    return null;
  }
  const isSlotContainer = Boolean(getAttribute(sourceNode, "container"));

  return <PaneComponent header="Behavior" className="m-behavior-pane">
    <button onClick={onSlotToggleClick}>{ isSlotContainer ? "Remove child override" : "Make children overridable" }</button>
  </PaneComponent>;
};

const getSelectedNodeStyle = (root: RootState) => {
  const node = getSyntheticNodeById(root.selectedNodeIds[0], root.browser);
  return node && stringifyStyle(getAttribute(node, "style") || EMPTY_OBJECT).split(";").join(";\n");
}

export const BehaviorPaneComponent = compose<StylePaneInnerProps, StylePaneOuterProps>(
  pure,
  withHandlers({
    onSlotToggleClick: ({ dispatch, setValue }) => (event: React.ChangeEvent<any>) => {
      dispatch(slotToggleClick());
      event.stopPropagation();
    },
  })
)(BaseBehaviorPaneComponent);