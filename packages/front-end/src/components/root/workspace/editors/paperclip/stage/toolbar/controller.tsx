import * as React from "react";
import { pure, compose, withHandlers } from "recompose";
import { toolbarToolClicked } from "actions";
import { ToolType } from "state";

export default compose(
  pure,
  withHandlers({
    onPointerClick: ({ dispatch }) => () => {
      dispatch(toolbarToolClicked(ToolType.POINTER));
    },
    onTextClick: ({ dispatch }) => () => {
      dispatch(toolbarToolClicked(ToolType.TEXT));
    },
    onComponentClick: ({ dispatch }) => () => {
      dispatch(toolbarToolClicked(ToolType.COMPONENT));
    },
    onElementClick: ({ dispatch }) => () => {
      dispatch(toolbarToolClicked(ToolType.ELEMENT));
    }
  }),
  Base => ({
    onPointerClick,
    onTextClick,
    onComponentClick,
    onElementClick
  }) => {
    return (
      <Base
        pointerProps={{
          onClick: onPointerClick
        }}
        textProps={{
          onClick: onTextClick
        }}
        componentProps={{
          onClick: onComponentClick
        }}
        elementProps={{
          onClick: onElementClick
        }}
      />
    );
  }
);
