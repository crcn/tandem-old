import * as React from "react";
import * as cx from "classnames";
const { ControllerItem } = require("./controller-item.pc");
import { compose, pure, withHandlers } from "recompose";
import {
  PCComponent,
  getSyntheticSourceNode,
  PCSourceTagNames
} from "paperclip";
import { EMPTY_ARRAY } from "tandem-common";
import {
  addComponentControllerButtonClicked,
  removeComponentControllerButtonClicked
} from "actions";

export default compose(
  pure,
  withHandlers({
    onRemoveControllerClick: ({ dispatch }) => () => {
      dispatch(removeComponentControllerButtonClicked());
    },
    onAddControllerClick: ({ dispatch }) => () => {
      dispatch(addComponentControllerButtonClicked());
    }
  }),
  Base => ({
    selectedNodes,
    graph,
    selectedControllerRelativePath,
    onRemoveControllerClick,
    onAddControllerClick,
    dispatch,
    ...rest
  }) => {
    if (!graph) {
      return null;
    }
    const sourceNode = getSyntheticSourceNode(
      selectedNodes[0],
      graph
    ) as PCComponent;

    if (sourceNode.name !== PCSourceTagNames.COMPONENT) {
      return null;
    }

    const hasControllerSelected =
      (sourceNode.controllers || EMPTY_ARRAY).indexOf(
        selectedControllerRelativePath
      ) !== -1;

    const controllers = (sourceNode.controllers || EMPTY_ARRAY).map(
      relativePath => {
        return (
          <ControllerItem
            dispatch={dispatch}
            selected={selectedControllerRelativePath === relativePath}
            relativePath={relativePath}
          />
        );
      }
    );
    return (
      <Base
        {...rest}
        variant={cx({ hasControllerSelected })}
        removeControllerButtonProps={{ onClick: onRemoveControllerClick }}
        addControllerButtonProps={{ onClick: onAddControllerClick }}
        contentProps={{ children: controllers }}
      />
    );
  }
);
